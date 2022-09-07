import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "api";
import { Store } from "StoreContext";
import { getToken, removeToken } from "../../variables/auth";
import AdminProfile from "../../views/AdminProfile/AdminProfile";
import CompanyProfile from "../../views/CompanyProfile/CompanyProfile";
import { useTranslation } from "react-i18next";

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
import { socket } from "../../App";

const AdminNavbar = (props) => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const { user } = Store();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);

  useEffect(() => {
    socket.on(`admin`, (data) => {
      getNotifications();
    });
  }, []);

  useEffect(() => {
    getNotifications();
  }, [user]);

  const getNotifications = async () => {
    const res = await api("get", `notifications/getAllAdmin`);
    setNewNotifications(res.data.notifications);
  };

  const markAsRead = async () => {
    const res = await api("put", `notifications/seen/${user._id}`);
    setNewNotifications([]);
  };

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
            {t(props.brandText)}
          </Link>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <Link
                className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
                onClick={() => {
                  if (language === "fr") {
                    i18n.changeLanguage("en");
                  } else {
                    i18n.changeLanguage("fr");
                  }
                }}
              >
                {t("fr")}
              </Link>
            </div>
            <Nav
              className="align-items-center d-none d-md-flex"
              style={{ marginRight: "20px" }}
              navbar
            >
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        <div
                          style={{ position: "relative", marginTop: "-5px" }}
                        >
                          {newNotifications.length > 0 && (
                            <div
                              style={{
                                zIndex: "2",
                                width: "8px",
                                height: "8px",
                                position: "absolute",
                                borderRadius: "50px",
                                backgroundColor: "red",
                                left: "8px",
                                top: "-2px",
                                marginRight: "8px",
                              }}
                            ></div>
                          )}
                          <i
                            style={{
                              position: "absolute",
                            }}
                            class="fas fa-bell fa-lg"
                          ></i>
                        </div>
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem
                    onClick={markAsRead}
                    style={{
                      textAlign: "center",
                      borderBottom: "1px solid rgb(228 228 228)",
                      color: "#46b9b5",
                    }}
                  >
                    {t("Mark as read")}
                  </DropdownItem>
                  {newNotifications.length > 0 ? (
                    newNotifications.map((n, index) => {
                      if (index < 10) {
                        return <DropdownItem>{n.title}</DropdownItem>;
                      }
                    })
                  ) : (
                    <DropdownItem disabled={true}>
                      {t("No new notifications")}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
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
                    <span>{t("My profile")}</span>
                  </DropdownItem>
                  <DropdownItem onClick={handleCompanyModal}>
                    <i className="ni ni-single-02 text-success" />
                    <span>{t("Company profile")}</span>
                  </DropdownItem>

                  <DropdownItem divider />
                  <DropdownItem onClick={handleLogout}>
                    <i className="ni ni-user-run text-danger" />
                    <span>{t("Logout")}</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </div>
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
