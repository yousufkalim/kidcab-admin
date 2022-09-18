import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, FormGroup, Form, Input, Row, Col } from 'reactstrap';
// core components
import { useTranslation } from 'react-i18next';

const ViewRequest = ({ openModal, handleModal, request }) => {
  const { i18n, t } = useTranslation();
  const { language } = i18n;

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {t('View Request')}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <span style={{ color: 'red' }}>{request.first_name ? '' : '*'} </span>
                        <label className="form-control-label">{t('First Name')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.first_name[0].toUpperCase() + request?.first_name.substring(1)}
                          name="first_name"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <span style={{ color: 'red' }}>{request.last_name ? '' : '*'} </span>
                        <label className="form-control-label">{t('Last Name')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.last_name[0].toUpperCase() + request?.last_name.substring(1)}
                          name="last_name"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <span style={{ color: 'red' }}>{request.company_name ? '' : '*'} </span>
                        <label className="form-control-label">{t('Company Name')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.company_name}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <span style={{ color: 'red' }}>{request.phone ? '' : '*'} </span>
                        <label className="form-control-label">{t('Phone Number')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.phone}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <span style={{ color: 'red' }}>{request.baby ? '' : '*'} </span>
                        <label className="form-control-label">{t('Total Babies')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.baby ? request?.baby : 0}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <span style={{ color: 'red' }}>{request.baby ? '' : '*'} </span>
                        <label className="form-control-label">{t('Total Children')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.total_children ? request?.total_children : 0}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <span style={{ color: 'red' }}>{request.baby ? '' : '*'} </span>
                        <label className="form-control-label">{t('Total Adults')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.total_adults ? request.total_adults : 0}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <label className="form-control-label">{t('PickUp Address')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.pickUp_address ? request.pickUp_address : '_____'}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <label className="form-control-label">{t('Status')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={
                            request?.status === 'not answer'
                              ? 'Not Answer'
                              : request?.status === 'pending'
                              ? 'Pending'
                              : request?.status === 'accepted'
                              ? 'Accepted'
                              : 'Decline'
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="3" style={{ margin: 'auto' }}>
                      <FormGroup>
                        <label className="form-control-label">{t('Destination Address')}</label>
                        <Input
                          className="form-control-alternative text-default"
                          required={true}
                          type="text"
                          value={request?.destination_address ? request.destination_address : '_____'}
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
          <Button onClick={handleModal}>{t('Cancel')}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ViewRequest;
