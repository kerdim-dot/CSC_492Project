import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './sidebar.css'

import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import TestPage from './Pages/TestPage.jsx'

import LandingPage from './Pages/LandingPage.jsx'

import Schedule from './Pages/SchedulePage.jsx'

import StudentsPage from './Pages/Admin_Pages/StudentsPage.jsx'
import StudentZoomPage from './Pages/Admin_Pages/StudentZoomPage.jsx'

import ClassesPage from './Pages/ClassesPage.jsx'
import ClassZoomPage from './Pages/ClassZoomPage.jsx'

import AdminManager from './Pages/Admin_Pages/AdminManager.jsx'
import ClassManagerPage from './Pages/Admin_Pages/ClassManagerPage.jsx'
import EnrollementManagerPage from './Pages/Admin_Pages/EnrollmentManagerPage.jsx'
import StudentManager from './Pages/Admin_Pages/StudentManager.jsx'
// import ProgressPage from './Pages/ProgressPage.jsx'
import DashboardPage from './Pages/DashboardPage.jsx'
import ScheduleManagerPage from './Pages/Admin_Pages/ScheduleManagerPage.jsx'


const router = createBrowserRouter([
    {path:"/", element:<LandingPage/>},
    {path:"/dashboard", element:<DashboardPage/>},
    {path:"/classes", element:<ClassesPage/>},
    {path:"/students", element:<StudentsPage/>},
    {path:"/schedule", element:<Schedule/>},
    // {path:"/progress", element:<ProgressPage/>},
    {path:"/student/manager", element:<StudentManager/>},
    {path:"/class/manager", element:<ClassManagerPage/>},
    {path:"/enrollment/manager", element:<EnrollementManagerPage/>},
    {path:"/admin/manager", element:<AdminManager/>},
    {path:"/test", element:<TestPage/>},
    {path:"/students/:id/", element:<StudentZoomPage/>},
    {path:"/classes/:header", element:<ClassZoomPage/>},
    {path:"/schedule/manager", element: <ScheduleManagerPage/>}
    
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
