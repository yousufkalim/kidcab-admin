import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import Select from "react-select";
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

// core components

const InvoiceForm = ({
  openModal,
  handleModal,
  editUser,
  isEditing,
  autoRefresh,
}) => {
  const [user, setUser] = useState({
    invoice_title: "",
    issue_date: "",
    total_price: "",
    status: "pending",
    comments: "",
    client: "",
    startDate: "",
    endDate: "",
  });

  const [users, setUsers] = useState([]);
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
  useEffect(() => {
    api("get", "users").then((res) => {
      setUsers(res.data.users);
    });

    if (isEditing) {
      setUser({
        invoice_title: editUser?.invoice_title,
        issue_date: editUser?.issue_date,
        total_price: editUser?.total_price,
        status: editUser?.status,
        client: editUser?.client,
        comments: editUser?.comments,
        startDate: editUser?.trip_info?.start_date,
        endDate: editUser?.trip_info?.end_date,
      });
      setStartAddress(editUser?.trip_info?.start_address);
      setEndAddress(editUser?.trip_info?.end_address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setUser({ ...user, client: e.value });
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "invoices";
    if (editUser) {
      method = "delete";
      uri = uri + `/${editUser._id}`;
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
    let uri = "invoices";
    const tripInfo = {
      start_date: user.startDate,
      end_date: user.endDate,
      start_address: startAddress,
      end_address: endAddress,
    };
    const formData = {};
    formData["invoice_title"] = user?.invoice_title;
    formData["issue_date"] = user?.issue_date;
    formData["total_price"] = user?.total_price;
    formData["status"] = user?.status;
    formData["client"] = user?.client;
    formData["comments"] = user?.comments;
    formData["trip_info"] = JSON.stringify(tripInfo);

    if (
      startAddress.lat == endAddress.lat &&
      startAddress.lng == endAddress.lng
    ) {
      return toast.error("Start and end address cant be same");
    }
    if (editUser) {
      method = "put";
      uri = uri + `/${editUser._id}`;
    }
    api(method, uri, formData).then(async(res) => {
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
    let uri = "invoices";
    if (user.client._id) {
      user["client"] = user.client._id;
    }
    user["issue_date"] = moment(user.issue_date).format("YYYY-MM-DD");
    api(method, uri, user).then((res) => {
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
      {console.log(user, "user")}
      {console.log("user", user)}
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? "Edit" : "Add"} Invoice
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Invoice information
                </h6>

                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
                          <span style={{ color: "red" }}>
                            {user?.invoice_title ? "" : "*"}
                          </span>{" "}
                          Invoice Title
                        </label>
                        <Input
                          className="form-control"
                          id="input-fname"
                          required={true}
                          placeholder="Enter Invoice Title"
                          type="text"
                          value={user.invoice_title}
                          name="invoice_title"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          <span style={{ color: "red" }}>
                            {user?.issue_date ? "" : "*"}
                          </span>{" "}
                          Issue Date
                        </label>
                        <Input
                          className="form-control"
                          id="input-lname"
                          type="date"
                          value={user?.issue_date?.split("T")[0]}
                          name="issue_date"
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
                          Select Client
                        </Label>
                        {users && (
                          <Select
                            onChange={handleUserChange}
                            name="user"
                            hideSelectedOptions
                            defaultValue={
                              editUser && {
                                value: user?.client?._id,
                                label: `${
                                  user?.client?.first_name +
                                  " " +
                                  user?.client?.last_name
                                }`,
                              }
                            }
                            className="form-control-alternative"
                            options={users.map((user) => ({
                              value: user._id,
                              label: `${
                                user?.first_name + " " + user?.last_name
                              }`,
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
                            {user.status ? "" : "*"}
                          </span>{" "}
                          Status
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="status"
                          value={user.status}
                          onChange={handleInputChange}
                          className="form-control"
                          type="select"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="late">Late</option>
                          <option value="cancelled">Cancelled</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          <span style={{ color: "red" }}>
                            {user?.total_price ? "" : "*"}
                          </span>{" "}
                          Total Price
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="total_price"
                          className="form-control"
                          placeholder="Enter Total Price"
                          type="number"
                          value={user?.total_price}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Trip information
                  </h6>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          <span style={{ color: "red" }}>
                            {user.startDate ? "" : "*"}
                          </span>{" "}
                          Start Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="date"
                          value={user.startDate?.split("T")[0]}
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
                            {user.endDate ? "" : "*"}
                          </span>{" "}
                          End Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Quote Number"
                          type="date"
                          value={user.endDate?.split("T")[0]}
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
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Comment
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="comments"
                          className="form-control"
                          placeholder="Enter comment here"
                          type="textarea"
                          value={user?.comments}
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
          </Button>{" "}
          {isEditing && (
            <>
              <Button color="primary" onClick={handleDuplicate}>
                Duplicate
              </Button>
              <Button color="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}{" "}
          <Button onClick={handleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default InvoiceForm;
