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
import TripForm from "./TripForm";
import TripRow from "./TripRow";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/index";

const TripList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [trips, setTrips] = useState();
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const autoRefresh = () => {
    api("get", "trips").then((res) => {
      console.log("response --------", res.data.trips);
      setTrips(res.data.trips);
    });
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
                  <h3 className="mb-0">Trip List</h3>
                  <Button
                    color="primary"
                    href="#pablo"
                    onClick={handleModal}
                    size="md"
                  >
                    <i className="ni ni-fat-add"></i>
                    Add Trip
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush my-3" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Trip Status</th>
                    <th scope="col" className="text-center">
                      Clients
                    </th>
                    <th scope="col" className="text-center">
                      Passengers
                    </th>
                    <th scope="col" className="text-center">
                      Invited Drivers
                    </th>
                    <th scope="col" className="text-center">
                      Start Address
                    </th>
                    <th scope="col" className="text-center">
                      End Address
                    </th>
                    <th scope="col" className="text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trips ? (
                    trips.map((trip) => (
                      <TripRow
                        key={trip._id}
                        trip={trip}
                        autoRefresh={autoRefresh}
                      />
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>No Trip Found</td>
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
          <TripForm
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

export default TripList;
