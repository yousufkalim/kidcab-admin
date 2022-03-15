import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useState } from "react";
import api from "../api/index";
import "jspdf-autotable";
import { toast } from "react-toastify";

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

  const handleExportPdf = async () => {
    let filteredQuotes = {};

    let quoteIds = quotes.map((quote) => {
      if (!filteredQuotes[quote.client._id]) {
        filteredQuotes[quote.client._id] = [];
      } else {
        filteredQuotes[quote.client._id].push(quote);
      }
      return quote._id;
    });

    if (Object.keys(filteredQuotes).length === 1) {
      let method = "post";
      let uri = "quotes/export_pdf";

      await api(method, uri, { quotes: quoteIds }).then((res) => {
        res.data.files.map((file) => {
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
        });
      });
    } else {
      toast.warning("Can only export Quotes of a single client only!");
    }
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
            handleExportPdf();
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
