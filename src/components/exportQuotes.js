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
export const ExportQuotes = () => {
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
      "Status",
      "Client",
      "No of Passengers",
      "No of Trips",
      "Start date",
      "End date",
    ];

    const ws = XLSX.utils.json_to_sheet(csvData, { header: myHeader });

    const wb = { Sheets: { quotes: ws }, SheetNames: ["quotes"] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const e_data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(e_data, fileName + fileExtension);
  };
  //pdf export

  const handleSubmitPdf = () => {
    const tableColumn = [
      "Quote Title",
      "Status",
      "Client",
      "Passengers",
      "Trips",
      "Start_date",
      "End_date",
    ];
    const tableRows = [];

    api("get", "quotes").then((res) => {
      let updatedQuotes = res.data.quotes.map((item) => {
        return {
          Quote_Title: item.quote_title,
          Status: item.status,
          Client: item.client.first_name,
          Passengers: item.passengers.length,
          Trips: item.trip_info?.total_trips,
          Start_date: item.trip_info?.start_date,
          End_date: item.trip_info?.end_date,
        };
      });

      updatedQuotes?.forEach((quote) => {
        const quoteData = [
          quote.Quote_Title,
          quote.Status,
          quote.Client,
          quote.Passengers,
          quote.Trips,
          quote.Start_date,
          quote.End_date,
        ];

        tableRows.push(quoteData);
      });

      const doc = new jsPDF();

      doc.autoTable(tableColumn, tableRows, {
        startY: 54,
        theme: "grid",
        styles: {
          halign: "center",
        },
      });

      doc.save("Quotes.pdf");
    });
  };

  // Fexporting excel
  const handleSubmitExcel = () => {
    api("get", "quotes").then((res) => {
      let updatedQuotes = res.data.quotes.map((item) => {
        return {
          "Quote Title": item.quote_title,
          Status: item.status,
          Client: item.client.first_name,
          "No of Passengers": item.passengers.length,
          "No of Trips": item.trip_info?.total_trips,
          "Start date": item.trip_info?.start_date,
          "End date": item.trip_info?.end_date,
        };
      });

      exportToCSV(updatedQuotes, " Quotes");
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
            handleSubmitExcel();
          }}
        >
          Excel
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
