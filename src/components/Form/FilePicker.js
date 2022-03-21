import { useState } from "react";
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

function FilePicker(props) {
  return (
    <>
      <label
        className={props.lableClassName}
        htmlFor={props.htmlFor}
        style={{
          width: "80%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "30%",
            padding: "10px",
            boxShadow: "0 1px 3px rgb(50 50 93 / 15%), 0 1px 0 rgb(0 0 0 / 2%)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i class="fas fa-upload" style={{ marginRight: "10px" }}></i>
            <> Add File</>
          </div>
        </div>
        <div
          style={{
            width: "70%",
            padding: "10px",
            boxShadow: "0 1px 3px rgb(50 50 93 / 15%), 0 1px 0 rgb(0 0 0 / 2%)",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            {props.value
              ? props.value.name
                ? props.value.name
                : props.value.split("---")[1]
              : "No File Added"}
          </div>
        </div>
      </label>
      <Input
        className={props.InputClassName}
        id={props.InputId}
        name={props.InputName}
        type="file"
        onChange={props.onChange}
        hidden
      />
    </>
  );
}

export default FilePicker;
