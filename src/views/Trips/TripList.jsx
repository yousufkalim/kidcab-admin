// reactstrap components
import { ExportTrips } from "components/exportTrips";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
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
  const pagination = useRef();
  const [trips, setTrips] = useState();
  const [dropDownItem, setDropDownItem] = useState("all");
  const [filterdropDownItem, setFilterDropDownItem] = useState("all");
  const [driverSearchfilter, setDriverSearchFilter] = useState("");
  const [clientSearchfilter, setClientSearchFilter] = useState("");
  const [dates, setDates] = useState([]);
  const [typefilter, setTypeFilter] = useState(false);
  const [datefilter, setDateFilter] = useState(false);
  const [driverfilter, setDriverFilter] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectBtn, setSelectBtn] = useState(false);
  const [page, setPage] = useState(0);
  const [datepage, setDatePage] = useState(0);
  const [driverpage, setDriverPage] = useState(0);
  const [clientpage, setClientPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleSelect = (trip) => {
    const selected = selectedItems.filter((a) => a._id === trip._id);
    if (selected.length > 0) {
      setSelectedItems((prev) => prev.filter((a) => a._id !== trip._id));
    } else {
      setSelectedItems((prev) => [...prev, trip]);
    }
  };
  const selectAll = () => {
    if (selectBtn == true) {
      setSelectBtn(false);
      setSelectedItems([]);
    } else {
      setSelectBtn(true);
      setSelectedItems([]);
      trips.map((e) => {
        setSelectedItems((prev) => [...prev, e]);
      });
    }
  };

  const setPageis = ({ selected }) => {
    if (datefilter === true) {
      setDatePage(selected);
    } else if (driverfilter) {
      setDriverPage(selected);
    } else if (typefilter) {
      setClientPage(selected);
    } else {
      setPage(selected);
    }
  };

  const handleDeleteMany = async () => {
    const tripIds = selectedItems.map((a) => a._id);
    api("delete", "trips/deleteMany", { data: { tripIds } }).then(() => {
      toast.success("Trips deleted successfully");
      autoRefresh();
      setSelectBtn(false);
      setSelectedItems([]);
    });
  };

  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };

  const handleDriver = () => {
    let driver = driverSearchfilter.toLowerCase();
    let method = "post";
    let uri = "trips/tripsbydriver";
    api(method, uri, {
      driver,
      pageNumber: page,
      pageSize: 10,
    }).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        setTrips(res.data.trips);
        setCount(res.data.count);
      } else {
        toast.error(" Error", res);
      }
    });
  };

  const handleClient = () => {
    let client = clientSearchfilter.toLowerCase();
    let method = "post";
    let uri = "trips/tripsbyClient";
    api(method, uri, {
      client,
      status: filterdropDownItem,
      pageNumber: page,
      pageSize: 10,
    }).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        setTrips(res.data.trips);
        setCount(res.data.count);
      } else {
        toast.error(" Error", res);
      }
    });
  };

  const autoRefresh = () => {
    api("post", `trips/status/${filterdropDownItem}`, {
      pageNumber: page,
      pageSize: 10,
    }).then((res) => {
      setTrips(res?.data?.trips);
      setCount(res?.data?.totalResults);
    });
  };
  const filterCheck = (e) => {
    e.preventDefault();
    setDropDownItem(e.target.name);
    if (e.target.name === "all") {
      setTypeFilter(false);
      setPage(0);
      setDatePage(0);
      setDriverPage(0);
      setDateFilter(false);
      setDriverFilter(false);
      setDriverSearchFilter("");
      setFilterDropDownItem(e.target.name);
      setDates({ ...dates, start_date: "", end_date: "" });
    } else if (e.target.name == "date-filter") {
      if (typefilter === true || driverfilter === true) {
        setTypeFilter(false);
        setDriverFilter(false);
        setDates({ ...dates, start_date: "", end_date: "" });
      }
      setPage(0);
      setDateFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === "trip-type-filter") {
      if (datefilter === true || driverfilter === true) {
        setDateFilter(false);
        setDriverFilter(false);
        setDates({ ...dates, start_date: "", end_date: "" });
      }
      setPage(0);
      setTypeFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === "driver-filter") {
      if (datefilter === true || typefilter === true) {
        setTypeFilter(false);
        setDateFilter(false);
        setDates({ ...dates, start_date: "", end_date: "" });
      }
      setPage(0);
      setDriverFilter((prevCheck) => !prevCheck);
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
    if (dates?.start_end == "") {
      return toast.error("Please enter start date");
    }
    if (dates?.end_date == "") {
      return toast.error("Please enter end date");
    }
    api(method, uri, {
      ...dates,
      pageNumber: datepage,
      pageSize: 10,
    }).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        setTrips(res.data.trips);
        setCount(res.data.count);
      } else {
        toast.error(" Error", res);
      }
    });
  };

  useEffect(() => {
    autoRefresh();
  }, [openModal, page, typefilter, datefilter, driverfilter]);

  useEffect(() => {
    if (dates.length > 1) {
      toast.error("Date criteria is empty");
    }
    if (datefilter === true) {
      let method = "post";
      let uri = "trips/tripsByDate";
      api(method, uri, {
        ...dates,
        pageNumber: datepage,
        pageSize: 10,
      }).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          setTrips(res.data.trips);
          setCount(res.data.count);
        } else {
          toast.error(" Error", res);
        }
      });
    }
  }, [datepage]);

  useEffect(() => {
    if (driverfilter === true) {
      if (driverSearchfilter === "") {
        return toast.error("Please Enter Search Criteria");
      }
      let method = "post";
      let uri = "trips/tripsbydriver";
      api(method, uri, {
        driver: driverSearchfilter,
        pageNumber: driverpage,
        pageSize: 10,
      }).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          setTrips(res.data.trips);
          setCount(res.data.count);
        } else {
          toast.error(" Error", res);
        }
      });
    }
  }, [driverpage]);

  useEffect(() => {
    if (typefilter === true) {
      if (clientSearchfilter === "") {
        return toast.error("Please Enter Search Criteria");
      }
      let method = "post";
      let uri = "trips/tripsbyClient";
      api(method, uri, {
        client: clientSearchfilter,
        status: filterdropDownItem,
        pageNumber: driverpage,
        pageSize: 10,
      }).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          setTrips(res.data.trips);
          setCount(res.data.count);
        } else {
          toast.error(" Error", res);
        }
      });
    }
  }, [clientpage]);

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
                    <Button
                      color="warning"
                      href="#pablo"
                      size="md"
                      onClick={selectAll}
                    >
                      {selectBtn === false ? (
                        <>Select All</>
                      ) : (
                        <>De-Select all</>
                      )}
                    </Button>
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
                    {selectedItems.length > 0 && (
                      <ExportTrips
                        dropDownItem={filterdropDownItem}
                        trips={selectedItems}
                      />
                    )}
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
                        <DropdownItem
                          name="driver-filter"
                          onClick={filterCheck}
                        >
                          Filter By Driver
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
                        position: "relative",
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
                            setClientSearchFilter(e.target.value.toLowerCase());
                          }}
                        />
                      </div>
                      <div>
                        <UncontrolledDropdown
                          style={{
                            position: "absolute",
                            top: "15%",
                            right: "20%",
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
                        <Button
                          color="success"
                          size="sm"
                          style={{
                            position: "absolute",
                            top: "15%",
                            right: "10%",
                          }}
                          onClick={handleClient}
                        >
                          Search
                        </Button>
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
                ) : driverfilter ? (
                  <>
                    <div
                      className="Trip_Filer"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "11px",
                        marginTop: "24px",
                        position: "relative",
                      }}
                    >
                      <div style={{ width: "60%" }}>
                        <Input
                          aria-label="Search"
                          className="form-control-rounded "
                          placeholder="Search Driver name"
                          type="search"
                          name="driver-search"
                          style={{ border: "none", backgroundColor: "#e8f7ff" }}
                          onChange={(e) => {
                            setDriverSearchFilter(e.target.value.toLowerCase());
                          }}
                        />
                      </div>
                      <div>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={handleDriver}
                          style={{
                            position: "absolute",
                            top: "15%",
                            right: "20%",
                          }}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  " "
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
                      Drivers
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
                  {trips ? (
                    trips?.map((trip) => (
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
            </Card>
          </div>
        </Row>
        <div style={{ width: "50%", margin: "auto" }}>
          <ReactPaginate
            ref={pagination}
            marginPagesDisplayed={1}
            pageCount={Math.ceil(count / 10)}
            onPageChange={setPageis}
            containerClassName="pagination"
            activeClassName="active"
            pageLinkClassName="page-link"
            breakLinkClassName="page-link"
            nextLinkClassName="page-link"
            previousLinkClassName="page-link"
            pageClassName="page-item"
            breakClassName="page-item"
            nextClassName="page-item"
            previousClassName="page-item"
            previousLabel={<>&laquo;</>}
            nextLabel={<>&raquo;</>}
            style={{ justifyContent: "center" }}
          />
        </div>
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
