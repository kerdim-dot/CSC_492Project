import "../class_zoom.css"
import { useLocation } from 'react-router';
import { useEffect, useState } from "react";
import axios from 'axios';
import { GraduationConverter } from "../tools/GraduationConverter";
import { useNavigate } from "react-router-dom";

function ClassZoom() {

    const path_class_header = useLocation().pathname.split("/").pop();
    console.log(path_class_header)

    const [studentData, setStudentData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [pairedEnrollments, setPairedEnrollments] = useState([]);

    // im keeping these just so if we want to eventually make the browser check data when we load
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentSemester, setCurrentSemester] = useState(2);

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin" || role === "supervisor";


    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [classesRes, studentsRes, enrollmentsRes] = await Promise.all([
                    axios.get('http://localhost:8080/test/get/classes'),
                    axios.get('http://localhost:8080/test/get/students'),
                    axios.get('http://localhost:8080/test/get/enrollments')
                ]);

                setClassData(classesRes.data);

                // Add graduationFormula to students
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
        fetchAllData();
    }, []);

    // fetches enrollments based on classId
    useEffect(() => {
        const class_id = 1;
        const fetchCertainClassEnrollments = async () => {
            const enrollmentData = await axios.get(`http://localhost:8080/test/get/class/enrollment?id=${class_id}`);
            console.log("Enrollment Example for calss with id 1: ", enrollmentData.data)
        }
        fetchCertainClassEnrollments();
    }, [enrollmentData])

    useEffect(() => {
        if (!studentData.length || !classData.length || !enrollmentData.length) return;

        // Find the class we are zooming into
        const foundClass = classData.find(c => c.header === path_class_header);
        if (!foundClass) return;

        // Grab enrollments for this class and pair each with its student
        const classEnrollments = enrollmentData
            .filter(e => e.mountClass_id === foundClass.class_id)
            .map(e => ({
                ...e,
                student: studentData.find(s => s.student_id === e.student_id)
            }));

        setSelectedClass(foundClass);
        setPairedEnrollments(classEnrollments);

    }, [studentData, classData, enrollmentData, path_class_header]);

    console.log(selectedClass)
    return (
        <div className="class-zoom-container">
            <ClassInfo selectedClass={selectedClass} />

            <InProgress pairedEnrollments={pairedEnrollments} />

            {isAdmin && (
                <>
                    <Completed pairedEnrollments={pairedEnrollments} />
                    <Incomplete pairedEnrollments={pairedEnrollments} />
                </>
            )}
        </div>
    );
}

export default ClassZoom;


// Class Info Card
function ClassInfo({ selectedClass }) {
    if (!selectedClass) return null;

    return (
        <div className="class-info">
            <p className="class-title">{selectedClass.title}</p>
            <p className="class-details">Header: {selectedClass.header}</p>
            <p className="class-details">Credits: {selectedClass.credits}</p>
            <p className="class-details">Active Status: {String(selectedClass.isActive)}</p>
        </div>
    );
}


function InProgress({ pairedEnrollments }) {
    const navigate = useNavigate();
    const inProgress = pairedEnrollments?.filter(e => e.status === 1);
    return (
        <div className="section">
            <p className="section-title">Students In Progress</p>
            <div className="student-list">
                {inProgress?.map(e => (
                    <div key={`${e.student?.student_id ?? e.id}`} className="student-item" onClick={() => { navigate(`/students/${e.student?.student_id}`) }}>
                        <p className="student-name">{e.student?.firstName} {e.student?.lastName}</p>
                        <p className="student-status">Graduation: {e.student?.graduationFormula}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


function Completed({ pairedEnrollments }) {
    const navigate = useNavigate();
    const completed = pairedEnrollments?.filter(e => e.status === 2);
    return (
        <div className="section">
            <p className="section-title">Students Completed</p>
            <div className="student-list">
                {completed?.map(e => (
                    <div key={`${e.student?.student_id ?? e.id}`} className="student-item" onClick={() => { navigate(`/students/${e.student?.student_id}`) }}>
                        <p className="student-name">{e.student?.firstName} {e.student?.lastName}</p>
                        <p className="student-status">Graduation: {e.student?.graduationFormula}</p>
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
            <p className="section-title">Students Incomplete</p>
            <div className="student-list">
                {incomplete?.map(e => (
                    <div key={`${e.student?.student_id ?? e.id}`} className="student-item" onClick={() => { navigate(`/students/${e.student?.student_id}`) }} x>
                        <p className="student-name">{e.student?.firstName} {e.student?.lastName}</p>
                        <p className="student-status">Graduation: {e.student?.graduationFormula}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}