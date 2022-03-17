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

  const handleSelect = (invoice) => {
    const selected = selectedItems.filter((a) => a._id === invoice._id);
    if (selected.length > 0) {
      setSelectedItems((prev) => prev.filter((a) => a._id !== invoice._id));
    } else {
      setSelectedItems((prev) => [...prev, invoice]);
    }
  };
  const handleDeleteMany = async () => {
    const invoiceIds = selectedItems.map((a) => a._id);

    api("delete", "invoices/deleteMany", { data: { invoiceIds } }).then(() => {
      toast.success("Invoices deleted successfully");
      autoRefresh();
      setSelectedItems([]);
    });
  };
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const autoRefresh = () => {
    api("get", `invoices/status/${dropDownItem}`).then((res) => {
      setInvoices(res.data.invoices);
    });
  };

  const changeStatus = (e) => {
    e.preventDefault();
    setStatusDropDown(e.target.name);
    let value = e.target.name;
    api("post", `invoices/setstatus`, {
      invoices: selectedItems,
      value: value,
    }).then((res) => {
      // console.log(res.data.updatedinvoices);
      setInvoices(res.data.updatedinvoices);
      toast.success("Status Updated successfully");
      setSelectedItems([]);
      setStatusDropDown("Bulk Action");
    });
  };

  useEffect(() => {
    autoRefresh();
  }, [openModal, dropDownItem, invoices]);
  return (
    <>
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <h3 className="mb-0">Invoice List</h3>

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
                        color="primary"
                        name
                        href="#pablo"
                        role="button"
                        caret
                        style={{ textTransform: "capitalize" }}
                      >
                        {dropDownItem}
                        &nbsp;invoices
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          name="all"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          All Invoices
                        </DropdownItem>
                        <DropdownItem
                          name="pending"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Pending Invoices
                        </DropdownItem>
                        <DropdownItem
                          name="paid"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Paid Invoices
                        </DropdownItem>
                        <DropdownItem
                          name="late"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Late Invoices
                        </DropdownItem>
                        <DropdownItem
                          name="cancelled"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Cancelled Invoices
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
                      Add Invoice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Select</th>
                    <th scope="col">Title</th>
                    <th scope="col">Issue Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Total Price</th>
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
