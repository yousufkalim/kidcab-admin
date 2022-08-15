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
} from 'reactstrap';

// core components
import Header from 'components/Headers/Header.js';
import { toast } from 'react-toastify';

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
              <Table className="align-items-center table-flush">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name </th>
                    <th cope="col">Journey Type</th>
                    <th scope="col">PickUp Address</th>
                    <th scope="col">Destination Address</th>
                    <th scope="col">Status</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {requests?.map((item) => {
                    return (
                      <tr>
                        <td>{item?.first_name}</td>
                        <td>{item?.journey_type ? item.journey_type : '_'}</td>
                        <td>{item?.pickUp_address ? item.pickUp_address.label : '_'}</td>

                        <td>{item?.destination_address ? item.destination_address.label : '_'}</td>
                        <td>{item?.status}</td>
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
