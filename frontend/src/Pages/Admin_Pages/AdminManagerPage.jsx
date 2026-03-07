import AdminManager from "../../Components/AdminManager";
import AdminSideBar from "../../Components/Admin_SideBar"
import TestPage from "../TestPage"

function AdminManagerPage(){
    return(
        <div className="desktop_container">
            <AdminSideBar/>
            <AdminManager/>
        </div>
    )
}

export default AdminManagerPage;