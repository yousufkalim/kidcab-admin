import React from "react";
import { UncontrolledTooltip } from "reactstrap";

const ClientAvatar = ({ user }) => {
  return (
    <>
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id={user.first_name.toLowerCase()}
        onClick={(e) => e.preventDefault()}
      >
        {user.profile_pic ? (
          <img
            alt="..."
            style={{ height: "100%", width: "100%" }}
            className="rounded-circle"
            src={`${process.env.REACT_APP_BASE_URL}${user.profile_pic}`}
          />
        ) : (
          <i className="ni ni-circle-08" />
        )}
      </a>
      <UncontrolledTooltip delay={0} target={user.first_name.toLowerCase()}>
        {user.first_name + " " + user.last_name}
      </UncontrolledTooltip>
    </>
  );
};

export default ClientAvatar;
