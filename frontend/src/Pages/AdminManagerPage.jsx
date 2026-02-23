import AdminManager from "../Components/AdminManager";
import SideBar from "../Components/SideBar"
import TestPage from "./TestPage"
function AdminManagerPage(){
    return(
        <div className="desktop_container">
            <SideBar/>
            <AdminManager/>
        </div>
    )
}

export default AdminManagerPage;