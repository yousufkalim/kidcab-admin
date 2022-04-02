import React, { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import chart from "./chart";
import * as moment from "moment";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import api from "../api/index";
const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  const [reports, setReports] = useState([]);
  const [trips, setTrips] = useState([]);
  const [pendingTrips, setPendingTrips] = useState([]);

  const [pendingpayments, setPendingPayments] = useState([]);
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [dataSet, SetDataSet] = useState([]);

  useEffect(() => {
    autoRefresh();
    autoInvoice();
  }, []);
  useEffect(() => {
    chart(dataSet);
  }, [dataSet]);

  const autoInvoice = () => {
    api("get", `invoices/`).then((res) => {
      let pendingPayment = res?.data?.invoices.filter(
        (a) => a.status == "pending"
      );
      let overdueinvoices = res?.data?.invoices.filter(
        (a) => a.status == "late"
      );
      setOverdueInvoices(overdueinvoices);
      setPendingPayments(pendingPayment);
    });
  };

  const autoRefresh = () => {
    api("get", `/trips`).then((res) => {
      let trips = res?.data?.trips;
      let pendingTrips = res?.data?.trips.filter((i) => {
        return i.status === "pending";
      });
      setPendingTrips(pendingTrips);
      setTrips(trips);
    });
    api("post", `/trips/getDayReport`).then((res) => {
      let reports = res?.data?.reports;
      setReports(reports);
    });
    api("post", `/trips/getRevenue`).then((res) => {
      SetDataSet(res?.data?.reports);
    });
  };
  return (
    <>
      <Header />
      <Container className="mt--20" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card
              style={{ maxHeight: "300px", overflow: "scroll" }}
              className="shadow"
            >
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Weekly report</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Total Earning</th>
                    <th scope="col">Total Rides</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {reports ? (
                      reports?.map((report) => (
                        <tr>
                          <td>{report?._id}</td>
                          <td>{report?.driver_price}</td>
                          <td>{report?.turnover}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h1 mx-lg-auto text-center">
                        <td>No Report Found</td>
                      </tr>
                    )}
                  </>
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card
              style={{ maxHeight: "300px", overflow: "scroll" }}
              className="shadow"
            >
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Pending Trips</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Client</th>
                    <th scope="col">Passengers</th>
                    <th scope="col">Invited Drivers</th>
                    <th scope="col">DATE</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <>
                    {pendingTrips ? (
                      pendingTrips?.map((trip) => (
                        <tr>
                          <td>{trip?.client?.first_name}</td>
                          <td>{trip?.passengers?.length}</td>
                          <td>{trip?.invited_drivers?.length}</td>
                          <td>{moment(trip.date).format("DD/MM/YYYY")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h1 mx-lg-auto text-center">
                        <td>NoT Found</td>
                      </tr>
                    )}
                  </>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card
              style={{ maxHeight: "300px", overflow: "scroll" }}
              className="shadow"
            >
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Over Due Invoices</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr style={{ height: "7vh" }}>
                    <th scope="col">Invoice TiTle</th>
                    <th scope="col">DATE </th>
                    <th scope="col">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {overdueInvoices ? (
                      overdueInvoices?.map((invoice) => (
                        <tr>
                          <td>{invoice?.invoice_title}</td>
                          <td>
                            {moment(invoice.issue_date).format("DD/MM/YYYY")}
                          </td>
                          <td>{invoice?.total_price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h1 mx-lg-auto text-center">
                        <td>No Invoice Found</td>
                      </tr>
                    )}
                  </>
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card
              style={{ maxHeight: "300px", overflow: "scroll" }}
              className="shadow"
            >
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Pending Payments</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr style={{ height: "7vh" }}>
                    <th scope="col">INVOICE TITLE</th>
                    <th scope="col">DATE </th>
                    <th scope="col">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {pendingpayments ? (
                      pendingpayments?.map((invoice) => (
                        <tr>
                          <td>{invoice?.invoice_title}</td>
                          <td>
                            {moment(invoice.issue_date).format("DD/MM/YYYY")}
                          </td>
                          <td>{invoice?.total_price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h1 mx-lg-auto text-center">
                        <td>No Invoice Found</td>
                      </tr>
                    )}
                  </>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Weekly Revenue</h3>
                  </div>
                </Row>
              </CardHeader>

              <div className="dashboard-item chart">
                <canvas id="lineChart"></canvas>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
