import React, { useState, useEffect } from "react";
import "../navbar/navbar.css";

// icons
import icon1 from "../../assets/images/icons/icon-add-data.png";
import icon2 from "../../assets/images/icons/icon-menage-data.png";
import icon3 from "../../assets/images/icons/icon-dashboard.png";
import { Link } from "react-router-dom";

export default function Navbar() {

  return (
    <>
      <div className="section-navbar">
        <div className="nav-setgroup1">
          <div className="group1-container">
            <div className="group1-menu-list">
              <div className="menu-list-dashboard">
                <img src={icon3} />
                <h2><Link className="hover:text-yellow-300 transition ease-in-out delay-100" to="/dashboard">หน้าสรุปผล</Link></h2>
              </div>

              <div className="menu-list-adddata">
                <div className="menu-list-adddata-head">
                  <img src={icon1} />
                  <h2>เพิ่มข้อมูล</h2>
                </div>
                <div className="menu-list-adddata-menu">
                  <a><Link style={{fontSize: "22px"}} className="hover:text-yellow-300 transition ease-in-out delay-100" to="/addproduct">เพิ่มสินค้าใหม่</Link></a>
                  <a><Link style={{fontSize: "22px"}} className="hover:text-yellow-300 transition ease-in-out delay-100" to="/addactivity">เพิ่มกิจกรรม</Link></a>
                  <a><Link style={{fontSize: "22px"}} className="hover:text-yellow-300 transition ease-in-out delay-100" to="/addperformance">เพิ่มผลงาน</Link></a>
                </div>
              </div>
              <div className="menu-list-menage">
                <div className="menu-list-adddata-head">
                  <img src={icon2} />
                  <h2>จัดการข้อมูล</h2>
                </div>
                <div className="menu-list-adddata-menu">
                  <a><Link style={{fontSize: "22px"}} className="hover:text-yellow-300 transition ease-in-out delay-100" to="/menageproduct">สินค้า</Link></a>
                  <a><Link style={{fontSize: "22px"}} className="hover:text-yellow-300 transition ease-in-out delay-100" to="/menageactivity">กิจกรรม</Link></a>
                  <a><Link style={{fontSize: "22px"}} className="hover:text-yellow-300 transition ease-in-out delay-100" to="/menageperformance">ผลงาน</Link></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
