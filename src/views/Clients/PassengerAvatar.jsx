import React from "react";
import { UncontrolledTooltip } from "reactstrap";

const PassengerAvatar = ({ passenger }) => {
  return (
    <>
      <a
        className="avatar avatar-sm"
        href="#pablo"
        id="tooltip742438047"
        onClick={(e) => e.preventDefault()}
      >
        {passenger.photo ? (
          <img alt="..." className="rounded-circle" src={passenger.photo} />
        ) : (
          <i className="ni ni-circle-08" />
        )}
      </a>
      <UncontrolledTooltip delay={0} target="tooltip742438047">
        {passenger.first_name + " " + passenger.last_name}
      </UncontrolledTooltip>
    </>
  );
};

export default PassengerAvatar;
