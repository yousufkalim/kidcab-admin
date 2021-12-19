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

const DriverList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState();
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
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
                  <h3 className="mb-0">Drivers List</h3>
                  <Button
                    color="primary"
                    href="#pablo"
                    onClick={handleModal}
                    size="md"
                  >
                    <i className="ni ni-fat-add"></i>
                    Add Driver
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush my-3" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">No. of Vehicles</th>
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
                      <td>No Driver Found</td>
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
            user={undefined}
            isEditing={false}
            autoRefresh={autoRefresh}
          />
        )}
      </Container>
    </>
  );
};

export default DriverList;
