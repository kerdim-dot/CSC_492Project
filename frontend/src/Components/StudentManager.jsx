import { useEffect, useState } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"
import axios from 'axios'
import { GraduationConverter} from "../tools/GraduationConverter";
import { computerScienceMajorRequirements,computerScienceMinorRequirements,multiPlatformMajorRequirements } from "../tools/FlagFormula";
import { DisplayDate } from "../tools/DisplayDate";

/* Backend Needs
- Fetch students c
- Fetch classes c
- Fetch Enrollment c
- Add Student
- Update Student 
- Delete Student - > might have to delete all the students schedules and other entries before this can occur
*/
function StudentManager(){
  const [activeTab, setActiveTab] = useState("add");
  const [selectedDeleteEntry, setSelectedDeleteEntry] = useState(null);
  const [selectedDeleteEntries, setSelectedDeleteEntries] = useState([]);

  const [selectDeleteMultiple, setSelectDeleteMultiple] = useState(false);

  const [studentUpdateEntry, setStudentUpdateEntry] = useState(null);
  const [studentSearchList,setStudentSearchList] = useState(null);


    const [updateFirstNameValue, setUpdateFirstNameValue] = useState(null);
    const [updateLastNameValue, setUpdateLastNameValue] = useState(null);
    const [updateGraduationValue, setUpdateGraduationValue] = useState(null);
    const [updateIsComputerScienceMajor, setUpdateIsComputerScienceMajor] = useState(null);
    const [updateIsComputerScienceMinor, setUpdateIsComputerScienceMinor] = useState(null);
    const [updateIsMultiPlatformMajor, setUpdateIsMultiPlatformMajor] = useState(null);

    const [addFirstName, setAddFirstName] = useState(null);
    const [addLastName, setAddLastName] = useState(null);
    const [addGraduationDay, setAddGraduationDay] = useState(null);
    const [addGraduationMonth, setAddGraduationMonth] = useState(null);
    const [addGraduationYear, setAddGraduationYear] = useState(null);
    const [addIsComputerScienceMajor, setAddIsComputerScienceMajor] = useState(false);
    const [addIsComputerScienceMinor, setAddIsComputerScienceMinor] = useState(false);
    const [addIsMultiPlatformMajor, setAddIsMultiPlatformMajor] = useState(false);


    const [requiredComputerScienceMajorHeaders, setRequiredComputerScienceMajorHeaders] = useState(null);
    const [requiredComputerScienceMinorHeaders, setRequiredComputerScienceMinorHeaders] = useState(null);
    const [requiredMultiPlatformMajorHeaders, setRequiredMultiPlatformMajorHeaders] = useState(null);


    const [startDate, setStartDate]= useState(null);
    const [endDate, setEndDate]= useState(null);
    const [showFilter,setShowFilter] = useState(false);
    const [overview, setOverview] = useState("All");

    const [searchInput, setSearchInput] = useState(null);

    const [studentsActive, setStudentsActive] = useState(null);
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentSemester, setCurrentSemester] = useState(2);

    const[classes, setClasses] = useState([]);
    const[students, setStudents] = useState([]);
    const[enrollment, setEnrollment] = useState([]);

    const [isBeginning, setIsBeginning] = useState(true);
    const [deleteConfirmationScreen, setDeleteConfirmationScreen] = useState(false);

    const [updateList, setUpdateList] = useState(false);

    useEffect(()=>{
        
        const retriveClassData = async() =>{
            const classData = await axios.get('http://localhost:8080/test/get/classes');
            setClasses(classData.data);
            console.log("class fetch:", classData.data)
        }

        const retriveStudentData = async() =>{
            const studentData = await axios.get('http://localhost:8080/test/get/students');
            // const updatedStudents = studentData.data.map((item) => ({
            //     ...item,
            //     graduationFormula: GraduationConverter(item.graduationDate)
            // }));
            setStudents(studentData.data);
            console.log("student fetch:", studentData.data)
        }

        const retriveEnrollmentData = async() =>{
            const enrollmentData = await axios.get('http://localhost:8080/test/get/enrollments');
            setEnrollment(enrollmentData.data);
            console.log("enrollment fetch:",enrollmentData.data)
        }

        retriveClassData();
        retriveStudentData();
        retriveEnrollmentData();

    },[updateList])

