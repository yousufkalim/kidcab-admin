import React, { useState } from "react";
import {
  Badge,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
} from "reactstrap";

import PassengerForm from "./PassengerForm";

const PassengerRow = ({ user, autoRefresh }) => {
  const [openModal, setOpenModal] = useState();
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  console.log("user", user);
  return (
    <tr>
      <th scope="row">
        <Media className="align-items-center">
          <Media>
            <span className="mb-0 text-sm">
              {user?.first_name + " " + user?.last_name}
            </span>
          </Media>
        </Media>
      </th>
      <td>{user?.relationship}</td>
      <td>{user?.client?.first_name + " " + user?.client?.last_name}</td>
      <td>{user?.client?.email}</td>
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
      <PassengerForm
        openModal={openModal}
        handleModal={handleModal}
        editUser={user}
        isEditing={true}
        autoRefresh={autoRefresh}
      />
    </tr>
  );
};

export default PassengerRow;
