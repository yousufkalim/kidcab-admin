import React from "react";
import { UncontrolledTooltip } from "reactstrap";

const ClientAvatar = ({ user }) => {
  return (
    <>
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id="tooltip742438047"
        onClick={(e) => e.preventDefault()}
      >
        {user.profile_pic ? (
          <img
            alt="..."
            className="rounded-circle"
            src={`${process.env.REACT_APP_BASE_URL}${user.profile_pic}`}
          />
        ) : (
          <i className="ni ni-circle-08" />
        )}
      </a>
      <UncontrolledTooltip delay={0} target="tooltip742438047">
        {user.first_name + " " + user.last_name}
      </UncontrolledTooltip>
    </>
  );
};

export default ClientAvatar;
