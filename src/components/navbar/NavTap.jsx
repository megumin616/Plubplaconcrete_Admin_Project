import React, { useState, useEffect } from "react";
import "../navbar/navbar.css";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from '../../assets/images/logo/พลับพลาคอนกรีตLogo.png'

export default function NavTap() {
  const [userDetail, setUserDetail] = useState(null);

  //ดึงข้อมูลผู้ที่ login มาแสดง
  // const fetchUserData = async () => {
  //   auth.onAuthStateChanged(async (user) => {
  //     console.log(user);
  //     const docRef = doc(db, "UserAdmin", user.uid);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setUserDetail(docSnap.data());
  //       console.log(docSnap.data());
  //     } else {
  //       console.log("User is not logged in");
  //       window.location.href = "/login";
  //     }
  //   } );
  // };

  //ส่วนนี้จะเพิ่มการตรวจสอบว่า ถ้าไม่ได้มีการ Login เข้ามา จะให้กลับไปหน้า login
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "UserAdmin", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetail(docSnap.data());
          console.log(docSnap.data());
        } else {
          console.log("User data does not exist");
        }
      } else {
        console.log("User is not logged in");
        window.location.href = "/login";
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully");
    } catch {
      console.log("Error logging out:");
    }
  };
  return (
    <>
      <div className="nav-setgroup2">
        <div className="group1-logo">
          <img src={logo} style={{borderRadius: "15px"}}/>
        </div>
        <div className="nav-admin">
          {userDetail ? (
            <p>{userDetail.firstName + "  " + userDetail.lastName}</p>
          ) : (
            <p>กำลังโหลดหน้า Admin</p>
            
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}
