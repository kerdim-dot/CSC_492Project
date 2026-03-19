import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import "../searchers.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function Students(){

    const [studentSearchList, setStudentSearchList] = useState(null);
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

    return(
        <div className="students-container">
            <SearchBar students = {students} setStudentSearchList = {setStudentSearchList} studentsActive = {studentsActive}/>
            <StudentList studentSearchList = {studentSearchList}/>
        </div>
        
    )
}

export default Students;

//function which takes the input of the search and gets people that match input

//function which opens up a filter menu, where we can see students with certain attributes

function SearchBar({students, setStudentSearchList, studentsActive}){
    
    const [searchInput, setSearchInput] = useState(null);

    useEffect(()=>{
        if(studentsActive){
            setStudentSearchList(studentsActive)
        }
    },[studentsActive])

    const searchExplorer = () =>{
        const searchResult = studentsActive.filter((item) => checkEqual(item, searchInput));
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
            <input type="search" className="search-input" value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}} placeholder="Search Student..."></input>
            <img src={filter} className="filter"></img>
        </div>
    )
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

        <div className="entry-list">
            {studentSearchList && studentSearchList.map((item,index)=>{
                return(
                <div className= {item.isBehind? "entry behind" : "entry"} onClick={()=>{navigate(`/students/${item.firstName}/${item.lastName}`)}}>
                    <p>{item.firstName} {item.lastName}</p>
                    <p>{item.graduation}</p>
                </div>
                )
            })}
        </div>
    ) 
}