import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../variables/auth';
import api from 'api';
import { Store, UpdateStore } from 'StoreContext';
import { baseUrl } from 'config';
import { useTranslation } from 'react-i18next';

// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap';

const AdminNavbar = () => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(() => getToken());
  const updateStore = UpdateStore();
  const store = Store();
  useEffect(() => {
    api('get', '/company').then((res) => {
      updateStore({
        logo: res?.data?.company?.logo,
      });
    });
  }, []);

  return (
    <>
      <Navbar className='navbar-top navbar-horizontal navbar-dark' expand='md'>
        <Container className='px-4'>
          <NavbarBrand to='/' tag={Link}>
            <img alt='...' src={`${baseUrl}${store.logo}`} />
          </NavbarBrand>
          <button className='navbar-toggler' id='navbar-collapse-main'>
            <span className='navbar-toggler-icon' />
          </button>
          <UncontrolledCollapse navbar toggler='#navbar-collapse-main'>
            <div className='navbar-collapse-header d-md-none'>
              <Row>
                <Col className='collapse-brand' xs='6'>
                  <Link to='/'>
                    <img alt='...' src={`${baseUrl}${store.logo}`} />
                  </Link>
                </Col>
                <Col className='collapse-close' xs='6'>
                  <button className='navbar-toggler' id='navbar-collapse-main'>
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className='ml-auto' navbar>
              <NavItem>
                <NavLink className='nav-link-icon' to='/auth/login' tag={Link}>
                  <span
                    className='text-uppercase'
                    onClick={() => {
                      if (language === 'fr') {
                        i18n.changeLanguage('en');
                      } else {
                        i18n.changeLanguage('fr');
                      }
                    }}
                  >
                    {t('fr')}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className='nav-link-icon' to='/auth/login' tag={Link}>
                  <i className='ni ni-key-25' />
                  <span className='nav-link-inner--text'>{t('Login')}</span>
                </NavLink>
              </NavItem>
              {token && (
                <NavItem>
                  <NavLink className='nav-link-icon' to='/' tag={Link}>
                    <i className='ni ni-planet' />
                    <span className='nav-link-inner--text'>{t('Dashboard')}</span>
                  </NavLink>
                </NavItem>
              )}
              {token && (
                <NavItem>
                  <NavLink className='nav-link-icon' to='/admin/user-profile' tag={Link}>
                    <i className='ni ni-single-02' />
                    <span className='nav-link-inner--text'>{t('Profile')}</span>
                  </NavLink>
                </NavItem>
              )}
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
