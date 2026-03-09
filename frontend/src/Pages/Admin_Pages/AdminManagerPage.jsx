import AdminSideBar from "../../Components/Admin_SideBar"
import StudentManager from "../../Components/StudentManager";
import TestPage from "../TestPage"

function AdminManagerPage(){
    return(
        <div className="desktop_container">
            <AdminSideBar/>
            <StudentManager/>
        </div>
    )
}

export default AdminManagerPage;