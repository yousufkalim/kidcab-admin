import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { baseUrl } from 'config';

const ManagerAvatar = ({ user }) => {
  return (
    <>
      <a className="avatar avatar-sm" href="#pablo" id={user?.first_name} onClick={(e) => e.preventDefault()}>
        {user?.profile_pic ? (
          <img
            alt="..."
            className="rounded-circle"
            style={{ width: '100%', height: '100%' }}
            src={`${baseUrl}${user?.profile_pic}`}
          />
        ) : (
          <i className="ni ni-circle-08" />
        )}
      </a>
      <UncontrolledTooltip delay={1} target={user?.first_name?.split(' ').join(',')}>
        {user?.first_name + ' ' + user?.last_name}
      </UncontrolledTooltip>
    </>
  );
};

export default ManagerAvatar;
