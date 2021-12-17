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

const InvoiceRow = ({ invoice,autoRefresh }) => {
  const [openModal, setOpenModal] = useState();
  console.log("client", invoice);
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  return (
    <tr>
      <th scope="row">{invoice.invoice_title}</th>
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
        {invoice?.trip?.client ? (
          <div className="avatar-group">
            <ClientAvatar user={invoice.trip.client} />
          </div>
        ) : (
          <p className="mb-0 text-sm" href="#pablo">
            No Client is added.
          </p>
        )}
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
