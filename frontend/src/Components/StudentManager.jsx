import { useEffect, useState } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
function StudentManager(){
  const [activeTab, setActiveTab] = useState("update");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [studentSearchList,setStudentSearchList] = useState(null);


    const [updateFirstNameValue, setUpdateFirstNameValue] = useState(null);
    const [updateLastNameValue, setUpdateLastNameValue] = useState(null);
    const [updateGraduationValue, setUpdateGraduationValue] = useState(null);

  const [students, setStudents] = useState([
  {studentId:1, firstName:"Bill", lastName:"Hart", graduation:"1/2029"},
  {studentId:2, firstName:"John", lastName:"Doe", graduation:"2/2028"}
]);

  
  return (
    <div className="tab-pane-container">
      <div className="top-container">
            <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab} setSelectedEntry={setSelectedEntry}/>
            {(activeTab === "delete" || activeTab === "update") && <SearchBar students={students} setStudentSearchList={setStudentSearchList}/>}
      </div>
      
      <BodyPanel activeTab={activeTab} studentSearchList={studentSearchList} selectedEntry={selectedEntry} setSelectedEntry={setSelectedEntry} updateFirstNameValue= {updateFirstNameValue} updateLastNameValue = {updateLastNameValue} updateGraduationValue={updateGraduationValue} setUpdateFirstNameValue={setUpdateFirstNameValue} setUpdateLastNameValue={setUpdateLastNameValue} setUpdateGraduationValue={setUpdateGraduationValue}/>
      
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

function SearchBar({students,setStudentSearchList}){   
    const [searchInput, setSearchInput] = useState(null);

    useEffect(()=>{
        if(students){
            setStudentSearchList(students);
        }
    },[students])

    const searchExplorer = () =>{
        const searchResult = students.filter((item) => checkEqual(item, searchInput));
        setStudentSearchList(searchResult);
        //console.log(searchResult);
    }   

    function checkEqual(item,searchInput){
        const fullName = (item.firstName +" "+item.lastName).trim().toLowerCase();
        return(fullName.includes(searchInput));
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter") searchExplorer();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [searchInput]);

    return(
        <div className="search">
            <img src={search} className="search-icon"></img>
            <input type="search" className="search-input" placeholder="Search Student..."  value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}}></input>
            <img src={filter} className="filter"></img>
        </div>
    )
    
}


function UpdateBlock(updateFirstNameValue, updateLastNameValue, updateGraduationValue, setUpdateFirstNameValue, setUpdateLastNameValue,setUpdateGraduationValue){
    
        return(
            <div className="update-student-panel">
                
                <button 
                    className="close-button"
                >
                    ✕
                </button>

                <p className="student-panel-title">Update Student Panel</p>

                <div className="panel-entry">
                    <p>First Name</p>
                    <input 
                        className="panel-input" 
                        value={updateFirstNameValue.updateFirstNameValue} 
                        onChange={(e)=>{setUpdateFirstNameValue(e.target.value)}}
                    />
                </div>
                
                <div className="panel-entry">
                    <p>Last Name</p>
                    <input 
                        className="panel-input" 
                        value={updateFirstNameValue.updateLastNameValue} 
                        onChange={(e)=>{setUpdateLastNameValue(e.target.value)}}
                    />
                </div>

                <div className="panel-entry">
                    <p>Graduation Date</p>
                    <input 
                        className="panel-input" 
                        value={updateFirstNameValue.updateGraduationValue} 
                        onChange={(e)=>{setUpdateGraduationValue(e.target.value)}}
                    />
                </div>

                <button className="panel-button">Confirm</button>
            </div>
        )
    }


function BodyPanel({activeTab, studentSearchList, selectedEntry, setSelectedEntry, updateFirstNameValue, updateLastNameValue, updateGraduationValue, setUpdateFirstNameValue, setUpdateLastNameValue,setUpdateGraduationValue}){
    const [warning, setWarning] = useState(null);
    const [multipleStudentText, setMultipleStudentText] = useState(null);
    const [studentUpdateEntry, setStudentUpdateEntry] = useState(null);
    const [csvIsSelected, setcsvIsSelected] = useState(true);
    
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
        // csv data
        if(csvIsSelected){
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
        // json data
        else{
           try {
                const parsed = JSON.parse(text);

                if (Array.isArray(parsed)) {
                    parsed.forEach((obj, index) => {
                        console.log("Object", index, obj);
                        
                        Object.entries(obj).forEach(([key, value]) => {
                            console.log(key, value);
                        });
                    });
                }
            } catch (err) {
                console.error("Invalid JSON:", err.message);
            }
        }
    }

    const clickOnEntry = (item) =>{
        setStudentUpdateEntry(item);
        setUpdateFirstNameValue(item.firstName);
        setUpdateLastNameValue(item.lastName);
        setUpdateGraduationValue(item.graduation);
    }

    return(
        <div className="tab-content">
            {activeTab === "add" && 
            <div className="placeholder">
                <div className="individual-add">
                    <p>Add Student</p>
                    <div className="name-container">
                        <input type= "text" className="name-input" placeholder="first name"/>
                        <input type= "text" className="name-input" placeholder="last name"/>
                    </div>
                    <p>Grduation Date</p>
                    <div className="graduation-container">
                        <input type="text" className = "graduation-input" placeholder="DD"></input>
                        <p>-</p>
                        <input type="text" className = "graduation-input" placeholder="MM"></input>
                        <p>-</p>
                        <input type="text" className = "graduation-input year" placeholder="YYYY"></input>
                    </div>  
                </div>
                <div className="mass-add">
                    <p>Add Multiple Students </p>
                    <div className="mass-btns">
                        <button className={csvIsSelected ? "mass-add-btn-active":"mass-add-btn"} onClick={()=>{setcsvIsSelected(true)}}>CSV</button>
                        <button className={csvIsSelected ? "mass-add-btn":"mass-add-btn-active"} onClick={()=>{setcsvIsSelected(false)}}>JSON?</button>
                    </div>
                    <textarea className="mass-add-textarea" value={multipleStudentText} onChange={(e)=>{setMultipleStudentText(e.target.value)}}/>
                    <button onClick={()=>{structureStudentData(multipleStudentText)}}>submit</button>
                </div>
            </div>
            }
            {activeTab === "update" && 
                <div className="placeholder">
                    
                    <p>Update Student</p> 
                    <div className="entry-list">
                        {studentSearchList && studentSearchList.map((item,index)=>{
                            return(
                            <div className={selectedEntry === item.studentId ?"entry highlighted":"entry"} onClick={()=>{clickOnEntry(item)}} >
                                    <p>{item.firstName} {item.lastName}</p>
                                    <p>{item.graduation}</p>
                            </div>)
                        })}
                    </div>
                    {studentUpdateEntry && <UpdateBlock updateFirstNameValue= {updateFirstNameValue} updateLastNameValue = {updateLastNameValue} updateGraduationValue={updateGraduationValue} setUpdateFirstNameValue = {setUpdateFirstNameValue} setUpdateLastNameValue = {setUpdateLastNameValue} setUpdateGraduationValue = {setUpdateGraduationValue}/>}
                </div>}
            {activeTab === "delete" && 
                <div className="placeholder">
                    <p>Delete Student</p>
                    <div className="entry-list">
                        {studentSearchList && studentSearchList.map((item,index)=>{
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