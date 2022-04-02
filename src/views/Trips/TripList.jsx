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
  const [filter, setFilter] = useState("");
  const [dates, setDates] = useState([]);
  const [typefilter, setTypeFilter] = useState(false);
  const [datefilter, setDateFilter] = useState(false);
  const [driverfilter, setDriverFilter] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectBtn, setSelectBtn] = useState(false);
  const [page, setPage] = useState(0);
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
      trips.map((e) => {
        setSelectedItems((prev) => [...prev, e]);
      });
    }
  };

  const setPageis = ({ selected }) => {
    console.log(selected === 0 ? 1 : selected);
    setPage(selected);
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
    api("post", `trips/status/${filterdropDownItem}`, {
      pageNumber: page,
      pageSize: 10,
    }).then((res) => {
      setTrips(res?.data?.trips);
      setCount(res.data.totalResults);
    });
  };

  const filterArr = React.useMemo(() => {
    if (filter === "") return trips;
    else if (typefilter === true) {
      return trips.filter((trip) =>
        (
          trip.client.first_name.toLowerCase() +
          trip.client.last_name.toLowerCase()
        ).includes(filter.split(" ").join(""))
      );
    } else if (driverfilter === true) {
      return trips
        ?.map((trip) => {
          let val = trip?.invited_drivers?.filter((driver) => {
            return (
              driver?.driver?.first_name.toLowerCase() +
              driver?.driver?.last_name.toLowerCase()
            ).includes(filter.split(" ").join(""));
          });
          return { ...trip, invited_drivers: val };
        })
        .filter((v) => v.invited_drivers.length > 0);
    }
  }, [filter, trips]);

  const filterCheck = (e) => {
    e.preventDefault();
    setDropDownItem(e.target.name);
    if (e.target.name === "all") {
      setTypeFilter(false);
      setDateFilter(false);
      setDriverFilter(false);
      setFilter("");
      setFilterDropDownItem(e.target.name);
      autoRefresh();
    } else if (e.target.name == "date-filter") {
      if (typefilter === true || driverfilter === true) {
        setTypeFilter(false);
        setDriverFilter(false);
        autoRefresh();
      }
      setDateFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === "trip-type-filter") {
      if (datefilter === true || driverfilter === true) {
        setDateFilter(false);
        setDriverFilter(false);
        autoRefresh();
      }
      setTypeFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === "driver-filter") {
      if (datefilter === true || typefilter === true) {
        setTypeFilter(false);
        setDateFilter(false);
        autoRefresh();
      }
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
  }, [openModal, filterdropDownItem, page]);

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
                    <ExportTrips
                      dropDownItem={filterdropDownItem}
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
                            setFilter(e.target.value.toLowerCase());
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
                            setFilter(e.target.value.toLowerCase());
                          }}
                        />
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
