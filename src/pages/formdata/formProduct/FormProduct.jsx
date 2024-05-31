import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navbar/Navbar";
import NavTap from "../../../components/navbar/NavTap";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";


const initialState = {
  product: "",
  detail: "",
  content: "",
  img1: "",
  img2: "",
  img3: "",
};

export default function FormProduct() {
  const [data, setData] = useState(initialState);  //ต้องการเก็บข้อมูลอะไร ก็กำหนดใน initialState
  const { product, detail, content } = data;
  // const [file, setFile] = useState(null);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const [messageProductWord, setMessageProductWord] = useState("");
  const [messageDetailWord, setMessageDetailWord] = useState("");
  const [messageContentWord, setMessageContentWord] = useState("");


  // id จากการ Edit
  const { id } = useParams();

  // ใช้ useEffect เพื่อเรียก getSingleUser เมื่อ id มีค่าเปลี่ยนแปลง
  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  // ฟังก์ชันที่ใช้ async เพื่อดึงข้อมูลของผู้ใช้เพียงคนเดียว
  const getSingleUser = async () => {
      // สร้างอ้างอิงไปยังเอกสารที่เฉพาะเจาะจงใน Firebase Firestore โดยใช้ id ที่กำหนด
    const docRef = doc(db, "products", id); // ดึงข้อมูลของเอกสารด้วย getDoc
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) { // ตรวจสอบว่าเอกสารมีอยู่จริงหรือไม่
      setData({ ...snapshot.data() }); // ถ้ามี เราจะอัปเดต state ด้วยข้อมูลที่ดึงมาใหม่
    }
  };

  //Upload file ที่ใช้ useEffect เพราะเมื่อมีการเลือกไฟล์ใน <input> แล้ว จะทำการอัพโหลด (firebaase) ทันที
  // useEffect(() => {
    const uploadFile = (file, setProgress, setUrl) => {
      // เมื่อมีการเปลี่ยนแปลงใน `file` (ไฟล์ที่ผู้ใช้เลือก), `useEffect()` จะถูกเรียกใช้.
      const name = new Date().getTime() + file.name;
      // สร้าง reference ไปยังโฟลเดอร์ใน Firebase Storage โดยใช้ชื่อไฟล์
      const storageRef = ref(storage, file.name);
      // เริ่มกระบวนการอัปโหลดไฟล์ด้วย `uploadBytesResumable()`
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        // ติดตามสถานะการอัปโหลดของไฟล์ด้วย `uploadTask.on()` โดยรายงานความคืบหน้าและสถานะของการอัปโหลดในแต่ละขั้นตอน
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //ส่วนนี้คำนวณความคืบหน้าของการอัปโหลดในรูปแบบของเปอร์เซ็นต์
          setProgress(progress); //อัปเดตค่าความคืบหน้า เพื่อทำให้ UI แสดงความคืบหน้าที่ถูกต้อง.
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        // เมื่อการอัปโหลดเสร็จสมบูรณ์ `() => {...}` จะถูกเรียก เพื่อดึง URL ของไฟล์ที่อัปโหลดเสร็จสมบูรณ์ด้วย
        //`getDownloadURL()` และเพิ่ม URL นี้ในข้อมูล `data` โดยใช้ `setData()`
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrl(downloadURL)
          });
        }
      );
    };
    // ถ้ามีไฟล์ที่เลือกอยู่ ให้เริ่มกระบวนการอัปโหลด
  //   file && uploadFile();
  // }, [file]);

  // รับค่าจาก <input>
  // const handleChange = (e) => {
  //   setData({ ...data, [e.target.name]: e.target.value });
  //   //เป็นการสร้างออบเจ็กต์ใหม่ของข้อมูลโดยนำข้อมูลเดิมมา และแทนที่ค่าของฟิลด์ที่เปลี่ยนแปลงด้วยค่าใหม่ที่ผู้ใช้ป้อนเข้ามา
  // };

  const handleChange = (e) => {
    if (e.target.name === "product" && e.target.value.length > 50) {
      const messageProductWord = "ข้อมูลอักขระเกิน 50";
      setMessageProductWord(messageProductWord);
    } else if (e.target.name === "detail" && e.target.value.length > 130){
      const messageDetailWord = "ข้อมูลอักขระเกิน 130";
      setMessageDetailWord(messageDetailWord);
    } else if (e.target.name === "content" && e.target.value.length > 1100){
      const messageContentWord = "ข้อมูลอักขระเกิน 1100";
      setMessageContentWord(messageContentWord);
    }else {
      setMessageProductWord("");
      setMessageDetailWord("");
      setMessageContentWord("");
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };


  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleFile3Change = (e) => {
    setFile3(e.target.files[0]);
  };

  useEffect(() => {
    file1 && uploadFile(file1, setProgress, (url) => setData((prev) => ({ ...prev, img1: url })));
  }, [file1]);

  useEffect(() => {
    file2 && uploadFile(file2, setProgress, (url) => setData((prev) => ({ ...prev, img2: url })));
  }, [file2]);

  useEffect(() => {
    file3 && uploadFile(file3, setProgress, (url) => setData((prev) => ({ ...prev, img3: url })));
  }, [file3]);

  //สร้าง Function สำหรับการตรวจสอบว่าได้ใส่ข้อมูลตามที่ต้องการรึเปล่า ในที่นี้คือ ห้ามมีค่าว่าง
  const validata = () => {
    let errors = {};
    if (!product) {
      errors.product = "จำเป็นต้องระบุชื่อสินค้า";
    }
    if (!detail) {
      errors.detail = "จำเป็นต้องระบุชื่อรายละเอียด";
    }
    if (!content) {
      errors.content = "จำเป็นต้องระบุชื่อรายละเอียด";
    }

    return errors;
  };

  //Function อัพข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault(); //กันการ Refresh จำเป็น
    let errors = validata();
    if (Object.keys(errors).length) { // ถ้ามีข้อผิดพลาด
      return setErrors(errors); // ตั้งค่า errors ใน state และหยุดการทำงานของฟังก์ชัน
    } else {
      setErrors({}); // เคลียร์ errors ใน state
      setIsSubmit(true); // ตั้งค่า isSubmit เป็น true เพื่อแสดงว่าข้อมูลกำลังถูกส่ง
      if (!id) { // ถ้าไม่มี id (เพิ่มข้อมูลใหม่)
        try {
          await addDoc(collection(db, "products"), {
            ...data,
            timestamp: serverTimestamp(),
          });
          console.log("success")
        } catch (error) {
          console.log(error);
        }
      } else { // ถ้ามี id (อัปเดตข้อมูล)
        try {
            await updateDoc(doc(db, "products", id), {
              ...data,
              timestamp: serverTimestamp(),
            });
          } catch (error) {
            console.log(error);
          }
      }
      navigate("/menageproduct");
    }
  };
  return (
    <>
      <div
        className="section-dashboard"
        style={{ display: "flex", width: "100%", marginTop: "10vh" }}
      >
        <Navbar />
        <NavTap />
        <div className="dashboard-content" style={{ width: "80vw" }}>
          <div className="bg-gray-100 h-full">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="">
                <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-4 w-full">
                  <form  className="space-y-4">
                  <h1 className="text-2xl font-mediam">เพิ่มสินค้าใหม่</h1>
                    <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                      <div className="flex flex-col text-start ">
                        <label className="mb-3">รูป 1</label>
                        <input
                          type="file"
                          className="border-2 border-black-500"
                          onChange={handleFile1Change}
                        />
                      </div>
                      <div className="flex flex-col text-start ">
                        <label className="mb-3">รูป 2</label>
                        <input
                          type="file"
                          className="border-2 border-black-500"
                          onChange={handleFile2Change}
                        />
                      </div>
                      <div className="flex flex-col text-start ">
                        <label className="mb-3">รูป 3</label>
                        <input
                          type="file"
                          className="border-2 border-black-500"
                          onChange={handleFile3Change}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="">ชื่อสินค้า <spen style={{color: "red"}}>{messageProductWord}</spen></label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border-2 border-black-500"
                        type="text"
                        name="product"
                        autoFocus
                        value={product}
                        placeholder={errors.product ? errors.product : "Name Product..."}
                        onChange={handleChange}
                        // onChange={(e) => setData(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="">รายละย่อย <spen style={{color: "red"}}>{messageDetailWord}</spen></label>
                      <input
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border-2 border-black-500"
                        type="text"
                        name="detail"
                        autoFocus
                        value={detail}
                        placeholder={errors.detail ? errors.detail : "Detail..."}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="">รายละเอียดสินค้า <spen style={{color: "red"}}>{messageContentWord}</spen></label>

                      <textarea
                        className="w-full rounded-lg border-gray-200 p-3 text-sm border-2 border-black-500"
                        rows="8"
                        name="content"
                        autoFocus
                        value={content}
                        placeholder={errors.content ? errors.content : "Content..."}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                        disabled={progress !== null && progress < 100}
                        onClick={handleSubmit}
                      >
                        บันทึกข้อมูล
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
