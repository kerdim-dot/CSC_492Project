import { useEffect, useState } from "react";
import '../dashboard.css'
import axios from "axios";
import { GraduationConverter } from "../tools/GraduationConverter";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard(){

    
    const [classes, setClasses] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    const [students, setStudents] = useState([]);

    const [currentYear, setCurrentYear] = useState(2026);
    const [currentSemester, setCurrentSemester] = useState(2);

    const [studentsActive, setStudentsActive] = useState();

    const [behindCount, setBehindCount] = useState(null);
    const [onTimeCount, setOnTimeCount] = useState(null);

    useEffect(()=>{
            
            const retriveClassData = async() =>{
                const classData = await axios.get('http://localhost:8080/test/get/classes');
                setClasses(classData.data);
                console.log("class fetch:", classData.data);
            }
    
            const retriveStudentData = async() =>{
                const studentData = await axios.get('http://localhost:8080/test/get/students');
                const updatedStudents = studentData.data.map((item) => ({
                    ...item,
                    graduationFormula: GraduationConverter(item.graduationDate)
                }));
                setStudents(updatedStudents);
            }
    
            const retriveEnrollmentData = async() =>{
                const enrollmentData = await axios.get('http://localhost:8080/test/get/enrollments');
                setEnrollment(enrollmentData.data);
                console.log("enrollment fetch:",enrollmentData.data);
            }
    
            retriveClassData();
            retriveStudentData();
            retriveEnrollmentData();
    
    },[])

    useEffect(()=>{
        if(enrollment.length > 0 && classes.length > 0 && students.length > 0){

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

            // checks how many semesters a student has, not including the current semester
            function timeCalculator(student){
                const graduationSemester = student.graduationFormula.substring(0,student.graduationFormula.indexOf("/"));
                const graduationYear = student.graduationFormula.substring(1+student.graduationFormula.indexOf("/"));
                const timerFormula =  ((graduationYear - currentYear)*2) + (graduationSemester - currentSemester)
                return timerFormula;
            }

            // checks if the student is behind in any classes and adds the isBehind field to the student object
            // used to flag if a student is behind on any classes
            /* right now this is O (n^3), need to make this better
            */

            let behindGroupping = 0;
            let onTimeGroupping = 0;

            students.map((studentItem)=>{
                let isBehind = false;
                const studentSemestersLeft = timeCalculator(studentItem);
                classes.forEach((classItem)=>{
                    const headerNumber = Number(classItem.header.substring(classItem.header.indexOf("-")+1,classItem.header.indexOf("-")+2));
                    const hasTakenClass = enrollmentMap[studentItem.student_id].includes(classItem.class_id);
                    const classSemesters = 8-(headerNumber*2)
                    if(!hasTakenClass && studentSemestersLeft<=classSemesters){
                        //console.log(classItem.header,classSemesters,studentSemestersLeft);
                        isBehind = true;
                    }

                })
                studentItem.isBehind = isBehind;

                if(studentItem.isBehind){
                    behindGroupping+=1;
                }
                else{
                    onTimeGroupping+=1;
                }  
            })

            setBehindCount(behindGroupping);
            setOnTimeCount(onTimeGroupping);
            setStudentsActive(students);
        }
            // replace this with a fetch students method

        //fetch classes and enrollment in here as well

        // key is studentsId, value is a list of classes they have taken
        
    },[enrollment, students, classes])

    return(
        <div>
            <GraphComparison behindCount={behindCount} onTimeCount={onTimeCount}/>
        </div>
    )
}

export default Dashboard


function GraphComparison({behindCount, onTimeCount}){

    const data = {
        labels: ["Behind", "On Time"],
        datasets: [
            {
            label: "Student Progress",
            data: [
                behindCount || 0,
                onTimeCount || 0
            ],
            backgroundColor: [
                "#ff6384", // red-ish
                "#36a2eb"  // blue
            ],
            borderColor: [
                "#ff6384",
                "#36a2eb"
            ],
            borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: "bottom"
            }
        }
    };

    return(
        <div style={{ width: "400px", margin: "0 auto" }}>
            <h3>Student Progress</h3>

            {behindCount !== null && onTimeCount !== null && (
            <Doughnut data={data} options={options} />
            )}
        </div>
    )
}