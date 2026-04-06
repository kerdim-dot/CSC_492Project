import { useEffect, useMemo, useState } from "react";
import "../dashboard.css";
import axios from "axios";
import { GraduationConverter } from "../tools/GraduationConverter";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ----------------------------- helper functions ---------------------------- */

function buildEnrollmentMap(enrollment) {
    const enrollmentMap = {};

    enrollment.forEach((item) => {
        if (!enrollmentMap[item.student_id]) {
            enrollmentMap[item.student_id] = [];
        }
        enrollmentMap[item.student_id].push(item.mountClass_id);
    });

    return enrollmentMap;
}

function getSemestersLeft(student, currentYear, currentSemester) {
    const graduationSemester = Number(
        student.graduationFormula.substring(
            0,
            student.graduationFormula.indexOf("/")
        )
    );

    const graduationYear = Number(
        student.graduationFormula.substring(
            student.graduationFormula.indexOf("/") + 1
        )
    );

    return ((graduationYear - currentYear) * 2) + (graduationSemester - currentSemester);
}

function getStudentBehindStatus(student, classes, enrollmentMap, currentYear, currentSemester) {
    const studentSemestersLeft = getSemestersLeft(student, currentYear, currentSemester);
    const takenClasses = enrollmentMap[student.student_id] || [];

    let isBehind = false;

    classes.forEach((classItem) => {
        const headerNumber = Number(
            classItem.header.substring(
                classItem.header.indexOf("-") + 1,
                classItem.header.indexOf("-") + 2
            )
        );

        const hasTakenClass = takenClasses.includes(classItem.class_id);
        const classSemesters = 8 - (headerNumber * 2);

        if (!hasTakenClass && studentSemestersLeft <= classSemesters) {
            isBehind = true;
        }
    });

    return isBehind;
}

function processStudents(students, classes, enrollment, currentYear, currentSemester) {
    const enrollmentMap = buildEnrollmentMap(enrollment);

    const processedStudents = students
        .map((student) => {
            const isBehind = getStudentBehindStatus(
                student,
                classes,
                enrollmentMap,
                currentYear,
                currentSemester
            );

            return {
                ...student,
                isBehind
            };
        })
        .sort((a, b) => a.lastName.localeCompare(b.lastName));

    const behindCount = processedStudents.filter((student) => student.isBehind).length;
    const onTimeCount = processedStudents.length - behindCount;

    return {
        processedStudents,
        behindCount,
        onTimeCount
    };
}

/*
  Placeholder data generator for the new dashboard requirement widget.
  Replace this later with real major/minor requirement data from backend.
*/
function getMockRequirementData() {
    return [
        {
            label: "Major",
            totalRequired: 19,
            courses: [
                { id: 101, code: "CSC 120", name: "Intro to Programming", status: "completed" },
                { id: 102, code: "CSC 145", name: "Data Structures", status: "completed" },
                { id: 103, code: "CSC 220", name: "Computer Architecture", status: "completed" },
                { id: 104, code: "CSC 250", name: "Algorithms", status: "completed" },
                { id: 105, code: "CSC 260", name: "Operating Systems", status: "completed" },
                { id: 106, code: "CSC 310", name: "Software Engineering", status: "in_progress" },
                { id: 107, code: "CSC 320", name: "Database Systems", status: "in_progress" },
                { id: 108, code: "CSC 330", name: "Networks", status: "in_progress" },
                { id: 109, code: "CSC 340", name: "Theory of Computation", status: "warning" }
            ]
        },
        {
            label: "Minor",
            totalRequired: 19,
            courses: [
                { id: 201, code: "MTH 120", name: "Calculus I", status: "completed" },
                { id: 202, code: "MTH 121", name: "Calculus II", status: "completed" },
                { id: 203, code: "MTH 220", name: "Linear Algebra", status: "completed" },
                { id: 204, code: "MTH 230", name: "Discrete Math", status: "completed" },
                { id: 205, code: "MTH 310", name: "Probability", status: "completed" },
                { id: 206, code: "MTH 315", name: "Statistics", status: "in_progress" },
                { id: 207, code: "MTH 340", name: "Numerical Methods", status: "in_progress" },
                { id: 208, code: "MTH 350", name: "Abstract Algebra", status: "in_progress" }
            ]
        }
    ];
}

/* -------------------------------- dashboard -------------------------------- */

function Dashboard() {
    const [classes, setClasses] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    const [students, setStudents] = useState([]);

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin";
    const isSupervisor = role === "supervisor";
    const isStudent = role === "user"

    const [showAlter, setShowAlter] = useState(false);

    const [currentYear] = useState(2026);
    const [currentSemester] = useState(2);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const [classRes, studentRes, enrollmentRes] = await Promise.all([
                    axios.get("http://localhost:8080/test/get/classes"),
                    axios.get("http://localhost:8080/test/get/students"),
                    axios.get("http://localhost:8080/test/get/enrollments")
                ]);

                setClasses(classRes.data);

                const updatedStudents = studentRes.data.map((item) => ({
                    ...item,
                    graduationFormula: GraduationConverter(item.graduationDate)
                }));
                setStudents(updatedStudents);

                setEnrollment(enrollmentRes.data);

                console.log("class fetch:", classRes.data);
                console.log("enrollment fetch:", enrollmentRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        }

        fetchDashboardData();
    }, []);

    const dashboardStats = useMemo(() => {
        if (!classes.length || !students.length || !enrollment.length) {
            return {
                processedStudents: [],
                behindCount: null,
                onTimeCount: null
            };
        }

        return processStudents(
            students,
            classes,
            enrollment,
            currentYear,
            currentSemester
        );
    }, [classes, students, enrollment, currentYear, currentSemester]);

    const requirementData = useMemo(() => getMockRequirementData(), []);

    return (
        <div className="dashboard-page">
            <div className="dashboard-top-section">
                <RequirementProgressCard rows={requirementData} />
                <GraphComparison
                    behindCount={dashboardStats.behindCount}
                    onTimeCount={dashboardStats.onTimeCount}
                />
                <CreditRingWidget/>
            </div>
        </div>
    );
}

