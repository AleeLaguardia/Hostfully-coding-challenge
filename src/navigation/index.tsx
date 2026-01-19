import React from "react";
import { Route, Routes } from "react-router-dom";
import { PATH } from "../utils/strings";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Reservation from "../pages/Reservation";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "../components/PrivateRoute";

const Navigation: React.FC = () => {
  return (
    <Routes>
      <Route path={PATH.HOME} element={<Home />} />
      <Route path={PATH.LOGIN} element={<Login />} />
      <Route path={PATH.REGISTER} element={<Register />} />
      <Route
        path={PATH.BOOKING}
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      />
      <Route
        path={PATH.RESERVATION}
        element={
          <PrivateRoute>
            <Reservation />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default Navigation;