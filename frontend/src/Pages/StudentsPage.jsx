import SideBar from "../Components/SideBar"
import Students from "../Components/Students";
import TestPage from "./TestPage"


function StudentsPage(){
    return(
        <div className="desktop_container">
            <SideBar/>
            <Students/>
        </div>
    )
}

export default StudentsPage;