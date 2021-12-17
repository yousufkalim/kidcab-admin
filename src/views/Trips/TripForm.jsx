import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
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

const TripForm = ({
  openModal,
  handleModal,
  editUser: editTrip,
  isEditing,
  autoRefresh
}) => {
  const [trip, setTrip] = useState({
    date: "",
    status: "pending",
    start_address: "",
    end_address: "",
    addresses: null,
    client_price: "",
    driver_price: "",
    required_drivers: "",
    assigned_drivers: [],
    invited_drivers: [],
    rides: null,
    client: "",
    quote: "",
  });
  const [drivers, setDrivers] = useState();
  const [clients, setClients] = useState();
  const [quotes, setQuotes] = useState();

  useEffect(() => {
    api("get", "drivers").then((res) => {
      setDrivers(res.data.drivers);
    });
    api("get", "users").then((res) => {
      setClients(res.data.users);
    });
    api("get", "quotes").then((res) => {
      setQuotes(res.data.quotes);
    });
  }, []);

  useEffect(() => {
    if (isEditing) {
      setTrip({
        date: new Date(editTrip.date),
        status: editTrip.status,
        start_address: editTrip.start_address.street_address,
        end_address: editTrip.end_address.street_address,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
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
          autoRefresh()
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

    if (editTrip) {
      method = "put";
      uri = uri + `/${editTrip._id}`;
    }

    api(method, uri, trip)
      .then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          toast.success("Saved Successfully");
          handleModal();
          autoRefresh()
        } else {
          toast.error("Save Error", res);
        }
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          Add Trip
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
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Start Address
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="Enter Start Address"
                          type="text"
                          value={trip.start_address}
                          name="start_address"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          End Address
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="Enter End Address"
                          type=""
                          value={trip.end_address}
                          name="end_address"
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
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder="Enter Company Name"
                          type="date"
                          value={trip.date}
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
                    </Col>
                  </Row>
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="12">
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
                            onChange={(e) =>
                              setTrip((user) => ({ ...user, client: e.value }))
                            }
                            name="clients"
                            defaultValue={{
                              value: clients[0]?._id,
                              label: `${clients[0]?.first_name} ${clients[0]?.last_name}`,
                            }}
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
                            defaultValue={{
                              value: quotes[0]?._id,
                              label: `${quotes[0]?.quote_title}`,
                            }}
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
