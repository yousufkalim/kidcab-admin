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
import moment from "moment";
import { useTranslation } from "react-i18next";

// core components
import Select from "react-select";
const QuotesForm = ({
  openModal,
  handleModal,
  editQuote,
  isEditing,
  autoRefresh,
}) => {
  const { t, i18n } = useTranslation();
  const [quote, setQuote] = useState({
    title: "",
    quoteNumber: "",
    client: "",
    status: "pending",
    issueDate: "",
    totalTrips: "",
    unitPrice: "",
    totalPrice: "",
    vat: "",
    startDate: "",
    endDate: "",
    docuSignLink: "",
    comment: "",
    description: "",
  });
  let [startAddress, setStartAddress] = useState({
    lat: "",
    lng: "",
    label: "",
    label2: "",
    city: "",
    postal_code: "",
  });
  let [endAddress, setEndAddress] = useState({
    lat: "",
    lng: "",
    label: "",
    label2: "",
    city: "",
    postal_code: "",
  });

  const [clients, setClients] = useState();
  useEffect(() => {
    api("get", "users").then((res) => setClients(res.data.users));
    if (isEditing) {
      setQuote({
        title: editQuote.quote_title,
        quoteNumber: editQuote.quote_number,
        client: editQuote.client,
        status: editQuote.status,
        issueDate: editQuote.issue_date,
        totalTrips: editQuote.trip_info.total_trips,
        totalPrice: editQuote.total_price,
        unitPrice: editQuote.trip_info.unit_price,
        vat: editQuote.vat,
        startDate: editQuote.trip_info.start_date,
        endDate: editQuote.trip_info.end_date,
        docuSignLink: editQuote.docu_sign_link,
        comment: editQuote?.comment,
      });

      setStartAddress(editQuote.trip_info.start_address);
      setEndAddress(editQuote.trip_info.end_address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    if (e.target.name === "totalTrips") {
      if (parseInt(e.target.value) < 1) {
        return toast.error("Trips should be greater than 1");
      }
      if (isEditing) {
        let UnitPrice =
          (parseInt(quote?.totalPrice) - parseInt(quote?.vat)) /
          parseInt(e.target.value);
        setQuote((quote) => ({
          ...quote,
          [e.target.name]: e.target.value,
          unitPrice: UnitPrice,
        }));
        return;
      }
    }
    if (e.target.name == "totalPrice") {
      let vat = parseInt(e.target.value) * 0.16667;
      let unitPrice =
        (parseInt(e.target.value) - parseInt(vat)) / parseInt(quote.totalTrips);
      setQuote((quote) => ({
        ...quote,
        [e.target.name]: e.target.value,
        vat: vat,
        unitPrice: unitPrice,
      }));
    }
    setQuote((quote) => ({ ...quote, [e.target.name]: e.target.value }));
  };

  const handleClientChange = (e) => {
    setQuote((quote) => ({ ...quote, client: e.value }));
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
    if (new Date(quote?.endDate) < new Date(quote?.startDate)) {
      return toast.error("end date must be greater than start date");
    }
    if (
      quote?.endDate == null ||
      quote?.endDate == " " ||
      quote?.startDate == null ||
      quote?.startDate == " "
    ) {
      return toast.error("Dates are mandatory");
    }
    let method = "post";
    let uri = "quotes";
    const tripInfo = {
      total_trips: quote.totalTrips,
      start_date: quote.startDate,
      end_date: quote.endDate,
      start_address: startAddress,
      end_address: endAddress,
      unit_price: quote.unitPrice,
    };
    const formData = {};
    formData["quote_title"] = quote.title;
    formData["client"] = quote.client;
    formData["comment"] = quote.comment;
    formData["description"] = quote.description;
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
    if (quote.status == "") {
      return toast.error("Please enter quote status");
    }
    if (quote.issueDate == "") {
      return toast.error("Please enter issue date");
    }
    if (tripInfo.total_trips == "") {
      return toast.error("Please enter total number of trips");
    }
    if (quote.unitPrice == "") {
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
    if (tripInfo.start_address.lat == "") {
      return toast.error("Please enter start address");
    }
    if (tripInfo.end_address.lat == "") {
      return toast.error("Please enter end address");
    }
    if (
      startAddress.lat == endAddress.lat &&
      startAddress.lng == endAddress.lng &&
      startAddress.PostalCode == endAddress.PostalCode &&
      startAddress.city == endAddress.city
    ) {
      return toast.error("Start and end address cant be same");
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
  const handleDuplicate = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "quotes";
    const tripInfo = {
      total_trips: quote.totalTrips,
      start_date: quote.startDate,
      end_date: quote.endDate,
      start_address: startAddress,
      end_address: endAddress,
      unit_price: quote.unitPrice,
    };

    const formData = {};
    formData["quote_title"] = quote.title;
    formData["client"] = quote.client._id ? quote.client._id : quote.client;
    formData["comment"] = quote.comment ? quote.comment : "";
    formData["description"] = quote.description ? quote.description : "";
    formData["quote_number"] = quote.quoteNumber;
    formData["issue_date"] = moment(quote.issueDate).format("YYYY-MM-DD");
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
    if (quote.status == "") {
      return toast.error("Please enter quote status");
    }
    if (quote.issueDate == "") {
      return toast.error("Please enter issue date");
    }
    if (tripInfo.total_trips == "") {
      return toast.error("Please enter total number of trips");
    }
    if (parseInt(tripInfo.total_trips) < 1) {
      return toast.error("Please enter valid total number of trips");
    }
    if (parseInt(quote.totalPrice) == "") {
      return toast.error("Please enter Amount with tax");
    }
    if (parseInt(quote.totalPrice) < 1) {
      return toast.error("Please enter valid Amount with tax");
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
    if (tripInfo.start_address.lat == "") {
      return toast.error("Please enter start address");
    }
    if (tripInfo.end_address.lat == "") {
      return toast.error("Please enter end address");
    }
    if (
      startAddress.lat == endAddress.lat &&
      startAddress.lng == endAddress.lng &&
      startAddress.PostalCode == endAddress.PostalCode &&
      startAddress.city == endAddress.city
    ) {
      return toast.error("Start and end address cant be same");
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
          {isEditing ? "Edit" : "Add"} {t("A Quote")}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  {t("Quote information")}
                </h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-title"
                        >
                          <span style={{ color: "red" }}>
                            {quote.title ? "" : "*"}
                          </span>{" "}
                          {t("Quote Title")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-title"
                          required={true}
                          placeholder={t("Quote Title")}
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
                          <span style={{ color: "red" }}>
                            {quote.quoteNumber ? "" : "*"}
                          </span>{" "}
                          {t("Quote Number")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-qnumber"
                          placeholder={t("Quote Number")}
                          type="number"
                          value={quote.quoteNumber}
                          name="quoteNumber"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          <span style={{ color: "red" }}>
                            {quote.client ? "" : "*"}
                          </span>{" "}
                          {t("Select Client")}
                        </Label>
                        {clients && (
                          <Select
                          placeholder={t("Select...")}
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
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          <span style={{ color: "red" }}>
                            {quote.status ? "" : "*"}
                          </span>{" "}
                          {t("Status")}
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
                          <option value="pending">{t("Pending")}</option>
                          <option value="accepted">{t("Accepted")}</option>
                          <option value="rejected">{t("Rejected")}</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          <span style={{ color: "red" }}>
                            {quote.issueDate ? "" : "*"}
                          </span>{" "}
                          {t("Issue Date")}
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
                  {t("Trip information")}
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          <span style={{ color: "red" }}>
                            {quote.totalTrips ? "" : "*"}
                          </span>{" "}
                          {t("No. of Trips")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder={t("Total Trips")}
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
                          <span style={{ color: "red" }}>
                            {quote.totalPrice ? "" : "*"}
                          </span>{" "}
                          {t("Amount including Vat")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder={t("Total Price")}
                          type="text"
                          disabled={!quote?.totalTrips}
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
                          <span style={{ color: "red" }}>
                            {quote.vat ? "" : "*"}
                          </span>{" "}
                          {t("Total Taxes")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder={t("VAT")}
                          type="text"
                          readOnly
                          value={parseInt(quote.vat).toFixed(2)}
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
                          <span style={{ color: "red" }}>
                            {quote.startDate ? "" : "*"}
                          </span>{" "}
                          {t("Start Date")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder={t("Quote Number")}
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
                          <span style={{ color: "red" }}>
                            {quote.endDate ? "" : "*"}
                          </span>{" "}
                          {t("End Date")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder={t("Quote Number")}
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
                          {t("Docusign Link")}
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
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          {t("Trip Description")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder={t("Add Description")}
                          type="textarea"
                          value={quote.description}
                          name="description"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          {t("Add comment")}
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder={t("Add Comment")}
                          type="textarea"
                          value={quote.comment}
                          name="comment"
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
            {t("Save")}
          </Button>
          {isEditing && (
            <>
              <Button color="primary" onClick={handleDuplicate}>
                {t("Duplicate")}
              </Button>
              <Button color="danger" onClick={handleDelete}>
                {t("Delete")}
              </Button>
            </>
          )}{" "}
          <Button onClick={handleModal}>{t("Cancel")}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default QuotesForm;
