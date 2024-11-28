import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const CalculateAge = (userDoB) => {
    const today = new Date();
    const bDate = new Date(userDoB);

    let age = today.getFullYear() - bDate.getFullYear();
    return age;
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const transformDate = (dateString) => {
    const dateArray = dateString.split("_");
    const month = months[Number(dateArray[1]) - 1]; // Adjust for zero-indexing
    const day = dateArray[0];
    const year = dateArray[2];

    return `${month} ${day}, ${year}`;
  };

  const currencySymbol = "$";

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const value = {
    CalculateAge,
    transformDate,
    currencySymbol,
    formatDate,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
