import Schedule from "../Components/Schedule";
import SideBar from "../Components/Sidebar";
import TestPage from "./TestPage";

function SchedulePage(){
    const role = localStorage.getItem("role");
    return (
        <div className="desktop_container">
            <SideBar/>
            <Schedule/>
        </div>
    );
}
export default SchedulePage;