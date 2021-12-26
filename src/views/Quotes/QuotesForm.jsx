import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import AddressInput from "components/Form/AddressInput";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
} from "reactstrap";
// core components
import Select from "react-select";
const QuotesForm = ({
  openModal,
  handleModal,
  editQuote,
  isEditing,
  autoRefresh,
}) => {
  const [quote, setQuote] = useState({
    title: "",
    quoteNumber: "",
    client: "",
    passengers: [],
    status: "",
    issueDate: "",
    totalTrips: "",
    totalPrice: "",
    vat: "",
    startDate: "",
    endDate: "",
    docuSignLink: "",
  });
  let [startAddress, setStartAddress] = useState({});
  let [endAddress, setEndAddress] = useState({});

  const [clients, setClients] = useState();
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    api("get", "users").then((res) => setClients(res.data.users));
    // api("get", "passengers").then((res) => setPassengers(res.data.passengers));
    if (isEditing) {
      setQuote({
        title: editQuote.quote_title,
        quoteNumber: editQuote.quote_number,
        client: editQuote.client,
        passengers: editQuote.passengers,
        status: editQuote.status,
        issueDate: editQuote.issue_date,
        totalTrips: editQuote.trip_info.total_trips,
        totalPrice: editQuote.total_price,
        vat: editQuote.vat,
        startDate: editQuote.trip_info.start_date,
        endDate: editQuote.trip_info.end_date,
        docuSignLink: editQuote.docu_sign_link,
      });

      setStartAddress(editQuote.trip_info.start_address);
      setEndAddress(editQuote.trip_info.end_address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setQuote((quote) => ({ ...quote, [e.target.name]: e.target.value }));
  };

  const handleClientChange = (e) => {
    setQuote((quote) => ({ ...quote, client: e.value }));
    setPassengers(clients.filter((a) => a._id === e.value)[0]?.passengers);
  };

  const handlePassengerChange = (e) => {
    setQuote((quote) => ({
      ...quote,
      passengers: e.map((passenger) => passenger.value),
    }));
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "quotes";
    if (editQuote) {
      method = "delete";
      uri = uri + `/${editQuote._id}`;
    }
    api(method, uri).then((res) => {
      // eslint-disable-next-line eqeqeq
      if (res.status == 200) {
        toast.success("Delete Successfully");
        handleModal();
        autoRefresh();
      } else {
        toast.error("Delete Error", res.data.message);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "quotes";
    const tripInfo = {
      total_trips: quote.totalTrips,
      start_date: quote.startDate,
      end_date: quote.endDate,
      start_address: startAddress,
      end_address: endAddress,
    };

    const formData = {};
    formData["quote_title"] = quote.title;
    formData["passengers"] = quote.passengers;
    formData["client"] = quote.client;
    formData["quote_number"] = quote.quoteNumber;
    formData["issue_date"] = quote.issueDate;
    formData["total_price"] = quote.totalPrice;
    formData["vat"] = quote.vat;
    formData["status"] = quote.status;
    formData["trip_info"] = JSON.stringify(tripInfo);
    formData["docu_sign_link"] = quote.docuSignLink;

    //validations
    if (quote.title == "") {
      return toast.error("Please enter quote title");
    }
    if (quote.quoteNumber == "") {
      return toast.error("Please enter quote number");
    }
    if (quote.client == "") {
      return toast.error("Please enter client name");
    }
    if (quote.passengers == "") {
      return toast.error("Please enter passanger's name");
    }
    if (quote.status == "") {
      return toast.error("Please enter quote status");
    }
    if (quote.issueDate == "") {
      return toast.error("Please enter issue date");
    }
    if (tripInfo.total_trips == "") {
      return toast.error("Please enter total number of trips");
    }
    if (tripInfo.total_passengers == "") {
      return toast.error("Please enter total number of passengers");
    }
    if (quote.totalPrice == "") {
      return toast.error("Please enter quote price");
    }
    if (quote.vat == "") {
      return toast.error("Please enter vat");
    }

    if (tripInfo.start_date == "") {
      return toast.error("Please enter start date");
    }
    if (tripInfo.end_date == "") {
      return toast.error("Please enter end date");
    }
    if (tripInfo.start_address == "") {
      return toast.error("Please enter start address");
    }
    if (tripInfo.end_address == "") {
      return toast.error("Please enter end address");
    }

    if (editQuote) {
      method = "put";
      uri = uri + `/${editQuote._id}`;
    }

    api(method, uri, formData).then((res) => {
      if (res.status === 200) {
        toast.success("Saved Successfully");
        handleModal();
        autoRefresh();
      } else {
        toast.error("Save Error", res);
      }
    });
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? "Edit" : "Add"} A Quote
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Quote information
                </h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-title"
                        >
                          Quote Title
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-title"
                          required={true}
                          placeholder="Quote Title"
                          type="text"
                          value={quote.title}
                          name="title"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-qnumber"
                        >
                          Quote Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-qnumber"
                          placeholder="Quote Number"
                          type="number"
                          value={quote.quoteNumber}
                          name="quoteNumber"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Select Client
                        </Label>
                        {clients && (
                          <Select
                            onChange={handleClientChange}
                            name="client"
                            hideSelectedOptions
                            className="form-control-alternative"
                            defaultValue={
                              quote?.client && {
                                value: quote.client?._id,
                                label: `${quote.client?.first_name} ${quote.client?.last_name}`,
                              }
                            }
                            options={clients.map((client) => ({
                              value: client._id,
                              label: `${client.first_name} ${client.last_name}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Select Passengers
                        </Label>
                        {passengers && (
                          <Select
                            onChange={handlePassengerChange}
                            isMulti
                            hideSelectedOptions
                            defaultValue={quote.passengers.map((passenger) => ({
                              value: passenger._id,
                              label: `${passenger.first_name} ${passenger.last_name}`,
                            }))}
                            name="passengers"
                            className="form-control-alternative"
                            options={passengers.map((passenger) => ({
                              value: passenger._id,
                              label: `${passenger.first_name} ${passenger.last_name}`,
                            }))}
                          />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Status
                        </Label>
                        <Input
                          id="exampleSelect"
                          placeholder="status"
                          name="status"
                          className="form-control-alternative"
                          type="select"
                          value={quote.status}
                          onChange={handleInputChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          Issue Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="date"
                          value={quote.issueDate?.split("T")[0]}
                          name="issueDate"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr className="my-4" />
                </div>
                <h6 className="heading-small text-muted mb-4">
                  Trip information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          No. of Trips
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="Total Trips"
                          type="number"
                          value={quote.totalTrips}
                          name="totalTrips"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          Total Price
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="Total Trips"
                          type="text"
                          value={quote.totalPrice}
                          name="totalPrice"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          VAT
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="VAT"
                          type="text"
                          value={quote.vat}
                          name="vat"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          Start Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="date"
                          value={quote.startDate?.split("T")[0]}
                          name="startDate"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>{" "}
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          End Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="date"
                          value={quote.endDate?.split("T")[0]}
                          name="endDate"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <AddressInput
                          label="Start Address"
                          address={startAddress}
                          setAddress={setStartAddress}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <AddressInput
                          label="End Address"
                          address={endAddress}
                          setAddress={setEndAddress}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          Docusign Link
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="DocuSign link (https://www.docusign.net/MEMBER/PowerFormSigning.aspx?PowerFormId=123e332) "
                          type="text"
                          value={quote.docuSignLink}
                          name="docuSignLink"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Save
          </Button>
          {isEditing && (
            <Button color="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}{" "}
          <Button onClick={handleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default QuotesForm;
