import { useState } from "react";
import { setToken } from "../../variables/auth";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import api from "api";
import { Store, UpdateStore } from "StoreContext";
import { Redirect } from "react-router-dom";
const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const { authorization } = Store();

  const updateStore = UpdateStore();
  const handleSubmit = async () => {
    let result = await api("post", "admins/login", login);
    const token = result.data.token;
    const admin = result.data.admin;
    if (token && result.status === 200) {
      localStorage.setItem("user", JSON.stringify(admin));
      updateStore({
        token: token,
        authorization: true,
        user: admin,
      });
      setToken(token);
    }
  };
  if (authorization) return <Redirect push to="/admin" />;
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in </small>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>

                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={login.email}
                    onChange={(e) =>
                      setLogin({ ...login, email: e.target.value })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>

                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={login.password}
                    onChange={(e) =>
                      setLogin({ ...login, password: e.target.value })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
