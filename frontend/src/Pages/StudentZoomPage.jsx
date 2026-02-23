import SideBar from "../Components/SideBar"
import StudentZoom from "../Components/StudentZoom";
function StudentZoomPage(){
    return(
        <div className="desktop_container">
            <SideBar/>
            <StudentZoom/>
        </div>
    )
}

export default StudentZoomPage;