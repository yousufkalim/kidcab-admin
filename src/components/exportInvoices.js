import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useState } from "react";
import api from "../api/index";

import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";

// Component
export const ExportInvoices = ({ dropDownItem }) => {
  const [exportItem, setExportItem] = useState("");
  // File Type
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  // Extension
  const fileExtension = ".xlsx";

  // Exporting
  const exportToCSV = (csvData, fileName) => {
    // Sorting
    const myHeader = [
      "Quote Title",
      "Issue Date",
      "Status",
      "Total price",
      "Trip",
    ];

    const ws = XLSX.utils.json_to_sheet(csvData, { header: myHeader });

    const wb = { Sheets: { invoices: ws }, SheetNames: ["invoices"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const e_data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(e_data, fileName + fileExtension);
  };

  // Filtering invoices by input
  const handleSubmit = (dropDownItem) => {
    api("get", `invoices/status/${dropDownItem}`).then((res) => {
      let updatedInvoices = res.data.invoices.map((item) => {
        return {
          "Quote Title": item.invoice_title,
          "Issue Date": item.issue_date,
          Status: item.status,
          "Total price": item.total_price,
          Trip: item.trip.quote.quote_title,
        };
      });

      exportToCSV(updatedInvoices, " Invoices");
    });
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
            handleSubmit(dropDownItem);
          }}
        >
          PDF
        </DropdownItem>
        <DropdownItem
          name="excel"
          onClick={(e) => {
            setExportItem(e.target.name);
            handleSubmit(dropDownItem);
          }}
        >
          Excel
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
