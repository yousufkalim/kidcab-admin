import React, { useState } from 'react';
import { Badge, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle } from 'reactstrap';
import InvoiceForm from './InvoiceForm';

const InvoiceRow = ({ invoice, autoRefresh, handleSelect, selectedItems }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  const handleModal = () => {
    console.log("openModal",openModal)
    setOpenModal((open) => !open);
    return openModal;
  };

  return (
    <tr>
      <td scope="row">
        <div className="custom-control custom-checkbox mb-3">
          <input
            className="custom-control-input"
            id={`customCheck1${invoice._id}`}
            type="checkbox"
            value={invoice._id}
            checked={selectedItems.filter((a) => a._id === invoice._id).length > 0}
            onClick={() => handleSelect(invoice)}
          />
          <label className="custom-control-label" htmlFor={`customCheck1${invoice._id}`}></label>
        </div>
      </td>
      <td>{invoice.invoice_title}</td>
      <td>{new Date(invoice.issue_date).toLocaleDateString()}</td>
      <td>
        <Badge color="" className="badge-dot mr-4">
          {invoice.status === 'cancelled' ? (
            <i className="bg-danger" />
          ) : invoice.status === 'pending' ? (
            <i className="bg-info" />
          ) : invoice.status === 'late' ? (
            <i className="bg-warning" />
          ) : invoice.status === 'paid' ? (
            <i className="bg-success" />
          ) : null}
          {invoice.status}
        </Badge>
      </td>
      <td>
        <div className="d-flex align-items-center">{invoice?.trip_info?.total_trips}</div>
      </td>
      <td>
        <div className="d-flex align-items-center">{invoice?.total_price}€</div>
      </td>

      <td className="text-left">
        {invoice.client
          ? invoice?.client?.first_name[0]?.toUpperCase() +
            invoice?.client?.first_name?.substring(1) +
            ' ' +
            invoice?.client?.last_name[0]?.toUpperCase() +
            invoice?.client?.last_name?.substring(1)
          : '_'}
      </td>
      <td className="text-left">
        {invoice.driver
          ? invoice?.driver?.first_name[0]?.toUpperCase() +
            invoice?.driver?.first_name?.substring(1) +
            ' ' +
            invoice?.driver?.last_name[0].toUpperCase() +
            invoice?.driver?.last_name.substring(1)
          : '_'}
      </td>

      <td className="text-right">
        <UncontrolledDropdown>
          <DropdownToggle className="btn-icon-only text-dark" role="button" size="sm" color="" onClick={handleModal}>
            <i className="fas fa-edit" />
          </DropdownToggle>
        </UncontrolledDropdown>
      </td>
      <InvoiceForm
        openModal={openModal}
        handleModal={handleModal}
        editUser={invoice}
        isEditing={true}
        autoRefresh={autoRefresh}
      />
    </tr>
  );
};

export default InvoiceRow;
