import { useLocation } from 'react-router'
import { useEffect, useState } from "react";
import { buildRoots,buildTree, findPreReqs, findParams } from "../tools/treeBuilder";
import Students from './Students';
import axios from 'axios'

function StudentZoom(){

    // this is contrived as hell but we can refine it later.

    let studentFullName = useLocation().pathname.substring(
        useLocation().pathname.indexOf("/")+10);
    let studentFirstName = studentFullName.slice(0, studentFullName.indexOf("/"))
    let studentLastName = studentFullName.substring(studentFullName.indexOf("/")+1)



    // fetch data reguarding the singular student

    // copied and pasted the logic for student handling, probably a better way to access all this

    const [selected, setSelected] = useState(null);
    const [studentList,setStudentList] = useState(null); 
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentSemester, setCurrentSemester] = useState(2);
    const [studentsActive, setStudentsActive] = useState(null);
    const [timer,setTimer] = useState(null);
    const [currentStudent,setCurrentStudent] = useState(null);
    const [studentSearchList, setStudentSearchList] = useState(null);
    const [startDate, setStartDate]= useState(null);
    const [endDate, setEndDate]= useState(null);
    const [showFilter,setShowFilter] = useState(false);
    const [overview, setOverview] = useState("All");

     useEffect(()=>{
        const student_id = 1;
        const fetchSchedules = async()=>{
            const scheduleData = await axios.get(`http://localhost:8080/test/get/schedules?studentId=${student_id}`);
            console.log(`Schedules for student ${student_id}`, scheduleData.data);
            
            for (let i = 0; i< scheduleData.data.length ; i++){
                const scheduleEntryData = await axios.get(`http://localhost:8080/test/get/scheduleEntries?scheduleId=${scheduleData.data[i].schedule_id}`);
                console.log(`Entries for schedule ${scheduleData.data[i].schedule_id}:`, scheduleEntryData.data);
            }

        }
        fetchSchedules();
    },[])

    useEffect(()=>{
        
        const retriveClassData = async() =>{
            const classData = await axios.get('http://localhost:8080/test/get/classes');
            console.log("class fetch:", classData.data)
        }

        const retriveStudentData = async() =>{
            const studentData = await axios.get('http://localhost:8080/test/get/students');
            console.log("student fetch:", studentData.data)
        }

        const retriveEnrollmentData = async() =>{
            const enrollmentData = await axios.get('http://localhost:8080/test/get/enrollments');
            console.log("enrollment fetch:",enrollmentData.data)
        }

        retriveClassData();
        retriveStudentData();
        retriveEnrollmentData();

    },[])
    

    useEffect(()=>{

        const classes = [
        {classId:1, title:"Programming Problem Solving I",header:"CSC-120", credits: 4, isActive: true,isRequired:true}, 
        {classId:2,title:"Programming Problem Solving II" ,header:"CSC-220", credits: 4,isActive: true,isRequired:true},
        {classId:3,title:"Computer Organization" , header:"CSC-270", credits: 4,isActive: true,isRequired:true}, 
        {classId:4,title:"Database Theory Implementation",header:"CSC-310", credits: 4,isActive: true,isRequired:true}, 
        {classId:5,title:"Algorithms and Data Structures",header:"CSC-320", credits: 4,isActive: true,isRequired:true}, 
        {classId:6,title:"Computer Networks",header:"CSC-360", credits: 4,isActive: false,isRequired:true}, 
        {classId:7,title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2,isActive: false,isRequired:true}, 
        {classId:8,title:"Practice Software Engineering",header:"CSC-492", credits: 2,isActive: false,isRequired:true}
        ];

        // for ease right now, class completion status is as follows:
        // 0 - Incomplete (Fail? I imagine so since it's in the list of enrollments.), 1 - In Progress, 2 - Complete

        const enrollment = [
            {enrollmentId:1,studentId:2, classId:1, status: 2},
            {enrollmentId:2,studentId:2, classId:2, status: 2},
            {enrollmentId:3,studentId:2, classId:3, status: 1},
            {enrollmentId:4,studentId:2, classId:4, status: 0},
            {enrollmentId:5,studentId:1, classId:1, status: 2},
            {enrollmentId:6,studentId:1, classId:2, status: 2},
            {enrollmentId:7,studentId:1, classId:3, status: 1},
            {enrollmentId:8,studentId:1, classId:4, status: 1}
        ]

        const students = [
            {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", isMajor:true ,classes:{}, credits:0},
            {studentId:2,firstName:"John" , lastName:"Doe", graduation: "2/2028", isMajor:true ,classes:{}, credits:0}
        ]

        if(enrollment && classes && students){
            const enrollmentMap = {};

            enrollment.forEach((item, index)=>{
                if(!enrollmentMap[item.studentId]){
                    enrollmentMap[item.studentId] = [];
                }
                enrollmentMap[item.studentId].push([item.classId, item.status]);
            })

            console.log(enrollmentMap)

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

        setStudentList(students);

    },[])


    // dang! now that that's all in there. lemme grab my student from the path?

    let zoomStudent = {};

    if (studentList) {
        studentList.map((item,index)=>{
            if(studentFirstName === item.firstName && studentLastName === item.lastName){
                zoomStudent = item;
            }

            })
        }
            console.log(zoomStudent)
    return(
        <div>
            <Schedule
                studentProp = {{zoomStudent}}
            />
            <InProgress />
            <Completed />
            <Incomplete />

        </div>
    )
}
export default StudentZoom;

function Schedule({studentProp}){
    return(
        <div>
            <p>Schedule will be inserted here...</p>
            {studentProp.zoomStudent.firstName}
        </div>
    )
}

function InProgress(){
    return(
        <div>
            <p>Classes in Progress by Student</p>
            <div>
                <p>Header</p>
            </div>
        </div>
    )
}

function Completed(){
    return(
        <div>
            <p>Classes Completed by Student</p>
            <div>
                <p>Header</p>
            </div>
        </div>
    )
}

function Incomplete(){
    return(
        <div>
            <p>Classes Incomplete by Student</p>
            <div>
                <p>Header</p>
            </div>
        </div>
    )
}
