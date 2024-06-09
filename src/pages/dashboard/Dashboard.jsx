import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import NavTap from "../../components/navbar/NavTap";
import './dashboard.css'

export default function Dashboard() {
  return (
    <>
      <div className="section-dashboard" style={{display: "flex", width: "100%", marginTop: "10vh"}}>
      <Navbar />
      <NavTap/>
       <div className="dashboard-content" style={{width: "80vw"}}>
       <h2>Analytics</h2>
       </div>
      </div>
    </>
  );
}
