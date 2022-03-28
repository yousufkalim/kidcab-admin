import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import FilePicker from "../../components/Form/FilePicker";
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
} from "reactstrap";
// core components

const CompanyProfile = ({ openModal, handleModal }) => {
  const [company, setCompany] = useState({
    logo: "",
    address: "",
    phoneNumber: "",
    companyName: "",
    siret: "",
    vat: "",
    legalForm: "",
    shareCapital: "",
    rcsCity: "",
    bankName: "",
    iban: "",
  });

  const getCompany = async () => {
    const { data } = await api("get", "company");
    setCompany({
      logo: data.company?.logo || "",
      phoneNumber: data.company?.phone_number || "",
      vat: data.company?.vat_number || "",
      companyName: data.company?.company_name || "",
      siret: data.company?.siret_number || "",
      legalForm: data.company?.legal_form || "",
      shareCapital: data.company?.share_capital || "",
      rcsCity: data.company?.rcs_city || "",
      bankName: data.company?.bank_name || "",
      iban: data.company?.iban || "",
      address: data.company?.address || "",
    });
  };

  useEffect(() => {
    getCompany();
  }, []);

  const handleFileChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("phone_number", company.phoneNumber);
    formData.append("address", company.address);
    formData.append("company_name", company.companyName);
    formData.append("siret_number", company.siret);
    formData.append("vat", company.vat);
    formData.append("legal_form", company.legalForm);
    formData.append("share_capital", company.shareCapital);
    formData.append("rcs_city", company.rcsCity);
    formData.append("bank_name", company.bankName);
    formData.append("iban", company.iban);

    if (company.logo) {
      formData.append("logo", company.logo);
    }

    api("post", "company", formData).then((res) => {
      toast.success("company edited successfully");
      getCompany();
      handleModal();
    });
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}></ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Company information
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
                            {company.logo ? "" : "*"}
                          </span>{" "}
                          Add Logo <i className="ni ni-album-2" />
                          <View url={company?.logo} />
                        </label>
                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-image"
                          InputClassName="form-control-file form"
                          InputId="input-image"
                          InputName="logo"
                          value={company?.logo}
                          onChange={handleFileChange}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-companyName"
                        >
                          Company Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-companyName"
                          placeholder="Company Name"
                          type="text"
                          value={company.companyName}
                          name="companyName"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-rcsCity"
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
                          htmlFor="input-vat"
                        >
                          VAT Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-vat"
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
                    <Col lg="8">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-iban"
                        >
                          IBAN / BIC
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

export default CompanyProfile;
