import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import api from "../../api/index";
const Header = () => {
  const [invoices, setInvoices] = useState([]);
  const [trips, setTrips] = useState([]);
  const [lateinvoices, setLateInvoices] = useState(0);
  const [pendingpayment, setPendingPayment] = useState(0);
  const [pendingtrips, setPendingTrips] = useState(0);

  useEffect(() => {
    autoRefresh();
    autoInvoice();
  }, []);

  const autoRefresh = () => {
    api("get", `trips/`).then((res) => {
      let Trips = res?.data?.trips;
      setTrips(Trips.length);
      let pendingTrips = Trips.filter((i) => i.status === "pending");
      setPendingTrips(pendingTrips.length);
    });
  };
  const autoInvoice = () => {
    api("get", `invoices/`).then((res) => {
      const data = res?.data?.invoices;
      setInvoices(data);
      let lateInvoices = data.filter((i) => i.status === "late");
      setLateInvoices(lateInvoices.length);
      let pendingPayment = data.filter((a) => a.status == "pending");
      setPendingPayment(pendingPayment.length);
    });
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Pending trips
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {pendingtrips}
                        </span>
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
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          over_due invoices
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {lateinvoices}
                        </span>
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
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Pending Payments
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {pendingpayment}
                        </span>
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
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Trips
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {trips}
                        </span>
                      </div>
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
