import "../student_zoom.css"
import { useLocation } from 'react-router';
import { useEffect, useState } from "react";
import axios from 'axios';
import { GraduationConverter } from "../tools/GraduationConverter";
import { useNavigate } from "react-router-dom";
// import Schedule from "../Components/Schedule.jsx"
// might need this? we'll see.
// import { buildRoots,buildTree, findPreReqs, findParams } from "../tools/treeBuilder";
// import Students from './Students';

function StudentZoom(){
    
    // grab my student's id from the path
    const path_student_id = useLocation().pathname.split("/").pop();

    const [studentData, setStudentData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [student, setStudent] = useState(null);
    const [pairedEnrollments, setPairedEnrollments] = useState([]);

    // im keeping these just so if we want to eventually make the browser check data when we load
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentSemester, setCurrentSemester] = useState(2);

    useEffect(()=>{
        

        // here im getting all the responses all neat-like
        const fetchAllData = async () => {
            try {
                const [classesRes, studentsRes, enrollmentsRes] = await Promise.all([
                    axios.get('http://localhost:8080/test/get/classes'),
                    axios.get('http://localhost:8080/test/get/students'),
                    axios.get('http://localhost:8080/test/get/enrollments')
                ]);

                setClassData(classesRes.data);

                // adding graduationFormula to students
                const studentsWithGraduation = studentsRes.data.map(s => ({
                    ...s,
                    graduationFormula: GraduationConverter(s.graduationDate)
                }));
                setStudentData(studentsWithGraduation);

                setEnrollmentData(enrollmentsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

    // alright go do it
    fetchAllData();
    },[])


    // time to grab our student.. beautiful student number :{id}
    useEffect(() => {
        // making sure this data isnt null
        if (!studentData.length || !classData.length || !enrollmentData.length) return;

        // grab the specific student
        const foundStudent = studentData.find(s => String(s.student_id) === String(path_student_id));
        if (!foundStudent) return;

        // grab this student's enrollments
        const studentEnrolls = enrollmentData.filter(e => String(e.student_id) === String(path_student_id));

        // pair the enrollments with class info
        const paired = studentEnrolls.map(e => ({
            ...e,
            class: classData.find(c => c.class_id === e.mountClass_id)
        }));

        // check if the student is behind
        const takenClassIds = new Set(studentEnrolls.map(e => e.mountClass_id));
        const [gradSemesterStr, gradYearStr] = foundStudent.graduationFormula.split("/");
        const semestersLeft = (Number(gradYearStr) - currentYear) * 2 +
                              (Number(gradSemesterStr) - currentSemester);

        const isBehind = classData.some(c => {
            const headerNumber = Number(c.header.split("-")[1]?.[0] || 0);
            const classSemesters = 8 - (headerNumber * 2);
            return !takenClassIds.has(c.class_id) && semestersLeft <= classSemesters;
        });

        setStudent({ ...foundStudent, isBehind });
        setPairedEnrollments(paired);

    }, [studentData, classData, enrollmentData, path_student_id, currentYear, currentSemester]);

    console.log("Student:", student);
    console.log("Paired Enrollments:", pairedEnrollments);

    return (
        <div className="student-zoom-container">
            <StudentInfo student={student} />
            {/* <ScheduleSection student={student} pairedEnrollments={pairedEnrollments} /> */}
            <InProgress student={student} pairedEnrollments={pairedEnrollments} />
            <Completed student={student} pairedEnrollments={pairedEnrollments} />
            <Incomplete student={student} pairedEnrollments={pairedEnrollments} />
        </div>
    );
}

export default StudentZoom;

// I'm having issues with the schedule, this will probably take some time to restructure everything
// function ScheduleSection({ student }) {
//     return (
//         <div>
//             <p>Schedule for {student?.firstName} {student?.lastName}</p>
//             <ScheduleBlock />
//         </div>
//     );
// }

function InProgress({ pairedEnrollments }) {
    const navigate = useNavigate();
    const inProgress = pairedEnrollments?.filter(e => e.status === 1);
    console.log(inProgress[0]);
    return (
        <div className="section">
            <p className="section-title">Classes in Progress:</p>
            {inProgress?.map(e => (
                <div key={`${e.enrollmentId ?? e.mountClass_id}`} className={`class-item ${e.isBehind ? 'behind' : ''}`} onClick={()=>{navigate(`/classes/${e?.class.header}`)}}>
                        <p className="class-title">{e.class?.title}</p>
                        <p className="class-status">In Progress</p>
                    </div>
            ))}
        </div>
    );
}

function Completed({ pairedEnrollments }) {
    const navigate = useNavigate();
    const completed = pairedEnrollments?.filter(e => e.status === 2);
    return (
        <div className="section">
            <p className="section-title">Classes Completed:</p>
            <div className="class-list">
                {completed?.map(e => (
                    <div key={`${e.enrollmentId ?? e.mountClass_id}`} className="class-item" onClick={()=>{navigate(`/classes/${e?.class.header}`)}}>
                        <p className="class-title">{e.class?.title}</p>
                        <p className="class-status">Completed</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Incomplete({ pairedEnrollments }) {
    const navigate = useNavigate();
    const incomplete = pairedEnrollments?.filter(e => e.status === 0);
    return (
        <div className="section">
            <p className="section-title">Classes Incomplete:</p>
            <div className="class-list">
                {incomplete?.map(e => (
                    <div key={`${e.enrollmentId ?? e.mountClass_id}`} className="class-item" onClick={()=>{navigate(`/classes/${e?.class.header}`)}}>
                        <p className="class-title">{e.class?.title}</p>
                        <p className="class-status">Incomplete</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StudentInfo({ student }) {
    if (!student) return null;

    return (
        <div className="student-info">
            <p className="student-name">
                {student.firstName} {student.lastName}
            </p>
            <div className="student-details">
                <span>Student ID: {student.student_id}</span>
                <span>Graduation: {student.graduationFormula}</span>
                <span className={`student-status ${student.isBehind ? 'status-behind' : 'status-on-track'}`}>
                    {student.isBehind ? 'Behind' : 'On Track'}
                </span>
            </div>
        </div>
    );
}