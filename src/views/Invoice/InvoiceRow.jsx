import React, { useState } from "react";
import {
  Badge,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
} from "reactstrap";
import ClientAvatar from "./ClientAvatar";
import InvoiceForm from "./InvoiceForm";
import Form from "bootstrap";

const InvoiceRow = ({ invoice, autoRefresh, handleSelect, selectedItems }) => {
  const [openModal, setOpenModal] = useState();
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

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
            id={`customCheck1${invoice._id}`}
            type="checkbox"
            value={invoice._id}
            checked={
              selectedItems.filter((a) => a._id === invoice._id).length > 0
            }
            onClick={handleSelect}
          />
          <label
            className="custom-control-label"
            htmlFor={`customCheck1${invoice._id}`}
          ></label>
        </div>
      </td>
      <td>{invoice.invoice_title}</td>
      <td>{new Date(invoice.issue_date).toLocaleDateString()}</td>
      <td>
        <Badge color="" className="badge-dot mr-4">
          {invoice.status === "canceled" ? (
            <i className="bg-warning" />
          ) : (
            <i className="bg-success" />
          )}
          {invoice.status}
        </Badge>
      </td>

      <td>
        <div className="d-flex align-items-center">{invoice.total_price}</div>
      </td>
      <td className="text-left">
        {invoice?.trip?.client?.first_name} -{" "}
        {invoice?.trip?.quote?.quote_title}
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
              Edit Profile
            </DropdownItem>
          </DropdownMenu>
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
