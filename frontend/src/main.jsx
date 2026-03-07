import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './sidebar.css'

import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import TestPage from './Pages/TestPage.jsx'
import UserDashboard from './Pages/User_Pages/User_Dashboard.jsx'
import AdminDashboard from './Pages/Admin_Pages/Admin_Dashboard.jsx'
import Schedule from './Pages/SchedulePage.jsx'
import StudentsPage from './Pages/Admin_Pages/StudentsPage.jsx'
import ClassesPage from './Pages/ClassesPage.jsx'
import StudentZoomPage from './Pages/Admin_Pages/StudentZoomPage.jsx'
import ClassZoomPage from './Pages/ClassZoomPage.jsx'
import AdminManagerPage from './Pages/Admin_Pages/AdminManagerPage.jsx'
import LandingPage from './Pages/LandingPage.jsx'


const router = createBrowserRouter([
    {path:"/", element:<LandingPage/>},
    {path:"/user_dashboard", element:<UserDashboard/>},
    {path:"/admin_dashboard", element:<AdminDashboard/>},
    {path:"/classes", element:<ClassesPage/>},
    {path:"/students", element:<StudentsPage/>},
    {path:"/schedule", element:<Schedule/>},
    {path:"/admin/manager", element:<AdminManagerPage/>},
    {path:"/test", element:<TestPage/>},
    {path:"/students/:firstName/:lastName", element:<StudentZoomPage/>},
    {path:"/classes/:header", element:<ClassZoomPage/>}

    
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
