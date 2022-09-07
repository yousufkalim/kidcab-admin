import { useState } from "react";
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
import { useTranslation } from "react-i18next";
// core components

const PassengerForm = ({ openModal, handleModal, clientId, autoRefresh }) => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    client: clientId,
    relationship: "",
  });

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
          {t("Add Passenger")}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  {t("Passenger information")}
                </h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          {t("First Name")}
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
                          {t("Last Name")}
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
                          {t("Relationship")}
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
                            {t("Self")}
                          </option>
                          <option value="son">{t("Son")}</option>
                          <option value="daughter">{t("Daughter")}</option>
                          <option value="brother">{t("Brother")}</option>
                          <option value="sister">{t("Sister")}</option>
                          <option value="father">{t("Father")}</option>
                          <option value="mother">{t("Mother")}</option>
                          <option value="uncle">{t("Uncle")}</option>
                          <option value="aunt">{t("Aunt")}</option>
                          <option value="other">{t("other")}</option>
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
            {t("Save")}
          </Button>
          <Button onClick={handleModal}>{t("Cancel")}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PassengerForm;
