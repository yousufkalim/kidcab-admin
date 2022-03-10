import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddressInput from "components/Form/AddressInput";
import api from "../../api";
import { UpdateStore } from "StoreContext";
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

const AdminProfile = ({ openModal, handleModal, user }) => {
  const [company, setCompany] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    siret: "",
    vat: "",
    legalForm: "",
    shareCapital: "",
    rcsCity: "",
    bankAccount: "",
    bankName: "",
    iban: "",
    bic: "",
  });
  const updateStore = UpdateStore();

  useEffect(() => {
    setCompany({
      firstName: user.name?.first_name || "",
      lastName: user.name?.last_name || "",
      email: user.email || "",
      phoneNumber: user.phone_number || "",
      vat: user.vat_number || "",
      siret: user.siret_number || "",
      legalForm: user.legal_form || "",
      shareCapital: user.share_capital || "",
      rcsCity: user.rcs_city || "",
      bankName: user.bank_name || "",
      bankAccount: user.bank_account || "",
      iban: user.iban || "",
      bic: user.bic || "",
      address: user.address || "",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.files[0] });
  };
  const handleInputChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  // const handleDelete = () => {
  //   let method = "delete";
  //   let uri = "companys";
  //   if (user) {
  //     method = "delete";
  //     uri = uri + `/${user._id}`;
  //   }
  //   api(method, uri).then((res) => {
  //     // eslint-disable-next-line eqeqeq
  //     if (res.status == 200) {
  //       toast.success("Delete Successfully");
  //       handleModal();
  //       autoRefresh();
  //     } else {
  //       toast.error("Delete Error", res.data.message);
  //     }
  //   });
  // };
  // const admin = {
  //   first_name: company.firstName,
  //   last_name: company.lastName,
  //   email: company.email,
  //   password: company.password,
  //   logo: company.logo,
  //   phone_number: company.phoneNumber,
  //   address: JSON.stringify(address),
  //   siret_number: company.siret,
  //   vat: company.vat,
  //   legal_form: company.legalForm,
  //   share_capital: company.shareCapital,
  //   rcs_city: company.rcsCity,
  //   bank_account: company.bankAccount,
  //   bank_name: company.bankName,
  //   iban: company.iban,
  //   bic: company.bic,
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "put";
    let uri = "admins";

    const formData = new FormData();

    formData.append(
      "name",
      JSON.stringify({
        first_name: company.firstName,
        last_name: company.lastName,
      })
    );
    formData.append("email", company.email);
    formData.append("password", company.password);
    formData.append("phone_number", company.phoneNumber);
    formData.append("address", company.address);
    formData.append("siret_number", company.siret);
    formData.append("vat", company.vat);
    formData.append("legal_form", company.legalForm);
    formData.append("share_capital", company.shareCapital);
    formData.append("rcs_city", company.rcsCity);
    formData.append("bank_account", company.bankAccount);
    formData.append("bank_name", company.bankName);
    formData.append("iban", company.iban);
    formData.append("bic", company.bic);

    if (company.password) {
      formData.append("password", company.password);
    }

    if (company.logo) {
      formData.append("logo", company.logo);
    }

    // if (company.name == "") {
    //   return toast.error("Please enter your name");
    // }
    // if (company.lastName == "") {
    //   return toast.error("Please enter your last name");
    // }
    // if (company.email == "") {
    //   return toast.error("Please enter email");
    // }
    // if (!(company.email.includes(".") && company.email.includes("@"))) {
    //   return toast.error("Please enter a valid email");
    // }

    // if (company.password == "") {
    //   return toast.error("Password is required");
    // }
    // if (company.password.length < 8) {
    //   return toast.error("Passwords should be of atleast 8 letters");
    // }

    uri = uri + `/${user._id}`;

    api(method, uri, formData).then((res) => {
      // eslint-disable-next-line eqeqeq
      let admin = res.data.admin;
      if (res.status == 200) {
        console.log("RES======>", res.data.admin);
        toast.success("Saved Successfully");

        updateStore({
          user: admin,
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            admin,
          })
        );
        handleModal();
      } else {
        toast.error("Save Error", res);
      }
    });
    console.log("=========================", company);

    //window.location.reload();
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          Profile
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">Profile</h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-image"
                        >
                          <span style={{ color: "red" }}>
                            {company.logo ? "" : "*"}
                          </span>{" "}
                          Add Logo <i className="ni ni-album-2" />
                        </label>
                        <Input
                          className="form-control-file form"
                          id="input-image"
                          name="logo"
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
                            {" "}
                            {company.firstName ? "" : "*"}{" "}
                          </span>
                          {""} First Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="John"
                          type="text"
                          value={company.firstName}
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
                            {" "}
                            {company.lastName ? "" : "*"}{" "}
                          </span>
                          {""} Last Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          required={true}
                          placeholder="John"
                          type="text"
                          value={company.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          <span style={{ color: "red" }}>
                            {company.email ? "" : "*"} {""}
                          </span>
                          Email Address
                        </label>
                        <Input
                          type="email"
                          name="email"
                          className="form-control-alternative"
                          id="input-email"
                          placeholder="johndoe@example.com"
                          value={company.email}
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
                          htmlFor="input-password"
                        >
                          <span style={{ color: "red" }}>
                            {company.password ? "" : "*"}{" "}
                          </span>
                          Password
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-password"
                          placeholder="Password"
                          type="password"
                          value={company.password}
                          name="password"
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
                          City of RCS
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-rcsCity"
                          placeholder="City of RCS"
                          type="text"
                          value={company.rcsCity}
                          name="rcsCity"
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
                          htmlFor="input-legalForm"
                        >
                          Legal Form
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-shareCapital"
                          placeholder="legal Form"
                          type="text"
                          value={company.legalForm}
                          name="legalForm"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-cap"
                        >
                          Share Capital
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-shareCapital"
                          placeholder="Share Capital"
                          type="text"
                          value={company.shareCapital}
                          name="shareCapital"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>

                <div className="pl-lg-4">
                  <Row>
                    <Col md="12">
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
                          placeholder="Enter your address"
                          type="text"
                          value={company.address}
                          name="address"
                          onChange={handleInputChange}
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
                          value={company.phoneNumber}
                          name="phoneNumber"
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
                          value={company.siret}
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
                          VAT Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-intra"
                          placeholder="123456789"
                          type="text"
                          value={company.vat}
                          name="vat"
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
                          htmlFor="input-bankName"
                        >
                          Bank Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-bankName"
                          placeholder="Example Bank Ltd"
                          type="text"
                          value={company.bankName}
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
                          type="text"
                          value={company.iban}
                          name="iban"
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
                          Bank Account
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-iban"
                          placeholder="bank Account"
                          type="text"
                          value={company.bankAccount}
                          name="bankAccount"
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
                          htmlFor="input-bic"
                        >
                          BIC
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-bsnk"
                          placeholder="bic"
                          type="text"
                          value={company.bic}
                          name="bic"
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
          <Button onClick={handleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdminProfile;
