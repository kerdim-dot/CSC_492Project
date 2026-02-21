import arrow_left from './../assets/left_arrow.svg'
import arrow_down from './../assets/down_arrow.svg'
import dashboard from './../assets/dashboard.svg'
import admin from "./../assets/admin.svg"
import student from "./../assets/person.svg"
import classes from "./../assets/classes.svg"
import schedule from "./../assets/schedule.svg"
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
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
                    <span className='logo'>Computer Science </span>
                    <button id = "toggle_btn" onClick={changeExpandedDesktop}><img src={arrow_left} className={expandedDesktop?'transition_right':""}></img></button>
                </li>
                

                <li>
                    <Link to ="/dashboard">
                        <img src={dashboard}></img>
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li>
                    <Link to ="/classes">
                        <img src={classes}></img>
                        <span>Classes</span>
                    </Link>
                </li>

                <li>
                    <Link to ="/students">
                        <img src={student}></img>
                        <span>Students</span>
                    </Link>
                </li>

                <li>
                    <Link to ="/schedule">
                        <img src={schedule}></img>
                        <span>Schedule</span>
                    </Link>
                </li>

                  <li>
                    <Link to ="/admin/manager">
                        <img src={admin}></img>
                        <span>Admin Manager</span>
                    </Link>
                </li>
            
            
                

            </ul>
        </nav>
        </>
    )
}

export default SideBar