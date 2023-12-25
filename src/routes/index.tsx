import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./common/PublicRoute";
import PrivateRoute from "./common/PrivateRoute";
import MainLayout from "routes/common/MainLayout";
import Login from "pages/auth/Login";
import Places from "pages/places/placesTable/index";
import CreateNewPlace from "pages/places/createNewPlace/index";
import PlaceDetails from "pages/places/placeDetails/index";
import PlaceEdit from "pages/places/editPlace/index";
import Cities from "pages/cities/citiesTable";
import Products from "pages/products";
import Checkins from "pages/check-in";
import Rooms from "pages/rooms";

import CreateNewCity from "pages/cities/createCity";
import EditCity from "pages/cities/editCity";

interface Props {
  userRole: string;
}

const MainRouter: React.FC<Props> = ({ userRole }) => {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/products" element={<Products />} />

          <Route path="/cities/all-cities" element={<Cities />} />
          <Route path="/cities/new" element={<CreateNewCity />} />
          <Route path="/cities/edit/:cityId" element={<EditCity />} />

          <Route path="/checkins" element={<Checkins />} />
          <Route path="/rooms" element={<Rooms />} />

          <Route path="/places/all-places" element={<Places />} />
          <Route path="/places/new" element={<CreateNewPlace />} />
          <Route path="/places/details/:placeId" element={<PlaceDetails />} />
          <Route path="/places/edit/:placeId" element={<PlaceEdit />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRouter;
