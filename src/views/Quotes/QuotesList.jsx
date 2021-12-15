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
import PassengerForm from "./QuotesForm";
import PassengerRow from "./QuotesRow";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/index";

const QuotesList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [quotes, setQuotes] = useState();
  const handleModal = () => {
    setOpenModal((open) => !open);
    return openModal;
  };

  useEffect(() => {
    api("get", "quotes").then((res) => {
      setQuotes(res.data.quotes);
      console.log(res.data.quotes);
    });
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
                  <h3 className="mb-0">Quotes List</h3>
                  <Button
                    color="primary"
                    href="#pablo"
                    onClick={handleModal}
                    size="md"
                  >
                    <i className="ni ni-fat-add"></i>
                    Add Quotes
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Quote Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Passenger</th>
                    <th scope="col">Clients</th>
                    <th scope="col">No. of Trips</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Actions </th>
                  </tr>
                </thead>
                <tbody>
                  {quotes ? (
                    quotes.map((quote) => (
                      <PassengerRow key={quote._id} quote={quote} />
                    ))
                  ) : (
                    <tr className="h1 mx-lg-auto text-center">
                      <td>No Quotes Found</td>
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
          <PassengerForm
            openModal={openModal}
            handleModal={handleModal}
            user={undefined}
            isEditing={false}
          />
        )}
      </Container>
    </>
  );
};

export default QuotesList;
