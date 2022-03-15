import React, { useEffect, useState } from "react";
import moment from "moment";
import { Row, Col, Label, Input, Spinner, FormGroup } from "reactstrap";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "moment/locale/fr";
import api from "../../api/index";

moment.locale("fr");
moment.locale("es-es", {
  week: {
    dow: 1, //Monday is the first day of the week.
  },
});

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

let formats = {
  dateFormat: "DD",
  monthHeaderFormat: "DD/MM/YYYY",
  dayHeaderFormat: "DD/MM/YYYY",
  dayRangeHeaderFormat: "DD/MM/YYYY",
  timeGutterFormat: (date, culture, localizer) =>
    localizer.format(date, "HH:mm", culture),
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, "HH:mm") + "-" + localizer.format(end, "HH:mm"),
};
//change calender texts to french

const messagesFrench = {
  allDay: "Journée",
  previous: "<",
  next: ">",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Événements à venir",
  date: "Date",
  time: "Heure",
  event: "Événement",
  work_week: "Semaine de travail",
  showMore: (total) => `+ ${total} événement(s) supplémentaire(s)`,
};

const eventsStyle = (event) => {
  var bgcolor = "";
  // condition for setting color in divs in calendar head
  if (event.status === "confirmed") {
    bgcolor = "#59d455";
  } else if (event.status === "cancelled") {
    bgcolor = "#ff545d";
  } else if (event.status === "pending") {
    bgcolor = "#bababa";
  } else if (event.status === "completed") {
    bgcolor = "#3da8ff";
  } else {
    bgcolor = "#bababa";
  }
  const style = {
    backgroundColor: bgcolor,
    clear: "both",
    display: "block",
    borderRadius: "4px",
    lineHeight: "16px",
    border: "2px solid #fff",
  };
  return {
    style: style,
  };
};

const ScheduleCalendar = (props) => {
  const [events, setEvents] = useState([]);
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getAllTrips();
    getAllDrivers();
    getAllClients();
  }, []);

  const getAllTrips = async () => {
    try {
      const res = await api("get", "trips");

      let allEvents = [];

      res.data.trips.map((e) => {
        let end = new Date(e.date);
        end.setHours(end.getHours() + 1);
        allEvents.push({
          id: e._id,
          title: e.client.first_name + e.client.last_name,
          start: new Date(e.date),
          end: end,
          status: e.status,
          clientId: e.client._id,
          driverId: e.assigned_drivers
            ? e.assigned_drivers.length != 0
              ? e.assigned_drivers[0]._id
              : ""
            : "",
        });
      });
      setTrips(allEvents);
      setEvents(allEvents);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAllDrivers = async () => {
    try {
      const res = await api("get", "drivers");
      setDrivers(res.data.drivers);
    } catch (error) {
      console.log("error", error);
    }
  };
  const getAllClients = async () => {
    try {
      const res = await api("get", "users");

      setClients(res.data.users);
    } catch (error) {
      console.log("error", error);
    }
  };

  const moveEvent = async ({ event, start, end }) => {
    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };
    const nextEvents = [...events];
    const tempEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);
    setEvents(nextEvents);
    try {
      const res = await api("put", `trips/event/${event.id}`, { date: start });
    } catch (error) {
      setEvents(tempEvents);
      console.log("error", error);
    }
  };

  const onDriverSelect = (e) => {
    if (e.target.value === "all") {
      setEvents(trips);
    } else {
      let filteredEvents = trips.map((event) => {
        if (e.target.value === event.driverId) {
          return event;
        }
      });
      setEvents(filteredEvents);
    }
  };

  const onClientSelect = (e) => {
    if (e.target.value === "all") {
      setEvents(trips);
    } else {
      let filteredEvents = trips.map((event) => {
        if (e.target.value === event.clientId) {
          return event;
        }
      });
      setEvents(filteredEvents);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        paddingTop: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {events.length === 0 ? (
        <Spinner color="primary" />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
              width: "98%",
              // marginLeft: "26px",
              marginTop: "26px",
            }}
          >
            {drivers.length > 0 && (
              <FormGroup
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "20px",
                  textAlign: "center",
                  width: "30%",
                }}
              >
                <Input
                  id="exampleSelect"
                  name="relationship"
                  className="form-control-alternative"
                  type="select"
                  onChange={(e) => onDriverSelect(e)}
                >
                  <option disabled={true} value="" selected>
                    Drivers
                  </option>
                  <option value="all">All Drivers</option>
                  {drivers.map((driver) => {
                    return (
                      <option value={driver._id}>
                        {driver.first_name + driver.last_name}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            )}
            {clients.length > 0 && (
              <FormGroup
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "20px",
                  textAlign: "center",
                  width: "30%",
                }}
              >
                <Input
                  id="exampleSelect"
                  name="relationship"
                  className="form-control-alternative"
                  type="select"
                  onChange={(e) => onClientSelect(e)}
                >
                  <option disabled={true} value="" selected>
                    Clients
                  </option>
                  <option value="all">All Clients</option>
                  {clients.map((client) => {
                    return (
                      <option value={client._id}>
                        {client.first_name + client.last_name}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            )}
          </div>
          <DragAndDropCalendar
            // step={60}
            culture="fr"
            popup={true}
            events={events}
            selectable={true}
            resizable={false}
            formats={formats}
            localizer={localizer}
            defaultView={Views.WEEK}
            style={{ width: "94%" }}
            messages={messagesFrench}
            onEventDrop={(e) => moveEvent(e)}
            eventPropGetter={eventsStyle}
            // onSelectEvent={(e) => console.log(e)}
            views={
              props.views || {
                week: true,
                day: true,
                month: true,
                agenda: true,
              }
            }
          />
        </>
      )}
    </div>
  );
};

export default ScheduleCalendar;
