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

const DriverForm = ({ openModal, handleModal, editUser, isEditing,autoRefresh }) => {
  const [user, setUser] = useState({
    profile_pic: "",
    id_front: "",
    id_back: "",
    vtc_front: "",
    vtc_back: "",
    green_front: "",
    green_back: "",
    license_front: "",
    license_back: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    bankAccountNo: "",
    bankName: "",
    iban: "",
    role: "",
    vehicles: [],
  });
  const [vehicles, setVehicles] = useState();

  useEffect(() => {
    api("get", "vehicles").then((res) => {
      setVehicles(res.data.vehicles);
    });
  }, []);

  useEffect(() => {
    if (isEditing) {
      setUser({
        firstName: editUser.first_name,
        lastName: editUser.last_name,
        password: editUser.password,
        email: editUser.email,
        phone: editUser.phone_number,
        role: editUser.role,
        address: editUser.address,
        bankAccountNo: editUser.bank_info.account_number,
        bankName: editUser.bank_info.bank_name,
        iban: editUser.bank_info.iban,
        vehicles: editUser.vehicles,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e) => {
    setUser((user) => ({ ...user, vehicles: e.value }));
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "drivers";
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
    let uri = "drivers";

    const bankInfo = {
      account_number: user.bankAccountNo,
      bank_name: user.bankName,
      iban: user.iban,
    };

    const formData = new FormData();
    formData.append("first_name", user.firstName);
    formData.append("last_name", user.lastName);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("role", user.role);
    formData.append("phone_number", user.phone);
    formData.append("address", user.address);
    formData.append("vehicles", user.vehicles);
    formData.append("bank_info", JSON.stringify(bankInfo));
    if (user.profile_pic)
      formData.append("profile_pic", user.profile_pic, user.profile_pic?.name);
    if (user.id_front)
      formData.append("id_card_front", user.id_front, user.id_front?.name);
    if (user.id_back)
      formData.append("id_card_back", user.id_back, user.id_back?.name);
    if (user.vtc_front)
      formData.append("vtc_card_front", user.vtc_front, user.vtc_front?.name);
    if (user.vtc_back)
      formData.append("vtc_card_back", user.vtc_back, user.vtc_back?.name);
    if (user.green_front)
      formData.append(
        "green_card_front",
        user.green_front,
        user.green_front?.name
      );
    if (user.green_back)
      formData.append(
        "green_card_back",
        user.green_back,
        user.green_back?.name
      );
    if (user.license_front)
      formData.append(
        "license_card_front",
        user.license_front,
        user.license_front?.name
      );
    if (user.license_back)
      formData.append(
        "license_card_back",
        user.license_back,
        user.license_back?.name
      );

    if (editUser) {
      method = "put";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, formData).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
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
          Add Driver
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  User information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-image"
                        >
                          Add Profile Picture <i className="ni ni-album-2" />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-image"
                          name="profile_pic"
                          type="file"
                          onChange={handleFileChange}
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
                          type="email"
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
                          htmlFor="input-email"
                        >
                          Email Address
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-email"
                          placeholder="johndoe@example.com"
                          type="text"
                          value={user.email}
                          name="email"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-password"
                        >
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
                  </Row>
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Select Company
                        </Label>

                        <Select
                          onChange={handleInputChange}
                          name="client"
                          hideSelectedOptions
                          className="form-control-alternative"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Select Vehicle
                        </Label>

                        {vehicles && (
                          <Select
                            onChange={handleVehicleChange}
                            name="vehicles"
                            hideSelectedOptions
                            defaultValue={{
                              value: vehicles[0]?._id,
                              label: `${vehicles[0]?.vehicle_name}`,
                            }}
                            className="form-control-alternative"
                            options={vehicles.map((vehicle) => ({
                              value: vehicle?._id,
                              label: `${vehicle?.vehicle_name}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="pl-lg-4">
                  <h6 className="heading-small text-muted mb-4">Role</h6>
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-male"
                        >
                          Individual
                        </label>
                        <Input
                          className="form-control-lg"
                          id="input-male"
                          required={true}
                          checked={user.role === "individual"}
                          type="radio"
                          name="role"
                          value="individual"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="5">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-female"
                        >
                          FleetManager
                        </label>
                        <Input
                          className="form-control-lg"
                          id="input-female"
                          required={true}
                          checked={user.role === "fleet_manager"}
                          type="radio"
                          name="role"
                          value="fleet_manager"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <hr className="my-4" />
                {/* Contact Information */}
                <h6 className="heading-small text-muted mb-4">
                  Contact information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Address
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-address"
                          placeholder="Home Address"
                          type="text"
                          value={user.address}
                          name="address"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
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
                          value={user.phone}
                          name="phone"
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
                          htmlFor="input-account"
                        >
                          Account No.
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-account"
                          placeholder="XXXXX-XXXXXXX-X"
                          type="text"
                          value={user.bankAccountNo}
                          name="bankAccountNo"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
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
                          placeholder="Bank Name"
                          type="text"
                          value={user.bankName}
                          name="bankName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
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
                          type="number"
                          value={user.iban}
                          name="iban"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <hr className="my-4" />
                <h6 className="heading-small text-muted mb-4">
                  Other information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-id-front"
                        >
                          Add Identity Card Front Side{" "}
                          <i className="fa fa-id-card" />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-id-front"
                          name="id_front"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-id-back"
                        >
                          Add Identity Card Back Side{" "}
                          <i className="fa fa-id-card" />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-id-back"
                          name="id_back"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-vtc-front"
                        >
                          Add VTC Card Front Side{" "}
                          <i className="fa fa-id-card" />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-vtc-front"
                          name="vtc_front"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-vtc-back"
                        >
                          Add VTC Card Back Side <i className="fa fa-id-card" />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-vtc-back"
                          name="vtc_back"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-green-front"
                        >
                          Add Green VTC Card Front Side{" "}
                          <i className="fa fa-id-card" />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-green-front"
                          name="green_front"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-green-back"
                        >
                          Add Green VTC Card Back Side{" "}
                          <i className="fa fa-id-card" />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-green-back"
                          name="green_back"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-license-front"
                        >
                          Add License Card Front Side{" "}
                          <i className="fa fa-id-card" />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-license-front"
                          name="license_front"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-license-back"
                        >
                          Add License Card Back Side{" "}
                          <i className="fa fa-id-card" />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-license-back"
                          name="license_back"
                          type="file"
                          onChange={handleFileChange}
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

export default DriverForm;
