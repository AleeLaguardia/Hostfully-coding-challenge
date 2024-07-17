import React from "react";
import { Route, Routes } from "react-router-dom";
import { PATH } from "../utils/strings";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Reservation from "../pages/Reservation";

const Navigation: React.FC = () => {
  return (
    <Routes>
      <Route path={PATH.HOME} element={<Home />} />
      <Route path={PATH.BOOKING} element={<Booking />} />
      <Route path={PATH.RESERVATION} element={<Reservation />} />
    </Routes>
  );
};

export default Navigation;