import React from "react";
import InvoiceList from "./InvoiceList";
import InvoiceHeader from "./InvoiceHeader";

const Invoices = () => {
  return (
    <div>
      <InvoiceHeader />
      <InvoiceList />
    </div>
  );
};

export default Invoices;
