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
export const ExportQuotes = ({ quotes }) => {
  const [exportItem, setExportItem] = useState("");

  // File Type
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  // Extension
  const fileExtension = ".xlsx";

  const myHeader = [
    "Quote Title",
    "Status",
    "Client",
    "No of Passengers",
    "No of Trips",
    "Start date",
    "End date",
  ];
  // Exporting
  const exportToCSV = (csvData, fileName) => {
    // Sorting

    const ws = XLSX.utils.json_to_sheet(csvData, { header: myHeader });

    const wb = { Sheets: { quotes: ws }, SheetNames: ["quotes"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const e_data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(e_data, fileName + fileExtension);
  };
  //pdf export

  const handleSubmitPdf = async () => {
    let tableRows;
    if (quotes.length > 0) {
      tableRows = quotes.map((item) => {
        return [
          item.quote_title,
          item.status,
          item.client.first_name,
          item.passengers.length,
          item.trip_info?.total_trips,
          new Date(item.trip_info?.start_date).toLocaleString(),
          new Date(item.trip_info?.end_date).toLocaleString(),
        ];
      });
    } else {
      const res = await api("get", "quotes");
      tableRows = res.data.quotes.map((item) => {
        return [
          item.quote_title,
          item.status,
          item.client.first_name,
          item.passengers.length,
          item.trip_info?.total_trips,
          new Date(item.trip_info?.start_date).toLocaleString(),
          new Date(item.trip_info?.end_date).toLocaleString(),
        ];
      });
    }

    const doc = new jsPDF();

    doc.autoTable(myHeader, tableRows, {
      startY: 54,
      theme: "grid",
      styles: {
        align: "center",
      },
    });

    doc.save("Quotes.pdf");
  };

  // Fexporting excel
  const handleSubmitExcel = async () => {
    let updatedQuotes;
    if (quotes.length > 0) {
      updatedQuotes = quotes.map((item) => {
        return {
          "Quote Title": item.quote_title,
          Status: item.status,
          Client: item.client.first_name,
          "No of Passengers": item.passengers.length,
          "No of Trips": item.trip_info?.total_trips,
          "Start date": new Date(item.trip_info?.start_date).toLocaleString(),
          "End date": new Date(item.trip_info?.end_date).toLocaleString(),
        };
      });
    } else {
      const res = await api("get", "quotes");
      updatedQuotes = res.data.quotes.map((item) => {
        return {
          "Quote Title": item.quote_title,
          Status: item.status,
          Client: item.client.first_name,
          "No of Passengers": item.passengers.length,
          "No of Trips": item.trip_info?.total_trips,
          "Start date": new Date(item.trip_info?.start_date).toLocaleString(),
          "End date": new Date(item.trip_info?.end_date).toLocaleString(),
        };
      });
    }

    exportToCSV(updatedQuotes, " Quotes");
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
            handleSubmitExcel();
          }}
        >
          Excel
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
