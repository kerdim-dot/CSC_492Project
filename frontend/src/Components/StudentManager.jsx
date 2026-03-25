import { useEffect, useState } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"

function StudentManager(){
  const [activeTab, setActiveTab] = useState("update");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [studentSearchList,setStudentSearchList] = useState(null);


    const [updateFirstNameValue, setUpdateFirstNameValue] = useState(null);
    const [updateLastNameValue, setUpdateLastNameValue] = useState(null);
    const [updateGraduationValue, setUpdateGraduationValue] = useState(null);

    const [startDate, setStartDate]= useState(null);
    const [endDate, setEndDate]= useState(null);
    const [showFilter,setShowFilter] = useState(false);
    const [overview, setOverview] = useState("All");

    const [searchInput, setSearchInput] = useState(null);

    const [studentsActive, setStudentsActive] = useState(null);
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentSemester, setCurrentSemester] = useState(2);

  const classes = [
        {classId:1, title:	"Programming Problem Solving I",header:"CSC-120", credits: 4, isActive: true,isRequired:true}, 
        {classId:2,title: "Programming Problem Solving II" ,header:"CSC-220", credits: 4,isActive: true,isRequired:true},
        {classId:3,title:"Computer Organization" , header:"CSC-270", credits: 4,isActive: true,isRequired:true}, 
        {classId:4,title:"Database Theory Implementation",header:"CSC-310", credits: 4,isActive: true,isRequired:true}, 
        {classId:5,title:"Algorithms and Data Structures",header:"CSC-320", credits: 4,isActive: true,isRequired:true}, 
        {classId:6,title:"Computer Networks",header:"CSC-360", credits: 4,isActive: false,isRequired:true}, 
        {classId:7,title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2,isActive: false,isRequired:true}, 
        {classId:8,title:"Practice Software Engineering",header:"CSC-492", credits: 2,isActive: false,isRequired:true}
    ];

    const enrollment = [
        {enrollmentId:1,studentId:1, classId:1},
        {enrollmentId:2,studentId:1, classId:2},
        {enrollmentId:3,studentId:1, classId:3},
        {enrollmentId:4,studentId:2, classId:1},
    ]

    const students = [
            {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", isMajor:true ,classes:null, credits:0},
            {studentId:2,firstName:"John" , lastName:"Doe", graduation: "2/2028", isMajor:true ,classes:null, credits:0}
    ]

useEffect(()=>{

        if(enrollment && classes && students){
            const enrollmentMap = {};

            enrollment.forEach((item, index)=>{
                if(!enrollmentMap[item.studentId]){
                    enrollmentMap[item.studentId] = [];
                }
                enrollmentMap[item.studentId].push(item.classId);
            })

            //console.log(enrollmentMap)

            students.sort((a,b)=>{return a.lastName.localeCompare(b.lastName)})

            // checks how many semesters a student has, not including the current semester
            function timeCalculator(student){
                const graduationSemester = student.graduation.substring(0,student.graduation.indexOf("/"));
                const graduationYear = student.graduation.substring(1+student.graduation.indexOf("/"));
                const timerFormula =  ((graduationYear - currentYear)*2) + (graduationSemester - currentSemester)
                return timerFormula;
            }

            // checks if the student is behind in any classes and adds the isBehind field to the student object
            // used to flag if a student is behind on any classes
            /* right now this is O (n^3), need to make this better
            */
            students.map((studentItem)=>{
                let isBehind = false;
                const studentSemestersLeft = timeCalculator(studentItem);
                classes.forEach((classItem)=>{
                    const headerNumber = Number(classItem.header.substring(classItem.header.indexOf("-")+1,classItem.header.indexOf("-")+2));
                    const hasTakenClass = enrollmentMap[studentItem.studentId].includes(classItem.classId);
                    const classSemesters = 8-(headerNumber*2)
                    if(!hasTakenClass && studentSemestersLeft<=classSemesters){
                        //console.log(classItem.header,classSemesters,studentSemestersLeft);
                        isBehind = true;
                    }
                })
                studentItem.isBehind = isBehind;
            })

            setStudentsActive(students);
        }
         // replace this with a fetch students method

        //fetch classes and enrollment in here as well

        // key is studentsId, value is a list of classes they have taken
        
    },[])

    useEffect(() => {
    if (!studentsActive) return;

        let filtered = [...studentsActive];

        if (searchInput) {
            filtered = filtered.filter((item) => {
                const fullName = (item.firstName + " " + item.lastName).toLowerCase();
                return fullName.includes(searchInput.toLowerCase());
            });
        }
        if (overview === "Behind Schedule") {
            filtered = filtered.filter((item) => item.isBehind);
        } else if (overview === "On Schedule") {
            filtered = filtered.filter((item) => !item.isBehind);
        }

        if (startDate) {
            filtered = filtered.filter((item) => {
                const gradYear = item.graduation.split("/")[1];
                return gradYear >= new Date(startDate).getFullYear();
            });
        }

        if (endDate) {
            filtered = filtered.filter((item) => {
                const gradYear = item.graduation.split("/")[1];
                return gradYear <= new Date(endDate).getFullYear();
            });
        }

        setStudentSearchList(filtered);

    }, [studentsActive, searchInput, overview, startDate, endDate]);

  
  return (
    <div className="tab-pane-container">
      <div className="top-container">
            <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab} setSelectedEntry={setSelectedEntry}/>
            {(activeTab === "delete" || activeTab === "update") && <SearchBar   searchInput={searchInput} setSearchInput={setSearchInput} setShowFilter={setShowFilter}/>}
      </div>

       {showFilter && <FilterBlock startDate={startDate} setStartDate={setStartDate} endDate = {endDate} setEndDate={setEndDate} setShowFilter={setShowFilter} overview={overview} setOverview ={setOverview}/>}

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

function SearchBar({ searchInput, setSearchInput, setShowFilter }) {
  return (
    <div className="search-two">
      <img src={search} className="search-icon" />
      <input
        type="search"
        className="search-input"
        placeholder="Search Student..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <img src={filter} className="filter" onClick={() => setShowFilter(true)} />
    </div>
  );
}


function FilterBlock({ startDate, endDate, setStartDate, setEndDate, setShowFilter, overview,setOverview}) {

    const onReset = ()=>{
        setStartDate("");
        setEndDate("");
        setOverview("All");
    }

    const onFilter = () =>{

    }
    console.log(overview)

    return (
        <div>
            <div className="filter-container">
                <img className="close-img" src={close} onClick={()=>{setShowFilter(false)}}></img>
                <p className="filter-title">Filter Students</p>

                <div className="filter-group">
                    <label>Graduation Start</label>
                    <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Graduation End</label>
                    <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="filter-graduation-overview">
                    <label>Graduation Overview</label>
                    <select className="graduation-select" value={overview} onChange={(e)=>setOverview(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Behind Schedule">Behind Schedule</option>
                        <option value="On Schedule">On Schedule</option>
                    </select>
                </div>

                <div className="filter-buttons">
                    <button onClick={onFilter} className="btn-apply">Apply Filter</button>
                    <button onClick={onReset} className="btn-reset">Reset</button>
                </div>
            </div>

            <div className="blocker">
            </div>

        </div>
    );
}


function UpdateBlock(updateFirstNameValue, updateLastNameValue, updateGraduationValue, setUpdateFirstNameValue, setUpdateLastNameValue,setUpdateGraduationValue){
    
        return(
            <div className="update-student-panel">
                

                <img className="close-img-two" src={close}></img>

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
                            <div className={item.isBehind? "entry behind" : "entry"} onClick={()=>{clickOnEntry(item)}} >
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
                            <div className={item.isBehind? "entry behind" : "entry"} onClick={()=>{makeSelectedEntry(item.studentId)}}>
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