//   const classes = [
//         {classId:1, title:	"Programming Problem Solving I",header:"CSC-120", credits: 4, isActive: true,isRequired:true}, 
//         {classId:2,title: "Programming Problem Solving II" ,header:"CSC-220", credits: 4,isActive: true,isRequired:true},
//         {classId:3,title:"Computer Organization" , header:"CSC-270", credits: 4,isActive: true,isRequired:true}, 
//         {classId:4,title:"Database Theory Implementation",header:"CSC-310", credits: 4,isActive: true,isRequired:true}, 
//         {classId:5,title:"Algorithms and Data Structures",header:"CSC-320", credits: 4,isActive: true,isRequired:true}, 
//         {classId:6,title:"Computer Networks",header:"CSC-360", credits: 4,isActive: false,isRequired:true}, 
//         {classId:7,title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2,isActive: false,isRequired:true}, 
//         {classId:8,title:"Practice Software Engineering",header:"CSC-492", credits: 2,isActive: false,isRequired:true}
//     ];

//     const enrollment = [
//         {enrollmentId:1,studentId:1, classId:1},
//         {enrollmentId:2,studentId:1, classId:2},
//         {enrollmentId:3,studentId:1, classId:3},
//         {enrollmentId:4,studentId:2, classId:1},
//     ]

//     const students = [
//             {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", isMajor:true ,classes:null, credits:0},
//             {studentId:2,firstName:"John" , lastName:"Doe", graduation: "2/2028", isMajor:true ,classes:null, credits:0}
//     ]

useEffect(()=>{
        if(classes.length > 0){
            const CSMajorRequirementMapping = []
            const CSMinorRequirementMapping = []
            const MPMajorRequirementMapping = []

            classes.forEach((item)=>{
                if(item.isRequiredComputerScienceMajor){
                    CSMajorRequirementMapping.push(item.header);
                }

                if(item.isRequiredComputerScienceMinor){
                    CSMinorRequirementMapping.push(item.header);
                }

                if(item.isRequiredMultiPlatformMajor){
                    MPMajorRequirementMapping.push(item.header);
                }
            })

            console.log(CSMajorRequirementMapping)
            
            setRequiredComputerScienceMajorHeaders(CSMajorRequirementMapping);
            setRequiredComputerScienceMinorHeaders(CSMinorRequirementMapping);
            setRequiredMultiPlatformMajorHeaders(MPMajorRequirementMapping);
        }
    },[classes])


