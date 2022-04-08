// reactstrap components

import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  Input,
  Button,
} from "reactstrap";
import InvoiceForm from "./InvoiceForm";
import InvoiceRow from "./InvoiceRow";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/index";
import { ExportInvoices } from "../../components/exportInvoices";
import { toast } from "react-toastify";

const InvoiceList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [invoices, setInvoices] = useState();
  const [dropDownItem, setDropDownItem] = useState("all");
  const [statusdropDown, setStatusDropDown] = useState("Bulk Action");
  const [selectedItems, setSelectedItems] = useState([]);
  const [typefilter, setTypeFilter] = useState(false);
  const [datefilter, setDateFilter] = useState(false);
  const [filter, setFilter] = useState("");
  const [dates, setDates] = useState([]);
  const [filterdropDownItem, setFilterDropDownItem] = useState("all");

  const handleSelect = (invoice) => {
    const selected = selectedItems.filter((a) => a._id === invoice._id);
    if (selected.length > 0) {
      setSelectedItems((prev) => prev.filter((a) => a._id !== invoice._id));
    } else {
      setSelectedItems((prev) => [...prev, invoice]);
    }
  };
  const handelNameFilter = (e) => {
    e.preventDefault();
    setFilterDropDownItem(e.target.name);
  };
  const handleDeleteMany = async () => {
    const invoiceIds = selectedItems.map((a) => a._id);

    api("delete", "invoices/deleteMany", { data: { invoiceIds } }).then(() => {
      toast.success("Invoices deleted successfully");
      autoRefresh();
      setSelectedItems([]);
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
        autoRefresh();
      }
      setDateFilter((prevCheck) => !prevCheck);
    } else if (e.target.name === "invoice-type-filter") {
      if (datefilter === true) {
        setDateFilter(false);
        autoRefresh();
      }
      setTypeFilter((prevCheck) => !prevCheck);
    }
  };
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const autoRefresh = () => {
    api("get", `invoices/status/${filterdropDownItem}`).then((res) => {
      setInvoices(res.data.invoices);
    });
  };
  const handleInputChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const changeStatus = (e) => {
    e.preventDefault();
    setStatusDropDown(e.target.name);
    let value = e.target.name;
    api("post", `invoices/setstatus`, {
      invoices: selectedItems,
      value: value,
    }).then((res) => {
      autoRefresh();
      toast.success("Status Updated successfully");
      setSelectedItems([]);
      setStatusDropDown("Bulk Action");
    });
  };
  const handleSubmit = (e) => {
    console.log("pressed");
    e.preventDefault();
    let method = "post";
    let uri = "invoices/InvoiceByDate";
    if (dates.start_end == "") {
      return toast.error("Please enter start date");
    }
    if (dates.end_date == "") {
      return toast.error("Please enter end date");
    }
    api(method, uri, {
      ...dates,
    }).then((res) => {
      if (res.status == 200) {
        setInvoices(res.data.invoices);
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
                          color="warning"
                          name
                          href="#pablo"
                          role="button"
                          caret
                          style={{ textTransform: "capitalize" }}
                        >
                          {filterdropDownItem}
                          &nbsp;invoices
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem name="all" onClick={handelNameFilter}>
                            All Invoices
                          </DropdownItem>
                          <DropdownItem
                            name="pending"
                            onClick={handelNameFilter}
                          >
                            Pending Invoices
                          </DropdownItem>
                          <DropdownItem name="paid" onClick={handelNameFilter}>
                            Paid Invoices
                          </DropdownItem>
                          <DropdownItem name="late" onClick={handelNameFilter}>
                            Late Invoices
                          </DropdownItem>
                          <DropdownItem
                            name="cancelled"
                            onClick={handelNameFilter}
                          >
                            Cancelled Invoices
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
                          Delete Invoices
                        </Button>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color="primary"
                            name
                            href="#pablo"
                            role="button"
                            caret
                            style={{ textTransform: "capitalize" }}
                          >
                            {statusdropDown}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem name="pending" onClick={changeStatus}>
                              Pending
                            </DropdownItem>
                            <DropdownItem name="paid" onClick={changeStatus}>
                              Paid
                            </DropdownItem>
                            <DropdownItem name="late" onClick={changeStatus}>
                              Late
                            </DropdownItem>
                            <DropdownItem
                              name="cancelled"
                              onClick={changeStatus}
                            >
                              cancel
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>{" "}
                        <ExportInvoices
                          dropDownItem={dropDownItem}
                          invoices={selectedItems}
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
                          All Invoices
                        </DropdownItem>
                        <DropdownItem
                          name="invoice-type-filter"
                          onClick={filterCheck}
                        >
                          Filter By Invoice type
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
                      <i className="ni ni-fat-add"></i>
                      Add Invoice
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
                    <th scope="col">Title</th>
                    <th scope="col">Issue Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">No. of Trips</th>
                    <th scope="col">Total Price Including vat</th>
                    <th scope="col">Total Price without vat</th>
                    <th scope="col">Client</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices ? (
                    invoices.map((invoice) => (
                      <InvoiceRow
                        key={invoice._id}
                        invoice={invoice}
                        selectedItems={selectedItems}
                        handleSelect={handleSelect}
                        autoRefresh={autoRefresh}
                      />
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>No Invoice Found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        {openModal && (
          <InvoiceForm
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

export default InvoiceList;
