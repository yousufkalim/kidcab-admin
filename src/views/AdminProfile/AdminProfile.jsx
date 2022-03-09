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

const AdminProfile = ({ openModal, handleModal, user, isEditing }) => {
  const [company, setCompany] = useState({
    name: "",
    logo: "",
    email: "",
    password: "",
    address: {},
    phoneNumber: "",
    siret: "",
    vat: "",
    legalForm: "",
    shareCapital: "",
    rcsCity: "",
    bankAccount: "",
    bankName: "",
    bic: "",
    bic: "",
  });
  let [address, setAddress] = useState({});

  useEffect(() => {
    console.log(user);
    setCompany({
      name: user.name?.first_name + " " + user.name?.last_name,
      logo: user.logo,
      password: user.password,
      email: user.email,
      phoneNumber: user.phone_number,
      vat: user.vat_number,
      siret: user.siret_number,
      legalForm: user.legal_form,
      shareCapital: user.share_capital,
      legalForm: user.legalForm,
      bankName: user.bank_name,
      bankAccount: user.bank_account,
      iban: user.iban,
      bic: user.bic,
    });
    // setAddress(user.address);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "companys";

    const formData = new FormData();

    formData.append("name", company.name);
    formData.append("email", company.email);
    formData.append("password", company.password);
    formData.append("logo", company.logo);
    formData.append("phone_number", company.phone_number);
    formData.append("address", JSON.stringify(address));
    formData.append("siret_number", company.siret);
    formData.append("vat", company.vat_number);

    if (company.name == "") {
      return toast.error("Please enter your name");
    }
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

    if (user) {
      method = "put";
      uri = uri + `/${user._id}`;
    }
    api(method, uri, formData).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        toast.success("Saved Successfully");

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
          {isEditing ? "Edit" : "Add"} Profile
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
                            {company.name ? "" : "*"}{" "}
                          </span>
                          {""} Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="John"
                          type="text"
                          value={company.name}
                          name="name"
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
                        <AddressInput
                          label="Address"
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
          {isEditing && <Button onClick={handleModal}>Cancel</Button>}{" "}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdminProfile;
