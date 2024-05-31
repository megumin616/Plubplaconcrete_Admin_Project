import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import NavTap from "../../../components/navbar/NavTap";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";


const initialState = {
  activity: "",
  content: "",
  img1: "",
  img2: "",
  img3: "",
};

export default function FormActivity() {
  const [data, setData] = useState(initialState);
  const { activity, content } = data;
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [messageActivityWord, setMessageActivityWord] = useState("");
  const [messageContentWord, setMessageContentWord] = useState("");

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, "activities", id); // ดึงข้อมูลของเอกสารด้วย getDoc
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) { 
      setData({ ...snapshot.data() }); 
    }
  };

    const uploadFile = (file, setProgress, setUrl) => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
          setProgress(progress); 
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
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrl(downloadURL)
          });
        }
      );
    };

  const handleChange = (e) => {
    if (e.target.name === "activity" && e.target.value.length > 50) {
      const messageActivityWord = "ข้อมูลอักขระเกิน 50";
      setMessageActivityWord(messageActivityWord);
    } else if (e.target.name === "content" && e.target.value.length > 1100){
      const messageContentWord = "ข้อมูลอักขระเกิน 1100";
      setMessageContentWord(messageContentWord);
    } else {
      setMessageActivityWord("");
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

  const validata = () => {
    let errors = {};
    if (!activity) {
      errors.activity = "จำเป็นต้องระบุชื่อสินค้า";
    }
    if (!content) {
      errors.content = "จำเป็นต้องระบุรายละเอียด";
    }

    return errors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    let errors = validata();
    if (Object.keys(errors).length) { 
      return setErrors(errors); 
    } else {
      setErrors({}); 
      setIsSubmit(true); 
      if (!id) { 
        try {
          await addDoc(collection(db, "activities"), {
            ...data,
            timestamp: serverTimestamp(),
          });
          console.log("success")
        } catch (error) {
          console.log(error);
        }
      } else { // ถ้ามี id (อัปเดตข้อมูล)
        try {
            await updateDoc(doc(db, "activities", id), {
              ...data,
              timestamp: serverTimestamp(),
            });
          } catch (error) {
            console.log(error);
          }
      }
      navigate("/menageactivity");
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
          <div class="bg-gray-100 h-full">
            <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
              <div class="">
                <div class="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-4 w-full">
                  <form class="space-y-4">
                    <h1 className="text-2xl font-mediam">เพิ่มโพสกิจกรรม</h1>
                    <div class="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
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
                      <label class="">ชื่อกิจกรรม <spen style={{color: "red"}}>{messageActivityWord}</spen></label>
                      <input
                        class="w-full rounded-lg border-gray-200 p-3 text-sm border-2 border-black-500"
                        type="text"
                        name="activity"
                        autoFocus
                        value={activity}
                        placeholder={errors.activity ? errors.activity : "Name activity..."}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label class="">รายละเอียดกิจกรรม <spen style={{color: "red"}}>{messageContentWord}</spen></label>

                      <textarea
                        class="w-full rounded-lg border-gray-200 p-3 text-sm border-2 border-black-500"
                        rows="8"
                        name="content"
                        autoFocus
                        value={content}
                        placeholder={errors.content ? errors.content : "Content..."}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div class="mt-4">
                      <button
                        type="submit"
                        class="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
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
