import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './sidebar.css'

import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import TestPage from './Pages/TestPage.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Classes from './Pages/ClassesPage.jsx'
import Schedule from './Pages/Schedule.jsx'
import AdminManager from './Pages/AdminManagerPage.jsx'
import StudentsPage from './Pages/StudentsPage.jsx'
import ClassesPage from './Pages/ClassesPage.jsx'
import StudentZoomPage from './Pages/StudentZoomPage.jsx'
import ClassZoomPage from './Pages/ClassZoomPage.jsx'
import AdminManagerPage from './Pages/AdminManagerPage.jsx'


const router = createBrowserRouter([
    {path:"/dashboard", element:<Dashboard/>},
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
