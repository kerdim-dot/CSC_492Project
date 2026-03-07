import AdminSideBar from "../../Components/Admin_SideBar"
import Students from "../../Components/Students";
import TestPage from "../TestPage"


function StudentsPage(){
    return(
        <div className="desktop_container">
            <AdminSideBar/>
            <Students/>
        </div>
    )
}

export default StudentsPage;