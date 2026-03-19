import { useState } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
function StudentManager(){
  const [activeTab, setActiveTab] = useState("update");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const students = [
            {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", classes:null, credits:0},
            {studentId:2,firstName:"John" , lastName:"Doe", graduation: "2/2028", classes:null, credits:0}
  ]

  
  return (
    <div className="tab-pane-container">
      <div className="top-container">
            <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab} setSelectedEntry={setSelectedEntry}/>
            {(activeTab === "delete" || activeTab === "update") && <SearchBar/>}
      </div>
      
      <BodyPanel activeTab={activeTab} students={students} selectedEntry={selectedEntry} setSelectedEntry={setSelectedEntry}/>
      
    </div>
  );
}

export default StudentManager;

function HeaderPanel({activeTab, setActiveTab, setSelectedEntry}){

    const makeAddTab = () =>{
    setActiveTab("add");
    setSelectedEntry(null);  
    }

    const makeUpdateTab = () =>{
        setActiveTab("update");
        setSelectedEntry(null);  
    }

    return(
        <div className="tab-header">
            <button className={activeTab === "add" ? "tab active" : "tab"}
            onClick={makeAddTab}>
            Add
            </button>

            <button
            className={activeTab === "update" ? "tab active" : "tab"}
            onClick={makeUpdateTab}
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



function BodyPanel({activeTab, students, selectedEntry, setSelectedEntry}){
    const [warning, setWarning] = useState(null);
    const [multipleStudentText, setMultipleStudentText] = useState(null);
    const [studentUpdateEntry, setStudentUpdateEntry] = useState(null);

    function UpdateBlock(){
        
        return(
            <div className="update-student-block">
                <p>Update Student</p>
                <input value={studentUpdateEntry.firstName}></input>
                <input value={studentUpdateEntry.lastName}></input>
                <input value={studentUpdateEntry.graduation}></input>
                <button>Back</button>
                <button>Confirm</button>
            </div>
        )
    }

    const makeSelectedEntry = (id) =>{
        setSelectedEntry(id);
    }

    const deleteEntry = () =>{
        if(!selectedEntry){
            setWarning("No Entry Selected")
            setTimeout(()=>{
                setWarning("");
            },2000)
        }
        else{
            console.log("This is the student id that needs to be deleted: "+selectedEntry)
        }
    }

   

    const structureStudentData = (text) =>{
        
        const studentEntries = text.split("\n");
        //const studentList = [];
        console.log(studentEntries)
        for (var i = 0; i<studentEntries.length; i++){
            const values = studentEntries[i].split(",");
            if(studentEntries[i].split() == "" || values.length != 3){
                continue;
            }
            else{
                students.push({
                    firstName: values[0],
                    lastName: values[1],
                    graduation: values[2],
                    classes:null
                })
            }
        }
    }


    return(
        <div className="tab-content">
            {activeTab === "add" && 
            <div className="placeholder">
                <div className="individual-add">
                    <p>Add Student</p>
                    <div className="name-container">
                        <input type= "text" placeholder="first name"/>
                        <input type= "text" placeholder="last name"/>
                    </div>
                    <div className="graduation-container">
                        <input type="text" placeholder="graduation Month"></input>
                    </div>  
                </div>
                <div className="mass-add">
                    <p>Add Multiple Students </p>
                    <button>CSV</button>
                    <button>JSON?</button>
                    <textarea className="mass-add-textarea" value={multipleStudentText} onChange={(e)=>{setMultipleStudentText(e.target.value)}}/>
                    <button onClick={()=>{structureStudentData(multipleStudentText)}}>submit</button>
                </div>
            </div>
            }
            {activeTab === "update" && 
                <div className="placeholder">
                    
                    <p>Update Student</p> 
                    <div className="entry-list">
                        {students.map((item,index)=>{
                            return(
                            <div className={selectedEntry === item.studentId ?"entry highlighted":"entry"} onClick={()=>{setStudentUpdateEntry(item)}} >
                                    <p>{item.firstName} {item.lastName}</p>
                                    <p>{item.graduation}</p>
                            </div>)
                        })}
                    </div>
                    {studentUpdateEntry && <UpdateBlock/>}
                </div>}
            {activeTab === "delete" && 
                <div className="placeholder">
                    <p>Delete Student</p>
                    <div className="entry-list">
                        {students.map((item,index)=>{
                            return(
                            <div className={selectedEntry === item.studentId ?"entry highlighted":"entry"} onClick={()=>{makeSelectedEntry(item.studentId)}}>
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