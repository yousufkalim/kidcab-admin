import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import api from '../../api/index';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState(0);
  const [passengers, setPassengers] = useState(0);
  const [drivers, setDrivers] = useState(0);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    autoRefresh();
  }, []);

  const autoRefresh = () => {
    api('get', `users/`).then((res) => {
      setUsers(res?.data?.users.length);
    });
    api('get', `trips/`).then((res) => {
      setTrips(res?.data?.trips.length);
    });
    api('get', `passengers/`).then((res) => {
      setPassengers(res?.data?.passengers.length);
    });
    api('get', `drivers/`).then((res) => {
      setDrivers(res?.data?.drivers.length);
    });
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col lg="8" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" width="5ch" className="text-uppercase text-muted mb-0">
                          {t('Total Users')}
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{users}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="8" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" width="5ch" className="text-uppercase text-muted mb-0">
                          {t('Total Number of Trips')}
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{trips}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="8" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" width="5ch" className="text-uppercase text-muted mb-0">
                          {t('Total Number of Drivers')}
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{drivers}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="8" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" width="5ch" className="text-uppercase text-muted mb-0">
                          {t('Total Passengers')}
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{passengers}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