useEffect(()=>{

        if(enrollment.length != 0 && classes.length != 0 && students.length != 0 && requiredComputerScienceMajorHeaders && requiredComputerScienceMinorHeaders && requiredMultiPlatformMajorHeaders){
            const enrollmentMap = {};

            enrollment.forEach((item, index)=>{
                if(!enrollmentMap[item.student_id]){
                    enrollmentMap[item.student_id] = [];
                }
                enrollmentMap[item.student_id].push(item.mountClass_id);
            })

            students.forEach((item)=>{
                if(!enrollmentMap[item.student_id]){
                    enrollmentMap[item.student_id] = [];
                }
            })

            //console.log(enrollmentMap)

            students.sort((a,b)=>{return a.lastName.localeCompare(b.lastName)})

            // checks how many semesters a student has, not including the current semester

            // checks if the student is behind in any classes and adds the isBehind field to the student object
            // used to flag if a student is behind on any classes
            /* right now this is O (n^3), need to make this better
            */
            students.map((studentItem)=>{
                let isBehind = false;
                if(studentItem.isComputerScienceMajor){
                    isBehind = isBehind || computerScienceMajorRequirements(studentItem, enrollmentMap,currentYear,currentSemester,requiredComputerScienceMajorHeaders)
                }

                if(studentItem.isComputerScienceMinor){
                    isBehind = isBehind || computerScienceMinorRequirements(studentItem, enrollmentMap,currentYear,currentSemester,requiredComputerScienceMinorHeaders)
                }

                if(studentItem.isMultiPlatformMajor){
                    isBehind = isBehind || multiPlatformMajorRequirements(studentItem, enrollmentMap,currentYear,currentSemester,requiredMultiPlatformMajorHeaders)
                }

                studentItem.isBehind = isBehind;
                console.log(studentItem)
            })


            setStudentsActive(students);
        }
         // replace this with a fetch students method

        //fetch classes and enrollment in here as well

        // key is studentsId, value is a list of classes they have taken
        
    },[enrollment,students,classes,requiredComputerScienceMajorHeaders,requiredComputerScienceMinorHeaders,requiredMultiPlatformMajorHeaders])

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
      {deleteConfirmationScreen && <DeleteConfirmation setDeleteConfirmationScreen={setDeleteConfirmationScreen} selectDeleteMultiple={selectDeleteMultiple} selectedDeleteEntries={selectedDeleteEntries} selectedDeleteEntry={selectedDeleteEntry} setSelectedDeleteEntries={setSelectedDeleteEntries} setSelectedDeleteEntry={setSelectedDeleteEntry} setUpdateList={setUpdateList}/>}
      <div className="top-container">
            <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab} setSelectedDeleteEntry={setSelectedDeleteEntry} setStudentUpdateEntry={setStudentUpdateEntry} studentUpdateEntry={studentUpdateEntry} setIsBeginning={setIsBeginning}/>
            {(activeTab === "delete" || activeTab === "update") && <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} setShowFilter={setShowFilter}/>}
      </div>

       {showFilter && <FilterBlock startDate={startDate} setStartDate={setStartDate} endDate = {endDate} setEndDate={setEndDate} setShowFilter={setShowFilter} overview={overview} setOverview ={setOverview}/>}
      
      <BodyPanel isBeginning={isBeginning} setIsBeginning={setIsBeginning} activeTab={activeTab} studentSearchList={studentSearchList} selectedDeleteEntry={selectedDeleteEntry} 
      setSelectedDeleteEntry={setSelectedDeleteEntry} updateFirstNameValue= {updateFirstNameValue} updateLastNameValue = {updateLastNameValue} addFirstName = {addFirstName} 
      addLastName = {addLastName} addGraduationDay={addGraduationDay} addGraduationMonth={addGraduationMonth} addGraduationYear={addGraduationYear} 
      addIsComputerScienceMajor = {addIsComputerScienceMajor} addIsComputerScienceMinor = {addIsComputerScienceMinor}
      addIsMultiPlatformMajor = {addIsMultiPlatformMajor} setAddIsComputerScienceMajor={setAddIsComputerScienceMajor} 
      setAddIsComputerScienceMinor={setAddIsComputerScienceMinor} setAddIsMultiPlatformMajor = {setAddIsMultiPlatformMajor}
      updateGraduationValue={updateGraduationValue} setUpdateFirstNameValue={setUpdateFirstNameValue} 
      setUpdateLastNameValue={setUpdateLastNameValue} setUpdateGraduationValue={setUpdateGraduationValue} setStudentUpdateEntry = {setStudentUpdateEntry} 
      studentUpdateEntry = {studentUpdateEntry} setDeleteConfirmationScreen={setDeleteConfirmationScreen} selectDeleteMultiple={selectDeleteMultiple} 
      setSelectDeleteMultiple={setSelectDeleteMultiple} selectedDeleteEntries = {selectedDeleteEntries} setSelectedDeleteEntries={setSelectedDeleteEntries} 
      updateIsComputerScienceMajor={updateIsComputerScienceMajor} updateIsComputerScienceMinor={updateIsComputerScienceMinor} 
      setUpdateIsComputerScienceMajor={setUpdateIsComputerScienceMajor} setUpdateIsComputerScienceMinor={setUpdateIsComputerScienceMinor} 
      updateIsMultiPlatformMajor={updateIsMultiPlatformMajor} setUpdateIsMultiPlatformMajor={setUpdateIsMultiPlatformMajor}/>

    </div>
  );
}

export default StudentManager;

