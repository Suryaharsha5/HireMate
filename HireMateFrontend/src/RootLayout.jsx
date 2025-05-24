import React from 'react'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { Outlet } from 'react-router-dom'
function RootLayout() {
  return (
    <div style={{backgroundColor: '#012a36' }} className='text-white fnt'>
      <Header></Header>
      <div  style={{minHeight:"100vh" ,minwidth:"100%"}}>
      <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default RootLayout