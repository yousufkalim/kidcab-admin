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
          <Media>
            <span className="mb-0 text-sm">
              {user?.first_name[0].toUpperCase() +
                user?.first_name.substring(1) +
                " " +
                user?.last_name[0].toUpperCase() +
                user?.last_name.substring(1)}
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
            className="btn-icon-only text-dark"
            role="button"
            size="sm"
            color=""
            onClick={handleModal}
          >
            <i className="fas fa-edit" />
          </DropdownToggle>
        </UncontrolledDropdown>
      </td>

      {openModal && (
        <DriverForm
          openModal={openModal}
          handleModal={handleModal}
          editUser={user}
          isEditing={true}
          isClose={false}
          autoRefresh={autoRefresh}
        />
      )}
    </tr>
  );
};

export default DriverRow;