function HeaderPanel({activeTab, setActiveTab, setSelectedDeleteEntry, setStudentUpdateEntry, setIsBeginning}){

    const makeAddTab = () =>{
        setActiveTab("add");
        setSelectedDeleteEntry(null);  
        setStudentUpdateEntry(null);
        setIsBeginning(true);
    }

    const makeUpdateTab = () =>{
        setActiveTab("update");
        setSelectedDeleteEntry(null);
        setStudentUpdateEntry(null);  
    }

    const makeDeleteTab = () =>{
        setActiveTab("delete")
        setStudentUpdateEntry(null);  
        setIsBeginning(true);
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
            onClick={makeDeleteTab}>
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


function UpdateBlock({isBeginning,studentUpdateEntry ,setStudentUpdateEntry,updateFirstNameValue, updateLastNameValue, updateGraduationValue, setUpdateFirstNameValue, setUpdateLastNameValue,setUpdateGraduationValue, updateIsComputerScienceMajor, setUpdateIsComputerScienceMajor, updateIsComputerScienceMinor, setUpdateIsComputerScienceMinor, updateIsMultiPlatformMajor, setUpdateIsMultiPlatformMajor}){
    const [processingStudentUpate, setProcessingStudentUpdate] = useState(false);

    const updateStudentEntry = async() =>{
        setProcessingStudentUpdate(true);
        const student = {
            firstName: updateFirstNameValue.trim(),
            lastName: updateLastNameValue.trim(),
            graduationDate:updateGraduationValue.trim(),
            isComputerScienceMajor:updateIsComputerScienceMajor.trim(),
            isComputerScienceMinor: updateIsComputerScienceMinor.trim(),
            isMultiPlatformMajor: (updateIsMultiPlatformMajor.trim()),
        }

        const impossibleFirstName = !student.firstName;
        const impossibleLastName = !student.lastName;
        const impossibleGraduationDate = !student.graduationDate && !Date(student.graduationDate);
        const impossibleComputerScienceMajor = student.isComputerScienceMajor!==true && student.isComputerScienceMajor!==false;
        const impossibleComputerScienceMinor = student.isComputerScienceMinor!==true && student.isComputerScienceMinor!==false
        const impossibleMultiPlatformMajor = student.isMultiPlatformMajor!==true && student.isMajor!==false

        const impossibleValues = impossibleFirstName || impossibleLastName || impossibleGraduationDate || impossibleComputerScienceMajor || impossibleComputerScienceMinor ||
        impossibleMultiPlatformMajor

        if(impossibleValues){
            const impossibleValueList = [];
            if(impossibleFirstName){
                impossibleValueList.push("first name");
            }
            if(impossibleLastName){
                impossibleValueList.push("last name");
            }
            if(impossibleGraduationDate){
                impossibleValueList.push("graduation date");
            }
            if(impossibleComputerScienceMajor){
                impossibleValueList.push("computer science major");
            }
            if(impossibleComputerScienceMinor){
                impossibleValueList.push("computer science minor");
            }
            if(impossibleMultiPlatformMajor){
                impossibleValueList.push("multiplatform major");
            }

            setTimeout(()=>{
                console.log(`the following fields are incorrectly filled out: ${impossibleValueList}`)
            },2000)
        }
        else if(student.isComputerScienceMajor && student.isComputerScienceMinor || student.isMultiPlatformMajor){
            setTimeout(()=>{
                console.log("You cannot have both a major and a minor in the same classes")
            },2000)
        }
        else{
            const updateStudent = await axios.put(`http://localhost:8080/test/update/student?id=${studentUpdateEntry}`,student);
        }
        setProcessingStudentUpdate(false);
        
    }

    return(
        <div className={studentUpdateEntry?"update-student-panel-out":isBeginning?"update-student-panel":"update-student-panel-hidden" }>
            

            <img className="close-img-two" src={close} onClick={()=>{setStudentUpdateEntry(null)}}></img>

            <p className="student-panel-title">Update Student Panel</p>

            <div className="panel-entry">
                <p>First Name</p>
                <input 
                    className="panel-input" 
                    value={updateFirstNameValue} 
                    onChange={(e)=>{setUpdateFirstNameValue(e.target.value)}}
                />
            </div>
            
            <div className="panel-entry">
                <p>Last Name</p>
                <input 
                    className="panel-input" 
                    value={updateLastNameValue} 
                    onChange={(e)=>{setUpdateLastNameValue(e.target.value)}}
                />
            </div>

            <div className="panel-entry">
                <p>Graduation Date</p>
                <input 
                    className="panel-input" 
                    value={updateGraduationValue} 
                    onChange={(e)=>{setUpdateGraduationValue(e.target.value)}}
                />
            </div>

            <div className="panel-entry">
                <p>Is a Computer Science Major</p>
                <input 
                    className="panel-input" 
                    value={updateIsComputerScienceMajor} 
                    onChange={(e)=>{setUpdateIsComputerScienceMajor(e.target.value)}}
                />
            </div>

            <div className="panel-entry">
                <p>Is a Computer Science Minor</p>
                <input 
                    className="panel-input" 
                    value={updateIsComputerScienceMinor} 
                    onChange={(e)=>{setUpdateIsComputerScienceMinor(e.target.value)}}
                />
            </div>
            <div className="panel-entry">
                <p>Is Multiplatorm Major</p>
                <input 
                    className="panel-input" 
                    value={updateIsMultiPlatformMajor} 
                    onChange={(e)=>{setUpdateIsMultiPlatformMajor(e.target.value)}}
                />
            </div>

            <button className="panel-button" onClick={updateStudentEntry}>{processingStudentUpate? "Processing..." : "Confirm Update"}</button>
        </div>
    )
}

function DeleteConfirmation({setDeleteConfirmationScreen,selectDeleteMultiple, selectedDeleteEntry, selectedDeleteEntries,setSelectedDeleteEntry,setSelectedDeleteEntries , setUpdateList}){

    const [isProcessing, setIsProcessing] = useState(null);
    const [inputConfirm, setInputConfirm] = useState(null);

    const deleteStudent= async() =>{
        setIsProcessing(true);
        if(selectDeleteMultiple){
            for(let i = 0; i<selectedDeleteEntries.length; i++){
                const currentStudentId = selectedDeleteEntries[i];
                const deleteStudentEnrollment = await axios.delete(`http://localhost:8080/test/delete/student/enrollment?id=${currentStudentId}`);
                console.log(deleteStudentEnrollment);
                const fetchSchedules = await axios.get(`http://localhost:8080/test/get/schedules?studentId=${currentStudentId}`);
                const scheduleIds = fetchSchedules.data;
                console.log(scheduleIds);
                for (let j = 0 ; j<scheduleIds.length; j++){
                    const deleteStudentScheduleEntries = await axios.delete(`http://localhost:8080/test/delete/schedule/entries?scheduleId=${scheduleIds[j]}`);
                    const deleteSchedule = await axios.delete(`http://localhost:8080/test/delete/schedule?id=${scheduleIds[j]}`)
                }
                const deleteStudent = await axios.delete(`http://localhost:8080/test/delete/student?id=${currentStudentId}`);
                console.log(deleteStudent.status);
            }
        }
        else{
            const currentStudentId = selectedDeleteEntry;
            console.log(currentStudentId)
            const deleteStudentEnrollment = await axios.delete(`http://localhost:8080/test/delete/student/enrollment?id=${currentStudentId}`);
            console.log(deleteStudentEnrollment);
            const fetchSchedules = await axios.get(`http://localhost:8080/test/get/schedules?studentId=${currentStudentId}`);
            const scheduleIds = fetchSchedules.data;
            console.log(scheduleIds);
            for (let j = 0 ; j<scheduleIds.length; j++){
                const deleteStudentScheduleEntries = await axios.delete(`http://localhost:8080/test/delete/schedule/entries?scheduleId=${scheduleIds[j]}`);
                const deleteSchedule = await axios.delete(`http://localhost:8080/test/delete/schedule?id=${scheduleIds[j]}`)
            }
            const deleteStudent = await axios.delete(`http://localhost:8080/test/delete/student?id=${currentStudentId}`);
            console.log(deleteStudent.status);

        }
        setUpdateList(prev => !prev)
        setIsProcessing(false);
    }

    const onCloseConfirmation = () =>{
        setDeleteConfirmationScreen(false);
        setSelectedDeleteEntries([]);
        setSelectedDeleteEntry(null);
    }

    return(
        <div className="student-delete-confirmation-overlay">
            <div className="student-delete-confirmation">
                <img className="close-img" onClick={onCloseConfirmation} src={close}></img>
                <p>Confirm Student Deletion</p>
                <p>type 'confirm' to delete Student</p>
                <p>*warning this will delete all their schedule and enrollment data</p>
                <input value={inputConfirm} onChange={(e)=>{setInputConfirm(e.target.value)}}></input>
                <button onClick={deleteStudent} disabled={inputConfirm !== "confirm"}>{isProcessing ? "processing...":"Confirm Deletion"}</button>
            </div>
        </div>
        
    )
}

function BodyPanel({isBeginning, setIsBeginning, activeTab, studentSearchList, selectedDeleteEntry, setSelectedDeleteEntry, updateFirstNameValue, 
    updateLastNameValue,updateGraduationValue, setUpdateFirstNameValue, setUpdateLastNameValue,setUpdateGraduationValue, setStudentUpdateEntry, 
    studentUpdateEntry,addGraduationDay,addGraduationMonth,addGraduationYear,setAddGraduationDay,setAddGraduationMonth,setAddGraduationYear,
    addIsComputerScienceMajor,setAddIsComputerScienceMajor,addIsComputerScienceMinor,setAddIsComputerScienceMinor,addIsMultiPlatformMajor,setAddIsMultiPlatformMajor,
    setDeleteConfirmationScreen, selectDeleteMultiple, setSelectDeleteMultiple,selectedDeleteEntries, setSelectedDeleteEntries,
    updateIsComputerScienceMajor,setUpdateIsComputerScienceMajor,updateIsComputerScienceMinor,setUpdateIsComputerScienceMinor,
    updateIsMultiPlatformMajor,setUpdateIsMultiPlatformMajor
    }){
    const [warning, setWarning] = useState(null);
    const [multipleStudentText, setMultipleStudentText] = useState(null);
    const [csvIsSelected, setcsvIsSelected] = useState(true);
    const [alreadyMajor, setAlreadyMajor] = useState(false);
    const [alreadyMinor, setAlreadyMinor] = useState(false);
    
    const makeSelectedDeleteEntry = (id) => {
        if (selectDeleteMultiple) {
            setSelectedDeleteEntries(prev => {
                if (prev.includes(id)) {
                    return prev.filter(entryId => entryId !== id);
                } else {
                    return [...prev, id];
                }
            });
        } 
        else {
            setSelectedDeleteEntry(id);
        }
    };

    const deleteEntry = () =>{
        setDeleteConfirmationScreen(true);
    }

    const structureStudentData = (text) =>{
        // csv data
        if(csvIsSelected){
            const studentEntries = text.split("\n");
            //const studentList = [];
            console.log(studentEntries)
            for (var i = 0; i<studentEntries.length; i++){
                const values = studentEntries[i].split(",");
                if(studentEntries[i].split() == "" || values.length != 4){
                    continue;
                }
                else{
                    students.push({
                        firstName: values[0],
                        lastName: values[1],
                        graduation: values[2],
                        isComputerScienceMajor: values[3],
                        isComputerScienceMinor: values[4],
                        isMultiPlatformMajor:values[5],
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
        setIsBeginning(false);
        setStudentUpdateEntry(item.student_id);
        setUpdateFirstNameValue(item.firstName);
        setUpdateLastNameValue(item.lastName);
        setUpdateGraduationValue(item.graduationDate);
        setUpdateIsComputerScienceMajor(item.isComputerScienceMajor);
        setUpdateIsComputerScienceMinor(item.isComputerScienceMinor);
        setUpdateIsMultiPlatformMajor(item.isMultiPlatformMajor);
    }

    useEffect(() => {
        if (selectDeleteMultiple) {
            setSelectedDeleteEntry(null);
        } else {
            setSelectedDeleteEntries([]);
        }
    }, [selectDeleteMultiple]);


    const addStudent = async() =>{
        const student = {
            firstName: addFirstName,
            lastName: addLastName,
            graduationDate:(addGraduationYear+"-"+addGraduationMonth+"-"+addGraduationDay) ,
            isComputerScienceMajor: addIsComputerScienceMajor, 
            isComputerScienceMinor: addIsComputerScienceMinor,
            isMultiPlatformMajor: addIsMultiPlatformMajor,
        }

        const impossibleFirstName = !student.firstName;
        const impossibleLastName = !student.lastName;
        const impossibleGraduationDate = !student.graduationDate && !Date(student.graduationDate);
        const impossibleComputerScienceMajor = student.isComputerScienceMajor!==true && student.isComputerScienceMajor!==false;
        const impossibleComputerScienceMinor = student.isComputerScienceMinor!==true && student.isComputerScienceMinor!==false
        const impossibleMultiPlatformMajor = student.isMultiPlatformMajor!==true && student.isMultiPlatformMajor!==false




        const impossibleValues = impossibleFirstName || impossibleLastName || impossibleGraduationDate || impossibleComputerScienceMajor || impossibleComputerScienceMinor ||
        impossibleMultiPlatformMajor

        if(impossibleValues){
            const impossibleValueList = [];
            if(impossibleFirstName){
                impossibleValueList.push("first name");
            }
            if(impossibleLastName){
                impossibleValueList.push("last name");
            }
            if(impossibleGraduationDate){
                impossibleValueList.push("graduation date");
            }
            if(impossibleComputerScienceMajor){
                impossibleValueList.push("computer science major");
            }
            if(impossibleComputerScienceMinor){
                impossibleValueList.push("computer science minor");
            }
            if(impossibleMultiPlatformMajor){
                impossibleValueList.push("multiplatform major");
            }
            setTimeout(()=>{
                console.log(`the following fields are incorrectly filled out: ${impossibleValueList}`)
            },2000)
        }
        else if(student.isComputerScienceMajor && student.isComputerScienceMinor){
            setTimeout(()=>{
                console.log("You cannot have both a major and a minor in the same classes")
            },2000)
        }
        else{
            const addStudent = await axios.put(`http://localhost:8080/test/add/student}`,student);
        }
        setProcessingStudentUpdate(false);
    }

    const changeIsCompMajor = () =>{

        if(addIsComputerScienceMajor){
            setAddIsComputerScienceMajor(false);
        }
        else if(!addIsComputerScienceMinor){
            setAddIsComputerScienceMajor(true);
        }
        else{
            setAlreadyMinor(true);
            setTimeout(()=>{
                setAlreadyMinor(false);
            },1500)
        }
    }
     const changeIsCompMinor = () =>{
        if(addIsComputerScienceMinor){
            setAddIsComputerScienceMinor(false);
        }
        else if(!addIsComputerScienceMajor){
            setAddIsComputerScienceMinor(true);
        }
        else{
            setAlreadyMajor(true);
            setTimeout(()=>{
                setAlreadyMajor(false);
            },1500)
        }
    }

    return(
        <div className="tab-content">
            {activeTab === "add" && 
            <div className="placeholder">
                <div className="individual-add">
                    <p>Add Student</p>
                    <div className="name-container">
                        <p>Student Name:</p>
                        <input type= "text" className="name-input" placeholder="first name" onClick={(e)=>{setUpdateFirstNameValue(e.target.value)}}/>
                        <input type= "text" className="name-input" placeholder="last name" onClick={(e)=>{setUpdateLastNameValue(e.target.value)}}/>
                    </div>
                    <div className="graduation-container">
                        <p>Grduation Date:</p>
                        <input type="text" className = "graduation-input" placeholder="DD" onClick={(e)=>{setAddGraduationDay(e.target.value)}}></input>
                        <p>-</p>
                        <input type="text" className = "graduation-input" placeholder="MM" onClick={(e)=>{setAddGraduationMonth(e.target.value)}}></input>
                        <p>-</p>
                        <input type="text" className = "graduation-input year" placeholder="YYYY" onClick={(e)=>{setAddGraduationYear(e.target.value)}}></input>
                    </div> 
                    <div className= {alreadyMinor? "boolean-container red":"boolean-container"}>
                        <label className="boolean-label">Is A Computer Science Major</label>
                        <label className={"toggle"}>
                            <input
                                type="checkbox"
                                checked={addIsComputerScienceMajor}
                                onChange={changeIsCompMajor}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className={alreadyMajor ? "boolean-container red":"boolean-container"}>
                        <label className="boolean-label">Is A Computer Science Minor</label>
                        <label className={"toggle"}>
                            <input
                                type="checkbox"
                                checked={addIsComputerScienceMinor}
                                onChange={changeIsCompMinor}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="boolean-container">
                        <label className="boolean-label">Is A Multiplatform Major</label>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={addIsMultiPlatformMajor}
                                onChange={(e) => { setAddIsMultiPlatformMajor(e.target.checked) }}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="graduation-container">
                        <button className="adding-buttons" onClick={addStudent}>Add Student</button>
                    </div>
                </div>
                <div className="mass-add">
                    <p>Add Multiple Students </p>
                    <div className="mass-btns">
                        <button className={csvIsSelected ? "mass-add-btn-active":"mass-add-btn"} onClick={()=>{setcsvIsSelected(true)}}>CSV</button>
                        <button className={csvIsSelected ? "mass-add-btn":"mass-add-btn-active"} onClick={()=>{setcsvIsSelected(false)}}>JSON</button>
                    </div>
                    <textarea className="mass-add-textarea" value={multipleStudentText} onChange={(e)=>{setMultipleStudentText(e.target.value)}}/>
                    <button className = "mass-add-button" onClick={()=>{structureStudentData(multipleStudentText)}}>Add Students</button>
                </div>
            </div>
            }
            {activeTab === "update" && 
                <div className="placeholder">
                    
                    <p>Update Student</p> 
                    <div className="entry-list">
                        {studentSearchList && studentSearchList.map((item,index)=>{
                            return(
                            <div className={item.student_id == studentUpdateEntry? "entry highlighted":item.isBehind? "entry behind" : "entry"} onClick={()=>{clickOnEntry(item)}} >
                                    <p>{item.firstName} {item.lastName}</p>
                                    <p>{item.graduationDate}</p>
                            </div>)
                        })}
                    </div>
                    {<UpdateBlock isBeginning={isBeginning} studentUpdateEntry={studentUpdateEntry} setStudentUpdateEntry = {setStudentUpdateEntry} updateFirstNameValue= {updateFirstNameValue} updateLastNameValue = {updateLastNameValue} updateGraduationValue={updateGraduationValue} setUpdateFirstNameValue = {setUpdateFirstNameValue} setUpdateLastNameValue = {setUpdateLastNameValue} setUpdateGraduationValue = {setUpdateGraduationValue} updateIsComputerScienceMajor={updateIsComputerScienceMajor} setUpdateIsComputerScienceMajor={setUpdateIsComputerScienceMajor} updateIsComputerScienceMinor={updateIsComputerScienceMinor} setUpdateIsComputerScienceMinor={setUpdateIsComputerScienceMinor} updateIsMultiPlatformMajor={updateIsMultiPlatformMajor} setUpdateIsMultiPlatformMajor={setUpdateIsMultiPlatformMajor}/>}
                </div>}
            {activeTab === "delete" && 
                <div className="placeholder">
                    <p>Delete Student</p>

                    <div>
                        <p>Mass Select</p>
                        <input checked={selectDeleteMultiple} onChange={(e) => setSelectDeleteMultiple(e.target.checked)} type="checkbox"/>
                    </div>
                    
                    <div className="entry-list">
                        {studentSearchList && studentSearchList.map((item,index)=> {
                            return (
                                <div 
                                    key={index}
                                    className={
                                        selectDeleteMultiple
                                            ? selectedDeleteEntries.includes(item.student_id)
                                                ? "entry highlighted"
                                                : item.isBehind
                                                ? "entry behind"
                                                : "entry"
                                            : item.student_id == selectedDeleteEntry
                                            ? "entry highlighted"
                                            : item.isBehind
                                            ? "entry behind"
                                            : "entry"
                                    }
                                    onClick={() => makeSelectedDeleteEntry(item.student_id)}
                                >
                                    <p>{item.firstName} {item.lastName}</p>
                                    <p>{DisplayDate(item.graduationDate)}</p>
                                </div>
                            )
                        })}
                    </div>

                    <div className="action-bar">
                        <p className="warning-text">{warning}</p>
                        <button 
                            onClick={deleteEntry} 
                            className="btn-delete-student"
                            disabled={
                                selectDeleteMultiple
                                    ? selectedDeleteEntries.length === 0
                                    : !selectedDeleteEntry
                            }
                        >
                            Delete Student
                        </button>
                    </div>
                </div>}
        </div>
    )
}