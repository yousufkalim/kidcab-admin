import { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
import { useTranslation } from "react-i18next";
// core components

const AdminProfile = ({ openModal, handleModal, user }) => {
  const { t, i18n } = useTranslation();
  const [admin, setAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const updateStore = UpdateStore();

  useEffect(() => {
    setAdmin({
      firstName: user.name?.first_name || "",
      lastName: user.name?.last_name || "",
      email: user.email || "",
    });
  }, []);

  const handleInputChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "put";
    let uri = "admins";

    const formData = new FormData();

    formData.append(
      "name",
      JSON.stringify({
        first_name: admin.firstName,
        last_name: admin.lastName,
      })
    );
    formData.append("email", admin.email);

    if (admin.password) {
      formData.append("password", admin.password);
    }

    uri = uri + `/${user._id}`;

    api(method, uri, formData).then((res) => {
      // eslint-disable-next-line eqeqeq
      let admin = res.data.admin;
      if (res.status == 200) {
        toast.success("Saved Successfully");

        updateStore({
          user: admin,
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...admin,
          })
        );
        handleModal();
      } else {
        toast.error("Save Error", res);
      }
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
                <h6 className="heading-small text-muted mb-4">{t("Admin Profile")}</h6>

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
                            {admin.firstName ? "" : "*"}{" "}
                          </span>
                          {""} {t("First Name")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="John"
                          type="text"
                          value={admin.firstName}
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
                            {admin.lastName ? "" : "*"}{" "}
                          </span>
                          {""} {t("Last Name")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          required={true}
                          placeholder="John"
                          type="text"
                          value={admin.lastName}
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
                            {admin.email ? "" : "*"} {""}
                          </span>
                          {t("Email Address")}
                        </label>
                        <Input
                          type="email"
                          name="email"
                          className="form-control-alternative"
                          id="input-email"
                          placeholder="johndoe@example.com"
                          value={admin.email}
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
                          {t("Password")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-password"
                          placeholder={t("Password")}
                          type="password"
                          value={admin.password}
                          name="password"
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
            {t("Save")}
          </Button>{" "}
          <Button onClick={handleModal}>{t("Cancel")}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdminProfile;
