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

const PassengerForm = ({
  openModal,
  handleModal,
  editUser,
  isEditing,
  autoRefresh,
}) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    client: "",
    relationship: "",
  });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    api("get", "users").then((res) => setClients(res.data.users));
    if (isEditing) {
      setUser({
        firstName: editUser.first_name,
        lastName: editUser.last_name,
        client: editUser.client._id,
        relationship: editUser.relationship,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "passengers";
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
    let uri = "passengers";

    const formData = new FormData();

    formData.append("first_name", user.firstName);
    formData.append("last_name", user.lastName);
    formData.append("client", user.client);
    formData.append("relationship", user.relationship);

    //validations
    if (user.firstName == "") {
      return toast.error("Please enter your first name");
    }
    if (user.lastName == "") {
      return toast.error("Please enter your last name");
    }
    if (user.client == "") {
      return toast.error("Please enter client name");
    }
    if (user.relationship == "") {
      return toast.error("Please enter passenger's relationship with client");
    }

    if (editUser) {
      method = "put";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, formData).then((res) => {
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
          {isEditing ? "Edit" : "Add"} Passenger
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Passenger information
                </h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          First Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="First Name"
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
                          Last Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Doe"
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
                        <Input
                          id="exampleSelect"
                          name="client"
                          value={user.client}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          type="select"
                        >
                          <option value="client" selected>
                            Select One Client
                          </option>
                          {clients ? (
                            clients.map((client) => (
                              <option key={client._id} value={client._id}>
                                {client.first_name + " " + client.last_name}
                              </option>
                            ))
                          ) : (
                            <option disabled>There is no Client</option>
                          )}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Relationship
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="relationship"
                          className="form-control-alternative"
                          type="select"
                          value={user.relationship}
                          onChange={handleInputChange}
                        >
                          <option value="self" selected>
                            Self
                          </option>
                          <option value="son">Son</option>
                          <option value="daughter">Daughter</option>
                          <option value="brother">Brother</option>
                          <option value="sister">Sister</option>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="uncle">Uncle</option>
                          <option value="aunt">Aunt</option>
                          <option value="other">other</option>
                        </Input>
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

export default PassengerForm;
