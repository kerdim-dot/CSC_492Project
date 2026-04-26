import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"
import { useEffect, useState } from "react";
import axios from "axios";
import { findPreReqs } from "../tools/treeBuilder";

function EnrollmentManager(){

    const [studentSearchList, setStudentSearchList] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);

    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    const [prerequisiteMapping, setPrerequisiteMapping] = useState([]);

    const [updateHappenedSwitch, setUpdateHappenedSwitch] = useState(true);

    /* Backend Needs
    - Fetch students c
    - Fetch classes c
    - Fetch Enrollment c
    - delete Enrollment
    - update Enrollment
    */

    useEffect(()=>{
        
        const retriveClassData = async() =>{
            const classData = await axios.get('http://localhost:8080/test/get/classes');
            setClasses(classData.data);
            console.log("class fetch:", classData.data)
        }

        const retriveStudentData = async() =>{
            const studentData = await axios.get('http://localhost:8080/test/get/students');
            setStudents(studentData.data);
            console.log("student fetch:", studentData.data)
        }

        const retriveEnrollmentData = async() =>{
            const enrollmentData = await axios.get('http://localhost:8080/test/get/enrollments');
            setEnrollment(enrollmentData.data)
            console.log("enrollment fetch:",enrollmentData.data)
        }

        const retrivePrerequisiteMappingData = async() =>{
            const prerequisiteMappingData = await axios.get('http://localhost:8080/test/get/prequisiteMapping');
            setPrerequisiteMapping(prerequisiteMappingData.data)
            console.log("prerequisite fetch:",prerequisiteMappingData.data)
        }

        retriveClassData();
        retriveStudentData();
        retriveEnrollmentData();
        retrivePrerequisiteMappingData();

    },[updateHappenedSwitch])


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
    //     {enrollmentId:1,studentId:2, classId:1, status: 2},
    //     {enrollmentId:2,studentId:2, classId:2, status: 2},
    //     {enrollmentId:3,studentId:2, classId:3, status: 1},
    //     {enrollmentId:5,studentId:1, classId:1, status: 2},
    //     {enrollmentId:6,studentId:1, classId:2, status: 2},
    //     {enrollmentId:7,studentId:1, classId:3, status: 1},
    //     {enrollmentId:8,studentId:1, classId:4, status: 1}
    // ]

    // const students = [
    //         {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", isMajor:true ,classes:null, credits:0},
    //         {studentId:2,firstName:"John" , lastName:"Doe", graduation: "2/2028", isMajor:true ,classes:null, credits:0}
    // ]

    return(
        <div>
            <SearchBar students = {students} setStudentSearchList={setStudentSearchList}/>
            <StudentList setIsBeginning = {setIsBeginning} studentSearchList={studentSearchList} selectedStudentId = {selectedStudentId} setSelectedStudentId={setSelectedStudentId} prerequisiteMapping={prerequisiteMapping}/>
            <UpdateBlock isBeginning = {isBeginning} classes={classes} enrollment={enrollment} selectedStudentId={selectedStudentId} setSelectedStudentId={setSelectedStudentId} prerequisiteMapping={prerequisiteMapping} setUpdateHappenedSwitch={setUpdateHappenedSwitch}/>
        </div>
    )
}


