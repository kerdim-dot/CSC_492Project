import SideBar from "../../Components/Sidebar"
import StudentZoom from "../../Components/StudentZoom";
function StudentZoomPage(){
    return(
        <div className="desktop_container">
            <SideBar/>
            <StudentZoom/>
        </div>
    )
}

export default StudentZoomPage;