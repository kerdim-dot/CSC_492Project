import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"
import "../searchers.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios'
import { GraduationConverter } from "../tools/GraduationConverter";
import { computerScienceMajorRequirements,computerScienceMinorRequirements,multiPlatformMajorRequirements } from "../tools/FlagFormula";
import { DisplayDate } from "../tools/DisplayDate";

function Students(){

    const [studentSearchList, setStudentSearchList] = useState(null);
    const [studentsActive, setStudentsActive] = useState(null);
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentSemester, setCurrentSemester] = useState(2);
    const [startDate, setStartDate]= useState(null);
    const [endDate, setEndDate]= useState(null);
    const [showFilter,setShowFilter] = useState(false);
    const [overview, setOverview] = useState("All");

    const [searchInput, setSearchInput] = useState("");

    const [classes, setClasses] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    const [students, setStudents] = useState([]);

    const [requiredComputerScienceMajorHeaders, setRequiredComputerScienceMajorHeaders] = useState(null);
    const [requiredComputerScienceMinorHeaders, setRequiredComputerScienceMinorHeaders] = useState(null);
    const [requiredMultiPlatformMajorHeaders, setRequiredMultiPlatformMajorHeaders] = useState(null);


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
            //console.log("student fetch:", updatedStudents)
        }

        const retriveEnrollmentData = async() =>{
            const enrollmentData = await axios.get('http://localhost:8080/test/get/enrollments');
            setEnrollment(enrollmentData.data);
            console.log("enrollment fetch:",enrollmentData.data)
        }

        retriveClassData();
        retriveStudentData();
        retriveEnrollmentData();

    },[])

    // const classes = [
    //     {classId:1, title:	"Programming Problem Solving I",header:"CSC-120", credits: 4, isActive: true,isRequired:true}, 
    //     {classId:2,title: "Programming Problem Solving II" ,header:"CSC-220", credits: 4,isActive: true,isRequired:true},
    //     {classId:3,title:"Computer Organization" , header:"CSC-270", credits: 4,isActive: true,isRequired:true}, 
    //     {classId:4,title:"Database Theory Implementation",header:"CSC-310", credits: 4,isActive: true,isRequired:true}, 
    //     {classId:5,title:"Algorithms and Data Structures",header:"CSC-320", credits: 4,isActive: true,isRequired:true}, 
    //     {classId:6,title:"Computer Networks",header:"CSC-360", credits: 4,isActive: false,isRequired:true}, 
    //     {classId:7,title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2,isActive: false,isRequired:true}, 
    //     {classId:8,title:"Practice Software Engineering",header:"CSC-492", credits: 2,isActive: false,isRequired:true}
    // ];

    // const enrollment = [
    //     {enrollmentId:1,studentId:1, classId:1},
    //     {enrollmentId:2,studentId:1, classId:2},
    //     {enrollmentId:3,studentId:1, classId:3},
    //     {enrollmentId:4,studentId:2, classId:1},
    // ]

    // const students = [
    //         {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", isMajor:true ,classes:null, credits:0},
    //         {studentId:2,firstName:"John" , lastName:"Doe", graduation: "2/2028", isMajor:true ,classes:null, credits:0}
    // ]

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

        if(enrollment.length > 0 && classes.length > 0 && students.length > 0 && requiredComputerScienceMajorHeaders && requiredComputerScienceMinorHeaders && requiredMultiPlatformMajorHeaders){

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

            students.sort((a,b)=>{return a.lastName.localeCompare(b.lastName)})


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
        
    },[enrollment, students, classes,requiredComputerScienceMajorHeaders,requiredComputerScienceMinorHeaders,requiredMultiPlatformMajorHeaders])

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

    return(
        <div className="students-container">
            {showFilter && <FilterBlock startDate={startDate} setStartDate={setStartDate} endDate = {endDate} setEndDate={setEndDate} setShowFilter={setShowFilter} overview={overview} setOverview ={setOverview}/>}
            <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} setShowFilter={setShowFilter} />
            <StudentList studentSearchList = {studentSearchList}/>
        </div>
        
    )
}

export default Students;

//function which takes the input of the search and gets people that match input

//function which opens up a filter menu, where we can see students with certain attributes




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

function SearchBar({ searchInput, setSearchInput, setShowFilter }) {
    return (
        <div className="search">
            <img src={search} className="search-icon" />
            <input
                type="search"
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Student..."
            />
            <img src={filter} className="filter" onClick={() => setShowFilter(true)} />
        </div>
    );
}

function StudentList({studentSearchList}){
    const navigate = useNavigate();
    
    // function which allows the user to click on a student and nav to individual 

   

    // useEffect(()=>{
    //     const retrieveStudents = async() =>{
    //         const studentRes = await fetch('http://localhost:8080/student/all',{
    //             method: "GET",
    //             headers: { "Content-Type": "application/json" }
    //         })
    //         const studentData = await studentRes.json();
    //         console.log(studentData);
    //     }   
    //     retrieveStudents();
    // },[])

    
   console.log(studentSearchList)


    return(

        <div className="placeholder">
            <div className="entry-list">
                {studentSearchList && studentSearchList.map((item,index)=>{
                    return(
                    <div className= {item.isBehind? "entry behind" : "entry"} onClick={()=>{navigate(`/students/${item.student_id}`)}}>
                        <p>{item.firstName} {item.lastName}</p>
                        <p>{DisplayDate(item.graduationDate)}</p>
                    </div>
                    )
                })}
            </div>
        </div>

    ) 
}