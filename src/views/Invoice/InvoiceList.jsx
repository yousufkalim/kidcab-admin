// reactstrap components

import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  Input,
  Button,
} from 'reactstrap';
import InvoiceForm from './InvoiceForm';
import InvoiceRow from './InvoiceRow';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../api/index';
import { ExportInvoices } from '../../components/exportInvoices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import MomentLocaleUtils from 'react-day-picker/moment';

import 'react-datepicker/dist/react-datepicker.css';

import fr from 'date-fns/locale/fr-CA';
const InvoiceList = () => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const [openModal, setOpenModal] = useState(false);
  const [invoices, setInvoices] = useState();
  const [dropDownItem, setDropDownItem] = useState('all');
  const [statusdropDown, setStatusDropDown] = useState('Bulk Action');
  const [selectedItems, setSelectedItems] = useState([]);
  const [typefilter, setTypeFilter] = useState(false);
  const [datefilter, setDateFilter] = useState(false);
  const [filter, setFilter] = useState('');
  const [dates, setDates] = useState([]);
  const [filterdropDownItem, setFilterDropDownItem] = useState('all');

  const handleSelect = (invoice) => {
    const selected = selectedItems.filter((a) => a._id === invoice._id);
    if (selected.length > 0) {
      setSelectedItems((prev) => prev.filter((a) => a._id !== invoice._id));
    } else {
      setSelectedItems((prev) => [...prev, invoice]);
    }
  };
  const handelNameFilter = (e) => {
    e.preventDefault();
    setFilterDropDownItem(e.target.name);
  };
  const handleDateChange = (e) => {
    setDates({ ...dates, start_date: e });
  };

  const handleDateChange1 = (e) => {
    setDates({ ...dates, end_date: e });
  };
  const handleDeleteMany = async () => {
    const invoiceIds = selectedItems.map((a) => a._id);

    api('delete', 'invoices/deleteMany', { data: { invoiceIds } }).then(() => {
      toast.success(`${t('Delete Successfully')}`);
      autoRefresh();
      setSelectedItems([]);
    });
  };
  const filterCheck = (e) => {
    e.preventDefault();
    setDropDownItem(e.target.name);
    if (e.target.name === 'all') {
      setTypeFilter(false);
      setDateFilter(false);
      setFilter('');
      setFilterDropDownItem(e.target.name);
      setDates({ ...dates, start_date: '', end_date: '' });
    } else if (e.target.name == 'date-filter') {
      if (typefilter === true) {
        setFilterDropDownItem('all');
        setTypeFilter(false);
        setDates({ ...dates, start_date: '', end_date: '' });
      }
      setFilterDropDownItem('all');
      setDateFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === 'invoice-type-filter') {
      if (datefilter === true) {
        setFilterDropDownItem('all');
        setDateFilter(false);
        setDates({ ...dates, start_date: '', end_date: '' });
      }
      setFilterDropDownItem('all');
      setTypeFilter((prevCheck) => !prevCheck);
    }
  };
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const autoRefresh = () => {
    api('get', `invoices/status/${filterdropDownItem}`).then((res) => {
      setInvoices(res.data.invoices);
    });
  };
  const handleInputChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const changeStatus = (e) => {
    e.preventDefault();
    setStatusDropDown(e.target.name);
    let value = e.target.name;
    api('post', `invoices/setstatus`, {
      invoices: selectedItems,
      value: value,
    }).then((res) => {
      autoRefresh();

      toast.success(`${t('Status Updated successfully')}`);
      setSelectedItems([]);
      setStatusDropDown('Bulk Action');
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let method = 'post';
    let uri = 'invoices/InvoiceByDate';
    if (!dates?.start_date) {
      return toast.error(`${t('Please enter start date')}`);
    }
    if (!dates?.end_date) {
      return toast.error(`${t('Please enter end date')}`);
    }
    api(method, uri, {
      ...dates,
    }).then((res) => {
      if (res.status == 200) {
        setInvoices(res.data.invoices);
      } else {
        return toast.error(`${t('Error')}`);
      }
    });
  };

  useEffect(() => {
    autoRefresh();
  }, [openModal, filterdropDownItem, typefilter, datefilter]);
  return (
    <>
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <div className="filter-cont" style={{ width: '20%' }}>
                    {typefilter && (
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="warning"
                          name
                          href="#pablo"
                          role="button"
                          caret
                          style={{ textTransform: 'capitalize' }}
                        >
                          {t(filterdropDownItem)}
                          &nbsp;{t('invoices')}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem name="all" onClick={handelNameFilter}>
                            {t('All Invoices')}
                          </DropdownItem>
                          <DropdownItem name="pending" onClick={handelNameFilter}>
                            {t('Pending Invoices')}
                          </DropdownItem>
                          <DropdownItem name="paid" onClick={handelNameFilter}>
                            {t('Paid Invoices')}
                          </DropdownItem>
                          <DropdownItem name="late" onClick={handelNameFilter}>
                            {t('Late Invoices')}
                          </DropdownItem>
                          <DropdownItem name="cancelled" onClick={handelNameFilter}>
                            {t('Cancelled Invoices')}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    )}
                  </div>
                  <div>
                    {selectedItems.length > 0 && (
                      <>
                        <Button color="danger" href="#pablo" onClick={handleDeleteMany} size="md">
                          {t('Delete Invoices')}
                        </Button>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color="primary"
                            name
                            href="#pablo"
                            role="button"
                            caret
                            style={{ textTransform: 'capitalize' }}
                          >
                            {t(statusdropDown)}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem name="pending" onClick={changeStatus}>
                              {t('Pending')}
                            </DropdownItem>
                            <DropdownItem name="paid" onClick={changeStatus}>
                              {t('Paid')}
                            </DropdownItem>
                            <DropdownItem name="late" onClick={changeStatus}>
                              {t('Late')}
                            </DropdownItem>
                            <DropdownItem name="cancelled" onClick={changeStatus}>
                              {t('cancel')}
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>{' '}
                        <ExportInvoices dropDownItem={dropDownItem} invoices={selectedItems} />
                      </>
                    )}
                    <UncontrolledDropdown>
                      <DropdownToggle
                        color="danger"
                        name
                        href="#pablo"
                        role="button"
                        caret
                        size="md"
                        style={{
                          textTransform: 'capitalize',
                        }}
                      >
                        {t(dropDownItem)}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem name="all" onClick={filterCheck}>
                          {t('All Invoices')}
                        </DropdownItem>
                        <DropdownItem name="invoice-type-filter" onClick={filterCheck}>
                          {t('Filter By Invoice type')}
                        </DropdownItem>
                        <DropdownItem name="date-filter" onClick={filterCheck}>
                          {t('Filter By Date')}
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <Button color="primary" href="#pablo" onClick={handleModal} size="md">
                      <i className="ni ni-fat-add"></i>
                      {t('Add Invoice')}
                    </Button>
                  </div>
                </div>
                {datefilter ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          width: '40%',
                        }}
                      >
                        <label className="form-control-label" htmlFor="input-date">
                          <span style={{ color: 'red' }}>{dates?.start_date ? '' : '*'}</span> {t('Start Date')}
                        </label>

                        <DatePicker
                          selected={dates?.start_date ? dates?.start_date : ''}
                          locale={language === 'fr' && fr}
                          placeholderText={t('dd/mm/yyyy')}
                          onChange={handleDateChange}
                        />
                      </div>
                      <div
                        style={{
                          width: '40%',
                          marginLeft: '20px',
                        }}
                      >
                        <label className="form-control-label" htmlFor="input-date">
                          <span style={{ color: 'red' }}>{dates?.end_date ? '' : '*'}</span> {t('End Date')}
                        </label>

                        <DatePicker
                          selected={dates?.end_date ? dates?.end_date : ''}
                          locale={language === 'fr' && fr}
                          placeholderText={t('dd/mm/yyyy')}
                          onChange={handleDateChange1}
                        />
                      </div>
                      <div>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={handleSubmit}
                          style={{
                            marginTop: '35px',
                            marginLeft: '30px',
                          }}
                        >
                          {t('Search')}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">{t('Select')}</th>
                    <th scope="col">{t('Title')}</th>
                    <th scope="col">{t('Issue Date')}</th>
                    <th scope="col">{t('Status')}</th>
                    <th scope="col">{t('No. of Trips')}</th>
                    <th scope="col">{t('Total Price inc vat')}</th>

                    <th scope="col">{t('Client')}</th>
                    <th scope="col">{t('Driver')}</th>
                    <th scope="col">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices ? (
                    invoices.map((invoice) => (
                      <InvoiceRow
                        key={invoice._id}
                        invoice={invoice}
                        selectedItems={selectedItems}
                        handleSelect={handleSelect}
                        autoRefresh={autoRefresh}
                      />
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>{t('No Invoice Found')}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        {openModal && (
          <InvoiceForm
            openModal={openModal}
            handleModal={handleModal}
            user={undefined}
            isEditing={false}
            autoRefresh={autoRefresh}
          />
        )}
      </Container>
    </>
  );
};

export default InvoiceList;
