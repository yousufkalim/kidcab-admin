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
  const [filterdropDownItem, setFilterDropDownItem] = useState("all");
  const [filter, setFilter] = useState("");
  const [dates, setDates] = useState([]);
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
    console.log(filterdropDownItem, "filterdropDownItem");
    api("get", `trips/status/${filterdropDownItem}`).then((res) => {
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
    e.preventDefault();
    setDropDownItem(e.target.name);
    if (e.target.name === "all") {
      setTypeFilter(false);
      setDateFilter(false);
      setFilter("");
      setFilterDropDownItem(e.target.name);
      autoRefresh();
    } else if (e.target.name == "date-filter") {
      if (typefilter === true) {
        setTypeFilter(false);
      }
      setDateFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === "trip-type-filter") {
      if (datefilter === true) {
        setDateFilter(false);
      }
      setTypeFilter((prevCheck) => !prevCheck);
    }
  };

  const handleInputChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handelNameFilter = (e) => {
    e.preventDefault();
    setFilterDropDownItem(e.target.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "trips/tripsByDate";
    if (dates.start_end == "") {
      return toast.error("Please enter start date");
    }
    if (dates.end_date == "") {
      return toast.error("Please enter end date");
    }
    api(method, uri, {
      ...dates,
    }).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        setTrips(res.data.trips);
      } else {
        toast.error(" Error", res);
      }
    });
  };

  useEffect(() => {
    autoRefresh();
  }, [openModal, filterdropDownItem]);

  return (
    <>
      {console.log(filterdropDownItem)}
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
                        <DropdownItem name="all" onClick={filterCheck}>
                          All Trips
                        </DropdownItem>
                        <DropdownItem
                          name="trip-type-filter"
                          onClick={filterCheck}
                        >
                          Filter By trip type
                        </DropdownItem>
                        <DropdownItem name="date-filter" onClick={filterCheck}>
                          Filter By Date
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
                {typefilter ? (
                  <>
                    <div
                      className="Trip_Filer"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "11px",
                        marginTop: "24px",
                      }}
                    >
                      <div style={{ width: "60%" }}>
                        <Input
                          aria-label="Search"
                          className="form-control-rounded "
                          placeholder="Search Client name"
                          type="search"
                          name="client-search"
                          style={{ border: "none", backgroundColor: "#e8f7ff" }}
                          onChange={(e) => {
                            setFilter(e.target.value.toLowerCase());
                          }}
                        />
                      </div>
                      <div>
                        <UncontrolledDropdown
                          style={{
                            marginTop: "-13px",
                            position: "absolute",
                            right: "210px",
                          }}
                        >
                          <DropdownToggle
                            color="primary"
                            name
                            href="#pablo"
                            role="button"
                            caret
                            size="sm"
                            style={{
                              textTransform: "capitalize",
                            }}
                          >
                            {filterdropDownItem}
                            &nbsp;trips
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem name="all" onClick={handelNameFilter}>
                              All Trips
                            </DropdownItem>
                            <DropdownItem
                              name="pending"
                              onClick={handelNameFilter}
                            >
                              Pending Trips
                            </DropdownItem>
                            <DropdownItem
                              name="confirmed"
                              onClick={handelNameFilter}
                            >
                              Confirmed Trips
                            </DropdownItem>
                            <DropdownItem
                              name="cancelled"
                              onClick={handelNameFilter}
                            >
                              Cancelled Trips
                            </DropdownItem>
                            <DropdownItem
                              name="completed"
                              onClick={handelNameFilter}
                            >
                              Completed Trips
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                  </>
                ) : datefilter ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <label
                          className="form-control-label"
                          htmlFor="input-date"
                        >
                          <span style={{ color: "red" }}>
                            {dates?.start_date ? "" : "*"}
                          </span>{" "}
                          Start Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          placeholder={"Select Start Date"}
                          type="date"
                          value={dates?.start_date}
                          name="start_date"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div
                        style={{
                          width: "40%",
                          marginLeft: "20px",
                        }}
                      >
                        <label
                          className="form-control-label"
                          htmlFor="input-date"
                        >
                          <span style={{ color: "red" }}>
                            {dates?.end_date ? "" : "*"}
                          </span>{" "}
                          End Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          placeholder={"Select End Date"}
                          type="date"
                          value={dates?.end_date}
                          name="end_date"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={handleSubmit}
                          style={{
                            marginTop: "35px",
                            marginLeft: "30px",
                          }}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
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
