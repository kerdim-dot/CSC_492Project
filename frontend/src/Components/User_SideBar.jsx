import right_arrow from './../assets/right_arrow.svg'
import dashboard from './../assets/dashboard.svg'
import classes from "./../assets/classes.svg"
import schedule from "./../assets/schedule.svg"
import { useState } from 'react';
import { NavLink } from 'react-router-dom'
function SideBar(){

    const [expandedDesktop, setExpandedDesktop] = useState(true);
    const [subbar1,setSubbar1] = useState(false);
    const [subbar2,setSubbar2] = useState(false);
    const [subbar3,setSubbar3] = useState(false);
    const [signoutScreen,setSignoutScreen] = useState(false);


    const changeSubbar1 = ()=>{
        if(subbar1 == true){
            setSubbar1(false);
            
        }
        else{
            setSubbar1(true);
            setExpandedDesktop(true);
        }
    }

    const changeSubbar2 = ()=>{
        if(subbar2 == true){
            setSubbar2(false);
            
        }
        else{
            setSubbar2(true);
            setExpandedDesktop(true);
        }
    }

    const changeSubbar3 = ()=>{
        if(subbar3 == true){
            setSubbar3(false);
            
        }
        else{
            setSubbar3(true);
            setExpandedDesktop(true);
        }
    }

    const changeExpandedDesktop = ()=>{
        if(expandedDesktop == true){
            setExpandedDesktop(false);
            setSubbar1(false);
        }
        else{
            setExpandedDesktop(true);
        }
    }

    const showSignOutScreen = ()=>{
        setSignoutScreen(true);
    }

    return(
        <>
        <nav id="desktop_sidebar" className={expandedDesktop?"":"close"}>
            <ul>
                <li>
                    <span className='logo'>Computer Science</span>
                    <button id = "toggle_btn" onClick={changeExpandedDesktop}><img src={right_arrow} className={expandedDesktop?'transition_right':""}></img></button>
                </li>
                

                <li>
                    <NavLink
                        to="/user_dashboard"
                        className={({ isActive }) => isActive ? "sidebar_link active" : "sidebar_link"}
                    >
                        <img src={dashboard} alt="Dashboard" />
                        <span>Dashboard</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/classes"
                        className={({ isActive }) => isActive ? "sidebar_link active" : "sidebar_link"}
                    >
                        <img src={classes} alt="Classes" />
                        <span>Classes</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/schedule"
                        className={({ isActive }) => isActive ? "sidebar_link active" : "sidebar_link"}
                    >
                        <img src={schedule} alt="Schedule" />
                        <span>Schedule</span>
                    </NavLink>
                </li>

            </ul>
        </nav>
        </>
    )
}

export default SideBar