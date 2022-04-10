import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import Select from "react-select";
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
import View from "../../components/view";
import FilePicker from "../../components/Form/FilePicker";

// core components
let current = moment();

const VehicleForm = ({
  openModal,
  handleModal,
  editUser: editVehicle,
  isEditing,
  autoRefresh,
}) => {
  const [drivers, setDrivers] = useState([]);
  const [vehicle, setVehicle] = useState({
    vehicle_name: "",
    number_plate: "",
    insurance_certificate: "",
    insurance_expiry_date: "",
    brand: "",
    model: "",
    color: "",
    engine_type: "",
    inspection_date: "",
    graycard: "",
    graycard_expiry_date: "",
    driver: "",
    registration_card: "",
  });
  const [docs, setDocs] = useState({});

  useEffect(() => {
    api("get", "drivers").then((res) => setDrivers(res.data.drivers));
    if (isEditing) {
      setVehicle({
        vehicle_name: editVehicle.vehicle_name,
        brand: editVehicle.brand,
        model: editVehicle.model,
        color: editVehicle.color,
        engine_type: editVehicle.engine_type,
        inspection_date: editVehicle.inspection_date,
        graycard: editVehicle.graycard,
        graycard_expiry_date: editVehicle?.graycard_expiry_date,
        driver: editVehicle.driver,
        inspection_expiry_date: editVehicle.inspection_expiry_date,
        insurance_certificate: editVehicle.insurance_certificate,
        insurance_expiry_date: editVehicle.insurance_expiry_date,
        registration_card: editVehicle.registration_card,
      });
      setDocs({
        graycard: editVehicle.graycard,
        insurance_certificate: editVehicle.insurance_certificate,
        registration_card: editVehicle.registration_card,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleFileChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleDriverChange = (e) => {
    setVehicle((vehicle) => ({ ...vehicle, driver: e.value }));
  };

  const handleDelete = () => {
    let method = "delete";
    let uri = "vehicles";
    if (editVehicle) {
      method = "delete";
      uri = uri + `/${editVehicle._id}`;
    }
    api(method, uri)
      .then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.status == 200) {
          toast.success("Delete Successfully");
          handleModal();
          autoRefresh();
        } else {
          console.log("error");
          toast.error(res.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let method = "post";
    let uri = "vehicles";
    let d = new Date();
    if (vehicle.vehicle_name == "") {
      return toast.error("Please enter vehicle name");
    }
    if (vehicle.brand == "") {
      return toast.error("Please enter brand name");
    }
    if (vehicle.model == "") {
      return toast.error("Please enter your car model");
    }
    if (vehicle.driver == "") {
      return toast.error("Please enter driver name");
    }
    if (vehicle.color == "") {
      return toast.error("Please enter your car color");
    }
    if (vehicle.engine_type == "") {
      return toast.error("Please enter your engine type");
    }
    if (vehicle.inspection_date == "") {
      return toast.error("Please enter Last inspection_date");
    }
    if (vehicle.insurance_certificate == "") {
      return toast.error("Please enter your vehicle's insurance card");
    }
    if (vehicle.insurance_expiry_date == "") {
      return toast.error("Please enter a valid insurance date");
    }

    const formData = new FormData();

    formData.append("vehicle_name", vehicle.vehicle_name);
    formData.append("brand", vehicle.brand);
    formData.append("model", vehicle.model);
    formData.append("color", vehicle.color);
    formData.append("engine_type", vehicle.engine_type);
    formData.append("inspection_date", vehicle.inspection_date);
    formData.append("driver", JSON.stringify(vehicle.driver));

    if (vehicle.insurance_certificate) {
      formData.append("insurance_certificate", vehicle.insurance_certificate);
      formData.append("insurance_expiry_date", vehicle.insurance_expiry_date);
    }

    if (vehicle.graycard) {
      formData.append("graycard", vehicle.graycard);
      formData.append("graycard_expiry_date", vehicle.graycard_expiry_date);
    }

    if (vehicle.registration_card) {
      formData.append("registration_card", vehicle.registration_card);
    }
    if (editVehicle) {
      method = "put";
      uri = uri + `/${editVehicle._id}`;
    }

    api(method, uri, formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Saved Successfully");
          handleModal();
          autoRefresh();
        } else {
          toast.error("Save Error", res);
        }
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <>
      <Modal isOpen={openModal} size="xl" centered>
        <ModalHeader charCode="X" toggle={handleModal}>
          {isEditing ? "Edit" : "Add"} Vehicle
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  Vehicle information
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
                            {vehicle.vehicle_name ? "" : "*"}
                          </span>{" "}
                          Vehicle Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-fname"
                          required={true}
                          placeholder="Vehicle Name"
                          type="text"
                          value={vehicle.vehicle_name}
                          name="vehicle_name"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          <span style={{ color: "red" }}>
                            {vehicle.brand ? "" : "*"}
                          </span>{" "}
                          Brand
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="brand"
                          value={vehicle.brand}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder="Enter Vehicle Brand"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          <span style={{ color: "red" }}>
                            {vehicle.model ? "" : "*"}
                          </span>{" "}
                          Model
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="model"
                          value={vehicle.model}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder="Enter Vehicle Model"
                          type="text"
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
                          <span style={{ color: "red" }}>
                            {vehicle.driver ? "" : "*"}
                          </span>{" "}
                          Select Driver
                        </Label>
                        {drivers && (
                          <Select
                            onChange={handleDriverChange}
                            name="client"
                            hideSelectedOptions
                            defaultValue={
                              vehicle?.driver && {
                                value: vehicle?.driver?._id,
                                label: `${vehicle?.driver?.first_name} ${vehicle?.driver?.last_name}`,
                              }
                            }
                            className="form-control-alternative"
                            options={drivers.map((driver) => ({
                              value: driver._id,
                              label: `${driver.first_name} ${driver.last_name}`,
                            }))}
                          />
                        )}
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
                            {vehicle.color ? "" : "*"}
                          </span>{" "}
                          Color
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="color"
                          value={vehicle.color}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder="Enter Vehicle Color"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          <span style={{ color: "red" }}>
                            {vehicle.inspection_date ? "" : "*"}
                          </span>{" "}
                          Last technical inspection
                        </Label>
                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          name="inspection_date"
                          required={true}
                          placeholder="Enter last technical inspection date"
                          value={vehicle?.inspection_date?.split("T")[0]}
                          onChange={handleInputChange}
                          type="date"
                          max={moment(current).format("YYYY-MM-DD")}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          <span style={{ color: "red" }}>
                            {vehicle.engine_type ? "" : "*"}
                          </span>{" "}
                          Number Plate
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="engine_type"
                          value={vehicle.engine_type}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder="Enter Vehicle Engine Type"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          Add Gray Card <View url={docs?.graycard} />
                        </label>
                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-graycard"
                          InputClassName="form-control-file form"
                          InputId="input-graycard"
                          InputName="graycard"
                          value={
                            editVehicle?.graycard
                              ? editVehicle?.graycard
                              : vehicle?.graycard
                          }
                          onChange={handleFileChange}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-date"
                        >
                          {/* <span style={{ color: "red" }}>
                            {vehicle.inspection_expiry_date ? "" : "*"}
                          </span>{" "} */}
                          Gray Valid Till
                        </label>

                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder="Enter validity date"
                          type="date"
                          value={vehicle?.graycard_expiry_date?.split("T")[0]}
                          name="graycard_expiry_date"
                          onChange={handleInputChange}
                          min={moment(current).format("YYYY-MM-DD")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          <span style={{ color: "red" }}>
                            {vehicle.insurance_certificate ? "" : "*"}
                          </span>{" "}
                          Add vehicle Insurance Certificate{" "}
                          <View url={docs.insurance_certificate} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-vehicle-insurance"
                          InputClassName="form-control-file form"
                          InputId="input-vehicle-insurance"
                          InputName="insurance_certificate"
                          value={
                            editVehicle?.insurance_certificate
                              ? editVehicle?.insurance_certificate
                              : vehicle?.insurance_certificate
                          }
                          onChange={handleFileChange}
                        ></FilePicker>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-date"
                        >
                          <span style={{ color: "red" }}>
                            {vehicle.insurance_expiry_date ? "" : "*"}
                          </span>{" "}
                          Insurance Valid Till
                        </label>

                        <Input
                          className="form-control-alternative"
                          id="input-date"
                          required={true}
                          placeholder="Enter validity date"
                          type="date"
                          value={vehicle?.insurance_expiry_date?.split("T")[0]}
                          name="insurance_expiry_date"
                          onChange={handleInputChange}
                          min={moment(current).format("YYYY-MM-DD")}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          Add Registration Card{" "}
                          <View url={docs?.registration_card} />
                        </label>

                        <FilePicker
                          lableClassName="form-control-label"
                          htmlFor="input-number-plate"
                          InputClassName="form-control-file form"
                          InputId="input-number-plate"
                          InputName="registration_card"
                          value={
                            editVehicle?.registration_card
                              ? editVehicle?.registration_card
                              : vehicle?.registration_card
                          }
                          onChange={handleFileChange}
                        ></FilePicker>
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

export default VehicleForm;
