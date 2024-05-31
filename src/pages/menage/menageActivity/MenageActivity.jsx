import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import NavTap from "../../../components/navbar/NavTap";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export default function MenageActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //ดึงข้อมูลมาแสดง
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, "activities"), //อย่าลืมมาเปลี่ยนตรงนี้ หลังจากสร้างไฟล์ตารางใหม่
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setActivity(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  //หากกำลังโหลดข้อมูล ให้แสดงหน้านี้ก่อน หรือจะให้แสดง UI อะไรก็ได้
  if (loading) {
    return console.log("loading..");
  }

  //Delete data
  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการที่จะลบข้อมูลใช่หรือไม่?")) {
      try {
        await deleteDoc(doc(db, "activities", id));
        setActivity(activity.filter((activity) => activity.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div style={{ display: "flex", width: "100%", marginTop: "10vh" }}>
        <Navbar />
        <NavTap />
        <div className="" style={{ width: "80vw" }}>
          <h1 className="m-5 text-2xl font-medium text-blue-500">
            จัดการข้อมูลกิจกรรม
          </h1>
          <div style={{ overflowY: "auto", maxHeight: "80vh" }}>
            <table class="min-w-full divide-y divide-black-500 m-5">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                    ชื่อสินค้า
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                    รูปภาพ
                  </th>
                  <th></th>
                  <th></th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-500">
              {activity &&
                  activity.map((val, key) => (
                    <tr key={key}>
                      <td class="px-6 py-4 whitespace-nowrap">{val.activity}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <img
                          style={{ width: "100px", height: "auto" }}
                          src={val.img1}
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <img
                          style={{ width: "100px", height: "auto" }}
                          src={val.img2}
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <img
                          style={{ width: "100px", height: "auto" }}
                          src={val.img3}
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => navigate(`/addactivity/${val.id}`)} class="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(val.id)} class="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
