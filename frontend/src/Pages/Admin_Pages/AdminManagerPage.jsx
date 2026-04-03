import SideBar from "../../Components/Sidebar"
import StudentManager from "../../Components/StudentManager";
import TestPage from "../TestPage"

function AdminManagerPage(){
    return(
        <div className="desktop_container">
            <SideBar/>
            <StudentManager/>
        </div>
    )
}

export default AdminManagerPage;