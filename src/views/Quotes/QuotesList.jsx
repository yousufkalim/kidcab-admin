import {
  Card,
  CardHeader,
  Table,
  Container,
  Input,
  Row,
  Button,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";
import PassengerForm from "./QuotesForm";
import PassengerRow from "./QuotesRow";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/index";
import { ExportQuotes } from "../../components/exportQuotes";
import { toast } from "react-toastify";

const QuotesList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [quotes, setQuotes] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropDownItem, setDropDownItem] = useState("all");
  const [filterdropDownItem, setFilterDropDownItem] = useState("all");
  const [filter, setFilter] = useState("");
  const [dates, setDates] = useState([]);
  const [typefilter, setTypeFilter] = useState(false);
  const [datefilter, setDateFilter] = useState(false);

  const handleSelect = (quote) => {
    const selected = selectedItems.filter((a) => a._id === quote._id);
    if (selected.length > 0) {
      setSelectedItems((prev) => prev.filter((a) => a._id !== quote._id));
    } else {
      setSelectedItems((prev) => [...prev, quote]);
    }
  };
  const handleDeleteMany = async () => {
    const quotesIds = selectedItems.map((a) => a._id);

    api("delete", "quotes/deleteMany", { data: { quotesIds } }).then(() => {
      toast.success("Quotes deleted successfully");
      autoRefresh();
      setSelectedItems([]);
    });
  };
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const autoRefresh = () => {
    api("get", `/quotes/status/${filterdropDownItem}`).then((res) => {
      setQuotes(res.data.quotes);
    });
  };
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
  const handelNameFilter = (e) => {
    e.preventDefault();
    setFilterDropDownItem(e.target.name);
  };

  const handleInputChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "quotes/QuotesByDate";
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
        setQuotes(res.data.qoutes);
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
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <div className="filter-cont" style={{ width: "20%" }}>
                    {typefilter && (
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="dark"
                          name
                          href="#pablo"
                          role="button"
                          caret
                          size="md"
                          style={{
                            textTransform: "capitalize",
                          }}
                        >
                          {filterdropDownItem}
                          &nbsp;qoutes
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem name="all" onClick={handelNameFilter}>
                            All Qoutes
                          </DropdownItem>
                          <DropdownItem
                            name="pending"
                            onClick={handelNameFilter}
                          >
                            Pending Qoutes
                          </DropdownItem>
                          <DropdownItem
                            name="accepted"
                            onClick={handelNameFilter}
                          >
                            Accepted Qoutes
                          </DropdownItem>
                          <DropdownItem
                            name="rejected"
                            onClick={handelNameFilter}
                          >
                            Rejected Qoutes
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    )}
                  </div>
                  <div>
                    {selectedItems.length > 0 && (
                      <>
                        <Button
                          color="danger"
                          href="#pablo"
                          onClick={handleDeleteMany}
                          size="md"
                        >
                          Delete Quotes
                        </Button>
                        <ExportQuotes
                          dropDownItem={dropDownItem}
                          quotes={selectedItems}
                        />
                      </>
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
                          All Qoutes
                        </DropdownItem>
                        <DropdownItem
                          name="trip-type-filter"
                          onClick={filterCheck}
                        >
                          Filter By Qoute type
                        </DropdownItem>
                        <DropdownItem name="date-filter" onClick={filterCheck}>
                          Filter By Date
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={handleModal}
                      size="md"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <i className="ni ni-fat-add"></i>
                        <> Add Quotes</>
                      </div>
                    </Button>
                  </div>
                </div>
                {datefilter ? (
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
                          width: "35%",
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
                          width: "35%",
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
                      <div style={{ marginTop: "35px" }}></div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                        justifyContent: "center",
                      }}
                    >
                      <Button color="primary" size="md" onClick={handleSubmit}>
                        Search
                      </Button>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Select</th>
                    <th scope="col">Quote Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Client</th>
                    <th scope="col">No. of Trips</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Total Price Including VAT</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Actions </th>
                  </tr>
                </thead>
                <tbody>
                  {quotes ? (
                    quotes.map((quote) => (
                      <PassengerRow
                        key={quote._id}
                        quote={quote}
                        selectedItems={selectedItems}
                        handleSelect={handleSelect}
                        autoRefresh={autoRefresh}
                      />
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>No Quotes Found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        {openModal && (
          <PassengerForm
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

export default QuotesList;
