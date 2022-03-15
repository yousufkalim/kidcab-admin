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
import { toast } from "react-toastify";

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

  const handleExportPdf = async () => {
    let filteredInvoices = {};

    let invoiceIds = invoices.map((invoice) => {
      if (!filteredInvoices[invoice.client._id]) {
        filteredInvoices[invoice.client._id] = [];
      } else {
        filteredInvoices[invoice.client._id].push(invoice);
      }
      return invoice._id;
    });

    if (Object.keys(filteredInvoices).length === 1) {
      let method = "post";
      let uri = "invoices/export_pdf";

      await api(method, uri, { invoices: invoiceIds }).then((res) => {
        res.data.files.map(async (file) => {
          let filename = file.split("/").pop();

          // Code to download a pdf from URL
          const req = new XMLHttpRequest();
          req.open("GET", file, true);
          req.responseType = "blob";
          req.onload = function () {
            const blob = new Blob([req.response], {
              type: "application/pdf",
            });

            const isIE = false || !!document.documentMode;
            if (isIE) {
              window.navigator.msSaveBlob(blob, filename);
            } else {
              const windowUrl = window.URL || window.webkitURL;
              const href = windowUrl.createObjectURL(blob);
              const a = document.createElement("a");
              a.setAttribute("download", filename);
              a.setAttribute("href", href);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          };
          req.send();
          await api("delete", "invoices/pdf", { data: { file: filename } });
        });
      });
    } else {
      toast.warning("Ne peut exporter que les factures d'un seul client!");
    }
  };

  // exporting excel
  const handleSubmitExcel = async (dropDownItem) => {
    let updatedInvoices;
    if (invoices.length > 0) {
      updatedInvoices = invoices.map((item) => {
        return {
          "Invoice Title": item.invoice_title,
          "Issue Date": new Date(item.issue_date).toLocaleString(),
          Status: item.status,
          "Total price": item.total_price,
          Trip: item.trip.quote.quote_title,
        };
      });
    } else {
      const res = await api("get", `invoices/status/${dropDownItem}`);
      updatedInvoices = res.data.invoices.map((item) => {
        return {
          "Invoice Title": item.invoice_title,
          "Issue Date": new Date(item.issue_date).toLocaleString(),
          Status: item.status,
          "Total price": item.total_price,
          Trip: item.trip.quote.quote_title,
        };
      });
    }

    exportToCSV(updatedInvoices, " Invoices");
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
            handleExportPdf();
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
