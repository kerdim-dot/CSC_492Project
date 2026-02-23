import Classes from "../Components/Classes";
import SideBar from "../Components/SideBar"
import TestPage from "./TestPage"
function ClassesPage (){
    return(
        <div className="desktop_container">
            <SideBar/>
            <Classes/>
        </div>
    )
}
export default ClassesPage;