import { useState } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
function StudentManager(){
  const [activeTab, setActiveTab] = useState("update");
  const students = [
            {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", classes:null, credits:0},
            {studentId:1,firstName:"John" , lastName:"Doe", graduation: "2/2028", classes:null, credits:0}
  ]

  
  return (
    <div className="tab-pane-container">
      <div className="top-container">
            <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab}/>
            {(activeTab === "delete" || activeTab === "update") && <SearchBar/>}
      </div>
      
      <BodyPanel activeTab={activeTab} students={students}/>
      
    </div>
  );
}

export default StudentManager;

function HeaderPanel({activeTab, setActiveTab}){
    return(
        <div className="tab-header">
            <button className={activeTab === "add" ? "tab active" : "tab"}
            onClick={() => setActiveTab("add")}>
            Add
            </button>

            <button
            className={activeTab === "update" ? "tab active" : "tab"}
            onClick={() => setActiveTab("update")}
            >
            Update
            </button>

            <button className={activeTab === "delete" ? "tab active" : "tab"}
            onClick={() => setActiveTab("delete")}>
            Delete
            </button>
        </div>
    )
}

function SearchBar(){
    return(
        <div className="search">
            <img src={search} className="search-icon"></img>
            <input type="search" className="search-input" placeholder="Search Student..."></input>
            <img src={filter} className="filter"></img>
        </div>
    )
    
}

function BodyPanel({activeTab, students}){
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [warning, setWarning] = useState(null);

    const makeSelectedEntry = (index) =>{
        setSelectedEntry(index);
    }

    const deleteEntry = () =>{
        if(!selectedEntry){
            setWarning("No Entry Selected")
            setTimeout(()=>{
                setWarning("");
            },2000)
        }
    }

    return(
        <div className="tab-content">
            {activeTab === "add" && 
            <div className="placeholder">
                <p>Add Student</p>
                <div className="name-container">
                    <input type= "text" placeholder="first name"/>
                    <input type= "text" placeholder="last name"/>
                </div>
                <div className="graduation-container">
                    <input type="text" placeholder="graduation semester"></input>
                    <input type="text" placeholder="graduation year"></input>
                </div>
                <div>
                    
                </div>
                
            </div>
            }
            {activeTab === "update" && 
                <div className="placeholder">
                    
                    <p>Update Student</p> 

                    <div className="entry-list">
                        {students.map((item,index)=>{
                            return(
                            <div className="entry">
                                    <p>{item.firstName} {item.lastName}</p>
                                    <p>{item.graduation}</p>
                            </div>)
                        })}
                    </div>

                </div>}
            {activeTab === "delete" && 
                <div className="placeholder">
                    <p>Delete Student</p>
                    <div className="entry-list">
                        {students.map((item,index)=>{
                            return(
                            <div className={selectedEntry === index ?"entry highlighted":"entry"} onClick={()=>{makeSelectedEntry(index)}}>
                                    <p>{item.firstName} {item.lastName}</p>
                                    <p>{item.graduation}</p>
                            </div>)
                        })}
                    </div>
                    <p>{warning}</p>
                    <button onClick={deleteEntry} className="btn-delete-student">Delete Student</button>
                </div>}
        </div>
    )
}