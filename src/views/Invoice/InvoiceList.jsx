// reactstrap components

import {
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
} from "reactstrap";
import InvoiceForm from "./InvoiceForm";
import InvoiceRow from "./InvoiceRow";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/index";

const InvoiceList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [invoices, setInvoices] = useState();
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };
  const autoRefresh=()=>{ api("get", "invoices").then((res) => {
    setInvoices(res.data.invoices);
  });}
  useEffect(() => {
    autoRefresh()
  }, [openModal]);
  return (
    <>
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between ">
                  <h3 className="mb-0">Invoice List</h3>
                  <Button
                    color="primary"
                    href="#pablo"
                    onClick={handleModal}
                    size="md"
                  >
                    <i className="ni ni-fat-add"></i>
                    Add Invoice
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Issue Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Client</th>
                    <th scope="col" className="text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices ? (
                    invoices.map((invoice) => (
                      <InvoiceRow key={invoice._id} invoice={invoice} autoRefresh={autoRefresh}/>
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>No Invoice Found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        {openModal && (
          <InvoiceForm
            openModal={openModal}
            handleModal={handleModal}
            user={undefined}
            isEditing={false}
            autoRefresh={autoRefresh}
          />
        )}
      </Container>
    </>
  );
};

export default InvoiceList;
