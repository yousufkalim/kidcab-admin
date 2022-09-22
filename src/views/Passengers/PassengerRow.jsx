import React, { useState } from 'react';
import { Badge, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Media } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import PassengerForm from './PassengerForm';

const PassengerRow = ({ user, autoRefresh }) => {
  const { t, i18n } = useTranslation();
  const [openModal, setOpenModal] = useState();
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
                ' ' +
                user?.last_name[0].toUpperCase() +
                user?.last_name.substring(1)}
            </span>
          </Media>
        </Media>
      </th>
      <td>{t(user?.relationship)}</td>
      <td>
        {user?.client?.first_name[0].toUpperCase() +
          user?.client?.first_name.substring(1) +
          ' ' +
          user?.client?.last_name[0].toUpperCase() +
          user?.client?.last_name.substring(1)}
      </td>
      <td>{user?.client?.email}</td>
      <td className="text-right">
        <UncontrolledDropdown>
          <DropdownToggle className="btn-icon-only text-dark" role="button" size="sm" color="" onClick={handleModal}>
            <i className="fas fa-edit" />
          </DropdownToggle>
        </UncontrolledDropdown>
      </td>
      <PassengerForm openModal={openModal} handleModal={handleModal} editUser={user} isEditing={true} autoRefresh={autoRefresh} />
    </tr>
  );
};

export default PassengerRow;
