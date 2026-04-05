import Sidebar from "../Components/Sidebar"
import Dashboard from "../Components/Dashboard"
import TestPage from "./TestPage"

function DashboardPage(){

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin" || role === "supervisor";
    const isSupervisor = role === "supervisor";

    //main dashboard items
    
    return(
        <div className="desktop_container">
            <Sidebar/>
            <Dashboard/>
        </div>
    )
}

export default DashboardPage