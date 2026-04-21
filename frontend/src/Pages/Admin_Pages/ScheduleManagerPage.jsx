import ScheduleManager from "../../Components/ScheduleManager";
import SideBar from "../../Components/Sidebar"

function ScheduleManagerPage(){
    return (
        <div className="desktop_container">
            <SideBar/>
            <ScheduleManager/>
        </div>
    )
}

export default ScheduleManagerPage;