import AdminSideBar from "../../Components/Admin_SideBar"
import StudentZoom from "../../Components/StudentZoom";
function StudentZoomPage(){
    return(
        <div className="desktop_container">
            <AdminSideBar/>
            <StudentZoom/>
        </div>
    )
}

export default StudentZoomPage;