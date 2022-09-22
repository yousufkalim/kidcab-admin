import {
  Card,
  CardHeader,
  Table,
  Container,
  Input,
  Row,
  Button,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
} from 'reactstrap';
import PassengerForm from './QuotesForm';
import PassengerRow from './QuotesRow';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../api/index';
import { ExportQuotes } from '../../components/exportQuotes';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import MomentLocaleUtils from 'react-day-picker/moment';

import 'react-datepicker/dist/react-datepicker.css';

import fr from 'date-fns/locale/fr-CA';

const QuotesList = () => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const [openModal, setOpenModal] = useState(false);
  const [quotes, setQuotes] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropDownItem, setDropDownItem] = useState('all');
  const [filterdropDownItem, setFilterDropDownItem] = useState('all');
  const [filter, setFilter] = useState('');
  const [dates, setDates] = useState([]);
  const [typefilter, setTypeFilter] = useState(false);
  const [datefilter, setDateFilter] = useState(false);

  const handleSelect = (quote) => {
    const selected = selectedItems.filter((a) => a._id === quote._id);
    if (selected.length > 0) {
      setSelectedItems((prev) => prev.filter((a) => a._id !== quote._id));
    } else {
      setSelectedItems((prev) => [...prev, quote]);
    }
  };
  const handleDeleteMany = async () => {
    const quotesIds = selectedItems.map((a) => a._id);

    api('delete', 'quotes/deleteMany', { data: { quotesIds } }).then(() => {
      toast.success(`${t('Delete Successfully')}`);
      autoRefresh();
      setSelectedItems([]);
    });
  };
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const autoRefresh = () => {
    api('get', `/quotes/status/${filterdropDownItem}`).then((res) => {
      setQuotes(res.data.quotes);
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
      autoRefresh();
      setDates({ ...dates, start_date: '', end_date: '' });
    } else if (e.target.name == 'date-filter') {
      if (typefilter === true) {
        setFilterDropDownItem('all');
        setTypeFilter(false);
        setDates({ ...dates, start_date: '', end_date: '' });
      }
      setFilterDropDownItem('all');
      setDateFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === 'qoute-type-filter') {
      if (datefilter === true) {
        setFilterDropDownItem('all');
        setDateFilter(false);
        setDates({ ...dates, start_date: '', end_date: '' });
      }
      setFilterDropDownItem('all');
      setTypeFilter((prevCheck) => !prevCheck);
    }
  };
  const handelNameFilter = (e) => {
    e.preventDefault();
    setFilterDropDownItem(e.target.name);
  };

  const handleInputChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    setDates({ ...dates, start_date: e });
  };

  const handleDateChange1 = (e) => {
    setDates({ ...dates, end_date: e });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = 'post';
    let uri = 'quotes/QuotesByDate';
    if (!dates?.start_date) {
      return toast.error(`${t('Please enter start date')}`);
    }
    if (!dates?.end_date) {
      return toast.error(`${t('Please enter end date')}`);
    }
    api(method, uri, {
      ...dates,
    }).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        setQuotes(res.data.qoutes);
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
                          color="dark"
                          name
                          href="#pablo"
                          role="button"
                          caret
                          size="md"
                          style={{
                            textTransform: 'capitalize',
                          }}
                        >
                          {t(filterdropDownItem)}
                          &nbsp;{t('qoutes')}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem name="all" onClick={handelNameFilter}>
                            {t('All Qoutes')}
                          </DropdownItem>
                          <DropdownItem name="pending" onClick={handelNameFilter}>
                            {t('Pending Qoutes')}
                          </DropdownItem>
                          <DropdownItem name="accepted" onClick={handelNameFilter}>
                            {t('Accepted Qoutes')}
                          </DropdownItem>
                          <DropdownItem name="rejected" onClick={handelNameFilter}>
                            {t('Rejected Qoutes')}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    )}
                  </div>
                  <div>
                    {selectedItems.length > 0 && (
                      <>
                        <Button color="danger" href="#pablo" onClick={handleDeleteMany} size="md">
                          {t('Delete Quotes')}
                        </Button>
                        <ExportQuotes dropDownItem={dropDownItem} quotes={selectedItems} />
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
                          {t('All Qoutes')}
                        </DropdownItem>
                        <DropdownItem name="qoute-type-filter" onClick={filterCheck}>
                          {t('Filter By Qoute type')}
                        </DropdownItem>
                        <DropdownItem name="date-filter" onClick={filterCheck}>
                          {t('Filter By Date')}
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <Button color="primary" href="#pablo" onClick={handleModal} size="md">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <i className="ni ni-fat-add"></i>
                        <> {t('Add Quotes')}</>
                      </div>
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
                    <th scope="col">{t('Quote Title')}</th>
                    <th scope="col">{t('Issue Date')}</th>
                    <th scope="col">{t('Status')}</th>
                    <th scope="col">{t('Client')}</th>
                    <th scope="col">{t('No. of Trips')}</th>
                    <th scope="col">{t('TOTAL PRICE INCLUDING VAT')}</th>
                    <th scope="col">{t('Total Price without VAT')}</th>
                    <th scope="col">{t('Actions')} </th>
                  </tr>
                </thead>
                <tbody>
                  {quotes ? (
                    quotes.map((quote) => (
                      <PassengerRow
                        key={quote._id}
                        quote={quote}
                        selectedItems={selectedItems}
                        handleSelect={handleSelect}
                        autoRefresh={autoRefresh}
                      />
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>{t('No Quotes Found')}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        {openModal && (
          <PassengerForm
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

export default QuotesList;
