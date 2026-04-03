import Sidebar from "../Components/Sidebar"
import TestPage from "./TestPage"

function Dashboard(){

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin" || role === "supervisor";
    const isSupervisor = role === "supervisor";

    //main dashboard items
    
    return(
        <div className="desktop_container">
            <Sidebar/>
        </div>
    )
}

export default Dashboard