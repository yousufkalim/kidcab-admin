import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import AddressInput from "components/Form/AddressInput";
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
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

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
    addresses: null,
    client_price: "",
    driver_price: "",
    required_drivers: "",
    assigned_drivers: [],
    invited_drivers: [],
    rides: null,
    client: "",
    quote: {},
  });
  let [startAddress, setStartAddress] = useState({});
  let [endAddress, setEndAddress] = useState({});
  const [drivers, setDrivers] = useState();
  const [clients, setClients] = useState();
  const [allQuotes, setAllQuotes] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDaysfordb, setSelectedDaysfordb] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    api("get", "drivers").then((res) => {
      setDrivers(res.data.drivers);
    });
    api("get", "users").then((res) => {
      setClients(res.data.users);
    });
    api("get", "quotes").then((res) => {
      setAllQuotes(res.data.quotes?.filter((a) => a.status === "accepted"));
    });
  }, []);

  useEffect(() => {
    if (isEditing) {
      setTrip({
        date: editTrip.date,
        status: editTrip.status,
        addresses: editTrip.addresses,
        client_price: editTrip.client_price,
        driver_price: editTrip.driver_price,
        required_drivers: editTrip.required_drivers,
        assigned_drivers: editTrip.assigned_drivers,
        invited_drivers: editTrip.invited_drivers.map((driver) => driver._id),
        rides: editTrip.rides,
        client: editTrip.client,
        quote: editTrip.quote,
      });
      setStartAddress(editTrip.start_address);
      setEndAddress(editTrip.end_address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleClientChange = (e) => {
    setTrip((user) => ({ ...user, client: e.value }));
    setQuotes(allQuotes.filter((a) => a.client?._id === e.value));
    // setPassengers(clients.filter((a) => a._id === e.value)[0]?.passengers);
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

    if (trip.status == "") {
      return toast.error("Please enter quote status");
    }
    if (trip.date == "") {
      return toast.error("Please enter trip date");
    }

    if (trip.client_price == "") {
      return toast.error("Please enter client price");
    }
    if (trip.driver_price == "") {
      return toast.error("Please enter drive price");
    }

    if (editTrip) {
      method = "put";
      uri = uri + `/${editTrip._id}`;
    }

    api(method, uri, {
      ...trip,
      start_address: startAddress,
      end_address: endAddress,
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
    // .catch((error) => toast.error(error.message));
  };

  const handleDayClick=(day, { selected })=> {
    
    if(selected){
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
     let newis=selectedDays.filter((item,i)=>i!=selectedIndex)
     let newfordb=selectedDaysfordb.filter((item,i)=>i!=selectedIndex)
      setSelectedDays(newis )
      setSelectedDaysfordb(newfordb)
    }else{
      setSelectedDays([...selectedDays,day])
      setSelectedDaysfordb([...selectedDaysfordb,{date:day,recurring:false}])
    }
  }
  const handlecheck=(value)=>{
    let newfordb2=selectedDaysfordb.map((item)=>item.date===value.date?{...item,recurring:!item.recurring}:item)
    setSelectedDaysfordb(newfordb2) 
  }
  {console.log("selectedDaysfordb",selectedDaysfordb)}

  return (
    <>
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
                    <Col lg="6">
                      <FormGroup>
                        <AddressInput
                          label="Start Address"
                          address={startAddress}
                          setAddress={setStartAddress}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
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
                          htmlFor="input-date"
                        >
                          Trip Date
                        </label>
                        {console.log("Date ---> ", trip.date)}
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder="Enter Company Name"
                          type="date"
                          value={trip?.date?.split("T")[0]}
                          name="date"
                          onChange={handleInputChange}
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
                          htmlFor="input-clientPrice"
                        >
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
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-rd"
                        >
                          Required Drivers
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-rd"
                          required={true}
                          placeholder="Enter Required Drivers"
                          type="number"
                          value={trip.required_drivers}
                          name="required_drivers"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Invite Drivers
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
                              trip?.required_drivers <= 0 ||
                              trip?.required_drivers ===
                                trip?.assigned_drivers?.length
                            }
                            name="drivers"
                            isMulti
                            className="form-control-alternative"
                            options={drivers.map((driver) => ({
                              value: driver?._id,
                              label: `${driver?.first_name} ${driver?.last_name}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                    {/* <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Assigned Drivers
                        </label>
                        {drivers && (
                          <Select
                            isDisabled
                            onChange={(e) =>
                              setTrip((user) => ({
                                ...user,
                                invited_drivers: e.map(
                                  (driver) => driver.value
                                ),
                              }))
                            }
                            name="assignedDrivers"
                            isMulti
                            className="form-control-alternative"
                            options={editTrip?.invited_drivers?.map(
                              (driver) => ({
                                value: driver?._id,
                                label: `${driver?.first_name} ${driver?.last_name}`,
                              })
                            )}
                          />
                        )}
                      </FormGroup>
                    </Col> */}
                  </Row>
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
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
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Quote
                        </label>
                        {quotes && (
                          <Select
                            onChange={(e) =>
                              setTrip((user) => ({ ...user, quote: e.value }))
                            }
                            name="quotes"
                            defaultValue={
                              trip.quote?._id && {
                                value: trip?.quote?._id,
                                label: `${trip?.quote?.quote_title}`,
                              }
                            }
                            className="form-control-alternative"
                            options={quotes.map((quote) => ({
                              value: quote?._id,
                              label: `${quote?.quote_title}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                     <p>Recurring Trips</p>
                     
                     {flag && selectedDaysfordb.length>=1&&selectedDaysfordb.map(value=>(<>
                     <div style={{display:"flex",margin:"0 10px 10px 0"}}>
                     <input type="checkbox" checked={value.recurring} style={{margin:"7px 10px 0 0"}} onChange={()=>handlecheck(value)}/>
                     <p>{new Date(value.date).toString()}</p>
                     </div>
                     
                     </>))}
                    </Col>
                    <Col lg="6">
                    <p onClick={()=>setFlag(!flag)}>Select Several days</p>
                    {flag &&<DayPicker
          selectedDays={selectedDays}
          onDayClick={handleDayClick}
        />}
                    
                    </Col>
                  </Row>
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
    </>
  );
};

export default TripForm;
