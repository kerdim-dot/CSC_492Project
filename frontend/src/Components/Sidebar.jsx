import right_arrow from "./../assets/right_arrow.svg";
import dashboard from "./../assets/dashboard.svg";
import admin from "./../assets/admin.svg";
import student from "./../assets/person.svg";
import classes from "./../assets/classes.svg";
import checklist from "./../assets/checklist.svg";
import edit from "./../assets/edit.svg"
import edit_person from "./../assets/person_edit.svg"
import table_edit from "./../assets/table_edit.svg"
import edit_admin from "./../assets/edit_admin.svg"
import schedule from "./../assets/schedule.svg";
import { NavLink, useLocation } from "react-router-dom";
import down_arrow from "./../assets/down_arrow.svg";
import { useEffect, useState } from "react";

function SideBar() {

    const location = useLocation();

    const managementRoutes = [
        "/student/manager",
        "/class/manager",
        "/enrollment/manager",
        "/admin/manager",
    ];

    const isOnManagementRoute = managementRoutes.includes(location.pathname);

    const [expandedDesktop, setExpandedDesktop] = useState(true);
    const [subbarManagement, setSubbarManagement] = useState(() => {
        return localStorage.getItem("subbarManagementOpen") === "true";
    });

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin" || role === "supervisor";
    const isSupervisor = role === "supervisor";
    const isUser = role === "user";

    const changeSubbarManagement = () => {
        setSubbarManagement((prev) => !prev);
        setExpandedDesktop(true);
    };

    const changeExpandedDesktop = () => {
        if (expandedDesktop) {
            setExpandedDesktop(false);
            setSubbarManagement(false);
        } else {
            setExpandedDesktop(true);
        }
    };

    const roleLabel =
        role === "supervisor"
            ? "Supervisor"
            : role === "admin"
                ? "Admin"
                : "User";

    useEffect(() => {
        localStorage.setItem("subbarManagementOpen", String(subbarManagement));
    }, [subbarManagement]);

    return (
        <nav id="desktop_sidebar" className={expandedDesktop ? "" : "close"}>
            <div className="sidebar_header">
                <div className="sidebar_brand_row">
                    <span className="sidebar_title">Computer Science</span>
                    <button id="toggle_btn" onClick={changeExpandedDesktop}>
                        <img
                            src={right_arrow}
                            className={expandedDesktop ? "transition_right" : ""}
                            alt="Toggle sidebar"
                        />
                    </button>
                </div>

                <p className="sidebar_role">{roleLabel}</p>
            </div>

            <hr
                style={{
                    color: "rgb(78, 32, 100)",
                    backgroundColor: "rgb(78, 32, 100)",
                    height: 5,
                    borderColor: "rgb(78, 32, 100)",
                }}
            />

            <ul className="sidebar_nav">
                <li>
                    <NavLink
                        to={isAdmin ? "/dashboard" : "../dashboard"}
                        className={({ isActive }) =>
                            isActive ? "sidebar_link active" : "sidebar_link"
                        }
                    >
                        <img src={dashboard} alt="Dashboard" />
                        <span>Dashboard</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/schedule"
                        className={({ isActive }) =>
                            isActive ? "sidebar_link active" : "sidebar_link"
                        }
                    >
                        <img src={schedule} alt="Schedule" />
                        <span>Schedule</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/classes"
                        className={({ isActive }) =>
                            isActive ? "sidebar_link active" : "sidebar_link"
                        }
                    >
                        <img src={classes} alt="Classes" />
                        <span>Classes</span>
                    </NavLink>
                </li>

                {isUser && (
                <li>
                    <NavLink
                        to="/progress"
                        className={({ isActive }) =>
                            isActive ? "sidebar_link active" : "sidebar_link"
                        }
                    >
                        <img src={checklist} alt="Progress" />
                        <span>{isAdmin || isSupervisor ? "Progress Summary" : "Progress"}</span>
                    </NavLink>
                </li>
                )}

                {isAdmin && (
                    <>
                        <li>
                            <NavLink
                                to="/students"
                                className={({ isActive }) =>
                                    isActive ? "sidebar_link active" : "sidebar_link"
                                }
                            >
                                <img src={student} alt="Students" />
                                <span>Students</span>
                            </NavLink>
                        </li>

                        <li className="sidebar-dropdown-group">

                            <button className="dropdown_btn" onClick={changeSubbarManagement}>
                                <div className="dropdown-btn-left">
                                    <img src={edit} alt="" />
                                    <span className="dropdown-btn-label">Management Tools</span>
                                </div>

                                <img
                                    src={down_arrow}
                                    className={`dropdown-arrow ${(subbarManagement || isOnManagementRoute) ? "dropdown-arrow-open" : ""}`}
                                    alt=""
                                />
                            </button>

                            <ul className={`sub_menu ${(subbarManagement || isOnManagementRoute) ? "show" : ""}`}>
                                <li>
                                    <NavLink to="/student/manager" className="sidebar_link">
                                        <img src={edit_person} alt="" />
                                        <span>Manage Students</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/class/manager" className="sidebar_link">
                                        <img src={table_edit} alt="" />
                                        <span>Manage Classes</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/enrollment/manager" className="sidebar_link">
                                        <img src={admin} alt="" />
                                        <span>Manage Enrollment</span>
                                    </NavLink>
                                </li>

                                {/* {isSupervisor && (
                                    <li>
                                        <NavLink to="/admin/manager" className="sidebar_link">
                                            <img src={edit_admin} alt="" />
                                            <span>Manage Admins</span>
                                        </NavLink>
                                    </li>
                                )} */}

                                {isSupervisor && (
                                    <li>
                                        <NavLink to="/schedule/manager" className="sidebar_link">
                                            <img src={edit_admin} alt="" />
                                            <span>Manage schedules</span>
                                        </NavLink>
                                    </li>
                                )}

                            </ul>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default SideBar;