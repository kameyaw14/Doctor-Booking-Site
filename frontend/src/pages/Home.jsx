import React, { useContext } from "react";
import Header from "../components/Header/Header";
import Speciality from "../components/speciality/speciality";
import TopDoctors from "../components/TopDoctors/TopDoctors";
import Banner from "../components/Banner/Banner";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const { token } = useContext(AppContext);
  return (
    <div>
      <Header />
      <Speciality />
      <TopDoctors />
      {!token ? <Banner /> : ""}
    </div>
  );
};

export default Home;
