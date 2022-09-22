// reactstrap components

import {
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
} from "reactstrap";
import DriverForm from "./DriverForm";
import DriverRow from "./DriverRow";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/index";
import { useTranslation } from "react-i18next";

const DriverList = () => {
  const { t, i18n } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState();
  const [user, setUser] = useState({
    profile_pic: "",
    id_front: "",
    id_back: "",
    vtc_front: "",
    vtc_back: "",
    criminal_record_image: "",
    criminal_record_date: "",
    ris_image: "",
    ris_date: "",
    kbis_image: "",
    kbis_date: "",
    proRc_image: "",
    address: "",
    proRc_date: "",
    license_front: "",
    license_back: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    bankName: "",
    iban: "",
    role: "",
    vehicles: [],
    company_name: "",
    siret_number: "",
    legal_info: "",
    social_capital: "",
    vat_number: "",
    city_of_rcs: "",
    kbis_extract: "",
    rib: "",
    professional_liability: "",
    insurance_civil_liability: "",
  });
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const handleFileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e) => {
    setUser((user) => ({
      ...user,
      vehicles: e.map((vehicle) => vehicle.value),
    }));
  };

  const handleRoleChange = (e) => {
    setUser((user) => ({ ...user, role: e.value }));
  };
  const autoRefresh = () => {
    api("get", "drivers").then((res) => setUsers(res.data.drivers));
  };
  useEffect(() => {
    autoRefresh();
  }, [openModal]);
  return (
    <>
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <h3 className="mb-0">{t("Drivers List")}</h3>
                  <Button
                    color="primary"
                    // href="#pablo"
                    onClick={handleModal}
                    size="md"
                  >
                    <i className="ni ni-fat-add"></i>
                    {t("Add Driver")}
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush my-3" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">{t("Name")}</th>
                    <th scope="col">{t("Role")}</th>
                    <th scope="col">{t("Email")}</th>
                    <th scope="col">{t("Phone Number")}</th>
                    <th scope="col">{t("No. of Vehicles")}</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {users ? (
                    users.map((user) => (
                      <DriverRow
                        key={user._id}
                        user={user}
                        autoRefresh={autoRefresh}
                      />
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>{t("No Driver Found")}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {/* <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter> */}
            </Card>
          </div>
        </Row>
        {openModal && (
          <DriverForm
            openModal={openModal}
            handleModal={handleModal}
            handleFileChange={handleFileChange}
            handleInputChange={handleInputChange}
            handleVehicleChange={handleVehicleChange}
            handleRoleChange={handleRoleChange}
            editUser={user}
            setUserData={setUser}
            isClose={true}
            autoRefresh={autoRefresh}
          />
        )}
      </Container>
    </>
  );
};

export default DriverList;
