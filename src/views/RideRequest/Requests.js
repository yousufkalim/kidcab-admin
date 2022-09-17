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
import { useTranslation } from 'react-i18next';
import ViewRequest from './ViewRequest';
const Requests = () => {
  const { t, i18n } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    await api('get', 'requests').then((res) => {
      setRequests(res?.data?.request);
    });
  };

  const handleEditModal = (item) => {
    console.log('Hi');
    if (item) {
      setRequest({
        _id: item._id,
        first_name: item.first_name,
        last_name: item.last_name,
        phone: item.phone,
        email: item.email,
        passengers: item.passengers,
        status: item.passengers,
        journey_type: item.journey_type,
        pickUp_date: new Date(item.pickUp_date).toDateString(),
        distance: item.pickUp_date,
        total_children: item.total_children,
        total_adults: item.total_adults,
        baby: item.baby,
        company_name: item.company_name,
      });
    }

    setEditModal((open) => !open);
    return openModal;
  };

  return (
    <>
      {console.log(editModal, 'editModal')}
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <h3 className="mb-0">{t('Ride Requests')}</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">{t('Name')} </th>
                    <th scope="col">{t('Phone number')} </th>
                    <th scope="col">{t('No of passengers')} </th>
                    <th cope="col">{t('Journey Type')}</th>
                    <th scope="col">{t('PickUp Address')}</th>
                    <th scope="col">{t('Destination Address')}</th>
                    <th scope="col">{t('Status')}</th>
                    <th scope="col">{t('PickUp Date')}</th>
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
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem href="#pablo" onClick={() => handleEditModal(item)}>
                                {t('View Request')}
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        {editModal && <ViewRequest openModal={editModal} handleModal={handleEditModal} request={request} />}
      </Container>
    </>
  );
};
export default Requests;
