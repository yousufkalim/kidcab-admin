import { Link } from "react-router-dom";
import api from "api";
import { Store } from "StoreContext";
import { getToken, removeToken } from "../../variables/auth";
import { useState } from "react";
import AdminProfile from "../../views/AdminProfile/AdminProfile";

import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

const AdminNavbar = (props) => {
  const { user } = Store();
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const handleLogout = async () => {
    const res = await api("post", "admins/logout", {
      token: getToken(),
      user: user,
    });
    if (res.status === 200) {
      removeToken();
      localStorage.removeItem("user");
      window.location = "/login";
    }
  };
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form> */}
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  {/* <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={
                        require("../../assets/img/theme/team-4-800x800.jpg")
                          .default
                      }
                    />
                  </span> */}
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user.name
                        ? `${user.name.first_name} ${user.name.last_name}`
                        : "Admin"}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem onClick={handleModal}>
                  <i className="ni ni-single-02 text-success" />
                  <span>My profile</span>
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>
                  <i className="ni ni-user-run text-danger" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {openModal && (
            <AdminProfile
              openModal={openModal}
              handleModal={handleModal}
              user={user}
              isEditing={true}
            />
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
