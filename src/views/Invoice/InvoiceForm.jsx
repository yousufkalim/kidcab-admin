import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import Select from "react-select";
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
  Label,
} from "reactstrap";
// core components

const InvoiceForm = ({
  openModal,
  handleModal,
  editUser,
  isEditing,
  autoRefresh,
}) => {
  const [user, setUser] = useState({
    invoice_title: "",
    issue_date: "",
    total_price: "",
    status: "",
    comments: "",
    trip: "",
  });

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    api("get", "trips").then((res) => {
      setTrips(res.data.trips);
    });

    if (isEditing) {
      setUser({
        invoice_title: editUser.invoice_title,
        issue_date: editUser.issue_date,
        total_price: editUser.total_price,
        status: editUser.status,
        trip: editUser.trip,
        comments: editUser.comments,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleTripChange = (e) => {
    setUser({ ...user, trip: e.value });
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "invoices";
    if (editUser) {
      method = "delete";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        toast.success("Delete Successfully");
        handleModal();
        autoRefresh();
      } else {
        toast.error("Delete Error", res.data.message);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "invoices";

    if (editUser) {
      method = "put";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, user).then((res) => {
      if (res.status === 200) {
        toast.success("Saved Successfully");
        handleModal();
        autoRefresh();
      } else {
        toast.error("Save Error", res);
      }
    });
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? "Edit" : "Add"} Invoice
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Invoice information
                </h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Invoice Title
                        </label>
                        <Input
                          className="form-control"
                          id="input-fname"
                          required={true}
                          placeholder="Enter Invoice Title"
                          type="text"
                          value={user.invoice_title}
                          name="invoice_title"
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
                          Issue Date
                        </label>
                        <Input
                          className="form-control"
                          id="input-lname"
                          type="date"
                          value={user.issue_date?.split("T")[0]}
                          name="issue_date"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Select Trip
                        </Label>
                        {console.log(trips[0])}
                        {trips && (
                          <Select
                            onChange={handleTripChange}
                            name="trip"
                            hideSelectedOptions
                            // defaultValue={{
                            //   value: trips[0]?._id,
                            //   label: `${trips[0]?.client?.first_name} - ${trips[0]?.quote?.quote_title}`,
                            // }}
                            className="form-control-alternative"
                            options={trips.map((trip) => ({
                              value: trip._id,
                              label: `${trip.client?.first_name} - ${trip.quote?.quote_title}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Status
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="status"
                          value={user.status}
                          onChange={handleInputChange}
                          className="form-control"
                          type="select"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="late">Late</option>
                          <option value="canceled">Canceled</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Total Price
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="total_price"
                          className="form-control"
                          placeholder="Enter Total Price"
                          type="number"
                          value={user.total_price}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Comment
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="comments"
                          className="form-control"
                          placeholder="Enter comment here"
                          type="textarea"
                          value={user.comments}
                          onChange={handleInputChange}
                        />
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

export default InvoiceForm;
