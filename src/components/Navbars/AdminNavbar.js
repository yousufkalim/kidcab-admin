import { Link } from "react-router-dom";
import api from "api";
import { Store } from "StoreContext";
import { getToken, removeToken } from "../../variables/auth";
import { useState } from "react";
import AdminProfile from "../../views/AdminProfile/AdminProfile";
import CompanyProfile from "../../views/CompanyProfile/CompanyProfile";

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
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openCompanyModal, setOpenCompanyModal] = useState(false);

  const handleProfileModal = () => {
    setOpenProfileModal((open) => !open);
    return openProfileModal;
  };
  const handleCompanyModal = () => {
    setOpenCompanyModal((open) => !open);
    return openCompanyModal;
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

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
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
                <DropdownItem onClick={handleProfileModal}>
                  <i className="ni ni-single-02 text-success" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem onClick={handleCompanyModal}>
                  <i className="ni ni-single-02 text-success" />
                  <span>Company profile</span>
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>
                  <i className="ni ni-user-run text-danger" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {openProfileModal && (
            <AdminProfile
              openModal={openProfileModal}
              handleModal={handleProfileModal}
              user={user}
              isEditing={true}
            />
          )}
          {openCompanyModal && (
            <CompanyProfile
              openModal={openCompanyModal}
              handleModal={handleCompanyModal}
              isEditing={true}
            />
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
