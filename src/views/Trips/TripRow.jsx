import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Badge,
} from "reactstrap";

import CompanyForm from "./TripForm";
import ManagerAvatar from "./ManagerAvatar";

const TripRow = ({ trip,autoRefresh }) => {
  console.log("trip", trip);
  const [openModal, setOpenModal] = useState();
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  return (
    <tr>
      <th scope="row">
        <Badge color="" className="badge-dot mr-4">
          {trip.status === "cancelled" ? (
            <i className="bg-warning" />
          ) : (
            <i className="bg-success" />
          )}
          {trip.status.toUpperCase()}
        </Badge>
      </th>
      <td className="text-center">
        {trip.client ? (
          <ManagerAvatar user={trip.client} />
        ) : (
          "No client is added"
        )}
      </td>
      <td className="text-center">
        {trip?.quote?.passengers
          ? trip?.quote?.passengers.map((passenger) => (
              <ManagerAvatar key={passenger.first_name} user={passenger} />
            ))
          : "No Passenger is added"}
      </td>
      <td className="text-center">
        {trip?.invited_drivers
          ? trip?.invited_drivers?.map(({ driver }) => {
              if (driver)
                return <ManagerAvatar key={driver.first_name} user={driver} />;
              else return null;
            })
          : "No Driver is Invited"}
      </td>
      <td className="text-center">{trip?.start_address?.street_address}</td>
      <td className="text-center">{trip?.end_address?.street_address}</td>
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
              Edit Trip
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
      <CompanyForm
        openModal={openModal}
        handleModal={handleModal}
        editUser={trip}
        isEditing={true}
        autoRefresh={autoRefresh}
      />
    </tr>
  );
};

export default TripRow;
