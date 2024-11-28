import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Keep this to see default classes structure

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="flex justify-center items-center p-6 bg-gray-100">
      <Calendar
        onChange={onDateChange}
        value={date}
        className="tailwind-calendar"
      />
    </div>
  );
};

export default MyCalendar;
