import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import RootLayout from './RootLayout'
import RoutingError from './RoutingError'
import Home from './components/home/Home'
import Register from './components/regsiter/Register'
import About from './components/about/About'
import Profile from './components/profile/Profile'
import FreeLauncerProfile from './components/freeLauncerProfile/FreeLauncerProfile'
function App() {

  const browserRouter=createBrowserRouter([{
    path:'',
    element:<RootLayout></RootLayout>,
    errorElement:<RoutingError></RoutingError>,
    children:[
      {
        path:'',
        element:<Home></Home>
      },
      {
        path:'register',
        element:<Register></Register>
      },
      {
        path:'about',
        element:<About></About>
      },
      {
        path:'profile',
        element:<Profile></Profile>
      },
      {
        path:'freeLauncerProfile',
        element:<FreeLauncerProfile></FreeLauncerProfile>
      }
    ]
  }])

  return (
    <div>
      <RouterProvider router={browserRouter}></RouterProvider>
    </div>
  )
}

export default App