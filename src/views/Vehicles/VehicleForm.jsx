import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import Select from 'react-select';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, FormGroup, Form, Input, Row, Col, Label } from 'reactstrap';
import moment from 'moment';
import View from '../../components/view';
import FilePicker from '../../components/Form/FilePicker';
import DayPicker, { DateUtils } from 'react-day-picker';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import fr from 'date-fns/locale/fr-CA';
import 'react-day-picker/lib/style.css';
import { useTranslation } from 'react-i18next';

// core components
let current = moment();

const VehicleForm = ({ openModal, handleModal, editUser: editVehicle, isEditing, autoRefresh }) => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const [drivers, setDrivers] = useState([]);
  const [data, setData] = useState({});
  const [vehicle, setVehicle] = useState({
    vehicle_name: '',
    number_plate: '',
    insurance_certificate: '',
    insurance_expiry_date: '',
    brand: '',
    model: '',
    color: '',
    engine_type: 'thermal',
    inspection_date: '',
    graycard: '',
    graycard_expiry_date: '',
    driver: '',
    number_plate: '',
    registration_card: '',
  });
  const [docs, setDocs] = useState({});

  useEffect(() => {
    api('get', 'drivers').then((res) => setDrivers(res.data.drivers));
    if (isEditing) {
      setVehicle({
        vehicle_name: editVehicle.vehicle_name,
        brand: editVehicle.brand,
        model: editVehicle.model,
        color: editVehicle.color,
        engine_type: editVehicle.engine_type,
        inspection_date: new Date(editVehicle.inspection_date),
        graycard: editVehicle.graycard,
        graycard_expiry_date: editVehicle?.graycard_expiry_date,
        driver: editVehicle.driver,
        number_plate: editVehicle.number_plate,
        inspection_expiry_date: new Date(editVehicle.inspection_expiry_date),
        insurance_certificate: editVehicle.insurance_certificate,
        insurance_expiry_date: new Date(editVehicle.insurance_expiry_date),
        registration_card: editVehicle.registration_card,
      });
      setDocs({
        graycard: editVehicle.graycard,
        insurance_certificate: editVehicle.insurance_certificate,
        registration_card: editVehicle.registration_card,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleDateChange = (e) => {
    setVehicle({ ...vehicle, inspection_date: e });
  };
  const handleDateChange1 = (e) => {
    setVehicle({ ...vehicle, graycard_expiry_date: e });
  };
  const handleDateChange2 = (e) => {
    setVehicle({ ...vehicle, insurance_expiry_date: e });
  };
  const handleFileChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleDriverChange = (e) => {
    setVehicle((vehicle) => ({ ...vehicle, driver: e.value }));
  };

  const handleDelete = () => {
    let method = 'delete';
    let uri = 'vehicles';
    if (editVehicle) {
      method = 'delete';
      uri = uri + `/${editVehicle._id}`;
    }
    api(method, uri)
      .then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          toast.success(`${t('Delete Successfully')}`);
          handleModal();
          autoRefresh();
        } else {
          toast.error(`${t(res.data)}`);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = 'post';
    let uri = 'vehicles';
    let d = new Date();
    if (vehicle.vehicle_name == '') {
      return toast.error(`${t('Please enter vehicle name')}`);
    }
    if (vehicle.brand == '') {
      return toast.error(`${t('Please enter brand name')}`);
    }
    if (vehicle.model == '') {
      return toast.error(`${t('Please enter your car model')}`);
    }
    if (vehicle.color == '') {
      return toast.error(`${t('Please enter your car color')}`);
    }
    if (vehicle.engine_type == '') {
      return toast.error(`${t('Please enter your engine type')}`);
    }
    if (!vehicle.inspection_date) {
      return toast.error(`${t('Please enter Last inspection_date')}`);
    }
    if (vehicle.insurance_certificate == '') {
      return toast.error(`${t('Please enter your vehicle insurance card')}`);
    }
    if (!vehicle.insurance_expiry_date) {
      return toast.error(`${t('Please enter a valid insurance date')}`);
    }
    if (vehicle.number_plate == '') {
      return toast.error(`${t('Please enter number plate')}`);
    }

    const formData = new FormData();

    formData.append('vehicle_name', vehicle.vehicle_name);
    formData.append('brand', vehicle.brand);
    formData.append('model', vehicle.model);
    formData.append('color', vehicle.color);
    formData.append('engine_type', vehicle.engine_type);
    formData.append('inspection_date', vehicle.inspection_date);
    formData.append('number_plate', vehicle.number_plate);
    if (vehicle.driver !== '') {
      formData.append('driver', JSON.stringify(vehicle.driver));
    }

    if (vehicle.insurance_certificate) {
      formData.append('insurance_certificate', vehicle.insurance_certificate);
      formData.append('insurance_expiry_date', vehicle.insurance_expiry_date);
    }

    if (vehicle.graycard) {
      formData.append('graycard', vehicle.graycard);
      if (!vehicle.graycard_expiry_date) {
        formData.append('graycard_expiry_date', '');
      } else {
        formData.append('graycard_expiry_date', vehicle.graycard_expiry_date);
      }
    }

    if (vehicle.registration_card) {
      formData.append('registration_card', vehicle.registration_card);
    }
    if (editVehicle) {
      method = 'put';
      uri = uri + `/${editVehicle._id}`;
    }

    api(method, uri, formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`${t('Saved Successfully')}`);
          autoRefresh();
          handleModal();
        } else {
          toast.error(`${t('Save Error')}`, `${t(res)}`);
        }
      })
      .catch((error) => toast.error(`${t(error.message)}`));
  };

  return (
    <>
      {console.log(vehicle)}
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? <>{t('Edit Vehicle')}</> : <>{t('Add Vehicle')}</>}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">{t('Vehicle information')}</h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-fname">
                          <span style={{ color: 'red' }}>{vehicle.vehicle_name ? '' : '*'}</span> {t('Vehicle Name')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder={t('Vehicle Name')}
                          type="text"
                          value={vehicle.vehicle_name}
                          name="vehicle_name"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          <span style={{ color: 'red' }}>{vehicle.brand ? '' : '*'}</span> {t('Brand')}
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="brand"
                          value={vehicle.brand}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder={t('Enter Vehicle Brand')}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          <span style={{ color: 'red' }}>{vehicle.model ? '' : '*'}</span> {t('Model')}
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="model"
                          value={vehicle.model}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder={t('Enter Vehicle Model')}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          {t('Select Driver')}
                        </Label>
                        {drivers && (
                          <Select
                            placeholder={t('Select...')}
                            onChange={handleDriverChange}
                            name="client"
                            hideSelectedOptions
                            defaultValue={
                              editVehicle?.driver && {
                                value: editVehicle?.driver?._id,
                                label: `${
                                  editVehicle?.driver?.first_name[0].toUpperCase() + editVehicle?.driver?.first_name.substring(1)
                                } ${
                                  editVehicle?.driver?.last_name[0].toUpperCase() + editVehicle?.driver?.last_name.substring(1)
                                }`,
                              }
                            }
                            className="form-control-alternative"
                            options={drivers.map((driver) => ({
                              value: driver._id,
                              label: `${driver?.first_name[0].toUpperCase() + driver?.first_name.substring(1)} ${
                                driver?.last_name[0].toUpperCase() + driver?.last_name.substring(1)
                              }`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          {t('Select Engine Type')}
                        </Label>
                        <Input
                          onChange={handleInputChange}
                          name="engine_type"
                          value={vehicle.engine_type}
                          className="form-control-alternative"
                          type="select"
                        >
                          <option value="Thermal" selected>
                            {t('Thermal')}
                          </option>
                          <option value="hybrid">{t('Hybrid')}</option>
                          <option value="electric">{t('Electric')}</option>
                          <option value="hydrogen">{t('Hydrogen')}</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          <span style={{ color: 'red' }}>{vehicle.color ? '' : '*'}</span> {t('Color')}
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="color"
                          value={vehicle.color}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder={t('Enter Vehicle Color')}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          <span style={{ color: 'red' }}>{vehicle.inspection_date ? '' : '*'}</span>{' '}
                          {t('Last technical inspection')}
                        </Label>

                        <DatePicker
                          selected={vehicle.inspection_date}
                          placeholderText={t('dd/mm/yyyy')}
                          locale={language === 'fr' && fr}
                          // value={vehicle.inspection_date}
                          // onChange={handleInputChange}
                          onChange={handleDateChange}
                          maxDate={new Date(Date.now())}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          <span style={{ color: 'red' }}>{vehicle.number_plate ? '' : '*'}</span> {t('Number Plate')}
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="number_plate"
                          value={vehicle.number_plate}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder={t('Enter Number Plate')}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add Gray Card')} <View url={docs?.graycard} />
                        </label>
                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-graycard"
                          InputClassName="form-control-file form"
                          InputId="input-graycard"
                          InputName="graycard"
                          value={editVehicle?.graycard ? editVehicle?.graycard : vehicle?.graycard}
                          onChange={handleFileChange}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-date">
                          {/* <span style={{ color: "red" }}>
                            {vehicle.inspection_expiry_date ? "" : "*"}
                          </span>{" "} */}
                          {t('Gray Valid Till')}
                        </label>

                        <DatePicker
                          selected={vehicle.graycard_expiry_date ? new Date(vehicle.graycard_expiry_date) : ''}
                          placeholderText={t('dd/mm/yyyy')}
                          locale={language === 'fr' && fr}
                          // value={vehicle.inspection_expiry_date}
                          // onChange={handleInputChange}
                          onChange={handleDateChange1}
                          minDate={new Date(Date.now())}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          <span style={{ color: 'red' }}>{vehicle.insurance_certificate ? '' : '*'}</span>{' '}
                          {t('Add vehicle Insurance Certificate')} <View url={docs.insurance_certificate} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-vehicle-insurance"
                          InputClassName="form-control-file form"
                          InputId="input-vehicle-insurance"
                          InputName="insurance_certificate"
                          value={
                            editVehicle?.insurance_certificate
                              ? editVehicle?.insurance_certificate
                              : vehicle?.insurance_certificate
                          }
                          onChange={handleFileChange}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-date">
                          <span style={{ color: 'red' }}>{vehicle.insurance_expiry_date ? '' : '*'}</span>{' '}
                          {t('Insurance Valid Till')}
                        </label>

                        <DatePicker
                          selected={vehicle.insurance_expiry_date}
                          placeholderText={t('dd/mm/yyyy')}
                          locale={language === 'fr' && fr}
                          // onChange={handleInputChange}
                          onChange={handleDateChange2}
                          minDate={new Date(Date.now())}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add Registration Card')} <View url={docs?.registration_card} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-number-plate"
                          InputClassName="form-control-file form"
                          InputId="input-number-plate"
                          InputName="registration_card"
                          value={editVehicle?.registration_card ? editVehicle?.registration_card : vehicle?.registration_card}
                          onChange={handleFileChange}
                        ></FilePicker>
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
            <Button color="danger" onClick={handleDelete}>
              {t('Delete')}
            </Button>
          )}{' '}
          <Button onClick={handleModal}>{t('Cancel')}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default VehicleForm;