function SearchBar({students, setStudentSearchList}){
    const [searchInput, setSearchInput] = useState();

    useEffect(()=>{
        if(students.length > 0){
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
            <input type="search" className="search-input" placeholder="Search Student..." value = {searchInput} onChange={(e)=>{setSearchInput(e.target.value)}}></input>
            <img src={filter} className="filter"></img>
        </div>
    )
}



function UpdateBlock({isBeginning, classes, enrollment, selectedStudentId, setSelectedStudentId, prerequisiteMapping, setUpdateHappenedSwitch}){
    const [studentEnrollmentMap, setStudentEnrollmentMap] = useState({});
    const [selectedClasses, setSelectedClasses] = useState([]);

    useEffect(()=>{
        if(enrollment.length > 0 && classes.length > 0){
            const enrollmentMap = {};

            enrollment.forEach((item)=>{
                if(!enrollmentMap[item.student_id]){
                    enrollmentMap[item.student_id] = [];
                }
                enrollmentMap[item.student_id].push({classId: item.mountClass_id, status: item.status});
            });

            const result = {};

            Object.keys(enrollmentMap).forEach((key) => {
                classes.forEach((classs) => {
                    enrollmentMap[key].forEach((enrollment)=>{
                        if(enrollment.classId == classs.class_id){
                            if(!result[key]){
                                result[key] = []
                            }
                            result[key].push({classHeader: classs.header, status: enrollment.status})
                        }
                    })
                });
            });

            setStudentEnrollmentMap(result);
        }
    },[classes, enrollment]);

    // clear selections when switching students or closing the panel
    useEffect(() => {
        setSelectedClasses([]);
    }, [selectedStudentId]);

    const codeClasses = (currentClass) => {
        if(prerequisiteMapping){
            const prereqs = findPreReqs(prerequisiteMapping, classes, currentClass.header);
            const enrolledHeaders = (studentEnrollmentMap[selectedStudentId] || [])
                .map(e => e.classHeader);

            if (
                selectedStudentId &&
                studentEnrollmentMap[selectedStudentId] &&
                studentEnrollmentMap[selectedStudentId].some(
                    enrollment => enrollment.classHeader === currentClass.header
                )
            ) {
                return "class-complete";
            } else if (
                selectedStudentId &&
                prereqs.every(prereq => enrolledHeaders.includes(prereq))
            ) {
                return "class-available";
            } else if (selectedStudentId) {
                return "class-blocked";
            }
        }
    }

    const toggleClassSelection = (classHeader, status) => {
        if (status !== "class-available") return;

        setSelectedClasses(prev =>
            prev.includes(classHeader)
                ? prev.filter(h => h !== classHeader)
                : [...prev, classHeader]
        );
    };

    const buildClassName = (status, isSelected) => {
        let base = "class-pool";
        if (isSelected){
            base += " highlight";
        } 
        else if (status === "class-complete"){
            base += " completedClass";
        } 
        else if (status === "class-available"){
            base += " availableClass";
        } 
        else if (status === "class-blocked"){
            base += " blockedClass";
        } 
        return base;
    };

    const addEnrollmentsToStudent = async () => {
        try {
            const requests = [];
            for (let i = 0; i < selectedClasses.length; i++) {
                const cls = classes.find(c => c.header === selectedClasses[i]);
                if (cls) {
                    const enrollmentDTO = {
                        student_id: selectedStudentId,
                        mountClass_id: cls.class_id,
                        status: 1,
                        grade:'A',
                        enrollment_date:new Date().toISOString().split("T")[0]
                    };
                    requests.push(
                        axios.post(`http://localhost:8080/test/add/enrollment?id=${selectedStudentId}`, enrollmentDTO)
                    );
                }
            }
            await Promise.all(requests);
            setSelectedClasses([]);
            setUpdateHappenedSwitch(prev => !prev);
        } catch (error) {
            console.error("Failed to add enrollments:", error);
        }
    };

    const deleteAllStudentEnrollments = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/test/delete/student/enrollment?id=${selectedStudentId}`
            );
            if (response.status === 200) {
                setUpdateHappenedSwitch(prev => !prev)
            }
        } catch (error) {
            console.error("Failed to delete enrollments:", error);
        }
    };

    return(
        <div className={selectedStudentId ? "update-student-panel-out" : isBeginning ? "update-student-panel" : "update-student-panel-hidden"}>
            <img className="close-img-two" src={close} onClick={()=>{setSelectedStudentId(null)}} />

            <p className="student-panel-title">Update Enrollment Panel</p>

            {classes.map((item) => {
                const status = codeClasses(item);
                const isSelected = selectedClasses.includes(item.header);

                return (
                    <button
                        key={item.class_id}
                        className={buildClassName(status, isSelected)}
                        onClick={() => toggleClassSelection(item.header, status)}
                        disabled={status !== "class-available"}
                    >
                        {item.header}
                    </button>
                );
            })}
            <div>
                <button className="panel-button" onClick={addEnrollmentsToStudent}>Confirm Enrollment</button>
                <button className="panel-button" onClick={deleteAllStudentEnrollments}>Reset Student Enrollment</button>
            </div>

        </div>
    )
}



function StudentList({setIsBeginning, studentSearchList,selectedStudentId ,setSelectedStudentId}){

    const selectEntry = (studentId) =>{
        setIsBeginning(false);
        setSelectedStudentId(studentId);
    }


    return(
        <div className="placeholder">
            <div className="entry-list">
                {studentSearchList && studentSearchList.map((item,index)=>{
                    return(
                    <div 
                        className={selectedStudentId === item.student_id ? "entry highlighted": "entry"}
                        onClick={() => selectEntry(item.student_id)}
                    >
                        <p>{item.firstName} {item.lastName}</p>
                        <p>{item.graduation}</p>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}

export default EnrollmentManager;