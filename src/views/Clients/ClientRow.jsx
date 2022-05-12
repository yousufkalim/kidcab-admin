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
import PassengerForm from "./AddPassenger";

const ClientRow = ({ user, passenger, autoRefresh }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };

  let [clientId, setClientId] = useState("");
  const [openPassengerModal, setOpenPassengerModal] = useState(false);

  const handlePassengerModal = (id) => {
    setClientId(id || clientId);
    setOpenPassengerModal((open) => !open);
    return openPassengerModal;
  };

  return (
    <>
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
        <td>{user?.email}</td>
        <td>
          <Badge color="" className="badge-dot mr-4">
            {/* <i className="bg-warning" /> */}
            {user?.phone_number}
          </Badge>
        </td>
        <td>{user?.passengers?.length}</td>

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
          <ClientForm
            openModal={openModal}
            handleModal={handleModal}
            editUser={user}
            isEditing={true}
            autoRefresh={autoRefresh}
          />
        )}
        {openPassengerModal && (
          <PassengerForm
            openModal={openPassengerModal}
            handleModal={handlePassengerModal}
            clientId={clientId}
            autoRefresh={autoRefresh}
          />
        )}
      </tr>
    </>
  );
};

export default ClientRow;
