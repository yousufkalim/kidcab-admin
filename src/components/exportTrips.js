import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useState } from "react";
import api from "../api/index";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";

// Component
export const ExportTrips = ({ dropDownItem, trips }) => {
  const [exportItem, setExportItem] = useState("");

  // File Type
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  const myHeader = [
    "Trip Date",
    "Trip Status",
    "Clients",
    "Passengers",
    "Invited Drivers",
    "Assigned Drivers",
    "Start Address",
    "End Address",
  ];
  // Extension
  const fileExtension = ".xlsx";

  // Exporting
  const exportToCSV = (csvData, fileName) => {
    // Sorting

    const ws = XLSX.utils.json_to_sheet(csvData, { header: myHeader });

    const wb = { Sheets: { trips: ws }, SheetNames: ["trips"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const e_data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(e_data, fileName + fileExtension);
  };

  //exporting pdf
  const handleSubmitPdf = async () => {
    let tableRows;

    if (trips.length > 0) {
      tableRows = trips.map((item) => {
        return [
          new Date(item.date).toLocaleDateString(),
          item.status,
          item.client.first_name + " " + item.client.last_name,
          item.quote.passengers.length,
          item.invited_drivers.length,
          item.assigned_drivers.length,
          item.start_address.label,
          item.end_address.label,
        ];
      });
    } else {
      const res = await api("get", `trips/status/${dropDownItem}`);
      tableRows = res.data?.trips?.map((item) => {
        return [
          new Date(item.date).toLocaleDateString(),
          item.status,
          item.client.first_name + " " + item.client.last_name,
          item.quote.passengers.length,
          item.invited_drivers.length,
          item.assigned_drivers.length,
          item.start_address.label,
          item.end_address.label,
        ];
      });
    }

    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.autoTable(myHeader, tableRows, {
      startY: 54,
      theme: "grid",
      styles: {
        align: "center",
      },
    });

    doc.save("trips.pdf");
  };

  // exporting excel
  const handleSubmitExcel = async (dropDownItem) => {
    let updatedTrips;
    if (trips.length > 0) {
      updatedTrips = trips.map((item) => {
        return {
          "Trip Date": new Date(item.date).toLocaleDateString(),
          "Trip Status": item.status,
          Clients: item.client.first_name + " " + item.client.last_name,
          Passengers: item.quote.passengers.length,
          "Invited Drivers": item.invited_drivers.length,
          "Assigned Drivers": item.assigned_drivers.length,
          "Start Address": item.start_address.label,
          "End Address": item.end_address.label,
        };
      });
    } else {
      const res = await api("get", `trips/status/${dropDownItem}`);
      updatedTrips = res.data.trips.map((item) => {
        return {
          "Trip Date": new Date(item.date).toLocaleDateString(),
          "Trip Status": item.status,
          Clients: item.client.first_name + " " + item.client.last_name,
          Passengers: item.quote.passengers.length,
          "Invited Drivers": item.invited_drivers.length,
          "Assigned Drivers": item.assigned_drivers.length,
          "Start Address": item.start_address.label,
          "End Address": item.end_address.label,
        };
      });
    }

    exportToCSV(updatedTrips, " trips");
  };

  // Render
  return (
    <UncontrolledDropdown>
      <DropdownToggle
        color="success"
        name
        href="#pablo"
        role="button"
        e-caret-hide
        style={{ textTransform: "capitalize" }}
      >
        <i className="ni ni-collection"></i> Export&nbsp;
        {exportItem}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          name="pdf"
          onClick={(e) => {
            setExportItem(e.target.name);
            handleSubmitPdf();
          }}
        >
          PDF
        </DropdownItem>
        <DropdownItem
          name="excel"
          onClick={(e) => {
            setExportItem(e.target.name);
            handleSubmitExcel(dropDownItem);
          }}
        >
          Excel
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
