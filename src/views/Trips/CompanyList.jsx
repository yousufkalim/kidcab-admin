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
import CompanyForm from "./CompanyForm";
import CompanyRow from "./CompanyRow";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/index";

const CompanyList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState();
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };

  useEffect(() => {
    api("get", "companies").then((res) => setUsers(res.data.companies));
  }, [openModal]);

  return (
    <>
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <h3 className="mb-0">Company List</h3>
                  <Button
                    color="primary"
                    href="#pablo"
                    onClick={handleModal}
                    size="md"
                  >
                    <i className="ni ni-fat-add"></i>
                    Add Company
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush my-3" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Company Name</th>
                    <th scope="col" className="text-center">
                      Company Manager
                    </th>
                    <th scope="col" className="text-center">
                      Location / City
                    </th>
                    <th scope="col" className="text-center">
                      No. of Vehicles
                    </th>
                    <th scope="col" className="text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users ? (
                    users.map((user) => (
                      <CompanyRow key={user._id} user={user} />
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>No Company Found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
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
              </CardFooter>
            </Card>
          </div>
        </Row>
        {openModal && (
          <CompanyForm
            openModal={openModal}
            handleModal={handleModal}
            user={undefined}
            isEditing={false}
          />
        )}
      </Container>
    </>
  );
};

export default CompanyList;
