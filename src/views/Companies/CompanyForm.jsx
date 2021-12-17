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

const CompanyForm = ({ openModal, handleModal, editUser, isEditing, autoRefresh }) => {
  const [user, setUser] = useState({
    company_name: "",
    logo: "",
    siret_number: "",
    legal_info: "",
    social_capital: "",
    vat_number: "",
    city_of_rcs: "",
    manager: null,
  });
  const [drivers, setDrivers] = useState();

  useEffect(() => {
    api("get", "drivers").then((res) => {
      const fleetManagers = res.data.drivers.filter((driver) => {
        return driver.role === "fleet_manager";
      });
      console.log(fleetManagers);
      setDrivers(fleetManagers);
    });
  }, []);

  useEffect(() => {
    if (isEditing) {
      setUser({
        company_name: editUser.company_name,
        logo: editUser.logo,
        siret_number: editUser.siret_number,
        legal_info: editUser.legal_info,
        social_capital: editUser.social_capital,
        vat_number: editUser.vat_number,
        city_of_rcs: editUser.city_of_rcs,
        manager: editUser.manager,
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
    setUser((user) => ({ ...user, manager: e.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "companies";
    const formData = new FormData();

    for (const property in user) {
      formData.append(property, user[property])
    }


    if (editUser) {
      method = "put";
      uri = uri + `/${editUser._id}`;
    }
    console.log(formData);
    api(method, uri, formData)
      .then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          toast.success("Saved Successfully");
          handleModal();
          autoRefresh();
        } else {
          toast.error("Save Error", res);
        }
      })
      .catch((error) => toast.error(error.message));
  };
  const handleDelete = () => {
    let method = "delete";
    let uri = "companies";
    if (editUser) {
      method = "delete";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri)
      .then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          toast.success("Delete Successfully");
          handleModal();
          autoRefresh();
        } else {
          toast.error("Delete Error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          Add Company
        </ModalHeader>
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
                          Add Company Logo <i className="ni ni-album-2" />
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
                    <Col lg="12">
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
                  </Row>
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Select Company Fleet Manager
                        </Label>

                        {drivers && (
                          <Select
                            onChange={handleVehicleChange}
                            name="vehicles"
                            className="form-control-alternative"
                            options={drivers.map((driver) => ({
                              value: driver?._id,
                              label: `${driver?.first_name} ${driver?.last_name}`,
                            }))}
                          />
                        )}
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
                          Enter Company Location / Working City
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-address"
                          placeholder="Address"
                          type="text"
                          value={user.city_of_rcs}
                          name="city_of_rcs"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <h6 className="heading-small text-muted mb-4">
                  Other Information
                </h6>
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
                          htmlFor="input-password"
                        >
                          VAT Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-password"
                          placeholder="Password"
                          type="password"
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

export default CompanyForm;
