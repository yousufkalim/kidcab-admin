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
  Label,
} from "reactstrap";
// core components
import Select from "react-select";
const QuotesForm = ({ openModal, handleModal, editUser, isEditing }) => {
  const [user, setUser] = useState({
    title: "",
    quoteNumber: "",
    client: "",
    passenger: "",
    status: "",
    issueDate: "",
    totalTrips: "",
  });

  const [clients, setClients] = useState();

  useEffect(() => {
    api("get", "users").then((res) => setClients(res.data.users));
    if (isEditing) {
      setUser({
        firstName: editUser.first_name,
        lastName: editUser.last_name,
        password: editUser.password,
        phone: editUser.phone_number,
      });
    }
  }, []);

  const handleInputChange = (e) => {
    console.log(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(clients);
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "passengers";
    if (editUser) {
      method = "delete";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri).then((res) => {
      if (res.status == 200) {
        toast.success("Delete Successfully");
        handleModal();
      } else {
        toast.error("Delete Error", res.data.message);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "passengers";

    const formData = new FormData();
    if (user.image) formData.append("image", user.image, user.image.name);
    formData.append("first_name", user.firstName);
    formData.append("last_name", user.lastName);
    formData.append("client", user.client);
    formData.append("relationship", user.relationship);

    if (editUser) {
      method = "put";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, formData).then((res) => {
      if (res.status === 200) {
        toast.success("Saved Successfully");
        handleModal();
      } else {
        toast.error("Save Error", res);
      }
    });
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="Y" toggle={handleModal}>
          Add A Quote
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Quote information
                </h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Quote Title
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="Quote Title"
                          type="text"
                          value={user.firstName}
                          name="firstName"
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
                          Quote Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="text"
                          value={user.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Select Client
                        </Label>
                        {clients && (
                          <Select
                            onChange={(e) => console.log(e.target.value)}
                            name="passengers"
                            className="form-control-alternative"
                            options={clients.map((client) => ({
                              value: client._id,
                              label: `${client.first_name} ${client.last_name}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Select Passengers
                        </Label>
                        {clients && (
                          <Select
                            onChange={(e) => console.log(e.map((v) => v.value))}
                            isMulti
                            name="passengers"
                            className="form-control-alternative"
                            options={clients.map((client) => ({
                              value: client._id,
                              label: `${client.first_name} ${client.last_name}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Status
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="relationship"
                          className="form-control-alternative"
                          type="select"
                          value={user.relationship}
                          onChange={handleInputChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </Input>
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
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="date"
                          value={user.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr className="my-4" />
                </div>
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
                          No. of Trips
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="Total Trips"
                          type="number"
                          value={user.firstName}
                          name="firstName"
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
                          Total Passengers
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Total Passengers"
                          type="number"
                          value={user.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Total Price
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="Total Trips"
                          type="number"
                          value={user.firstName}
                          name="firstName"
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
                          VAT
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Total Passengers"
                          type="number"
                          value={user.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          Start Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="date"
                          value={user.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>{" "}
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          End Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="date"
                          value={user.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
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
                          placeholder="Start Address"
                          type="text"
                          value={user.firstName}
                          name="firstName"
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
                          id="input-lname"
                          placeholder="End Address"
                          type="text"
                          value={user.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          Docusign Link
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="DocuSign link (https://www.docusign.net/MEMBER/PowerFormSigning.aspx?PowerFormId=123e332) "
                          type="text"
                          value={user.lastName}
                          name="lastName"
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

export default QuotesForm;
