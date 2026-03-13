import ClassZoom from "../Components/ClassZoom";
import UserSideBar from "../Components/User_SideBar";
import AdminSideBar from "../Components/Admin_SideBar";
import user_matched from "./LandingPage";
import admin_matched from "./LandingPage";

function ClassZoomPage(){
    if (user_matched) {
        return(
            <div className="desktop_container">
                <UserSideBar/>
                <ClassZoom/>
            </div>
        )
    }
    else if (admin_matched) {
        return(
            <div className="desktop_container">
                <AdminSideBar/>
                <ClassZoom/>
            </div>
        )
    }
}

export default ClassZoomPage;