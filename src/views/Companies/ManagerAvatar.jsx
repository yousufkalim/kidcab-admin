import React from "react";
import { UncontrolledTooltip } from "reactstrap";

const ManagerAvatar = ({ manager }) => {
  return (
    <>
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id="tooltip742438047"
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
      <UncontrolledTooltip delay={0} target="tooltip742438047">
        {manager.first_name + " " + manager.last_name}
      </UncontrolledTooltip>
    </>
  );
};

export default ManagerAvatar;
