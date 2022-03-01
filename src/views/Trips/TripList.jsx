// reactstrap components
import { ExportTrips } from "components/exportTrips";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardHeader,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import api from "../../api/index";
import TripForm from "./TripForm";
import TripRow from "./TripRow";

const TripList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [trips, setTrips] = useState();
  const [dropDownItem, setDropDownItem] = useState("all");
  const [filter, setFilter] = useState("");
  const [filterval, setFilterVal] = useState([]);
  const [filtercheck, setFilterCheck] = useState(false);
  const [typefilter, setTypeFilter] = useState(false);
  const [datefilter, setDateFilter] = useState(false);
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
    api("get", `trips`).then((res) => {
      console.log("response --------", res?.data?.trips);
      setTrips(res?.data?.trips);
    });
  };

  const filterArr = React.useMemo(() => {
    if (filter === "") return trips;
    return trips.filter((trip) =>
      (
        trip.client.first_name.toLowerCase() +
        trip.client.last_name.toLowerCase()
      ).includes(filter.split(" ").join(""))
    );
  }, [filter, trips]);

  const filterCheck = (e) => {
    console.log(e.target.name);
    if (e.target.name == "date-filter") {
      if (datefilter === true) setTypeFilter(false);
      setTypeFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === "trip-type-filter") {
      if (typefilter === true) setTypeFilter(false);
      setDateFilter((prevCheck) => !prevCheck);
    }
  };

  useEffect(() => {
    autoRefresh();
  }, [openModal, dropDownItem]);

  return (
    <>
      {console.log(filtercheck, "filter chk")}
      {console.log(typefilter, "filter type")}
      {console.log(datefilter, "filter date")}
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
                        color="danger"
                        name
                        href="#pablo"
                        role="button"
                        caret
                        size="md"
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        {dropDownItem}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem name="date-filter" onClick={filterCheck}>
                          all
                        </DropdownItem>
                        <DropdownItem
                          name="trip-type-filter"
                          onClick={filterCheck}
                        >
                          Filter By trip type
                        </DropdownItem>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownItem name="date-filter" onClick={filterCheck}>
                          Filter By Date
                        </DropdownItem>
                        <DropdownItem
                          name="trip-type-filter"
                          onClick={filterCheck}
                        >
                          Filter By trip type
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <Button
                      color="info"
                      href="#pablo"
                      onClick={handleModal}
                      size="md"
                    >
                      <i className="ni ni-fat-add"></i>
                      Add Trip
                    </Button>
                  </div>
                </div>
                {filtercheck && (
                  <>
                    <div
                      style={{
                        textAlign: "center",
                        margin: "11px 0",
                        marginTop: "30px",
                      }}
                    >
                      <Button
                        color="info"
                        href="#pablo"
                        size="sm"
                        name="filter-date"
                        onClick={filterCheck}
                      >
                        <i className="ni ni-fat-search"></i>
                        Filter by Date
                      </Button>
                      <Button
                        color="warning"
                        href="#pablo"
                        size="sm"
                        name="filter-type"
                        onClick={filterCheck}
                      >
                        <i className="ni ni-fat-search"></i>
                        Filter by Trip Type
                      </Button>
                    </div>
                    {typefilter ? (
                      <>
                        <div
                          className="Trip_Filer"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "11px 0",
                            alignItems: "center",
                          }}
                        >
                          <Input
                            aria-label="Search"
                            className="form-control-rounded "
                            placeholder="Search Client name"
                            type="search"
                            name="client-search"
                            style={{ width: "200", border: "none" }}
                            onChange={(e) => {
                              setFilter(e.target.value.toLowerCase());
                            }}
                          />
                          <UncontrolledDropdown>
                            <DropdownToggle
                              color="dark"
                              name
                              href="#pablo"
                              role="button"
                              caret
                              size="sm"
                              style={{
                                textTransform: "capitalize",
                                marginTop: "5px",
                              }}
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
                          </UncontrolledDropdown>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              width: "35%",
                            }}
                          >
                            <label
                              className="form-control-label"
                              htmlFor="input-date"
                            >
                              {/* <span style={{ color: "red" }}>
                                {trip.date ? "" : "*"}
                              </span>{" "} */}
                              Start Date
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-date"
                              placeholder={"Select Start Date"}
                              type="date"
                              // value={trip.startdate}
                              name="startdate"
                              // onChange={handleInputChange}
                            />
                          </div>
                          <div
                            style={{
                              width: "35%",
                            }}
                          >
                            <label
                              className="form-control-label"
                              htmlFor="input-date"
                            >
                              {/* <span style={{ color: "red" }}>
                                {trip.date ? "" : "*"}
                              </span>{" "} */}
                              End Date
                            </label>

                            <Input
                              className="form-control-alternative"
                              id="input-date"
                              placeholder={"Select End Date"}
                              type="date"
                              // value={trip.startdate}
                              name="enddate"
                              // onChange={handleInputChange}
                            />
                          </div>
                          <div style={{ marginTop: "35px" }}>
                            <Button color="primary" size="sm">
                              Search
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
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
                      Date
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
                  {filterArr ? (
                    filterArr?.map((trip) => (
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
