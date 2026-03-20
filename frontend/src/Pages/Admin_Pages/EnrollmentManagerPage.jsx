import AdminSideBar from "../../Components/Admin_SideBar"
import EnrollmentManager from "../../Components/EnrollmentManager";
function EnrollementManagerPage(){
    return(
        <div className="desktop_container">
            <AdminSideBar/>
            <EnrollmentManager/>
        </div>
    )
}

export default EnrollementManagerPage;