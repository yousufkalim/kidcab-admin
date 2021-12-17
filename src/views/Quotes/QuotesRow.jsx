import React, { useState } from "react";
import { Badge, UncontrolledDropdown, DropdownToggle, Media } from "reactstrap";
import ClientAvatar from "./ClientAvatar";
import QuotesForm from "./QuotesForm";

const QuotesRow = ({ quote,autoRefresh }) => {
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
            <span className="mb-0 text-sm">{quote.quote_title}</span>
          </Media>
        </Media>
      </th>
      <td>
        <Badge color="" className="badge-dot mr-4">
          {quote.status === "accepted" ? (
            <i className="bg-success" />
          ) : (
            <i className="bg-warning" />
          )}
          {quote.status}
        </Badge>
      </td>

      <td>
        <div className="avatar-group">
          {quote.passengers ? (
            quote.passengers.map((passenger) => (
              <ClientAvatar key={passenger._id} user={passenger} />
            ))
          ) : (
            <p className="mb-0 text-sm" href="#pablo">
              No Client is added.
            </p>
          )}
        </div>
      </td>
      <td>
        {quote.client ? (
          <div className="avatar-group">
            <ClientAvatar user={quote.client} />
          </div>
        ) : (
          <p className="mb-0 text-sm" href="#pablo">
            No Client is added.
          </p>
        )}
      </td>
      <td>{quote?.trip_info && quote?.trip_info?.total_trips}</td>
      <td>
        <div className="d-flex align-items-center">
          {quote?.trip_info &&
            new Date(quote?.trip_info?.start_date).toLocaleDateString()}
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          {quote?.trip_info &&
            new Date(quote?.trip_info?.end_date).toLocaleDateString()}
        </div>
      </td>
      <td>
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
      <QuotesForm
        openModal={openModal}
        handleModal={handleModal}
        editQuote={quote}
        isEditing={true}
        autoRefresh={autoRefresh}
      />
    </tr>
  );
};

export default QuotesRow;
