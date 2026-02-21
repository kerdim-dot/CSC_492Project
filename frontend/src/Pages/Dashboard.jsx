import SideBar from "../Components/SideBar"
import TestPage from "./TestPage"

function Dashboard(){
    return(
        <div className="desktop_container">
            <SideBar/>
            <TestPage/>
        </div>
    )
}

export default Dashboard