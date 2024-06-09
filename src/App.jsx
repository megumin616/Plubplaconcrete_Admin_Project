import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Register from './pages/register/Reguster'
import Login from './pages/register/Login'
import Dashboard from './pages/dashboard/Dashboard'

import { ToastContainer } from 'react-toastify'
import { auth } from './firebase'
import FormProduct from './pages/formdata/formProduct/FormProduct'
import FormActivity from './pages/formdata/formActivity/FormActivity'
import FormPerformance from './pages/formdata/formPerformance/FormPerformance'
import MenageProduct from './pages/menage/menageProduct/MenageProduct'
import MenageActivity from './pages/menage/menageActivity/MenageActivity'
import MenagePerformance from './pages/menage/menagePerformance/MenagePerformance'

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    })
  })

  return (
    <BrowserRouter>
    {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={ user ? <Navigate to="/menageproduct"/> : <Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>

        <Route path='/addproduct' element={<FormProduct/>}/>
        <Route path='/addproduct/:id' element={<FormProduct/>}/>
        <Route path='/addactivity' element={<FormActivity/>}/>
        <Route path='/addactivity/:id' element={<FormActivity/>}/>
        <Route path='/addperformance' element={<FormPerformance/>}/>
        <Route path='/addperformance/:id' element={<FormPerformance/>}/>

        <Route path='/menageproduct' element={<MenageProduct/>}/>
        <Route path='/menageactivity' element={<MenageActivity/>}/>
        <Route path='/menageperformance' element={<MenagePerformance/>}/>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  )
}

export default App
