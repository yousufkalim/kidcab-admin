import React, { useState } from 'react';
import { DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Badge } from 'reactstrap';

import TripForm from './TripForm';
import ManagerAvatar from './ManagerAvatar';

const TripRow = ({ trip, autoRefresh, selectedItems, handleSelect }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };

  return (
    <tr>
      <td scope="row">
        <div className="custom-control custom-checkbox mb-3">
          <input
            className="custom-control-input"
            id={`customCheck1${trip._id}`}
            type="checkbox"
            value={trip._id}
            checked={selectedItems.filter((a) => a._id === trip._id).length > 0}
            onClick={() => handleSelect(trip)}
          />
          <label className="custom-control-label" htmlFor={`customCheck1${trip._id}`}></label>
        </div>
      </td>
      <th scope="row">
        <Badge color="" className="badge-dot mr-4">
          {trip.status === 'cancelled' ? <i className="bg-warning" /> : <i className="bg-success" />}
          {trip.status.toUpperCase()}
        </Badge>
      </th>
      <td className="text-center">
        {trip.client
          ? trip?.client?.first_name[0].toUpperCase() +
            trip?.client?.first_name.substring(1) +
            ' ' +
            trip.client.last_name[0].toUpperCase() +
            trip?.client?.last_name.substring(1)
          : 'No client is added'}
      </td>
      <td className="text-center">{trip?.passengers ? trip.passengers.length : 'No Passenger is added'}</td>
      {trip.status === 'pending' || trip.status === 'rejected' ? (
        <>
          {trip?.invited_drivers?.length > 0 ? (
            <td className="text-center">
              {trip?.invited_drivers.map((i) => {
                return (
                  i?.driver?.first_name[0].toUpperCase() +
                  i?.driver?.first_name.substring(1) +
                  ' ' +
                  i?.driver?.last_name[0].toUpperCase() +
                  i?.driver?.last_name.substring(1)
                );
              })}
            </td>
          ) : (
            <td className="text-center">No Driver Assigned</td>
          )}
        </>
      ) : (
        <>
          {trip.assigned_drivers.length > 0 ? (
            <td className="text-center">
              {trip.assigned_drivers.map((i) => {
                return (
                  i?.first_name[0].toUpperCase() +
                  i?.first_name.substring(1) +
                  ' ' +
                  i?.last_name[0].toUpperCase() +
                  i?.last_name.substring(1)
                );
              })}
            </td>
          ) : (
            <td className="text-center">No Driver Assigned</td>
          )}
        </>
      )}

      <td className="text-center">{trip?.date ? trip?.date.split('T')[0] : 'Date not Found'}</td>
      <td className="text-center">{trip?.start_address?.city}</td>
      <td className="text-center">{trip?.end_address?.city}</td>
      <td className="text-right">
        <UncontrolledDropdown>
          <DropdownToggle className="btn-icon-only text-dark" role="button" size="sm" color="" onClick={handleModal}>
            <i className="fas fa-edit" />
          </DropdownToggle>
        </UncontrolledDropdown>
      </td>
      {openModal && (
        <TripForm openModal={openModal} handleModal={handleModal} editUser={trip} isEditing={true} autoRefresh={autoRefresh} />
      )}
    </tr>
  );
};

export default TripRow;
