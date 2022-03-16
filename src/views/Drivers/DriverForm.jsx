import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import AddressInput from "components/Form/AddressInput";
import View from "../../components/view";
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
  editUser,
  isEditing,
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
  const [docs, setDocs] = useState({});

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
    if (isEditing) {
      setUser({
        firstName: editUser.first_name,
        lastName: editUser.last_name,
        password: editUser.password,
        email: editUser.email,
        phone: editUser.phone_number,
        role: editUser.role,
        bankName: editUser.bank_info.bank_name,
        iban: editUser.bank_info.iban,
        vehicles: editUser.vehicles,
        company_name: editUser.company?.company_name,
        siret_number: editUser.company?.siret_number,
        legal_info: editUser.company?.legal_info,
        social_capital: editUser.company?.social_capital,
        vat_number: editUser.company?.vat_number,
        city_of_rcs: editUser.company?.city_of_rcs,
        criminal_record_date: editUser.criminal_record_date,
        kbis_date: editUser.kbis_date,
        ris_date: editUser.ris_date,
        proRc_date: editUser.proRc_date,
      });
      setDocs({
        profile_pic: editUser.profile_pic,
        id_card_front: editUser.id_card_front,
        id_card_back: editUser.id_card_back,
        vtc_card_front: editUser.vtc_card_front,
        vtc_card_back: editUser.vtc_card_back,
        criminal_record_image: editUser.criminal_record_image,
        ris_image: editUser.ris_image,
        kbis_image: editUser.kbis_image,
        proRc_image: editUser.proRc_image,
        license_card_front: editUser.license_card_front,
        license_card_back: editUser.license_card_back,
      });

      console.log(editUser);

      setAddress(editUser.address);
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
    setUser((user) => ({ ...user, vehicles: [e.value] }));
  };

  const handleRoleChange = (e) => {
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
      // eslint-disable-next-line
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
      formData.append(
        "criminal_record_image",
        user.criminal_record_image,
        user.criminal_record_image?.name
      );
      formData.append("criminal_record_date", user.criminal_record_date);
    }

    if (user.ris_image) {
      formData.append("ris_image", user.ris_image, user.ris_image?.name);
      formData.append("ris_date", user.ris_date);
    }

    if (user.kbis_image) {
      formData.append("kbis_image", user.kbis_image, user.kbis_image?.name);
      formData.append("kbis_date", user.kbis_date);
    }

    if (user.proRc_image) {
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

    if (user.profile_pic == "") {
      return toast.error("Please attach profile picture");
    }

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

    if (
      !(
        address.lat ||
        address.lng ||
        address.city ||
        address.label ||
        address.label ||
        address.label2
      )
    ) {
      return toast.error("Please select your addres");
    }

    if (user.phone == "") {
      return toast.error("Please enter phone number");
    }

    if (user.id_front == "") {
      return toast.error("Please attach ID card front picture");
    }
    if (user.id_back == "") {
      return toast.error("Please attach ID card back picture");
    }
    if (user.vtc_front == "") {
      return toast.error("Please attach vtc card front picture");
    }
    if (user.vtc_back == "") {
      return toast.error("Please attach vtc card back picture");
    }
    if (user.license_front == "") {
      return toast.error("Please attach license front picture");
    }
    if (user.license_back == "") {
      return toast.error("Please attach license back picture");
    }

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
                          <span style={{ color: "red" }}>
                            {user.profile_pic ? "" : "*"}
                          </span>{" "}
                          Add Profile Picture <View url={docs.profile_pic} />
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
                            onChange={handleInputChange}
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
                          onChange={handleRoleChange}
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
                              onChange={handleVehicleChange}
                              name="vehicles"
                              hideSelectedOptions
                              defaultValue={
                                user?.vehicles?.length > 0 && {
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
                    ) : (
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
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          placeholder="Example Bank Ltd"
                          type="text"
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
                          <span style={{ color: "red" }}>
                            {user.id_front ? "" : "*"}
                          </span>{" "}
                          Add Identity Card/Passport/Residence Permit Front Side{" "}
                          <View url={docs.id_card_front} />
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
                          <span style={{ color: "red" }}>
                            {user.id_back ? "" : "*"}
                          </span>{" "}
                          Add Identity Card/Passport/Residence Permit Back Side{" "}
                          <View url={docs.id_card_back} />
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
                          <span style={{ color: "red" }}>
                            {user.vtc_back ? "" : "*"}
                          </span>{" "}
                          Add VTC Card Front Side{" "}
                          <View url={docs.vtc_card_front} />
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
                          <span style={{ color: "red" }}>
                            {user.vtc_back ? "" : "*"}
                          </span>{" "}
                          Add VTC Card Back Side{" "}
                          <View url={docs.vtc_card_back} />
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
                          htmlFor="input-license-front"
                        >
                          <span style={{ color: "red" }}>
                            {user.license_front ? "" : "*"}
                          </span>{" "}
                          Add License Card Front Side{" "}
                          <View url={docs.license_card_front} />
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
                          <span style={{ color: "red" }}>
                            {user.license_back ? "" : "*"}
                          </span>{" "}
                          Add License Card Back Side{" "}
                          <View url={docs.license_card_back} />
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
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-criminal-record"
                        >
                          <span style={{ color: "red" }}>
                            {user.criminal_record_image ? "" : "*"}
                          </span>{" "}
                          Add Criminal Record{" "}
                          <View url={docs.criminal_record_image} />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-criminal-record"
                          name="criminal_record_image"
                          type="file"
                          onChange={handleFileChange}
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
                            {user.criminal_record_date ? "" : "*"}
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
                          onChange={handleInputChange}
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
                          <span style={{ color: "red" }}>
                            {user.ris_image ? "" : "*"}
                          </span>{" "}
                          Add Restricted Information Statement{" "}
                          <View url={docs.ris_image} />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-restricted-information-statement"
                          name="ris_image"
                          type="file"
                          onChange={handleFileChange}
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
                            {user.ris_date ? "" : "*"}
                          </span>{" "}
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
                          onChange={handleInputChange}
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
                          <span style={{ color: "red" }}>
                            {user.kbis_image ? "" : "*"}
                          </span>{" "}
                          Add KBIS <View url={docs.kbis_image} />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-kbis"
                          name="kbis_image"
                          type="file"
                          onChange={handleFileChange}
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
                            {user.kbis_date ? "" : "*"}
                          </span>{" "}
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
                          onChange={handleInputChange}
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
                          <span style={{ color: "red" }}>
                            {user.proRc_image ? "" : "*"}
                          </span>{" "}
                          Add Pro RC Insurance Certificate{" "}
                          <View url={docs.proRc_image} />
                        </label>

                        <Input
                          className="form-control-file form"
                          id="input-pro_rc_insurance_certificate"
                          name="proRc_image"
                          type="file"
                          onChange={handleFileChange}
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
                            {user.proRc_date ? "" : "*"}
                          </span>{" "}
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
                          onChange={handleInputChange}
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
