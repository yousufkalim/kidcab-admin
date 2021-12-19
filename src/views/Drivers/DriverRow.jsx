import React, { useState } from "react";
import {
  Badge,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
} from "reactstrap";

import DriverForm from "./DriverForm";

const DriverRow = ({ user, autoRefresh }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  return (
    <tr>
      <th scope="row">
        <Media className="align-items-center">
          <a
            className="avatar rounded-circle mr-3"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            {user.profile_pic ? (
              <img
                className="rounded-circle"
                style={{ width: "100%", height: "100%" }}
                alt={`${user.first_name} profile pic`}
                src={process.env.REACT_APP_BASE_URL + user?.profile_pic}
              />
            ) : (
              <i className="ni ni-circle-08" />
            )}
          </a>
          <Media>
            <span className="mb-0 text-sm">
              {user.first_name + " " + user.last_name}
            </span>
          </Media>
        </Media>
      </th>
      <td>{user.role}</td>
      <td>{user.email}</td>
      <td>
        <Badge color="" className="badge-dot mr-4">
          {user.phone_number}
        </Badge>
      </td>
      <td className="text-center">
        {user.vehicles ? user.vehicles.length : <p>No Vehicle is added.</p>}
      </td>

      <td className="text-right">
        <UncontrolledDropdown>
          <DropdownToggle
            className="btn-icon-only text-light"
            href="#pablo"
            role="button"
            size="sm"
            color=""
            onClick={(e) => e.preventDefault()}
          >
            <i className="fas fa-ellipsis-v" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-arrow" right>
            <DropdownItem href="#pablo" onClick={handleModal}>
              Edit Driver
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>

      {openModal && (
        <DriverForm
          openModal={openModal}
          handleModal={handleModal}
          editUser={user}
          isEditing={true}
          autoRefresh={autoRefresh}
        />
      )}
    </tr>
  );
};

export default DriverRow;
