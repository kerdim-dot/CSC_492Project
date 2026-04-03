import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"
import { useEffect, useState } from "react";

function EnrollmentManager(){

    const [studentSearchList, setStudentSearchList] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

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
        {enrollmentId:1,studentId:2, classId:1, status: 2},
        {enrollmentId:2,studentId:2, classId:2, status: 2},
        {enrollmentId:3,studentId:2, classId:3, status: 1},
        {enrollmentId:5,studentId:1, classId:1, status: 2},
        {enrollmentId:6,studentId:1, classId:2, status: 2},
        {enrollmentId:7,studentId:1, classId:3, status: 1},
        {enrollmentId:8,studentId:1, classId:4, status: 1}
    ]

    const students = [
            {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", isMajor:true ,classes:null, credits:0},
            {studentId:2,firstName:"John" , lastName:"Doe", graduation: "2/2028", isMajor:true ,classes:null, credits:0}
    ]

    return(
        <div>
            <SearchBar students = {students} setStudentSearchList={setStudentSearchList}/>
            <StudentList studentSearchList={studentSearchList} selectedStudentId = {selectedStudentId} setSelectedStudentId={setSelectedStudentId}/>
            <UpdateBlock classes={classes} enrollment={enrollment} selectedStudentId={selectedStudentId}/>
        </div>
    )
}


function SearchBar({students, setStudentSearchList}){
    const [searchInput, setSearchInput] = useState();

    useState(()=>{
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
            <input type="search" className="search-input" placeholder="Search Student..." value = {searchInput} onChange={(e)=>{setSearchInput(e.target.value)}}></input>
            <img src={filter} className="filter"></img>
        </div>
    )
}

function UpdateBlock({classes, enrollment, selectedStudentId}){
    const [studentEnrollmentMap, setStudentEnrollmentMap] = useState({});

    useEffect(()=>{
        if(enrollment && classes){
            const enrollmentMap = {};

            enrollment.forEach((item)=>{
                if(!enrollmentMap[item.studentId]){
                    enrollmentMap[item.studentId] = [];
                }
                enrollmentMap[item.studentId].push({classId: item.classId, status: item.status});
            });

            const result = {};

            Object.keys(enrollmentMap).forEach((key) => {
                classes.forEach((classs) => {
                    enrollmentMap[key].forEach((enrollment)=>{
                        if(enrollment.classId == classs.classId){
                            if(!result[key]){
                                result[key] = []
                            }
                            result[key].push({classHeader: classs.header, status: enrollment.status})
                        }
                    })
                });
            });

            setStudentEnrollmentMap(result);
            console.log(result)
        }
    },[classes,enrollment]);

    return(
        <div className="update-student-panel">
            <img className="close-img-two" src={close}></img>

            <p className="student-panel-title">Update Enrollment Panel</p>

            {classes.map((item)=>{
                const isEnrolled = 
                    selectedStudentId &&
                    studentEnrollmentMap[selectedStudentId] &&
                    studentEnrollmentMap[selectedStudentId].some(enrollment => enrollment.classHeader === item.header);;

                return(
                    <button className={isEnrolled ? "completedClass" : ""}>
                        {item.header}
                    </button>
                )
            })}

            <button className="panel-button">Confirm</button>
        </div>
    )
}

function StudentList({studentSearchList,selectedStudentId ,setSelectedStudentId}){
    return(
        <div className="entry-list">
            {studentSearchList && studentSearchList.map((item,index)=>{
                return(
                <div 
                    className={selectedStudentId === item.studentId ? "entry highlighted": "entry"}
                    onClick={() => setSelectedStudentId(item.studentId)}
                >
                    <p>{item.firstName} {item.lastName}</p>
                    <p>{item.graduation}</p>
                </div>
                )
            })}
        </div>
    )
}

export default EnrollmentManager;