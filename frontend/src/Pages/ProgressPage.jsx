import SideBar from "../Components/Sidebar";
import TestPage from "./TestPage";


function ProgressPage (){
    const role = localStorage.getItem("role");
    return (
        <div className="desktop_container">
            <SideBar/>
            <span>This will be the progress page</span>
        </div>
    );

}
export default ProgressPage;