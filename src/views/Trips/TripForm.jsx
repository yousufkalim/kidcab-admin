import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import AddressInput from "components/Form/AddressInput";
import AddressInputMultiple from "components/Form/AddressInputMultiple";
import TimePicker from "react-time-picker";
import "../Trips/app.css";
import * as moment from "moment";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
// core components
import Select from "react-select";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
const options = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thrusday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];
const disableDates = () => {
  var today, dd, mm, yyyy;
  today = new Date();
  dd = today.getDate();
  mm = today.getMonth() + 1;
  yyyy = today.getFullYear();
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (dd < 10) {
    dd = "0";
  }
  return yyyy + "-" + mm + "-" + dd;
};
const TripForm = ({
  openModal,
  handleModal,
  editUser: editTrip,
  isEditing,
  autoRefresh,
}) => {
  const [trip, setTrip] = useState({
    date: "",
    status: "pending",
    trip_type: "",
    addresses: null,
    client_price: "",
    driver_price: "",
    assigned_drivers: [],
    invited_drivers: [],
    passengers: [],
    Days: [],
    startdate: "",
    enddate: "",
    rides: null,
    client: "",
    comment: "",
  });
  let [startAddress, setStartAddress] = useState({});
  let [endAddress, setEndAddress] = useState({});
  let [stepAddress, setStepAddress] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [allPassengers, setAllPassengers] = useState([]);
  const [clients, setClients] = useState();
  const [value, onChange] = useState("12:00");
  const [daysLength, setDaysLength] = useState([]);
  const [tripType, setTriptype] = useState("simple");
  const [selectedDays, setSelectedDays] = useState([]);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [passengerChange, setPassengerChange] = useState([]);
  let [allAddresses, setAllAddresses] = useState([]);

  useEffect(() => {
    api("get", "drivers").then((res) => {
      setDrivers(res.data.drivers);
    });
    api("get", "users").then((res) => {
      setClients(res.data.users);
    });
    api("get", `passengers`).then((res) => {
      setAllPassengers(res.data.passengers);
    });
  }, []);
  useEffect(() => {
    if (isEditing) {
      var date = new Date(editTrip.date);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var time = `${hours}:${minutes}`;
      onChange(time);
      setAllAddresses(editTrip.addresses);

      setTrip({
        date: editTrip.date,
        status: editTrip.status,
        addresses: editTrip.addresses,
        client_price: editTrip.client_price,
        driver_price: editTrip.driver_price,
        assigned_drivers: editTrip.assigned_drivers,
        invited_drivers: editTrip.invited_drivers.map(
          (driver) => driver?.driver?._id
        ),
        passengers: editTrip.passengers.map((passenger) => passenger._id),
        rides: editTrip.rides,
        client: editTrip.client,
        quote: editTrip?.quote,
        time: editTrip.time,
        comment: editTrip?.comment,
      });
      api("get", `passengers`).then((res) => {
        setPassengers(
          res.data.passengers.filter(
            (a) => a.client._id === editTrip?.client?._id
          )
        );
      });

      let p = editTrip.passengers.map((passenger) => {
        return {
          label: passenger.first_name + " " + passenger.last_name,
          value: passenger._id,
        };
      });
      setPassengerChange(p);
      setStartAddress(editTrip.start_address);
      setEndAddress(editTrip.end_address);
      setStepAddress(editTrip.addresses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
    if (e.target.name === "trip_type") {
      setTriptype(e.target.value);
    }
  };

  const handleDayChange = (e) => {
    setTrip({ ...trip, Days: e.value });
    let data = [];
    let time = [];
    e.map((i) => {
      data.push(i);
      time.push("10:00");
    });
    onChange(time);
    setDaysLength(data);
  };
  const handleClientChange = (e) => {
    setTrip((user) => ({ ...user, client: e.value, passengers: [] }));
    setPassengers(allPassengers.filter((a) => a?.client?._id === e.value));
    setPassengerChange([]);
  };
  const handlePassengerChange = (e) => {
    setTrip((user) => ({
      ...user,
      passengers: e.map((passenger) => passenger.value),
    }));
    setPassengerChange(e.map((passenger) => passenger));
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "trips";
    if (editTrip) {
      method = "delete";
      uri = uri + `/${editTrip._id}`;
    }

    api(method, uri)
      .then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          toast.success("Delete Successfully");
          handleModal();
          autoRefresh();
        } else {
          toast.error("Delete Error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "trips";
    if (
      (startAddress.lat == endAddress.lat &&
        startAddress.lng == endAddress.lng &&
        startAddress.PostalCode == endAddress.PostalCode &&
        startAddress.city == endAddress.city) ||
      (startAddress.lat == stepAddress.lat &&
        startAddress.lng == stepAddress.lng &&
        startAddress.PostalCode == stepAddress.PostalCode &&
        startAddress.city == stepAddress.city) ||
      (endAddress.lat == stepAddress.lat &&
        endAddress.lng == stepAddress.lng &&
        endAddress.PostalCode == stepAddress.PostalCode &&
        endAddress.city == stepAddress.city)
    ) {
      return toast.error("Adresses cant be same");
    }
    if (trip.status == "") {
      return toast.error("Please enter trip status");
    }
    if (selectedDays.length == 0 && !isEditing && trip.trip_type == "simple") {
      return toast.error("Please enter trip dates");
    }

    if (parseInt(trip.client_price) < 1 || trip.client_price == "") {
      return toast.error("Invalid client price");
    }
    if (trip.driver_price == "") {
      return toast.error("Please enter drive price");
    }
    if (parseInt(trip.driver_price) < 1) {
      return toast.error("Please enter valid driver price");
    }
    if (parseInt(trip.driver_price) > parseInt(trip.client_price)) {
      return toast.error("Client price should be greater than driver price");
    }

    if (trip.passengers.length < 1) {
      return toast.error("Passenger is required");
    }
    if (editTrip) {
      const serverDate = new Date(trip.date); //creating date for server
      var hours = value.split(":"); //split hours and minutes
      serverDate.setHours(parseInt(hours[0])); //setting time for server
      serverDate.setMinutes(parseInt(hours[1])); //setting time for server
      trip.date = serverDate; //Setting Trip Date
      method = "put";
      uri = uri + `/${editTrip._id}`;
    }

    if (trip.trip_type === "recurring") {
      let selectedDDays = [];
      const s_date = new Date(trip.startdate); //start date
      const e_date = new Date(trip.enddate); //end date
      let j = s_date;
      //setting loop index
      for (let i = 0; i < daysLength.length; i++) {
        //this loop will run for each day
        for (; j <= e_date; j.setDate(j.getDate() + 1)) {
          //this loop will work from start to end date and find when date is repeating
          if (daysLength[i].value === j.getDay()) {
            let serverDate = new Date(j); //taking date coming from request
            var hours = value[i].split(":"); //split hours and minutes
            serverDate.setHours(parseInt(hours[0]));
            serverDate.setMinutes(parseInt(hours[1]));
            selectedDDays.push(serverDate);
          }
        }
        j = new Date(trip.startdate); //After inner loop break this will reinitalize loop from start date
      }
      api(method, uri, {
        ...trip,
        start_address: startAddress,
        end_address: endAddress,
        dates: selectedDDays,
        addresses: allAddresses,
      }).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          toast.success("Saved Successfully");
          handleModal();
          autoRefresh();
        } else {
          toast.error("Save Error", res);
        }
      });
    } else {
      let selectedDDays = selectedDays.map((date) => {
        const serverDate = new Date(date); //creating date for server
        var hours = value.split(":"); //split hours and minutes
        serverDate.setHours(parseInt(hours[0])); //setting time for server
        serverDate.setMinutes(parseInt(hours[1])); //setting time for server
        return serverDate;
      });
      api(method, uri, {
        ...trip,
        start_address: startAddress,
        tripType: tripType,
        end_address: endAddress,
        dates: selectedDDays,
        addresses: allAddresses,
      }).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          toast.success("Saved Successfully");
          handleModal();
          autoRefresh();
        } else {
          toast.error("Save Error", res);
        }
      });
    }
  };

  const handleDayClick = (day, { selected }) => {
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );
      let newis = selectedDays.filter((item, i) => i != selectedIndex);
      setSelectedDays(newis);
    } else {
      if (!moment(day).isBefore(new Date())) moment(day).format("LL");
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleDateModal = () => {
    setOpenDateModal((open) => !open);
    return openDateModal;
  };
  return (
    <>
      {console.log(trip, "t")}
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? "Edit" : "Add"} Trip
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Trip information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <AddressInput
                          label="Start Address"
                          address={startAddress}
                          setAddress={setStartAddress}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <AddressInputMultiple
                          multiple={true}
                          label="Add Step"
                          address={stepAddress}
                          setAddress={setStepAddress}
                          allAddresses={allAddresses}
                          setAllAddresses={setAllAddresses}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <AddressInput
                          label="End Address"
                          address={endAddress}
                          setAddress={setEndAddress}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-status"
                        >
                          <span style={{ color: "red" }}>
                            {trip.status ? "" : "*"}
                          </span>{" "}
                          Status
                        </label>
                        <Input
                          id="input-status"
                          name="status"
                          className="form-control-alternative"
                          type="select"
                          value={trip.status}
                          onChange={handleInputChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-tripType"
                        >
                          Trip Type
                        </label>
                        <Input
                          id="input-trip_type"
                          name="trip_type"
                          className="form-control-alternative"
                          type="select"
                          value={trip.trip_type}
                          onChange={handleInputChange}
                        >
                          <option value="simple">simple</option>
                          <option value="recurring">recurring</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                {tripType == "simple" ? (
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-date"
                          >
                            <span style={{ color: "red" }}>
                              {trip.date ? "" : "*"}
                            </span>{" "}
                            Trip Date
                          </label>
                          {isEditing ? (
                            <Input
                              className="form-control-alternative"
                              id="input-date"
                              locale={"en-gb"}
                              placeholder={"Select Dates"}
                              type="date"
                              min={!isEditing && disableDates()}
                              value={trip?.date?.split("T")[0]}
                              name="date"
                              onChange={handleInputChange}
                            />
                          ) : (
                            <Input
                              className="form-control-alternative"
                              id="input-date"
                              value={selectedDays?.map((i) =>
                                moment(i).format("DD/MM/YYYY")
                              )}
                              min={disableDates()}
                              placeholder={"Select Dates"}
                              readonly
                              type="text"
                              onClick={() => setOpenDateModal(true)}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <div className="TimePicker-ss">
                            <label
                              className="form-control-label"
                              htmlFor="input-time"
                            >
                              <span style={{ color: "red" }}></span> Select Trip
                              Time
                            </label>
                            <TimePicker
                              style={{ height: "calc(1.5em + 1.25rem + 2px)" }}
                              name="time"
                              disableClock={true}
                              clockIcon={null}
                              amPmAriaLabel={true}
                              value={value}
                              onChange={onChange}
                            />
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-date"
                            >
                              <span style={{ color: "red" }}>
                                {trip.startdate ? "" : "*"}
                              </span>{" "}
                              Start Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-date"
                              // value={selectedDays?.map((i) => i)}
                              placeholder={"Select Date"}
                              type="date"
                              value={trip.startdate}
                              min={disableDates()}
                              name="startdate"
                              onChange={handleInputChange}
                              // onClick={() => setOpenDateModal(true)}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-date"
                            >
                              <span style={{ color: "red" }}>
                                {trip.enddate ? "" : "*"}
                              </span>{" "}
                              End Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-date"
                              min={disableDates()}
                              // value={selectedDays?.map((i) => i)}
                              placeholder={"Select Date"}
                              type="date"
                              value={trip.enddate}
                              name="enddate"
                              onChange={handleInputChange}
                              // onClick={() => setOpenDateModal(true)}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              for="exampleSelect"
                              className="form-control-label"
                            >
                              <span style={{ color: "red" }}>
                                {trip?.Days?.length < 1 ? "" : "*"}
                              </span>{" "}
                              Select Days
                            </label>
                            <Select
                              onChange={handleDayChange}
                              name="Days"
                              isMulti
                              hideSelectedOptions
                              className="form-control-alternative"
                              value={trip.Days}
                              defaultValue={null}
                              options={options}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div className="pl-lg-4">
                      <Row>
                        {daysLength.map((i, index) => {
                          return (
                            <>
                              <Col lg="6">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-Day"
                                  >
                                    Day
                                  </label>
                                  <Input
                                    id="input-Day"
                                    name="input-Day"
                                    readOnly
                                    className="input-Day"
                                    value={i.label}
                                  ></Input>
                                </FormGroup>
                              </Col>
                              <Col lg="6">
                                <FormGroup>
                                  <div className="TimePicker-ss">
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-time"
                                    >
                                      <span style={{ color: "red" }}></span>{" "}
                                      Select Trip Time
                                    </label>
                                    <TimePicker
                                      style={{
                                        height: "calc(1.5em + 1.25rem + 2px)",
                                      }}
                                      name="time"
                                      disableClock={true}
                                      clockIcon={null}
                                      amPmAriaLabel={true}
                                      value={value[index]}
                                      onChange={(value) => {
                                        onChange((prev) => {
                                          prev[index] = value;
                                          return [...prev];
                                        });
                                      }}
                                    />
                                  </div>
                                </FormGroup>
                              </Col>
                            </>
                          );
                        })}
                      </Row>
                    </div>
                  </>
                )}
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-clientPrice"
                        >
                          <span style={{ color: "red" }}>
                            {trip.client_price ? "" : "*"}
                          </span>{" "}
                          Client Price
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-clientPrice"
                          required={true}
                          placeholder="Enter Client Price"
                          type="number"
                          value={trip.client_price}
                          name="client_price"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-driverPrice"
                        >
                          <span style={{ color: "red" }}>
                            {trip.driver_price ? "" : "*"}
                          </span>{" "}
                          Driver Price
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-driverPrice"
                          required={true}
                          placeholder="Enter Driver Price"
                          type="number"
                          value={trip.driver_price}
                          name="driver_price"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          <span style={{ color: "red" }}>
                            {trip.invited_drivers.length > 0 ||
                            trip.assigned_drivers.length > 0
                              ? ""
                              : "*"}
                          </span>{" "}
                          Drivers Name
                        </label>
                        {drivers && (
                          <Select
                            onChange={(e) =>
                              setTrip((user) => ({
                                ...user,
                                invited_drivers: e.map(
                                  (driver) => driver.value
                                ),
                              }))
                            }
                            isDisabled={
                              isEditing && editTrip?.status !== "pending"
                            }
                            name="drivers"
                            isMulti
                            className="form-control-alternative"
                            defaultValue={
                              isEditing
                                ? editTrip.status === "pending"
                                  ? editTrip?.invited_drivers.map((i) => ({
                                      value: i?.driver?._id,
                                      label: `${i?.driver?.first_name} ${i?.driver?.last_name}`,
                                    }))
                                  : editTrip?.assigned_drivers.map((i) => ({
                                      value: i?._id,
                                      label: `${i?.first_name} ${i?.last_name}`,
                                    }))
                                : null
                            }
                            options={drivers.map((driver) => ({
                              value: driver?._id,
                              label: `${driver?.first_name} ${driver?.last_name}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          <span style={{ color: "red" }}>
                            {trip.client ? "" : "*"}
                          </span>{" "}
                          Client
                        </label>
                        {clients && (
                          <Select
                            onChange={handleClientChange}
                            name="clients"
                            defaultValue={
                              trip?.client?._id && {
                                value: trip?.client?._id,
                                label: `${trip?.client?.first_name} ${trip?.client?.last_name}`,
                              }
                            }
                            className="form-control-alternative"
                            options={clients.map((client) => ({
                              value: client?._id,
                              label: `${client?.first_name} ${client?.last_name}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Passengers
                        </label>
                        {allPassengers && (
                          <Select
                            onChange={handlePassengerChange}
                            isDisabled={trip?.client <= 0}
                            name="passengers"
                            isMulti
                            className="form-control-alternative"
                            value={passengerChange?.map((i) => ({
                              value: i.value,
                              label: i.label,
                            }))}
                            options={passengers
                              .map((passenger) => ({
                                value: passenger?._id,
                                label: `${passenger?.first_name} ${passenger?.last_name}`,
                              }))
                              .filter(
                                (p) =>
                                  passengerChange.findIndex(
                                    (v) => v === p.label
                                  ) < 0
                              )}
                          />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-lname">
                      Add comment
                    </label>
                    <Input
                      className="form-control-alternative"
                      id="input-lname"
                      placeholder="Add Comment"
                      type="textarea"
                      value={trip.comment}
                      name="comment"
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </div>
              </Form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Save
          </Button>{" "}
          {isEditing && (
            <Button color="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}{" "}
          <Button onClick={handleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={openDateModal} size="sm" centered>
        <ModalHeader charCode="X" toggle={handleDateModal}>
          {isEditing ? "Edit" : "Select"} Date
        </ModalHeader>
        <div style={{ textAlign: "center" }}>
          <DayPicker
            disabledDays={{ before: new Date() }}
            selectedDays={selectedDays}
            onDayClick={handleDayClick}
          />
        </div>
        <ModalFooter>
          <Button color="success" onClick={handleDateModal}>
            Ok
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TripForm;
