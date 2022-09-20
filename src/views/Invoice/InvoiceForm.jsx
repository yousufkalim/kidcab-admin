import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import Select from 'react-select';
import AddressInput from 'components/Form/AddressInput';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, FormGroup, Form, Input, Row, Col, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import fr from 'date-fns/locale/fr-CA';
import 'react-day-picker/lib/style.css';

// core components

const InvoiceForm = ({ openModal, handleModal, editUser, isEditing, autoRefresh }) => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const [user, setUser] = useState({
    invoice_title: '',
    issue_date: '',
    totalPrice: '',
    type: 'client',
    driver: '',
    status: 'pending',
    comments: '',
    client: '',
    startDate: '',
    endDate: '',
    totalTrips: '',
    unitPrice: '',
    vat: '',
  });

  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  let [startAddress, setStartAddress] = useState({
    lat: '',
    lng: '',
    label: '',
    label2: '',
    city: '',
    postal_code: '',
  });
  let [endAddress, setEndAddress] = useState({
    lat: '',
    lng: '',
    label: '',
    label2: '',
    city: '',
    postal_code: '',
  });
  useEffect(() => {
    api('get', 'users').then((res) => {
      setUsers(res.data.users);
    });
    api('get', 'drivers').then((res) => {
      setDrivers(res.data.drivers);
    });

    if (isEditing) {
      setUser({
        invoice_title: editUser?.invoice_title,
        issue_date: new Date(editUser?.issue_date),
        totalTrips: editUser?.trip_info.total_trips,
        totalPrice: editUser?.total_price,
        unitPrice: editUser.trip_info.unit_price,
        vat: editUser?.vat,
        driver: editUser?.driver,
        type: editUser?.type,
        status: editUser?.status,
        client: editUser?.client,
        comments: editUser?.comments,
        startDate: editUser?.trip_info?.start_date,
        endDate: editUser?.trip_info?.end_date,
      });
      setStartAddress(editUser?.trip_info?.start_address);
      setEndAddress(editUser?.trip_info?.end_address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange2 = (e) => {
    setUser((user) => ({
      ...user,
      issue_date: e,
    }));
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'totalTrips') {
      if (parseInt(e.target.value) < 1) {
        return toast.error('Trips should be greater than 1');
      }
      if (isEditing) {
        let UnitPrice = (parseInt(user?.totalPrice) - parseInt(user?.vat)) / parseInt(e.target.value);
        setUser((user) => ({
          ...user,
          [e.target.name]: e.target.value,
          unitPrice: UnitPrice,
        }));
        return;
      }
    }
    if (e.target.name == 'totalPrice') {
      let Vat = parseInt(e.target.value) * 0.2;
      let UnitPrice = (parseInt(e.target.value) - parseInt(Vat)) / parseInt(user?.totalTrips);
      setUser((user) => ({
        ...user,
        [e.target.name]: e.target.value,
        vat: Vat,
        unitPrice: UnitPrice,
      }));
      return;
    }
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setUser({ ...user, client: e.value, driver: '' });
  };
  const handleDriverChange = (e) => {
    setUser({ ...user, driver: e.value, client: '' });
  };

  const handleDelete = () => {
    let method = 'delete';
    let uri = 'invoices';
    if (editUser) {
      method = 'delete';
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        toast.success(`${t('Delete Successfully')}`);
        handleModal();
        autoRefresh();
      } else {
        toast.error(`${t('Delete Error')}`, `${t(res.data.message)}`);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let method = 'post';
    let uri = 'invoices';
    if (parseInt(user?.totalTrips) < 1 || user?.totalTrips == '') {
      return toast.error('Trips should be greater than 1');
    }
    if (parseInt(user?.totalTrips) > parseInt(user?.totalPrice)) {
      return toast.error('Total Price should be greater  than total trips');
    }
    if (new Date(user?.endDate) < new Date(user?.startDate)) {
      return toast.error('end date must be greater than start date');
    }
    if (user?.endDate == null || user?.endDate == ' ' || user?.startDate == null || user?.startDate == ' ') {
      return toast.error('Dates are mandatory');
    }
    const tripInfo = {
      total_trips: user?.totalTrips,
      start_date: user.startDate,
      end_date: user.endDate,
      start_address: startAddress,
      end_address: endAddress,
      unit_price: user?.unitPrice,
    };
    const formData = {};
    if (user?.type === 'client') {
      formData['client'] = user?.client;
    }
    if (user?.type === 'driver') {
      formData['driver'] = user?.driver;
    }
    formData['invoice_title'] = user?.invoice_title;
    formData['total_price'] = user?.totalPrice;
    formData['issue_date'] = user?.issue_date;
    formData['status'] = user?.status;
    formData['type'] = user?.type;
    formData['comments'] = user?.comments;
    formData['vat'] = user?.vat;
    formData['trip_info'] = JSON.stringify(tripInfo);

    if (startAddress.lat == endAddress.lat && startAddress.lng == endAddress.lng) {
      return toast.error('Start and end address cant be same');
    }

    if (startAddress.lat == '' || endAddress.lng == '') {
      return toast.error('Adresses are mandatory');
    }

    if (editUser) {
      method = 'put';
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, formData).then(async (res) => {
      if (res.status === 200) {
        toast.success(`${t('Saved Successfully')}`);
        handleModal();
        autoRefresh();
      } else {
        toast.error(`${t('Save Error')}`);
      }
    });
  };

  const handleDuplicate = (e) => {
    e.preventDefault();
    let method = 'post';
    let uri = 'invoices';
    if (user?.client?._id) {
      user['client'] = user.client._id;
    }
    user['issue_date'] = moment(user.issue_date).format('YYYY-MM-DD');
    const formData = {};
    const tripInfo = {
      total_trips: user?.totalTrips,
      start_date: user?.startDate,
      end_date: user?.endDate,
      start_address: startAddress,
      end_address: endAddress,
      unit_price: user?.unitPrice,
    };
    formData['invoice_title'] = user?.invoice_title;
    formData['total_price'] = user?.totalPrice;
    formData['issue_date'] = user?.issue_date;
    formData['status'] = user?.status;
    formData['type'] = user?.type;
    formData['comments'] = user?.comments;
    formData['vat'] = user?.vat;
    formData['trip_info'] = JSON.stringify(tripInfo);
    if (user?.type === 'client') {
      formData['client'] = user?.client;
    }
    if (user?.type === 'driver') {
      formData['driver'] = user?.driver;
    }
    api(method, uri, formData).then((res) => {
      if (res.status === 200) {
        toast.success(`${t('Saved Successfully')}`);
        handleModal();
        autoRefresh();
      } else {
        toast.error(`${t('Save Error')}`);
      }
    });
  };

  return (
    <>
      {console.log(startAddress, endAddress)}
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? 'Edit' : 'Add'} {t('Invoice')}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">{t('Invoice information')}</h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-fname">
                          <span style={{ color: 'red' }}>{user?.invoice_title ? '' : '*'}</span> {t('Invoice Title')}
                        </label>
                        <Input
                          className="form-control"
                          id="input-fname"
                          required={true}
                          placeholder={t('Enter Invoice Title')}
                          type="text"
                          value={user.invoice_title}
                          name="invoice_title"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-lname">
                          <span style={{ color: 'red' }}>{user?.issue_date ? '' : '*'}</span> {t('Issue Date')}
                        </label>
                        {/* <Input
                          className="form-control"
                          id="input-lname"
                          type="date"
                          value={user?.issue_date?.split('T')[0]}
                          name="issue_date"
                          onChange={handleInputChange}
                        /> */}
                        <DatePicker
                          // selected={trip.date ? trip.date : editTrip.date?.split('T')[0]}
                          // selected={trip.date}
                          selected={user?.issue_date}
                          locale={language === 'fr' && fr}
                          // value={trip.date ? trip.date : editTrip.date?.split('T')[0]}

                          onChange={handleDateChange2}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-tripType">
                          {t('Invoice Type')}
                        </label>
                        <Input
                          id="input-trip_type"
                          name="type"
                          className="form-control-alternative"
                          type="select"
                          disabled={isEditing}
                          value={user.type}
                          onChange={handleInputChange}
                        >
                          <option value="client">Client</option>
                          <option value="driver">Driver</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    {user?.type == 'client' ? (
                      <Col lg="4">
                        <FormGroup>
                          <Label for="exampleSelect" className="form-control-label">
                            {t('Select Client')}
                          </Label>
                          {users && (
                            <Select
                              placeholder={t('Select...')}
                              onChange={handleUserChange}
                              name="user"
                              hideSelectedOptions
                              defaultValue={
                                editUser && {
                                  value: user?.client?._id,
                                  label: `${
                                    editUser?.client?.first_name[0].toUpperCase() + editUser?.client?.first_name.substring(1)
                                  } ${editUser?.client?.last_name[0].toUpperCase() + editUser?.client?.last_name.substring(1)}`,
                                }
                              }
                              className="form-control-alternative"
                              options={users.map((user) => ({
                                value: user?._id,
                                label: `${user?.first_name[0].toUpperCase() + user?.first_name.substring(1)} ${
                                  user?.last_name[0].toUpperCase() + user?.last_name.substring(1)
                                }`,
                              }))}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    ) : (
                      <Col lg="4">
                        <FormGroup>
                          <Label for="exampleSelect" className="form-control-label">
                            {t('Select Driver')}
                          </Label>
                          {drivers && (
                            <Select
                              onChange={handleDriverChange}
                              name="driver"
                              key={user?.type}
                              hideSelectedOptions
                              defaultValue={
                                editUser && {
                                  value: drivers?._id,
                                  label: `${user?.driver?.first_name[0].toUpperCase() + user?.driver?.first_name.substring(1)} ${
                                    user?.driver?.last_name[0].toUpperCase() + user?.driver?.last_name.substring(1)
                                  }`,
                                }
                              }
                              className="form-control-alternative"
                              options={drivers.map((driver) => ({
                                value: driver?._id,
                                label: `${driver?.first_name[0].toUpperCase() + driver?.first_name.substring(1)} ${
                                  driver?.last_name[0].toUpperCase() + driver?.last_name.substring(1)
                                }`,
                              }))}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    )}
                    <Col lg="4">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          <span style={{ color: 'red' }}>{user.status ? '' : '*'}</span> {t('Status')}
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="status"
                          value={user.status}
                          onChange={handleInputChange}
                          className="form-control"
                          type="select"
                        >
                          <option value="pending">{t('Pending')}</option>
                          <option value="paid">{t('Paid')}</option>
                          <option value="late">{t('Late')}</option>
                          <option value="cancelled">{t('Cancelled')}</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">{t('Trip information')}</h6>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-fname">
                          <span style={{ color: 'red' }}>{user.totalTrips ? '' : '*'}</span> {t('No. of Trips')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder={t('Total Trips')}
                          type="number"
                          value={user.totalTrips}
                          name="totalTrips"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-fname">
                          <span style={{ color: 'red' }}>{user.totalPrice ? '' : '*'}</span> {t('Amount including Vat')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder={t('Total Price')}
                          type="text"
                          disabled={!user?.totalTrips}
                          value={user?.totalPrice}
                          name="totalPrice"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-lname">
                          <span style={{ color: 'red' }}>{user?.vat ? '' : '*'}</span> {t('Total Taxes')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder={t('VAT')}
                          type="text"
                          readOnly
                          value={parseInt(user?.vat).toFixed(2)}
                          name="vat"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-lname">
                          <span style={{ color: 'red' }}>{user.startDate ? '' : '*'}</span> {t('Start Date')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder={t('Quote Number')}
                          type="date"
                          value={user.startDate?.split('T')[0]}
                          name="startDate"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>{' '}
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-lname">
                          <span style={{ color: 'red' }}>{user.endDate ? '' : '*'}</span> {t('End Date')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder={t('Quote Number')}
                          type="date"
                          value={user.endDate?.split('T')[0]}
                          name="endDate"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <AddressInput label="Start Address" address={startAddress} setAddress={setStartAddress} />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <AddressInput label="End Address" address={endAddress} setAddress={setEndAddress} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          {t('Comment')}
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="comments"
                          className="form-control"
                          placeholder={t('Enter comment here')}
                          type="textarea"
                          value={user?.comments}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            {t('Save')}
          </Button>{' '}
          {isEditing && (
            <>
              <Button color="primary" onClick={handleDuplicate}>
                {t('Duplicate')}
              </Button>
              <Button color="danger" onClick={handleDelete}>
                {t('Delete')}
              </Button>
            </>
          )}{' '}
          <Button onClick={handleModal}>{t('Cancel')}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default InvoiceForm;
