
import AdminSideBar from "../../Components/Admin_SideBar"
import ClassManager from "../../Components/ClassManager";
function ClassManagerPage(){
    return(
        <div className="desktop_container">
            <AdminSideBar/>
            <ClassManager/>
        </div>
        
    )
}
export default ClassManagerPage;