import React, { useState } from "react";
import {
  Badge,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
} from "reactstrap";
import ClientAvatar from "./DriverAvatar";
import PassengerForm from "./VehicleForm";

const VehicleRow = ({ user: vehicle, autoRefresh }) => {
  const [openModal, setOpenModal] = useState();

  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  return (
    <tr>
      <th scope="row">
        <span className="mb-0 text-sm">{vehicle.vehicle_name}</span>
      </th>
      <td>{vehicle.model}</td>
      <td>
        <Badge color="" className="badge-dot mr-4">
          {/* <i className="bg-warning" /> */}
          {vehicle.color}
        </Badge>
      </td>
      <td className="text-left">
        {vehicle.driver ? (
          <div className="avatar-group">
            <ClientAvatar user={vehicle.driver} />
          </div>
        ) : (
          <p className="mb-0 text-sm" href="#pablo">
            No Driver is added.
          </p>
        )}
      </td>
      <td>
        <div className="d-flex align-items-center"></div>
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
      <PassengerForm
        openModal={openModal}
        handleModal={handleModal}
        editUser={vehicle}
        isEditing={true}
        autoRefresh={autoRefresh}
      />
    </tr>
  );
};

export default VehicleRow;
