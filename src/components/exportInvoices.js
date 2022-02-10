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
export const ExportInvoices = ({ dropDownItem, invoices }) => {
  const [exportItem, setExportItem] = useState("");

  // File Type
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  const myHeader = [
    "Invoice Title",
    "Issue Date",
    "Status",
    "Total price",
    "Trip",
  ];
  // Extension
  const fileExtension = ".xlsx";

  // Exporting
  const exportToCSV = (csvData, fileName) => {
    // Sorting

    const ws = XLSX.utils.json_to_sheet(csvData, { header: myHeader });

    const wb = { Sheets: { invoices: ws }, SheetNames: ["invoices"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const e_data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(e_data, fileName + fileExtension);
  };

  //exporting pdf
  const handleSubmitPdf = async () => {
    let tableRows;

    if (invoices.length > 0) {
      tableRows = invoices.map((item) => {
        return [
          item.invoice_title,
          new Date(item.issue_date).toLocaleString(),
          item.status,
          item.total_price,
          item.trip.quote.quote_title,
        ];
      });
    } else {
      const res = await api("get", `invoices/status/${dropDownItem}`);
      tableRows = res.data?.invoices?.map((item) => {
        return [
          item.invoice_title,
          new Date(item.issue_date).toLocaleString(),
          item.status,
          item.total_price,
          item.trip.quote.quote_title,
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

    doc.save("Invoices.pdf");
  };

  // exporting excel
  const handleSubmitExcel = (dropDownItem) => {
    api("get", `invoices/status/${dropDownItem}`).then((res) => {
      let updatedInvoices = res.data.invoices.map((item) => {
        return {
          "Invoice Title": item.invoice_title,
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
