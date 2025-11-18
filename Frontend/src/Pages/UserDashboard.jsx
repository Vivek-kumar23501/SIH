import React from "react";
import { Outlet } from "react-router-dom";
import UserDashboardNavbar from "../Components/UserDashboardNavbar";

const UserDashboard = () => {
  return (
    <>
      <UserDashboardNavbar />

      {/* Dashboard sub-pages will load here */}
      <div style={{ marginTop: "180px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default UserDashboard;
