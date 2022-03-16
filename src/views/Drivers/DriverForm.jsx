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
  Label,
} from "reactstrap";
// core components
import Select from "react-select";
import moment from "moment";
let current = moment();
const DriverForm = ({
  openModal,
  handleModal,
  handleFileChange,
  handleInputChange,
  handleVehicleChange,
  handleRoleChange,
  editUser,
  isEditing,
  isClose,
  autoRefresh,
}) => {
  const [user, setUser] = useState({
    profile_pic: "",
    id_front: "",
    id_back: "",
    vtc_front: "",
    vtc_back: "",
    criminal_record_image: "",
    criminal_record_date: "",
    ris_image: "",
    ris_date: "",
    kbis_image: "",
    kbis_date: "",
    proRc_image: "",
    proRc_date: "",
    license_front: "",
    license_back: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    bankName: "",
    iban: "",
    role: "",
    vehicles: [],
    company_name: "",
    siret_number: "",
    legal_info: "",
    social_capital: "",
    vat_number: "",
    city_of_rcs: "",
  });
  const [address, setAddress] = useState({
    lat: "",
    lng: "",
    label: "",
    label2: "",
    city: "",
    postal_code: "",
  });
  const [vehicles, setVehicles] = useState();
  useEffect(() => {
    api("get", "vehicles").then((res) => {
      setVehicles(res.data.vehicles);
    });
  }, []);

  useEffect(() => {
    if (isClose) {
      console.log("v", editUser.vehicles);
      setUser({
        firstName: editUser?.firstName,
        lastName: editUser?.lastName,
        password: editUser?.password,
        email: editUser?.email,
        phone: editUser?.phone,
        role: editUser?.role,
        bankName: editUser?.bankName,
        iban: editUser?.iban,
        vehicles: editUser?.vehicles.map((i) => {
          return i.value;
        }),
        company_name: editUser?.company_name,
        siret_number: editUser?.siret_number,
        legal_info: editUser?.legal_info,
        social_capital: editUser?.siret_number,
        vat_number: editUser?.vat_number,
        city_of_rcs: editUser?.city_of_rcs,
        profile_pic: editUser?.profile_pic,
        criminal_record_date: editUser?.criminal_record_date,
        kbis_date: editUser?.kbis_date,
        ris_date: editUser?.ris_date,
        proRc_date: editUser?.proRc_date,
        criminal_record_image: editUser?.criminal_record_image,
        ris_image: editUser?.ris_image,
        kbis_image: editUser?.kbis_image,
        proRc_image: editUser.proRc_image,
        id_front: editUser?.id_front,
        id_back: editUser?.id_front,
        vtc_front: editUser?.vtc_front,
        vtc_back: editUser?.vtc_back,
        license_front: editUser?.license_front,
        license_back: editUser?.license_back,
        address: editUser?.address,
      });
      setAddress(editUser?.address);
    }
  }, [editUser]);

  useEffect(() => {
    if (isEditing) {
      setUser({
        firstName: editUser?.first_name,
        lastName: editUser?.last_name,
        password: editUser?.password,
        email: editUser?.email,
        phone: editUser?.phone_number,
        role: editUser?.role,
        bankName: editUser?.bank_info?.bank_name,
        iban: editUser?.bank_info?.iban,
        vehicles: editUser?.vehicles,
        company_name: editUser?.company?.company_name,
        siret_number: editUser?.company?.siret_number,
        legal_info: editUser?.company?.legal_info,
        social_capital: editUser?.company?.social_capital,
        vat_number: editUser?.company?.vat_number,
        city_of_rcs: editUser?.company?.city_of_rcs,
        profile_pic: editUser?.profile_pic,
        criminal_record_date: editUser?.criminal_record_date,
        kbis_date: editUser?.kbis_date,
        ris_date: editUser?.ris_date,
        proRc_date: editUser?.proRc_date,
      });
      setAddress(editUser?.address);
    }
  }, []);

  const handleFile1Change = (e) => {
    console.log(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  };

  const handleInput1Change = (e) => {
    console.log("e.target.value", e.target.name);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleVehicle1Change = (e) => {
    console.log("v");
    setUser((user) => ({ ...user, vehicles: [e.value] }));
  };

  const handleRole1Change = (e) => {
    console.log("inside role1");
    setUser((user) => ({ ...user, role: e.value }));
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "drivers";
    if (editUser) {
      method = "delete";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri).then((res) => {
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
      bank_name: user.bankName,
      iban: user.iban,
    };

    const formData = new FormData();
    if (user.profile_pic)
      formData.append("profile_pic", user.profile_pic, user.profile_pic?.name);
    formData.append("first_name", user.firstName);
    formData.append("last_name", user.lastName);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("role", user.role);
    formData.append("phone_number", user.phone);
    formData.append("address", JSON.stringify(address));
    formData.append("vehicles", JSON.stringify(user.vehicles));
    formData.append("bank_info", JSON.stringify(bankInfo));

    if (user.role === "fleet_manager") {
      formData.append(
        "company",
        JSON.stringify({
          company_name: user.company_name,
          siret_number: user.siret_number,
          legal_info: user.legal_info,
          social_capital: user.social_capital,
          vat_number: user.vat_number,
          city_of_rcs: user.city_of_rcs,
        })
      );
    }

    if (user.criminal_record_image) {
      if (user?.criminal_record_date == "") {
        return toast.error("Please enter criminal_record expirty date");
      }
      formData.append(
        "criminal_record_image",
        user.criminal_record_image,
        user.criminal_record_image?.name
      );
      formData.append("criminal_record_date", user.criminal_record_date);
    }

    if (user.ris_image) {
      formData.append("ris_image", user.ris_image, user.ris_image?.name);
      if (user?.ris_date == "") {
        return toast.error("Please enter RIS expirty date");
      }
      formData.append("ris_date", user.ris_date);
    }

    if (user.kbis_image) {
      formData.append("kbis_image", user.kbis_image, user.kbis_image?.name);
      formData.append("kbis_date", user.kbis_date);
      if (user?.kbis_date == "") {
        return toast.error("Please enter KBIS expirty date");
      }
    }

    if (user.proRc_image) {
      if (user?.proRc_dates == "") {
        return toast.error("Please enter proRC expirty date");
      }
      formData.append("proRc_image", user.proRc_image, user.proRc_image?.name);
      formData.append("proRc_date", user.proRc_date);
    }

    if (user.id_front)
      formData.append("id_card_front", user.id_front, user.id_front?.name);
    if (user.id_back)
      formData.append("id_card_back", user.id_back, user.id_back?.name);

    if (user.vtc_front)
      formData.append("vtc_card_front", user.vtc_front, user.vtc_front?.name);
    if (user.vtc_back)
      formData.append("vtc_card_back", user.vtc_back, user.vtc_back?.name);

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

    if (user.role == "") {
      return toast.error("Please select your role");
    }

    if (user.phone == "") {
      return toast.error("Please enter phone number");
    }

    if (isEditing) {
      method = "put";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, formData).then((res) => {
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
          {isEditing ? "Edit" : "Add"} Driver
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
                          <span style={{ color: "red" }}>
                            {user.firstName ? "" : "*"}
                          </span>{" "}
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
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
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
                          Last Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Doe"
                          type="email"
                          value={user.lastName}
                          name="lastName"
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {!isEditing && (
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            <span style={{ color: "red" }}>
                              {user.email ? "" : "*"}
                            </span>{" "}
                            Email Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="johndoe@example.com"
                            type="text"
                            value={user.email}
                            name="email"
                            onChange={
                              isEditing ? handleInput1Change : handleInputChange
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            <span style={{ color: "red" }}>
                              {user.password ? "" : "*"}
                            </span>{" "}
                            Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-password"
                            placeholder="Password"
                            type="password"
                            value={user.password}
                            name="password"
                            onChange={
                              isEditing ? handleInput1Change : handleInputChange
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          <span style={{ color: "red" }}>
                            {user.role ? "" : "*"}
                          </span>{" "}
                          Select Role
                        </Label>

                        <Select
                          onChange={
                            isEditing ? handleRole1Change : handleRoleChange
                          }
                          name="role"
                          hideSelectedOptions
                          defaultValue={
                            user?.role && {
                              value: user.role,
                              label: user.role,
                            }
                          }
                          className="form-control-alternative"
                          options={[
                            {
                              value: "individual",
                              label: "individual",
                            },
                            {
                              value: "fleet_manager",
                              label: "fleet_manager",
                            },
                          ]}
                        />
                      </FormGroup>
                    </Col>
                    {user.role === "individual" ? (
                      <Col lg="6">
                        <FormGroup>
                          <Label
                            for="exampleSelect"
                            className="form-control-label"
                          >
                            <span style={{ color: "red" }}>
                              {user.vehicles[0] ? "" : "*"}
                            </span>{" "}
                            Select Vehicle
                          </Label>
                          {vehicles && (
                            <Select
                              name="vehicles"
                              hideSelectedOptions
                              onChange={
                                isEditing
                                  ? handleVehicle1Change
                                  : handleVehicleChange
                              }
                              defaultValue={
                                isClose
                                  ? editUser.vehicles?.map((i) => ({
                                      value: i.value,
                                      label: i.label,
                                    }))
                                  : user?.vehicles?.length > 0 && {
                                      value: user?.vehicles[0]?._id,
                                      label: user?.vehicles[0]?.vehicle_name,
                                    }
                              }
                              className="form-control-alternative"
                              options={vehicles.map((vehicle) => ({
                                value: vehicle?._id,
                                label: `${vehicle?.vehicle_name}`,
                              }))}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    ) : user.role === "fleet_manager" ? (
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-fname"
                          >
                            Select Vehicles
                          </label>

                          {vehicles && (
                            <Select
                              onChange={(e) =>
                                setUser((user) => ({
                                  ...user,
                                  vehicles: e.map((driver) => driver.value),
                                }))
                              }
                              name="vehicles"
                              isMulti
                              className="form-control-alternative"
                              defaultValue={
                                user?.vehicles?.length > 0 &&
                                user?.vehicles?.map((vehicle) => ({
                                  value: vehicle._id,
                                  label: vehicle.vehicle_name,
                                }))
                              }
                              options={vehicles.map((vehicle) => ({
                                value: vehicle?._id,
                                label: `${vehicle?.vehicle_name}`,
                              }))}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    ) : (
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-fname"
                          >
                            Select Vehicles
                          </label>

                          <Select
                            name="vehicles"
                            isMulti
                            className="form-control-alternative"
                            isDisabled={true}
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                </div>

                {user.role === "fleet_manager" && (
                  <>
                    <hr className="my-4" />

                    {/* Contact Information */}
                    <h6 className="heading-small text-muted mb-4">
                      Company information
                    </h6>

                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-fname"
                            >
                              Company Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-fname"
                              required={true}
                              placeholder="Enter Company Name"
                              type="text"
                              value={user.company_name}
                              name="company_name"
                              onChange={
                                isEditing
                                  ? handleInput1Change
                                  : handleInputChange
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              City of RCS
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-address"
                              placeholder="City of RCS"
                              type="text"
                              value={user.city_of_rcs}
                              name="city_of_rcs"
                              onChange={
                                isEditing
                                  ? handleInput1Change
                                  : handleInputChange
                              }
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
                              htmlFor="input-email"
                            >
                              SIRET Number
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="123456789"
                              type="text"
                              value={user.siret_number}
                              name="siret_number"
                              onChange={
                                isEditing
                                  ? handleInput1Change
                                  : handleInputChange
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-vat"
                            >
                              VAT Number
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-vat"
                              placeholder="VAT Number"
                              type="text"
                              value={user.vat_number}
                              name="vat_number"
                              onChange={
                                isEditing
                                  ? handleInput1Change
                                  : handleInputChange
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-account"
                            >
                              Enter Social Capital
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-account"
                              placeholder="XXXXX-XXXXXXX-X"
                              type="text"
                              value={user.social_capital}
                              name="social_capital"
                              onChange={
                                isEditing
                                  ? handleInput1Change
                                  : handleInputChange
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-bankName"
                            >
                              Enter Legal Information
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-bankName"
                              placeholder="Legal Information here..."
                              type="text"
                              value={user.legal_info}
                              name="legal_info"
                              onChange={
                                isEditing
                                  ? handleInput1Change
                                  : handleInputChange
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}

                <hr className="my-4" />
                {/* Contact Information */}
                <h6 className="heading-small text-muted mb-4">
                  Contact information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <AddressInput
                          label="Address"
                          optional={true}
                          address={address}
                          setAddress={setAddress}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-phone"
                        >
                          <span style={{ color: "red" }}>
                            {user.phone ? "" : "*"}
                          </span>{" "}
                          Phone Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-phone"
                          placeholder="+33123456789"
                          type="text"
                          value={user.phone}
                          name="phone"
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
                          maxLength={14}
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
                          placeholder="Bank Name"
                          type="text"
                          value={user.bankName}
                          name="bankName"
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
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
                          placeholder="Example Bank Ltd"
                          type="text"
                          value={user.iban}
                          name="iban"
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
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
                          Add Identity Card/Passport/Residence Permit Front Side{" "}
                          <i className="fa fa-id-card" />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-id-front"
                          name="id_front"
                          type="file"
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-id-back"
                        >
                          Add Identity Card/Passport/Residence Permit Back Side{" "}
                          <i className="fa fa-id-card" />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-id-back"
                          name="id_back"
                          type="file"
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
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
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
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
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
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
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
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
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-criminal-record"
                        >
                          Add Criminal Record <i className="fa fa-id-card" />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-criminal-record"
                          name="criminal_record_image"
                          type="file"
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-date"
                        >
                          <span style={{ color: "red" }}>
                            {user.criminal_record_image && "*"}
                          </span>{" "}
                          Valid Till
                        </label>

                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder="Enter Company Name"
                          type="date"
                          value={user?.criminal_record_date?.split("T")[0]}
                          name="criminal_record_date"
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
                          min={moment(current).format("YYYY-MM-DD")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-restricted-information-statement"
                        >
                          Add Restricted Information Statement{" "}
                          <i className="fa fa-id-card" />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-restricted-information-statement"
                          name="ris_image"
                          type="file"
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-date"
                        >
                          <span style={{ color: "red" }}>
                            {user.ris_image ? (user?.ris_date ? "" : "*") : ""}
                          </span>
                          Valid Till
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder="Enter Company Name"
                          type="date"
                          value={user?.ris_date?.split("T")[0]}
                          name="ris_date"
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
                          min={moment(current).format("YYYY-MM-DD")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-kbis"
                        >
                          Add KBIS <i className="fa fa-id-card" />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-kbis"
                          name="kbis_image"
                          type="file"
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-date"
                        >
                          <span style={{ color: "red" }}>
                            {user.kbis_image
                              ? user?.kbis_date
                                ? ""
                                : "*"
                              : ""}
                          </span>
                          Valid Till
                        </label>

                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder="Enter Company Name"
                          type="date"
                          value={user?.kbis_date?.split("T")[0]}
                          name="kbis_date"
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
                          min={moment(current).format("YYYY-MM-DD")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-pro_rc_insurance_certificate"
                        >
                          Add Pro RC Insurance Certificate{" "}
                          <i className="fa fa-id-card" />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-pro_rc_insurance_certificate"
                          name="proRc_image"
                          type="file"
                          title=" "
                          onChange={
                            isEditing ? handleFile1Change : handleFileChange
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-date"
                        >
                          <span style={{ color: "red" }}>
                            {user.proRc_image
                              ? user?.proRc_date
                                ? ""
                                : "*"
                              : ""}
                          </span>
                          Valid Till
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder="Enter Company Name"
                          type="date"
                          value={user?.proRc_date?.split("T")[0]}
                          name="proRc_date"
                          onChange={
                            isEditing ? handleInput1Change : handleInputChange
                          }
                          min={moment(current).format("YYYY-MM-DD")}
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
