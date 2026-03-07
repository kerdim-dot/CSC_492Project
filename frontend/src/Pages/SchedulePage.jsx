import Schedule from "../Components/Schedule";
import UserSideBar from "../Components/User_SideBar";
import AdminSideBar from "../Components/Admin_SideBar";
import TestPage from "./TestPage";

function SchedulePage(){
    const role = localStorage.getItem("role");
    return (
        <div className="desktop_container">
            {role === "admin" ? <AdminSideBar /> : <UserSideBar/>}
            <Schedule/>
        </div>
    );
}
export default SchedulePage;