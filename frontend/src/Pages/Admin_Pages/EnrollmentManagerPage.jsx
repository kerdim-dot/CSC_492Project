import SideBar from "../../Components/Sidebar"
import EnrollmentManager from "../../Components/EnrollmentManager";
function EnrollementManagerPage(){
    return(
        <div className="desktop_container">
            <SideBar/>
            <EnrollmentManager/>
        </div>
    )
}

export default EnrollementManagerPage;