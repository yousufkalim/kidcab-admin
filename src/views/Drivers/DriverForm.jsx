import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import AddressInput from 'components/Form/AddressInput';
import View from '../../components/view';
import FilePicker from '../../components/Form/FilePicker';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, FormGroup, Form, Input, Row, Col, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
// core components
import Select from 'react-select';
import moment from 'moment';
let current = moment();
const DriverForm = ({ openModal, handleModal, editUser, isEditing, isClose, autoRefresh, setUserData }) => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({
    profile_pic: '',
    id_front: '',
    id_back: '',
    vtc_front: '',
    vtc_back: '',
    criminal_record_image: '',
    criminal_record_date: '',
    ris_image: '',
    ris_date: '',
    kbis_image: '',
    kbis_date: '',
    proRc_image: '',
    proRc_date: '',
    license_front: '',
    license_back: '',
    kbis_extract: '',
    rib: '',
    professional_liability: '',
    insurance_civil_liability: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    bankName: '',
    iban: '',
    role: '',
    vehicles: [],
    company_name: '',
    siret_number: '',
    legal_info: '',
    social_capital: '',
    vat_number: '',
    city_of_rcs: '',
  });
  const [docs, setDocs] = useState({});

  const [address, setAddress] = useState({
    lat: '',
    lng: '',
    label: '',
    label2: '',
    city: '',
    postal_code: '',
  });
  const [vehicles, setVehicles] = useState();
  useEffect(() => {
    api('get', 'vehicles').then((res) => {
      let filteredvehicles = res.data.vehicles.filter((e) => {
        return !e.driver;
      });
      setVehicles(filteredvehicles);
    });
  }, []);

  useEffect(() => {
    if (isClose) {
      setUser({
        firstName: editUser?.firstName,
        lastName: editUser?.lastName,
        password: editUser?.password,
        email: editUser?.email,
        phone: editUser?.phone,
        role: editUser?.role,
        bankName: editUser?.bankName,
        iban: editUser?.iban,
        vehicles: editUser?.vehicles.map((i) => {
          return i.value;
        }),
        company_name: editUser?.company_name,
        siret_number: editUser?.siret_number,
        legal_info: editUser?.legal_info,
        social_capital: editUser?.social_capital,
        vat_number: editUser?.vat_number,
        city_of_rcs: editUser?.city_of_rcs,
        profile_pic: editUser?.profile_pic,
        criminal_record_image: editUser?.criminal_record_image,
        criminal_record_date: editUser?.criminal_record_date,
        ris_image: editUser?.ris_image,
        ris_date: editUser?.ris_date,
        kbis_image: editUser?.kbis_image,
        kbis_date: editUser?.kbis_date,
        proRc_image: editUser.proRc_image,
        proRc_date: editUser.proRc_date,
        id_front: editUser?.id_front,
        id_back: editUser?.id_back,
        vtc_front: editUser?.vtc_front,
        vtc_back: editUser?.vtc_back,
        license_front: editUser?.license_front,
        license_back: editUser?.license_back,
        kbis_extract: editUser?.kbis_extract,
        rib: editUser?.rib,
        professional_liability: editUser?.professional_liability,
        insurance_civil_liability: editUser?.insurance_civil_liability,
        address: editUser?.address,
      });
    }
  }, [editUser]);

  useEffect(() => {
    if (isEditing) {
      setUser({
        firstName: editUser?.first_name,
        lastName: editUser?.last_name,
        password: editUser?.password,
        email: editUser?.email,
        phone: editUser?.phone_number,
        role: editUser?.role,
        bankName: editUser?.bank_info?.bank_name,
        iban: editUser?.bank_info?.iban,
        vehicles: editUser?.vehicles.map((i) => {
          return i?._id;
        }),
        company_name: editUser?.company?.company_name,
        siret_number: editUser?.company?.siret_number,
        legal_info: editUser?.company?.legal_info,
        social_capital: editUser?.company?.social_capital,
        vat_number: editUser?.company?.vat_number,
        city_of_rcs: editUser?.company?.city_of_rcs,
        criminal_record_date: editUser?.criminal_record_date,
        kbis_date: editUser?.kbis_date,
        ris_date: editUser?.ris_date,
        proRc_date: editUser?.proRc_date,
      });
      setDocs({
        profile_pic: editUser.profile_pic,
        id_card_front: editUser.id_card_front,
        id_card_back: editUser.id_card_back,
        vtc_card_front: editUser.vtc_card_front,
        vtc_card_back: editUser.vtc_card_back,
        criminal_record_image: editUser.criminal_record_image,
        ris_image: editUser.ris_image,
        kbis_image: editUser.kbis_image,
        proRc_image: editUser.proRc_image,
        license_card_front: editUser.license_card_front,
        license_card_back: editUser.license_card_back,
        insurance_civil_liability: editUser.insurance_civil_liability,
        professional_liability: editUser.professional_liability,
        rib: editUser.rib,
        kbis_extract: editUser.kbis_extract,
      });

      setAddress(editUser.address);
    }
  }, []);

  const handleFile1Change = (e) => {
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  };

  const handleInput1Change = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleVehicle1Change = (e) => {
    setUser((user) => ({
      ...user,
      vehicles: e.map((vehicle) => vehicle.value),
    }));
  };

  const handleRole1Change = (e) => {
    setUser((user) => ({ ...user, role: e.value }));
  };

  const handleDelete = () => {
    let method = 'delete';
    let uri = 'drivers';
    if (editUser) {
      method = 'delete';
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri).then((res) => {
      if (res.status == 200) {
        toast.success('Delete Successfully');
        handleModal();
        autoRefresh();
      } else {
        toast.error('Delete Error', res.data.message);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let method = 'post';
    let uri = 'drivers';
    if (user?.vehicles.length < 1) {
      return toast.error('Vechicle is required');
    }
    const bankInfo = {
      bank_name: user?.bankName,
      iban: user?.iban,
    };

    const formData = new FormData();
    if (user?.profile_pic) formData.append('profile_pic', user?.profile_pic, user?.profile_pic?.name);
    formData.append('first_name', user.firstName.toLowerCase());
    formData.append('last_name', user.lastName.toLowerCase());
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('role', user.role);
    formData.append('phone_number', user.phone);
    if (address?.lat && address?.lng) {
      formData.append('address', JSON.stringify(address));
    }
    formData.append('vehicles', JSON.stringify(user.vehicles));
    formData.append('bank_info', JSON.stringify(bankInfo));

    if (user.role === 'fleet_manager') {
      formData.append(
        'company',
        JSON.stringify({
          company_name: user.company_name,
          siret_number: user.siret_number,
          legal_info: user.legal_info,
          social_capital: user.social_capital,
          vat_number: user.vat_number,
          city_of_rcs: user.city_of_rcs,
        })
      );
      if (user.kbis_extract) {
        formData.append('kbis_extract', user.kbis_extract, user.kbis_extract?.name);
      }

      if (user.rib) {
        formData.append('rib', user.rib, user.rib?.name);
      }

      if (user.professional_liability) {
        formData.append('professional_liability', user.professional_liability, user.professional_liability?.name);
      }

      if (user.insurance_civil_liability) {
        formData.append('insurance_civil_liability', user.insurance_civil_liability, user.insurance_civil_liability?.name);
      }
    }

    if (user?.criminal_record_image) {
      if (!user.criminal_record_date) {
        return toast.error('Please enter criminal_record expirty date');
      }
      formData.append('criminal_record_image', user.criminal_record_image, user.criminal_record_image?.name);
    }

    if (user.ris_image) {
      if (!user.ris_date) {
        return toast.error('Please enter RIS expirty date');
      }
      formData.append('ris_image', user.ris_image, user.ris_image?.name);
    }
    if (user.kbis_image) {
      if (!user.kbis_date) {
        return toast.error('Please enter KBIS expirty date');
      }
      formData.append('kbis_image', user.kbis_image, user.kbis_image?.name);
    }

    if (user.proRc_image) {
      if (!user?.proRc_date) {
        return toast.error('Please enter proRC expirty date');
      }
      formData.append('proRc_image', user.proRc_image, user.proRc_image?.name);
    }
    if (user.criminal_record_date) {
      formData.append('criminal_record_date', user.criminal_record_date);
    }
    if (user.ris_date) {
      formData.append('ris_date', user.ris_date);
    }
    if (user.kbis_date) {
      formData.append('kbis_date', user.kbis_date);
    }
    if (user?.proRc_date) {
      formData.append('proRc_date', user.proRc_date);
    }

    if (user.id_front) formData.append('id_card_front', user.id_front, user.id_front?.name);
    if (user.id_back) formData.append('id_card_back', user.id_back, user.id_back?.name);

    if (user.vtc_front) formData.append('vtc_card_front', user.vtc_front, user.vtc_front?.name);
    if (user.vtc_back) formData.append('vtc_card_back', user.vtc_back, user.vtc_back?.name);

    if (user.license_front) formData.append('license_card_front', user.license_front, user.license_front?.name);
    if (user.license_back) formData.append('license_card_back', user.license_back, user.license_back?.name);

    if (user.firstName == '') {
      return toast.error('Please enter your first name');
    }
    if (user.lastName == '') {
      return toast.error('Please enter your last name');
    }
    if (user.email == '') {
      return toast.error('Please enter email');
    }
    if (!(user.email.includes('.') && user.email.includes('@'))) {
      return toast.error('Please enter a valid email');
    }
    if (user.password == '') {
      return toast.error('Password is required');
    }
    if (user.password.length < 8) {
      return toast.error('Passwords should be of atleast 8 letters');
    }

    if (user.role == '') {
      return toast.error('Please select your role');
    }

    if (user.phone == '') {
      return toast.error('Please enter phone number');
    }
    if (isEditing) {
      method = 'put';
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, formData).then((res) => {
      if (res.status == 200) {
        toast.success('Saved Successfully');
        // setUserData({
        //   profile_pic: "",
        //   id_front: "",
        //   id_back: "",
        //   vtc_front: "",
        //   vtc_back: "",
        //   criminal_record_image: "",
        //   criminal_record_date: "",
        //   ris_image: "",
        //   ris_date: "",
        //   kbis_image: "",
        //   kbis_date: "",
        //   proRc_image: "",
        //   proRc_date: "",
        //   license_front: "",
        //   license_back: "",
        //   kbis_extract: "",
        //   rib: "",
        //   professional_liability: "",
        //   insurance_civil_liability: "",
        //   firstName: "",
        //   lastName: "",
        //   email: "",
        //   password: "",
        //   phone: "",
        //   bankName: "",
        //   iban: "",
        //   role: "",
        //   vehicles: [],
        //   company_name: "",
        //   siret_number: "",
        //   legal_info: "",
        //   social_capital: "",
        //   vat_number: "",
        //   city_of_rcs: "",
        // });

        handleModal();
        autoRefresh();
      } else {
        toast.error('Save Error', res);
      }
    });
  };

  return (
    <>
      {console.log(user, 'd')}
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? t('Edit') : t('Add')} {t('Driver')}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">{t('User information')}</h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="12">
                      <FormGroup style={{ width: '60%' }}>
                        <label className="form-control-label">
                          {t('Add Profile Picture')}
                          <View url={docs.profile_pic} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-image"
                          InputClassName="form-control-file form"
                          InputId="input-image"
                          InputName="profile_pic"
                          value={editUser.profile_pic ? editUser.profile_pic : user.profile_pic}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-fname">
                          <span style={{ color: 'red' }}>{user.firstName ? '' : '*'}</span> {t('First Name')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder={t('First Name')}
                          type="text"
                          value={user.firstName}
                          name="firstName"
                          onChange={handleInput1Change}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-lname">
                          <span style={{ color: 'red' }}>{user.lastName ? '' : '*'}</span> {t('Last Name')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Doe"
                          type="email"
                          value={user.lastName}
                          name="lastName"
                          onChange={handleInput1Change}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {isEditing ? (
                    <Row>
                      <Col lg="6" style={{ margin: 'auto' }}>
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            <span style={{ color: 'red' }}>{user.email ? '' : '*'}</span> {t('Email Address')}
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="johndoe@example.com"
                            type="text"
                            value={user.email}
                            name="email"
                            onChange={handleInput1Change}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            <span style={{ color: 'red' }}>{user.email ? '' : '*'}</span> {t('Email Address')}
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="johndoe@example.com"
                            type="text"
                            value={user.email}
                            name="email"
                            onChange={handleInput1Change}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-password">
                            <span style={{ color: 'red' }}>{user.password ? '' : '*'}</span> {t('Password')}
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-password"
                            placeholder={t('Password')}
                            type="password"
                            value={user.password}
                            name="password"
                            onChange={handleInput1Change}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                </div>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <Label for="exampleSelect" className="form-control-label">
                          <span style={{ color: 'red' }}>{user.role ? '' : '*'}</span> {t('Select Role')}
                        </Label>

                        <Select
                          placeholder={t('Select...')}
                          onChange={handleRole1Change}
                          name="role"
                          hideSelectedOptions
                          defaultValue={
                            user?.role && {
                              value: user.role,
                              label: user.role,
                            }
                          }
                          className="form-control-alternative"
                          options={[
                            {
                              value: 'individual',
                              label: 'individual',
                            },
                            {
                              value: 'fleet_manager',
                              label: 'fleet_manager',
                            },
                          ]}
                        />
                      </FormGroup>
                    </Col>
                    {user.role === 'individual' ? (
                      <Col lg="6">
                        <FormGroup>
                          <Label for="exampleSelect" className="form-control-label">
                            <span style={{ color: 'red' }}>{user?.vehicles?.length > 0 ? '' : '*'}</span> {t('Select Vehicle')}
                          </Label>
                          {vehicles && (
                            <Select
                              placeholder={t('Select...')}
                              name="vehicles"
                              hideSelectedOptions
                              isMulti
                              isDisabled={isEditing}
                              onChange={handleVehicle1Change}
                              defaultValue={
                                isClose
                                  ? editUser.vehicles?.map((i) => ({
                                      value: i.value,
                                      label: i.label,
                                    }))
                                  : user?.vehicles?.length > 0 &&
                                    editUser.vehicles?.map((i) => ({
                                      value: i?._id,
                                      label: i?.vehicle_name,
                                    }))
                              }
                              className="form-control-alternative"
                              options={vehicles.map((vehicle) => ({
                                value: vehicle?._id,
                                label: `${vehicle?.vehicle_name}`,
                              }))}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    ) : user.role === 'fleet_manager' ? (
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-fname">
                            <span style={{ color: 'red' }}>{user?.vehicles?.length > 0 ? '' : '*'}</span> {t('Select Vehicle')}
                          </label>
                          {vehicles && (
                            <Select
                              placeholder={t('Select...')}
                              onChange={handleVehicle1Change}
                              name="vehicles"
                              isDisabled={isEditing}
                              isMulti
                              className="form-control-alternative"
                              defaultValue={
                                user?.vehicles?.length > 0 &&
                                user?.vehicles?.map((vehicle) => ({
                                  value: vehicle._id,
                                  label: vehicle.vehicle_name,
                                }))
                              }
                              options={vehicles.map((vehicle) => ({
                                value: vehicle?._id,
                                label: `${vehicle?.vehicle_name}`,
                              }))}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    ) : (
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-fname">
                            {t('Select Vehicles')}
                          </label>
                          <Select
                            placeholder={t('Select...')}
                            name="vehicles"
                            isMulti
                            className="form-control-alternative"
                            isDisabled={true}
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                </div>
                {user.role === 'fleet_manager' && (
                  <>
                    <hr className="my-4" />
                    {/* Contact Information */}
                    <h6 className="heading-small text-muted mb-4">{t('Company information')}</h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-fname">
                              {t('Company Name')}
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-fname"
                              required={true}
                              placeholder={t('Enter Company Name')}
                              type="text"
                              value={user.company_name}
                              name="company_name"
                              onChange={handleInput1Change}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-address">
                              {t('City of RCS')}
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-address"
                              placeholder={t('City of RCS')}
                              type="text"
                              value={user.city_of_rcs}
                              name="city_of_rcs"
                              onChange={handleInput1Change}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-email">
                              {t('SIRET Number')}
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="123456789"
                              type="text"
                              value={user.siret_number}
                              name="siret_number"
                              onChange={handleInput1Change}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-vat">
                              {t('VAT Number')}
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-vat"
                              placeholder={t('VAT Number')}
                              type="text"
                              value={user.vat_number}
                              name="vat_number"
                              onChange={handleInput1Change}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-account">
                              {t('Enter Social Capital')}
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-account"
                              placeholder="XXXXX-XXXXXXX-X"
                              type="text"
                              value={user.social_capital}
                              name="social_capital"
                              onChange={handleInput1Change}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-bankName">
                              {t('Enter Legal Information')}
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-bankName"
                              placeholder={t('Legal Information here...')}
                              type="text"
                              value={user.legal_info}
                              name="legal_info"
                              onChange={handleInput1Change}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label">
                              {t('Add insurance civil liability')} <i className="fa fa-id-card" />
                              <View url={docs.insurance_civil_liability} />
                            </label>

                            <FilePicker
                              lableClassName="form-control-label"
                              htmlFor="input-insurance-civil-liability"
                              InputClassName="form-control-file form"
                              InputId="input-insurance-civil-liability"
                              InputName="insurance_civil_liability"
                              value={
                                editUser.insurance_civil_liability
                                  ? editUser.insurance_civil_liability
                                  : user.insurance_civil_liability
                              }
                              onChange={handleFile1Change}
                            ></FilePicker>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label">
                              {t('Add Professional liability')} <i className="fa fa-id-card" />
                              <View url={docs.professional_liability} />
                            </label>

                            <FilePicker
                              lableClassName="form-control-label"
                              htmlFor="input-Professional-liability"
                              InputClassName="form-control-file form"
                              InputId="input-Professional-liability"
                              InputName="professional_liability"
                              value={
                                editUser.professional_liability ? editUser.professional_liability : user.professional_liability
                              }
                              onChange={handleFile1Change}
                            ></FilePicker>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label">
                              {t('Add RIB')} <i className="fa fa-id-card" />
                              <View url={docs.rib} />
                            </label>

                            <FilePicker
                              lableClassName="form-control-label"
                              htmlFor="input-RIB"
                              InputClassName="form-control-file form"
                              InputId="input-RIB"
                              InputName="rib"
                              value={editUser.rib ? editUser.rib : user.rib}
                              onChange={handleFile1Change}
                            ></FilePicker>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-id-front">
                              {t('Add Kbis extract')} <i className="fa fa-id-card" />
                              <View url={docs.kbis_extract} />
                            </label>

                            <FilePicker
                              lableClassName="form-control-label"
                              htmlFor="input-kbis-extract"
                              InputClassName="form-control-file form"
                              InputId="input-kbis-extract"
                              InputName="kbis_extract"
                              value={editUser.kbis_extract ? editUser.kbis_extract : user.kbis_extract}
                              onChange={handleFile1Change}
                            ></FilePicker>
                          </FormGroup>
                        </Col>
                      </Row>{' '}
                    </div>
                  </>
                )}

                <hr className="my-4" />
                {/* Contact Information */}
                <h6 className="heading-small text-muted mb-4">{t('Contact information')}</h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <AddressInput label="Address" optional={true} address={address} setAddress={setAddress} />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-phone">
                          <span style={{ color: 'red' }}>{user.phone ? '' : '*'}</span> {t('Phone Number')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-phone"
                          placeholder="+33123456789"
                          type="text"
                          value={user.phone}
                          name="phone"
                          onChange={handleInput1Change}
                          maxLength={14}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <h6 className="heading-small text-muted mb-4">{t('Bank information')}</h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-bankName">
                          {t('Bank Name')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-bankName"
                          placeholder={t('Bank Name')}
                          type="text"
                          value={user?.bankName}
                          name="bankName"
                          onChange={handleInput1Change}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="8">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-iban">
                          {t('IBAN Number')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-iban"
                          placeholder={t('Example Bank Ltd')}
                          type="text"
                          value={user.iban}
                          name="iban"
                          onChange={handleInput1Change}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <hr className="my-4" />
                <h6 className="heading-small text-muted mb-4">{t('Other information')}</h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup style={{ display: 'flex', flexDirection: 'column' }}>
                        <label className="form-control-label">
                          {t('Add Identity Card/Passport/Residence Permit Front Side')} <View url={docs?.id_card_front} />
                        </label>
                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-id-front"
                          InputClassName="form-control-file form"
                          InputId="input-id-front"
                          InputName="id_front"
                          value={editUser.id_card_front ? editUser.id_card_front : user.id_front}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add Identity Card/Passport/Residence Permit Back Side')} <View url={docs.id_card_back} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-id-back"
                          InputClassName="form-control-file form"
                          InputId="input-id-back"
                          InputName="id_back"
                          value={editUser.id_card_back ? editUser.id_card_back : user.id_back}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add VTC Card Front Side')}
                          <View url={docs.vtc_card_front} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-vtc-front"
                          InputClassName="form-control-file form"
                          InputId="input-vtc-front"
                          InputName="vtc_front"
                          value={editUser.vtc_card_front ? editUser.vtc_card_front : user.vtc_front}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add VTC Card Back Side')} <View url={docs.vtc_card_back} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-vtc-back"
                          InputClassName="form-control-file form"
                          InputId="input-vtc-back"
                          InputName="vtc_back"
                          value={editUser.vtc_card_back ? editUser.vtc_card_back : user.vtc_back}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add License Card Front Side')} <View url={docs.license_card_front} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-license-front"
                          InputClassName="form-control-file form"
                          InputId="input-license-front"
                          InputName="license_front"
                          value={editUser.license_card_front ? editUser.license_card_front : user.license_front}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          Add License Card Back Side <View url={docs.license_card_back} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-license-back"
                          InputClassName="form-control-file form"
                          InputId="input-license-back"
                          InputName="license_back"
                          value={editUser.license_card_back ? editUser.license_card_back : user.license_back}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add Criminal Record')} <View url={docs.criminal_record_image} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-criminal-record"
                          InputClassName="form-control-file form"
                          InputId="input-criminal-record"
                          InputName="criminal_record_image"
                          value={editUser.criminal_record_image ? editUser.criminal_record_image : user.criminal_record_image}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-date">
                          <span style={{ color: 'red' }}>
                            {user.criminal_record_image ? (user?.criminal_record_date ? '' : '*') : ''}
                          </span>{' '}
                          {t('Valid Till')}
                        </label>

                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder={t('Enter Company Name')}
                          type="date"
                          value={user?.criminal_record_date?.split('T')[0]}
                          name="criminal_record_date"
                          onChange={handleInput1Change}
                          min={moment(current).format('YYYY-MM-DD')}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add Restricted Information Statement')} <View url={docs.ris_image} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-restricted-information-statement"
                          InputClassName="form-control-file form"
                          InputId="input-restricted-information-statement"
                          InputName="ris_image"
                          value={editUser.ris_image ? editUser.ris_image : user.ris_image}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-date">
                          <span style={{ color: 'red' }}>{user.ris_image ? (user?.ris_date ? '' : '*') : ''}</span>
                          {t('Valid Till')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder={t('Enter Company Name')}
                          type="date"
                          value={user?.ris_date?.split('T')[0]}
                          name="ris_date"
                          onChange={handleInput1Change}
                          min={moment(current).format('YYYY-MM-DD')}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add KBIS')} <View url={docs.kbis_image} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-kbis"
                          InputClassName="form-control-file form"
                          InputId="input-kbis"
                          InputName="kbis_image"
                          value={editUser.kbis_image ? editUser.kbis_image : user.kbis_image}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-date">
                          <span style={{ color: 'red' }}>{user.kbis_image ? (user?.kbis_date ? '' : '*') : ''}</span>
                          {t('Valid Till')}
                        </label>

                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder={t('Enter Company Name')}
                          type="date"
                          value={user?.kbis_date?.split('T')[0]}
                          name="kbis_date"
                          onChange={handleInput1Change}
                          min={moment(current).format('YYYY-MM-DD')}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {t('Add Pro RC Insurance Certificate')} <View url={docs.proRc_image} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-pro_rc_insurance_certificate"
                          InputClassName="form-control-file form"
                          InputId="input-pro_rc_insurance_certificate"
                          InputName="proRc_image"
                          value={editUser.proRc_image ? editUser.proRc_image : user.proRc_image}
                          onChange={handleFile1Change}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-date">
                          <span style={{ color: 'red' }}>{user.proRc_image ? (user?.proRc_date ? '' : '*') : ''}</span>
                          {t('Valid Till')}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder={t('Enter Company Name')}
                          type="date"
                          value={user?.proRc_date?.split('T')[0]}
                          name="proRc_date"
                          onChange={handleInput1Change}
                          min={moment(current).format('YYYY-MM-DD')}
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

export default DriverForm;
