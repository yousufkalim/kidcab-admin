import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
} from "reactstrap";

import CompanyForm from "./CompanyForm";
import ManagerAvatar from "./ManagerAvatar";

const DriverRow = ({ user: company, autoRefresh }) => {
  const [openModal, setOpenModal] = useState();
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  return (
    <tr>
      <th scope="row">
        <Media className="align-items-center">
          <a
            className="avatar rounded-circle mr-3"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            {company.logo ? (
              <img
                className="rounded-circle"
                style={{ width: "100%", height: "100%" }}
                alt={`${company.company_name} profile pic`}
                src={process.env.REACT_APP_BASE_URL + company?.logo}
              />
            ) : (
              <i className="ni ni-circle-08" />
            )}
          </a>
          <Media>
            <span className="mb-0 text-sm">{company.company_name}</span>
          </Media>
        </Media>
      </th>
      <td className="text-center">
        <ManagerAvatar manager={company?.manager} />
      </td>
      <td className="text-center">{company.city_of_rcs}</td>
      <td className="text-center">
        {company.vehicles ? company.vehicles.length : <p>0</p>}
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
              Edit Company
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
      <CompanyForm
        openModal={openModal}
        handleModal={handleModal}
        editUser={company}
        isEditing={true}
        autoRefresh={autoRefresh}
      />
    </tr>
  );
};

export default DriverRow;
