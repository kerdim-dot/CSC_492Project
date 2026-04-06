import Classes from "../Components/Classes";
import SideBar from "../Components/Sidebar";
import TestPage from "./TestPage";


function ClassesPage (){
    const role = localStorage.getItem("role");
    return (
        <div className="desktop_container">
            <SideBar/>
            <Classes/>
        </div>
    );

}
export default ClassesPage;