import React from "react";
import { Button, Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";

const TripProfile = () => {
  const { t, i18n } = useTranslation();
  return (
    <Card className="card-profile shadow">
      <Row className="justify-content-center">
        <Col className="order-lg-2" lg="3">
          <div className="card-profile-image">
            <a href="#pablo" onClick={(e) => e.preventDefault()}>
              <img
                alt="..."
                className="rounded-circle"
                src={
                  require("../../assets/img/theme/team-4-800x800.jpg").default
                }
              />
            </a>
          </div>
        </Col>
      </Row>
      <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
        <div className="d-flex justify-content-between">
          <Button
            className="mr-4"
            color="info"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
            size="sm"
          >
            {t("Connect")}
          </Button>
          <Button
            className="float-right"
            color="default"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
            size="sm"
          >
            {t("Message")}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="pt-0 pt-md-4">
        <Row>
          <div className="col">
            <div className="card-profile-stats d-flex justify-content-center mt-md-5">
              <div>
                <span className="heading">22</span>
                <span className="description">{t("Friends")}</span>
              </div>
              <div>
                <span className="heading">10</span>
                <span className="description">{t("Photos")}</span>
              </div>
              <div>
                <span className="heading">89</span>
                <span className="description">{t("Comments")}</span>
              </div>
            </div>
          </div>
        </Row>
        <div className="text-center">
          <h3>
            {t("Jessica Jones")}
            <span className="font-weight-light">, 27</span>
          </h3>
          <div className="h5 font-weight-300">
            <i className="ni location_pin mr-2" />
            {t("Bucharest, Romania")}
          </div>
          <div className="h5 mt-4">
            <i className="ni business_briefcase-24 mr-2" />
            {t("Solution Manager - Creative Tim Officer")}
          </div>
          <div>
            <i className="ni education_hat mr-2" />
            {t("University of Computer Science")}
          </div>
          <hr className="my-4" />
          <p>
            {t("Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music.")}
          </p>
          <a href="#pablo" onClick={(e) => e.preventDefault()}>
            {t("Show more")}
          </a>
        </div>
      </CardBody>
    </Card>
  );
};

export default TripProfile;
