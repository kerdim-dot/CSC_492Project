import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './sidebar.css'

import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import TestPage from './Pages/TestPage.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Schedule from './Pages/SchedulePage.jsx'
import StudentsPage from './Pages/Admin_Pages/StudentsPage.jsx'
import ClassesPage from './Pages/ClassesPage.jsx'
import StudentZoomPage from './Pages/Admin_Pages/StudentZoomPage.jsx'
import ClassZoomPage from './Pages/ClassZoomPage.jsx'
import AdminManagerPage from './Pages/Admin_Pages/AdminManagerPage.jsx'
import LandingPage from './Pages/LandingPage.jsx'
import ClassManagerPage from './Pages/Admin_Pages/ClassManagerPage.jsx'
import EnrollementManagerPage from './Pages/Admin_Pages/EnrollmentManagerPage.jsx'


const router = createBrowserRouter([
    {path:"/", element:<LandingPage/>},
    {path:"/dashboard", element:<Dashboard/>},
    {path:"/classes", element:<ClassesPage/>},
    {path:"/students", element:<StudentsPage/>},
    {path:"/schedule", element:<Schedule/>},
    {path:"/student/manager", element:<AdminManagerPage/>},
    {path:"/class/manager", element:<ClassManagerPage/>},
    {path:"/enrollment/manager", element:<EnrollementManagerPage/>},
    {path:"/test", element:<TestPage/>},
    {path:"/students/:firstName/:lastName", element:<StudentZoomPage/>},
    {path:"/classes/:header", element:<ClassZoomPage/>}

    
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
