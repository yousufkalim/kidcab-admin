import {
  Card,
  CardHeader,
  Table,
  Container,
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
    api("get", `/quotes/status/${dropDownItem}`).then((res) => {
      console.log("response --------", res.data.quotes);
      setQuotes(res.data.quotes);
    });
  };
  useEffect(() => {
    autoRefresh();
  }, [openModal, dropDownItem]);
  return (
    <>
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <h3 className="mb-0">Quotes List</h3>
                  <div>
                    {selectedItems.length > 0 && (
                      <Button
                        color="danger"
                        href="#pablo"
                        onClick={handleDeleteMany}
                        size="md"
                      >
                        Delete Quotes
                      </Button>
                    )}
                    <ExportQuotes
                      dropDownItem={dropDownItem}
                      quotes={selectedItems}
                    />{" "}
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
                        &nbsp;qoutes
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          name="all"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          All Qoutes
                        </DropdownItem>
                        <DropdownItem
                          name="pending"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Pending Qoutes
                        </DropdownItem>
                        <DropdownItem
                          name="accepted"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Accepted Qoutes
                        </DropdownItem>
                        <DropdownItem
                          name="rejected"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropDownItem(e.target.name);
                          }}
                        >
                          Rejected Qoutes
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
                      Add Quotes
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Select</th>
                    <th scope="col">Quote Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Client</th>
                    <th scope="col">Passengers</th>
                    <th scope="col">No. of Trips</th>
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