export default Dashboard;

/* --------------------------- requirement progress -------------------------- */

function RequirementProgressCard({ rows }) {
    return (
        <div className="requirement-progress-card">
            {rows.map((row) => (
                <RequirementProgressRow key={row.label} row={row} />
            ))}
        </div>
    );
}

function RequirementProgressRow({ row }) {
    const filledCells = Array.from(
        { length: row.totalRequired },
        (_, index) => row.courses[index] || null
    );

    const completedCount = row.courses.filter(
        (course) => course.status === "completed"
    ).length;

    const inProgressCount = row.courses.filter(
        (course) => course.status === "in_progress"
    ).length;

    const warningCount = row.courses.filter(
        (course) => course.status === "warning"
    ).length;

    return (
        <div className="requirement-progress-row">
            <div className="requirement-progress-main">
                <div className="requirement-progress-label">{row.label}:</div>

                <div
                    className="requirement-progress-grid"
                    style={{ gridTemplateColumns: `repeat(${row.totalRequired}, 1fr)` }}
                >
                    {filledCells.map((course, index) => (
                        <RequirementGridCell
                            key={course ? course.id : `${row.label}-${index}`}
                            course={course}
                        />
                    ))}
                </div>
            </div>

            <div className="requirement-progress-summary">
                {completedCount}/{row.totalRequired} Classes Complete
                {inProgressCount > 0 ? `, ${inProgressCount} In Progress` : ""}
                {warningCount > 0 ? `, ${warningCount} Warning` : ""}
            </div>
        </div>
    );
}

function RequirementGridCell({ course }) {
    const navigate = useNavigate();

    const getCellClass = () => {
        if (!course) return "requirement-grid-cell empty";
        if (course.status === "warning") return "requirement-grid-cell warning";
        if (course.status === "in_progress") return "requirement-grid-cell in-progress";
        if (course.status === "completed") return "requirement-grid-cell completed";
        return "requirement-grid-cell empty";
    };

    return (
        <button
            type="button"
            className={getCellClass()}
            disabled={!course}
            title={course ? `${course.code}: ${course.name}` : ""}
            onClick={() => {
                if (course) {
                    navigate(`/classzoom/${course.id}`);
                }
            }}
        >
            {course && (
                <span className="requirement-grid-tooltip">
                    {course.code}: {course.name}
                </span>
            )}
        </button>
    );
}

/* ---------------------------------- chart --------------------------------- */

function GraphComparison({ behindCount, onTimeCount }) {
    const data = {
        labels: ["Behind", "On Time"],
        datasets: [
            {
                label: "Student Progress",
                data: [behindCount || 0, onTimeCount || 0],
                backgroundColor: ["#ff6384", "#36a2eb"],
                borderColor: ["#ff6384", "#36a2eb"],
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

    return (
        <div className="dashboard-chart-card">
            <h3>Student Progress</h3>
            {behindCount !== null && onTimeCount !== null && (
                <Doughnut data={data} options={options} />
            )}
        </div>
    );
}

function CreditRingWidget({
    totalCredits = 60,
    completedCredits = 20,
    inProgressCredits = 12,
    size = 520
}) {
    const center = size / 2;
    const outerRadius = size * 0.42;
    const innerRadius = size * 0.30;

    const segments = Array.from({ length: totalCredits }, (_, i) => {
        if (i < completedCredits) return "completed";
        if (i < completedCredits + inProgressCredits) return "in-progress";
        return "remaining";
    });

    return (
        <div className="credit-ring-widget">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {segments.map((status, index) => (
                    <RingSegment
                        key={index}
                        index={index}
                        total={totalCredits}
                        center={center}
                        outerRadius={outerRadius}
                        innerRadius={innerRadius}
                        status={status}
                    />
                ))}
            </svg>

            <div className="credit-ring-center">
                <div className="credit-pill credit-pill-complete">
                    <span>Credits Complete</span>
                    <span className="credit-pill-value">{completedCredits}</span>
                </div>

                <div className="credit-pill credit-pill-progress">
                    <span>In Progress</span>
                    <span className="credit-pill-value">{inProgressCredits}</span>
                </div>
            </div>
        </div>
    );
}

function RingSegment({
    index,
    total,
    center,
    outerRadius,
    innerRadius,
    status
}) {
    const anglePerSegment = 360 / total;
    const gapDegrees = 0.8;

    const startAngle = -90 + index * anglePerSegment + gapDegrees / 2;
    const endAngle = -90 + (index + 1) * anglePerSegment - gapDegrees / 2;

    const polarToCartesian = (cx, cy, radius, angleDeg) => {
        const angleRad = (angleDeg * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(angleRad),
            y: cy + radius * Math.sin(angleRad)
        };
    };

    const p1 = polarToCartesian(center, center, outerRadius, startAngle);
    const p2 = polarToCartesian(center, center, outerRadius, endAngle);
    const p3 = polarToCartesian(center, center, innerRadius, endAngle);
    const p4 = polarToCartesian(center, center, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const d = [
        `M ${p1.x} ${p1.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`,
        `L ${p3.x} ${p3.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}`,
        "Z"
    ].join(" ");

    let fill = "#f4f4f4";
    if (status === "completed") fill = "#10b84f";
    if (status === "in-progress") fill = "#f3ef00";

    return <path d={d} fill={fill} stroke="#0c2a3a" strokeWidth="1.6" />;
}