import React from "react";
import type { Event } from "@calcaster/types";
import Calendar from "@toast-ui/react-calendar";

import "@toast-ui/calendar/dist/toastui-calendar.min.css";

type Props = { events: Event[] };

const CalendarComponent = ({ events }: Props) => {
  const calendars = [{ id: "cal1", name: "Personal" }];
  const initialEvents = events.map((event, idx) => {
    return {
      id: idx,
      calendarId: "cal1",
      title: "Busy",
      category: "time",
      start: event.data.start?.datetime,
      end: event.data.end?.datetime,
    };
  });

  return (
    <Calendar
      isReadOnly
      height="100%"
      view="day"
      calendars={calendars}
      events={initialEvents}
      usageStatistics={false}
    />
  );
};

export default CalendarComponent;
