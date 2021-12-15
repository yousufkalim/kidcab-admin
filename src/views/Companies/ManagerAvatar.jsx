import React from "react";
import { UncontrolledTooltip } from "reactstrap";

const ManagerAvatar = ({ manager }) => {
  return (
    <>
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id={manager.first_name}
        onClick={(e) => e.preventDefault()}
      >
        {manager.profile_pic ? (
          <img
            alt="..."
            className="rounded-circle"
            style={{ width: "100%", height: "100%" }}
            src={`${process.env.REACT_APP_BASE_URL}${manager.profile_pic}`}
          />
        ) : (
          <i className="ni ni-circle-08" />
        )}
      </a>
      <UncontrolledTooltip delay={0} target={manager.first_name}>
        {manager.first_name + " " + manager.last_name}
      </UncontrolledTooltip>
    </>
  );
};

export default ManagerAvatar;
