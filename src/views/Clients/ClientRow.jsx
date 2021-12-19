import React, { useState } from "react";

import {
  Badge,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Progress,
} from "reactstrap";
import ClientForm from "./ClientForm";
import PassengerForm from "../Passengers/PassengerForm";

const ClientRow = ({ user, passenger, autoRefresh }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const [openPassengerModal, setOpenPassengerModal] = useState();
  const handlePassengerModal = () => {
    setOpenPassengerModal((open) => !open);
    return openPassengerModal;
  };

  return (
    <tr>
      <th scope="row">
        <Media className="align-items-center">
          <Media>
            <span className="mb-0 text-sm">
              {user.first_name + " " + user.last_name}
            </span>
          </Media>
        </Media>
      </th>
      <td>{user.email}</td>
      <td>
        <Badge color="" className="badge-dot mr-4">
          {/* <i className="bg-warning" /> */}
          {user.phone_number}
        </Badge>
      </td>
      <td></td>

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
              Edit Profile
            </DropdownItem>
            <DropdownItem href="#pablo" onClick={handlePassengerModal}>
              Add Passenger
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
      {openModal && (
        <ClientForm
          openModal={openModal}
          handleModal={handleModal}
          editUser={user}
          isEditing={true}
          autoRefresh={autoRefresh}
        />
      )}
      <PassengerForm
        openModal={openPassengerModal}
        handleModal={handlePassengerModal}
        editUser={user}
        isEditing={true}
      />
    </tr>
  );
};

export default ClientRow;
