import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Route, Switch, Redirect } from 'react-router-dom';
// reactstrap components
import { Container } from 'reactstrap';
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import AdminFooter from 'components/Footers/AdminFooter.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import { getToken, getUser, SetAuthToken } from '../variables/auth';
import api from 'api';
import routes from 'routes/routes';
import { UpdateStore, Store } from 'StoreContext';
import { baseUrl } from 'config';

const Admin = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const [token, setToken] = useState('');
  const [company, setCompany] = useState('');
  const updateStore = UpdateStore();
  const store = Store();

  useEffect(() => {
    getCompany();
    setToken(getToken());
    if (getToken() && getUser()) {
      SetAuthToken(token);
      updateStore({
        user: JSON.parse(getUser()),
      });
    } else {
      window.location.replace('/auth/login');
    }
  }, [token]);

  const getCompany = async () => {
    await api('get', '/company').then((res) => {
      // setCompany(res?.data?.company);
      updateStore({
        logo: res?.data?.company.logo,
      });
    });
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (props.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: '/admin/index',
          //imgSrc: require('../assets/img/brand/kidcab.png').default,
          imgSrc: baseUrl + store?.logo,
          imgAlt: '...',
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar {...props} brandText={getBrandText(props.location.pathname)} />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/index" />
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
