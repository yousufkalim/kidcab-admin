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
// core components

const VehicleForm = ({
  openModal,
  handleModal,
  editUser: editVehicle,
  isEditing,
  autoRefresh
}) => {
  const [drivers, setDrivers] = useState();
  const [vehicle, setVehicle] = useState({
    vehicle_name: "",
    number_plate: "",
    brand: "",
    model: "",
    color: "",
    engine_type: "",
    gray_card: "",
    inspection_info: "",
    driver: "",
  });

  useEffect(() => {
    api("get", "drivers").then((res) => setDrivers(res.data.drivers));
    if (isEditing) {
      setVehicle({
        vehicle_name: editVehicle.vehicle_name,
        number_plate: editVehicle.number_plate,
        brand: editVehicle.brand,
        model: editVehicle.model,
        color: editVehicle.color,
        engine_type: editVehicle.engine_type,
        gray_card: editVehicle.gray_card,
        inspection_info: editVehicle.inspection_info,
        driver: editVehicle.driver,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          autoRefresh()
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

    if (editVehicle) {
      method = "put";
      uri = uri + `/${editVehicle._id}`;
    }
    api(method, uri, vehicle)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Saved Successfully");
          handleModal();
          autoRefresh()
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
          Add Vehicle
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
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-fname"
                        >
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
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-lname"
                        >
                          Registration Number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-lname"
                          placeholder="Registration Number"
                          type="text"
                          value={vehicle.number_plate}
                          name="number_plate"
                          onChange={handleInputChange}
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
                          Select Driver
                        </Label>
                        {drivers && (
                          <Select
                            onChange={handleDriverChange}
                            name="client"
                            hideSelectedOptions
                            defaultValue={{
                              value: drivers && drivers[0]?._id,
                              label: `${drivers[0]?.first_name} ${drivers[0]?.last_name}`,
                            }}
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
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
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
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Engine Type
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
                    <Col lg="4">
                      <FormGroup>
                        <Label
                          for="exampleSelect"
                          className="form-control-label"
                        >
                          Gray Card
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="gray_card"
                          value={vehicle.gray_card}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder="Enter Vehicle Gray Card Information"
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
                          Inspection Information
                        </Label>
                        <Input
                          id="exampleSelect"
                          name="inspection_info"
                          value={vehicle.inspection_info}
                          onChange={handleInputChange}
                          className="form-control-alternative"
                          placeholder="Enter Vehicle Inspection Information"
                          type="text"
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
