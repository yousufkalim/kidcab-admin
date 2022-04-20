import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddressInput from "components/Form/AddressInput";
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

const ClientForm = ({
  openModal,
  handleModal,
  editUser,
  isEditing,
  autoRefresh,
}) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: {},
    phone_number: "",
    siret: "",
    intraCommunityNo: "",
    bankName: "",
    iban: "",
    // gender: "",
  });
  let [address, setAddress] = useState({});

  useEffect(() => {
    if (isEditing) {
      setUser({
        firstName: editUser.first_name,
        lastName: editUser.last_name,
        password: editUser.password,
        email: editUser.email,
        phone_number: editUser.phone_number,
        // gender: editUser.gender,
        siret: editUser.siret_number,
        intraCommunityNo: editUser.intra_community,
        bankName: editUser.bank_info.bank_name,
        iban: editUser.bank_info.iban,
      });
      setAddress(editUser.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "users";
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
    let uri = "users";

    const bankInfo = {
      bank_name: user.bankName,
      iban: user.iban,
    };

    const formData = new FormData();

    formData.append("first_name", user.firstName.toLowerCase());
    formData.append("last_name", user.lastName.toLowerCase());
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("phone_number", user.phone_number);
    if (address?.lat && address?.lng) {
      formData.append("address", JSON.stringify(address));
    }
    if (Object.keys(bankInfo).length > 0) {
      formData.append("bank_info", JSON.stringify(bankInfo));
    }
    formData.append("siret_number", user.siret);
    formData.append("intra_community", user.intraCommunityNo);

    if (user.firstName == "") {
      return toast.error("Please enter your first name");
    }
    if (user.lastName == "") {
      return toast.error("Please enter your last name");
    }
    if (user.email == "") {
      return toast.error("Please enter email");
    }
    if (!(user.email.includes(".") && user.email.includes("@"))) {
      return toast.error("Please enter a valid email");
    }

    if (user.password == "") {
      return toast.error("Password is required");
    }
    if (user.password.length < 8) {
      return toast.error("Passwords should be of atleast 8 letters");
    }

    if (editUser) {
      method = "put";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, formData).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        toast.success("Saved Successfully");
        autoRefresh();
        handleModal();
      } else {
        toast.error("Save Error", res);
      }
    });
    //window.location.reload();
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? "Edit" : "Add"} Client
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Client information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          <span style={{ color: "red" }}>
                            {" "}
                            {user.firstName ? "" : "*"}{" "}
                          </span>
                          {""}First Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="John"
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
                          <span style={{ color: "red" }}>
                            {user.lastName ? "" : "*"}
                          </span>{" "}
                          {""}
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
                    {isEditing ? (
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            <span style={{ color: "red" }}>
                              {user.email ? "" : "*"} {""}
                            </span>
                            Email Address
                          </label>
                          <Input
                            type="email"
                            name="email"
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="johndoe@example.com"
                            value={user.email}
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    ) : (
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            <span style={{ color: "red" }}>
                              {user.email ? "" : "*"} {""}
                            </span>
                            Email Address
                          </label>
                          <Input
                            type="email"
                            name="email"
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="johndoe@example.com"
                            value={user.email}
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    )}
                    {!isEditing && (
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            <span style={{ color: "red" }}>
                              {user.password ? "" : "*"}{" "}
                            </span>
                            Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-password"
                            placeholder="Password"
                            type="password"
                            value={user.password}
                            name="password"
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                </div>
                {/* <div className="pl-lg-4">
                  <h6 className="heading-small text-muted mb-4">Gender</h6>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-male"
                        >
                          Male
                        </label>
                        <Input
                          className="form-control-lg"
                          id="input-male"
                          required={true}
                          checked={user.gender === "male"}
                          placeholder="Username"
                          type="radio"
                          name="gender"
                          value="male"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-female"
                        >
                          Female
                        </label>
                        <Input
                          className="form-control-lg"
                          id="input-female"
                          required={true}
                          placeholder="Username"
                          checked={user.gender === "female"}
                          type="radio"
                          name="gender"
                          value="female"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-other"
                        >
                          Other
                        </label>
                        <Input
                          className="form-control-lg"
                          id="input-other"
                          required={true}
                          placeholder="Username"
                          type="radio"
                          name="gender"
                          checked={user.gender === "other"}
                          value="other"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div> */}
                {/* <hr className="my-4" /> */}
                {/* Contact Information */}
                <h6 className="heading-small text-muted mb-4">
                  Contact information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <AddressInput
                          label="Address"
                          optional={true}
                          address={address}
                          setAddress={setAddress}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-phone"
                        >
                          Phone Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-phone"
                          placeholder="+33123456789"
                          type="text"
                          value={user.phone_number}
                          name="phone_number"
                          onChange={handleInputChange}
                          maxLength="11"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-siret"
                        >
                          Siret Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-siret"
                          placeholder="79465211500013"
                          type="text"
                          value={user.siret}
                          name="siret"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-intra"
                        >
                          Intra Community Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-intra"
                          placeholder="123456789"
                          type="text"
                          value={user.intraCommunityNo}
                          name="intraCommunityNo"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <h6 className="heading-small text-muted mb-4">
                  Bank information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-bankName"
                        >
                          Bank Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-bankName"
                          placeholder="Example Bank Ltd"
                          type="text"
                          value={user.bankName}
                          name="bankName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="8">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-iban"
                        >
                          IBAN Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-iban"
                          placeholder="123456789"
                          type="text"
                          value={user.iban}
                          name="iban"
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

export default ClientForm;
