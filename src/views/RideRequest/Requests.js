/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'api';
import { Store, UpdateStore } from 'StoreContext';
import moment from 'moment';
import {
  Badge,
  Card,
  CardHeader,
  Button,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Table,
  Container,
  Row,
  Nav,
} from 'reactstrap';

// core components
import Header from 'components/Headers/Header.js';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    await api('get', 'requests').then((res) => {
      setRequests(res?.data?.request);
    });
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <h3 className="mb-0">Ride Requests</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name </th>
                    <th scope="col">Phone number </th>
                    <th scope="col">No of passengers </th>
                    <th cope="col">Journey Type</th>
                    <th scope="col">PickUp Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Status</th>
                    <th scope="col">PickUp Date</th>

                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {requests?.map((item) => {
                    return (
                      <tr>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">
                                {item?.first_name[0].toUpperCase() +
                                  item?.first_name.substring(1) +
                                  ' ' +
                                  item?.last_name[0].toUpperCase() +
                                  item?.last_name.substring(1)}
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td>{item.phone || '_'}</td>
                        <td>{item.passengers || '_'}</td>
                        <td>{item.journey_type || '_'}</td>
                        <td>{item.pickUp_address.label || '_'}</td>
                        <td>{item?.destination_address?.label || '_'}</td>
                        <td>
                          {item?.status === 'not answer'
                            ? 'Not Answer'
                            : item?.status === 'pending'
                            ? 'Pending'
                            : item?.status === 'accepted'
                            ? 'Accepted'
                            : 'Decline'}
                        </td>
                        <td>{new Date(item.pickUp_date).toDateString()}</td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};
export default Requests;
