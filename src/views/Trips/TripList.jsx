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
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";
import TripForm from "./TripForm";
import TripRow from "./TripRow";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/index";
import { ExportTrips } from "components/exportTrips";
import { toast } from "react-toastify";

const TripList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [trips, setTrips] = useState();
  const [dropDownItem, setDropDownItem] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (trip) => {
    const selected = selectedItems.filter((a) => a._id === trip._id);
    if (selected.length > 0) {
      setSelectedItems((prev) => prev.filter((a) => a._id !== trip._id));
    } else {
      setSelectedItems((prev) => [...prev, trip]);
    }
  };

  const handleDeleteMany = async () => {
    const tripIds = selectedItems.map((a) => a._id);

    api("delete", "trips/deleteMany", { data: { tripIds } }).then(() => {
      toast.success("Trips deleted successfully");
      autoRefresh();
      setSelectedItems([]);
    });
  };

  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const autoRefresh = () => {
    api("get", `trips/status/${dropDownItem}`).then((res) => {
      console.log("response --------", res.data.trips);
      setTrips(res.data.trips);
    });
  };
  useEffect(() => {
    autoRefresh();
  }, [openModal, dropDownItem]);

  return (
    <>
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <h3 className="mb-0">Trip List</h3>
                  <div>
                    {selectedItems.length > 0 && (
                      <Button
                        color="danger"
                        href="#pablo"
                        onClick={handleDeleteMany}
                        size="md"
                      >
                        Delete Trips
                      </Button>
                    )}
                    <ExportTrips
                      dropDownItem={dropDownItem}
                      trips={selectedItems}
                    />
                    <UncontrolledDropdown>
                      <DropdownToggle
                        color="primary"
                        name
                        href="#pablo"
                        role="button"
                        caret
                        style={{ textTransform: "capitalize" }}
                      >
                        {dropDownItem}
                        &nbsp;trips
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          name="all"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          All Trips
                        </DropdownItem>
                        <DropdownItem
                          name="pending"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Pending Trips
                        </DropdownItem>
                        <DropdownItem
                          name="confirmed"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Confirmed Trips
                        </DropdownItem>
                        <DropdownItem
                          name="cancelled"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Cancelled Trips
                        </DropdownItem>
                        <DropdownItem
                          name="completed"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Completed Trips
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>{" "}
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
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush my-3" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Select</th>
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
                        selectedItems={selectedItems}
                        handleSelect={handleSelect}
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
