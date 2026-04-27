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


// const retriveClassData = async() =>{
//     const classData = await axios.get('http://localhost:8080/test/get/classes');
//     console.log("class fetch:", classData.data)
// }


// const retriveStudentData = async() =>{
//     const studentData = await axios.get('http://localhost:8080/test/get/students');
//     // const updatedStudents = studentData.data.map((item) => ({
//     //     ...item,
//     //     graduationFormula: GraduationConverter(item.graduationDate)
//     // }));
//     console.log("student fetch:", studentData.data)
// }



// const retriveEnrollmentData = async() =>{
//     const enrollmentData = await axios.get('http://localhost:8080/test/get/enrollments');
//     console.log("enrollment fetch:",enrollmentData.data)
// }



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



function AdviseesBoard({ students = [] }) {
    
    const navigate = useNavigate();

    return (
        <section className="dashboard-surface advisees-board">
            <div className="dashboard-surface-header">
                <div>
                    <button
                        type="button"
                        className="surface-title-link dashboard-surface-title2"
                        onClick={() => navigate("/students")}
                    >
                        <span className="dashboard-surface-title2">Advisee Grades</span>
                    </button>

                    <p className="dashboard-surface-subtitle">
                        Snapshot of current student standing
                    </p>
                </div>
            </div>

            <div className="advisees-grid">
                {students.map((student) => (
                    <article className="advisee-card polished-card" key={student.name}>
                        <div className="advisee-card-body">
                            <div className="segmented-stack">
                                {student.classes.map((item) => (
                                    <button
                                        type="button"
                                        className="segmented-row advisee-row clickable-advisee-row"
                                        key={`${student.name}-${item.code}`}
                                        onClick={() => navigate(`/classes/${item.code}`)}
                                    >
                                        <span className={`segmented-primary ${item.colorClass}`}>
                                            {item.code}
                                        </span>
                                        <span className="segmented-cell advisee-grade-cell">
                                            {item.grade}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="advisee-student-link"
                            onClick={() => navigate(`/students/${student.id}`)}
                        >
                            {student.name}
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
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
                { id: 101, code: "CSC-120", name: "Intro to Programming", status: "completed" },
                { id: 102, code: "CSC-145", name: "Data Structures", status: "completed" },
                { id: 103, code: "CSC-220", name: "Computer Architecture", status: "completed" },
                { id: 104, code: "CSC-250", name: "Algorithms", status: "completed" },
                { id: 105, code: "CSC-260", name: "Operating Systems", status: "completed" },
                { id: 106, code: "CSC-310", name: "Software Engineering", status: "in_progress" },
                { id: 107, code: "CSC-320", name: "Database Systems", status: "in_progress" },
                { id: 108, code: "CSC-330", name: "Networks", status: "in_progress" },
                { id: 109, code: "CSC-340", name: "Theory of Computation", status: "warning" }
            ]
        },
        {
            label: "Minor",
            totalRequired: 19,
            courses: [
                { id: 201, code: "MTH-120", name: "Calculus I", status: "completed" },
                { id: 202, code: "MTH-121", name: "Calculus II", status: "completed" },
                { id: 203, code: "MTH-220", name: "Linear Algebra", status: "completed" },
                { id: 204, code: "MTH-230", name: "Discrete Math", status: "completed" },
                { id: 205, code: "MTH-310", name: "Probability", status: "completed" },
                { id: 206, code: "MTH-315", name: "Statistics", status: "in_progress" },
                { id: 207, code: "MTH-340", name: "Numerical Methods", status: "in_progress" },
                { id: 208, code: "MTH-350", name: "Abstract Algebra", status: "in_progress" }
            ]
        }
    ];
}

const semesterData = [
    {
        id: 1,
        term: "Semester 1",
        label: "Fall 2026",
        courses: [
            { code: "CSC120", credits: 4, points: 16, grade: "A", status: "good" },
            { code: "MTH160", credits: 4, points: 16, grade: "A", status: "good" },
            { code: "PHY151", credits: 4, points: 12, grade: "B", status: "warn" },
        ],
    },
    {
        id: 2,
        term: "Semester 2",
        label: "Spring 2027",
        courses: [
            { code: "CSC220", credits: 4, points: 16, grade: "A", status: "good" },
            { code: "MTH170", credits: 4, points: 12, grade: "B", status: "warn" },
            { code: "PHY152", credits: 4, points: 16, grade: "A", status: "good" },
        ],
    },
    {
        id: 3,
        term: "Semester 3",
        label: "Fall 2027",
        courses: [
            { code: "CSC270", credits: 4, points: 16, grade: "A", status: "good" },
            { code: "CSC290", credits: 4, points: 12, grade: "B", status: "warn" },
            { code: "MTH250", credits: 4, points: 12, grade: "B", status: "warn" },
        ],
    },
    {
        id: 4,
        term: "Semester 4",
        label: "Spring 2028",
        courses: [
            { code: "CSC310", credits: 4, points: 16, grade: "A", status: "good" },
            { code: "CSC320", credits: 4, points: 12, grade: "B", status: "warn" },
            { code: "PHY270", credits: 4, points: 0, grade: "F", status: "bad" },
        ],
    },
    {
        id: 5,
        term: "Semester 5",
        label: "Fall 2028",
        courses: [
            { code: "CSC410", credits: 4, points: null, grade: null, status: "planned" },
            { code: "CSC420", credits: 4, points: null, grade: null, status: "planned" },
            { code: "MTH300", credits: 4, points: null, grade: null, status: "planned" },
        ],
    },
    {
        id: 6,
        term: "Semester 6",
        label: "Spring 2029",
        courses: [
            { code: "CSC430", credits: 4, points: null, grade: null, status: "planned" },
            { code: "PHY310", credits: 4, points: null, grade: null, status: "planned" },
            { code: "GEN300", credits: 4, points: null, grade: null, status: "planned" },
        ],
    },
    {
        id: 7,
        term: "Semester 7",
        label: "Fall 2029",
        courses: [
            { code: "CSC450", credits: 4, points: null, grade: null, status: "planned" },
            { code: "PHY350", credits: 4, points: null, grade: null, status: "planned" },
            { code: "GEN350", credits: 4, points: null, grade: null, status: "planned" },
        ],
    },
    {
        id: 8,
        term: "Semester 8",
        label: "Spring 2030",
        courses: [
            { code: "CSC499", credits: 4, points: null, grade: null, status: "planned" },
            { code: "PHY401", credits: 4, points: null, grade: null, status: "planned" },
            { code: "GEN400", credits: 4, points: null, grade: null, status: "planned" },
        ],
    },
];

function SemesterPlanBoard({ semesterData = [] }) {
    
    const navigate = useNavigate();

    const getTotalCredits = (courses) =>
        courses.reduce((sum, course) => sum + (course.credits || 0), 0);

    const getTotalPoints = (courses) =>
        courses.reduce((sum, course) => sum + (course.points || 0), 0);

    return (
        <section className="dashboard-surface semester-plan-board">
            <div className="dashboard-surface-header">
                <div>
                    <h2 className="dashboard-surface-title">Course Plan</h2>
                    <p className="dashboard-surface-subtitle">
                        Semester-by-semester advising overview
                    </p>
                </div>

                <div className="semester-plan-legend">
                    <span className="legend-item">
                        <span className="legend-dot status-good"></span>
                        Completed
                    </span>
                    <span className="legend-item">
                        <span className="legend-dot status-warn"></span>
                        Mixed
                    </span>
                    <span className="legend-item">
                        <span className="legend-dot status-bad"></span>
                        At Risk
                    </span>
                    <span className="legend-item">
                        <span className="legend-dot status-planned"></span>
                        Planned
                    </span>
                </div>
            </div>

            <div className="semester-grid semester-grid-two-col">
                {semesterData.map((semester) => {
                    const totalCredits = getTotalCredits(semester.courses);
                    const totalPoints = getTotalPoints(semester.courses);
                    const yearNumber = Math.ceil(semester.id / 2);

                    return (
                        <article className="semester-card polished-card" key={semester.id}>
                            <div className="semester-card-top">
                                <div className="semester-card-heading">
                                    <span className="semester-year-chip">Year {yearNumber}</span>
                                    <h3>{semester.term}</h3>
                                    <p>{semester.label}</p>
                                </div>

                                <div className="metric-chip">
                                    <span className="metric-chip-label">Credits</span>
                                    <span className="metric-chip-value">{totalCredits}</span>
                                </div>
                            </div>

                            <div className="segmented-stack semester-course-list">
                                {semester.courses.map((course, idx) => (
                                    <button
                                        type="button"
                                        className="segmented-row semester-course-row clickable-semester-row"
                                        key={`${semester.id}-${idx}`}
                                        onClick={() => navigate(`/classes/${course.code}`)}
                                    >
                                        <span className={`segmented-primary status-${course.status}`}>
                                            {course.code}
                                        </span>
                                        <span className="segmented-cell">{course.credits ?? "—"}</span>
                                        <span className="segmented-cell">{course.points ?? "—"}</span>
                                        <span className="segmented-cell">{course.grade ?? "—"}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="semester-summary">
                                <div className="summary-block">
                                    <span className="summary-label">Total Credits</span>
                                    <span className="summary-value">{totalCredits}</span>
                                </div>

                                <div className="summary-block">
                                    <span className="summary-label">Total Points</span>
                                    <span className="summary-value">
                                        {totalPoints > 0 ? totalPoints : "—"}
                                    </span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

/* --------------------------- requirement progress -------------------------- */

function RequirementProgressCard({ rows }) {
    return (
        <section className="dashboard-surface requirement-progress-card">
            <div className="dashboard-surface-header">
                <div>
                    <h2 className="dashboard-surface-title">Requirements</h2>
                    <p className="dashboard-surface-subtitle">
                        Degree progress by requirement group
                    </p>
                </div>
            </div>

            <div className="requirement-progress-content">
                {rows.map((row) => (
                    <RequirementProgressRow key={row.label} row={row} />
                ))}
            </div>
        </section>
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

    const completionPct = Math.round((completedCount / row.totalRequired) * 100);

    return (
        <div className="requirement-row-card polished-card">
            <div className="requirement-row-top">
                <div>
                    <div className="requirement-progress-label">{row.label}</div>
                    <div className="requirement-row-meta">
                        {completedCount} complete, {inProgressCount} active
                        {warningCount > 0 ? `, ${warningCount} warning` : ""}
                    </div>
                </div>

                <div className="metric-chip">
                    <span className="metric-chip-label">Complete</span>
                    <span className="metric-chip-value">{completionPct}%</span>
                </div>
            </div>

            <div
                className="requirement-progress-grid requirement-progress-grid-polished"
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
    );
}


function RequirementGridCell({ course }) {
    const navigate = useNavigate();

    const getCellClass = () => {
        if (!course) return "requirement-grid-cell polished empty";
        if (course.status === "warning") return "requirement-grid-cell polished warning";
        if (course.status === "in_progress") return "requirement-grid-cell polished in-progress";
        if (course.status === "completed") return "requirement-grid-cell polished completed";
        return "requirement-grid-cell polished empty";
    };

    return (
        <button
            type="button"
            className={getCellClass()}
            disabled={!course}
            onClick={() => {
                if (course) {
                    navigate(`/classes/${course.code}`);
                }
            }}
        >
            {course && (
                <>
                    <span className="requirement-grid-hover-label">
                        {course.code}
                    </span>
                    <span className="requirement-grid-tooltip">
                        {course.code}: {course.name}
                    </span>
                </>
            )}
        </button>
    );
}


/* ---------------------------------- chart --------------------------------- */

function GraphComparison({ behindCount, onTimeCount }) {
    const behind = behindCount ?? 0;
    const onTime = onTimeCount ?? 0;
    const total = behind + onTime;
    const onTimePct = total > 0 ? Math.round((onTime / total) * 100) : 0;
    const behindPct = total > 0 ? Math.round((behind / total) * 100) : 0;

    return (
        <section className="dashboard-surface progress-overview-card">
            <div className="dashboard-surface-header compact-header">
                <div>
                    <h2 className="dashboard-surface-title">Student Progress</h2>
                    <p className="dashboard-surface-subtitle">
                        Overall advising status across students
                    </p>
                </div>
            </div>

            <div className="progress-stat-grid">
                <div className="progress-stat-tile positive">
                    <span className="progress-stat-label">On Time</span>
                    <span className="progress-stat-value">{onTime}</span>
                    <span className="progress-stat-subvalue">{onTimePct}%</span>
                </div>

                <div className="progress-stat-tile negative">
                    <span className="progress-stat-label">Behind</span>
                    <span className="progress-stat-value">{behind}</span>
                    <span className="progress-stat-subvalue">{behindPct}%</span>
                </div>
            </div>

            <div className="progress-balance-block">
                <div className="progress-balance-label-row">
                    <span>Overall balance</span>
                    <span>{total} students</span>
                </div>

                <div className="progress-balance-bar">
                    <div
                        className="progress-balance-bar-ontrack"
                        style={{ width: `${onTimePct}%` }}
                    />
                    <div
                        className="progress-balance-bar-behind"
                        style={{ width: `${behindPct}%` }}
                    />
                </div>
            </div>
        </section>
    );
}

function CreditRingWidget({
    totalCredits = 60,
    completedCredits = 20,
    inProgressCredits = 12,
    size = 320
}) {
    const [viewMode, setViewMode] = useState("bar");
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const remainingCredits = Math.max(
        0,
        totalCredits - completedCredits - inProgressCredits
    );

    const completedPct = Math.round((completedCredits / totalCredits) * 100);
    const inProgressPct = Math.round((inProgressCredits / totalCredits) * 100);
    const remainingPct = Math.max(0, 100 - completedPct - inProgressPct);

    const segments = Array.from({ length: totalCredits }, (_, i) => {
        if (i < completedCredits) return "completed";
        if (i < completedCredits + inProgressCredits) return "in-progress";
        return "remaining";
    });

    const center = size / 2;
    const outerRadius = size * 0.42;
    const innerRadius = size * 0.29;

    const getSvgPoint = (svg, clientX, clientY) => {
        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        return point.matrixTransform(svg.getScreenCTM().inverse());
    };

    const handleRingMouseMove = (event) => {
        const svg = event.currentTarget;
        const point = getSvgPoint(svg, event.clientX, event.clientY);

        const dx = point.x - center;
        const dy = point.y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const hoverOuterRadius = outerRadius + 14;

        if (distance < innerRadius || distance > hoverOuterRadius) {
            setHoveredIndex(null);
            return;
        }

        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        angle = (angle + 90 + 360) % 360;

        const index = Math.floor((angle / 360) * totalCredits);
        setHoveredIndex(Math.max(0, Math.min(totalCredits - 1, index)));
    };

    return (
        <section className="dashboard-surface credit-progress-card">
            <div className="dashboard-surface-header compact-header">
                <div>
                    <h2 className="dashboard-surface-title">Credit Progress</h2>
                    <p className="dashboard-surface-subtitle">
                        Completed, active, and remaining credits
                    </p>
                </div>

                <div className="view-toggle">
                    <div className="toggle-buttons">
                        <button
                            type="button"
                            className={`view-toggle-button${viewMode === "bar" ? " active" : ""}`}
                            onClick={() => setViewMode("bar")}
                        >
                            Bar
                        </button>

                        <button
                            type="button"
                            className={`view-toggle-button${viewMode === "ring" ? " active" : ""}`}
                            onClick={() => setViewMode("ring")}
                        >
                            Ring
                        </button>
                    </div>

                </div>
            </div>

            {viewMode === "bar" ? (
                <>
                    <div className="credit-progress-total">
                        <span className="credit-progress-total-value">
                            {completedCredits + inProgressCredits}
                        </span>
                        <span className="credit-progress-total-label">
                            of {totalCredits} credits accounted for
                        </span>
                    </div>

                    <div className="credit-progress-bar">
                        <div
                            className="credit-progress-segment completed"
                            style={{ width: `${completedPct}%` }}
                        />
                        <div
                            className="credit-progress-segment in-progress"
                            style={{ width: `${inProgressPct}%` }}
                        />
                        <div
                            className="credit-progress-segment remaining"
                            style={{ width: `${remainingPct}%` }}
                        />
                    </div>
                </>
            ) : (
                <div className="credit-ring-widget polished-card">
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        onMouseMove={handleRingMouseMove}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {segments.map((status, index) => (
                            <InteractiveRingSegment
                                key={index}
                                index={index}
                                total={totalCredits}
                                center={center}
                                outerRadius={outerRadius}
                                innerRadius={innerRadius}
                                status={status}
                                hoveredIndex={hoveredIndex}
                            />
                        ))}
                    </svg>

                    <div className="credit-ring-center">
                        <div className="ring-center-total">
                            <span className="ring-center-label">Total Credits</span>
                            <span className="ring-center-value">{totalCredits}</span>
                        </div>

                        <div className="credit-pill credit-pill-complete">
                            <span>Done</span>
                            <span className="credit-pill-value">{completedCredits}</span>
                        </div>

                        <div className="credit-pill credit-pill-progress">
                            <span>Active</span>
                            <span className="credit-pill-value">{inProgressCredits}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="credit-progress-legend-grid">
                <div className="credit-legend-card">
                    <span className="credit-legend-dot completed"></span>
                    <div>
                        <div className="credit-legend-title">Completed</div>
                        <div className="credit-legend-value">{completedCredits} credits</div>
                    </div>
                </div>

                <div className="credit-legend-card">
                    <span className="credit-legend-dot in-progress"></span>
                    <div>
                        <div className="credit-legend-title">In Progress</div>
                        <div className="credit-legend-value">{inProgressCredits} credits</div>
                    </div>
                </div>

                <div className="credit-legend-card">
                    <span className="credit-legend-dot remaining"></span>
                    <div>
                        <div className="credit-legend-title">Remaining</div>
                        <div className="credit-legend-value">{remainingCredits} credits</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InteractiveRingSegment({
    index,
    total,
    center,
    outerRadius,
    innerRadius,
    status,
    hoveredIndex
}) {
    const anglePerSegment = 360 / total;
    const gapDegrees = 1.4;

    const polarToCartesian = (cx, cy, radius, angleDeg) => {
        const angleRad = (angleDeg * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(angleRad),
            y: cy + radius * Math.sin(angleRad)
        };
    };

    const circularDistance = (a, b, totalCount) => {
        const direct = Math.abs(a - b);
        return Math.min(direct, totalCount - direct);
    };

    let radialOffset = 0;
    if (hoveredIndex !== null) {
        const distance = circularDistance(index, hoveredIndex, total);
        radialOffset = Math.max(0, 14 - distance * 4);
    }

    const adjustedOuterRadius = outerRadius + radialOffset;
    const adjustedInnerRadius = innerRadius + radialOffset;

    const startAngle = -90 + index * anglePerSegment + gapDegrees / 2;
    const endAngle = -90 + (index + 1) * anglePerSegment - gapDegrees / 2;

    const p1 = polarToCartesian(center, center, adjustedOuterRadius, startAngle);
    const p2 = polarToCartesian(center, center, adjustedOuterRadius, endAngle);
    const p3 = polarToCartesian(center, center, adjustedInnerRadius, endAngle);
    const p4 = polarToCartesian(center, center, adjustedInnerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const d = [
        `M ${p1.x} ${p1.y}`,
        `A ${adjustedOuterRadius} ${adjustedOuterRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`,
        `L ${p3.x} ${p3.y}`,
        `A ${adjustedInnerRadius} ${adjustedInnerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}`,
        "Z"
    ].join(" ");

    const fill =
        status === "completed"
            ? "#55ad2a"
            : status === "in-progress"
                ? "#e4e004"
                : "#e1e7ee";

    return (
        <path
            d={d}
            fill={fill}
            strokeWidth="1.35"
            className="credit-ring-segment"
        />
    );
}

const GRADE_LINES = [
    { label: "A", fill: 80 },
    { label: "B", fill: 60 },
    { label: "C", fill: 40 },
    { label: "D", fill: 20 },
];

function GradeMeterCard({ course, isLast }) {
    const navigate = useNavigate();

    const grade = Math.max(0, Math.min(course.grade ?? 0, 100));
    const minimum = course.requiredMinimum ?? null;
    const statusClass = getGradeStatusClass(grade);

    const fillHeight = `${grade}%`;
    const thresholdHeight =
        minimum !== null ? `${minimum}%` : null;

    return (
        <button
            type="button"
            className={`grade-bar-card clickable-grade-card${isLast ? " last" : ""}`}
            onClick={() => navigate(`/classes/${course.name}`)}
        >
            <div className="grade-bar-header">
                <span className="grade-course-name">{course.name}</span>
                <span className={`grade-pill ${statusClass}`}>{grade}%</span>
            </div>

            <div className="grade-bar-visual">
                <div className="grade-bar-scale">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                </div>

                <div className="grade-bar-track">
                    {thresholdHeight && (
                        <div
                            className="grade-threshold-marker"
                            style={{ bottom: thresholdHeight }}
                        />
                    )}

                    <div
                        className={`grade-bar-fill ${statusClass}`}
                        style={{ height: fillHeight }}
                    />
                </div>
            </div>

            <div className="grade-bar-footer">
                <span>
                    Minimum: {minimum !== null ? `${minimum}%` : "—"}
                </span>
            </div>
        </button>
    );
}

function GradeMeterWidget({ classes }) {
    const classGradeData = [
        { id: 1, name: "CSC120", grade: 90, requiredMinimum: 70 },
        { id: 2, name: "CSC130", grade: 80, requiredMinimum: 70 },
        { id: 3, name: "CSC140", grade: 70, requiredMinimum: 70 },
        { id: 4, name: "CSC150", grade: 60, requiredMinimum: null },
        { id: 5, name: "CSC160", grade: 58, requiredMinimum: null },
    ];

    const displayClasses = classes ?? classGradeData;

    return (
        <section className="dashboard-surface grade-meter-panel">
            <div className="dashboard-surface-header compact-header">
                <div>
                    <h2 className="dashboard-surface-title">Grade Snapshot</h2>
                    <p className="dashboard-surface-subtitle">
                        Current course standing against minimum thresholds
                    </p>
                </div>
            </div>

            <div className="grade-bars-grid">
                {displayClasses.map((course, index) => (
                    <GradeMeterCard
                        key={course.id ?? index}
                        course={course}
                        isLast={index === displayClasses.length - 1}
                    />
                ))}
            </div>
        </section>
    );
}

function AdviseeStatusBoard({ advisees = [] }) {
    const navigate = useNavigate();

    return (
        <section className="dashboard-surface advisee-status-board">
            <div className="dashboard-surface-header">
                <div>
                    <button
                        type="button"
                        className="surface-title-link"
                        onClick={() => navigate("/students")}
                    >
                        <span className="dashboard-surface-title2">Advisees</span>
                    </button>

                    <p className="dashboard-surface-subtitle">
                        Advising snapshot by student
                    </p>
                </div>
            </div>

            <div className="advisee-status-list">
                {advisees.map((student) => (
                    <article className="advisee-status-card polished-card" key={student.id}>
                        <div className="advisee-status-top">
                            <button
                                type="button"
                                className="advisee-identity-block clickable-advisee-block"
                                onClick={() => navigate(`/students/${student.id}`)}
                            >
                                <div className="advisee-name">{student.name}</div>
                                <div className="advisee-year">{student.yearLabel}</div>
                            </button>

                            <div
                                className={`advisee-summary-block ${student.summaryStatus === "good"
                                    ? "status-good"
                                    : student.summaryStatus === "bad"
                                        ? "status-bad"
                                        : "status-planned"
                                    } ${student.warningCourse ? "has-warning" : ""}`}
                            >
                                {student.warningCourse ? (
                                    <button
                                        type="button"
                                        className="advisee-warning-course-button clickable-warning-block"
                                        onClick={() => navigate(`/classes/${student.warningCourse}`)}
                                    >
                                        {student.warningCourse}
                                    </button>
                                ) : (
                                    <span className="advisee-summary-text">
                                        {student.summaryText}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="advisee-status-bottom">
                            <div className="advisee-section-label">In Progress</div>

                            <div className="advisee-pill-row">
                                {student.inProgress.map((course) => (
                                    <button
                                        type="button"
                                        className="advisee-course-pill clickable-advisee-pill status-warn"
                                        key={`${student.id}-${course}`}
                                        onClick={() => navigate(`/classes/${course}`)}
                                    >
                                        {course}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

/* -------------------------------- dashboard helpers -------------------------------- */

const CURRENT_YEAR = 2026;
const CURRENT_SEMESTER = 2;

// TODO: replace once your backend/status enum is finalized.
const ENROLLMENT_STATUS = {
    PLANNED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    DROPPED: 3,
};

// TODO: replace if minimum grade differs by course.
const DEFAULT_REQUIRED_MINIMUM = 70;

// TODO: replace once you know actual semester offering rules.
// Example future shape:
// {
//     "CSC120": ["fall", "spring"],
//     "CSC220": ["spring"],
//     "CSC320": ["fall"]
// }
const COURSE_OFFERING_MAP = null;

// TODO: replace once schedule/term information is fully available.
const CURRENT_TERM_INDEX = null;
const GRADUATION_TERM_INDEX_BY_STUDENT_ID = null;


/* ----------------------------- normalization helpers ----------------------------- */

function normalizeClass(rawClass) {
    return {
        ...rawClass,

        // flexible aliases
        id: rawClass.id ?? rawClass.class_id ?? rawClass.classId,
        classId: rawClass.classId ?? rawClass.class_id ?? rawClass.id,

        code: rawClass.code ?? rawClass.header ?? rawClass.classCode,
        header: rawClass.header ?? rawClass.code ?? rawClass.classCode,
        name: rawClass.name ?? rawClass.title ?? rawClass.className,

        credits: Number(rawClass.credits ?? 0),

        isCSMajor: Boolean(rawClass.isCSMajor),
        isCSMinor: Boolean(rawClass.isCSMinor),
        isMultiPlatformMajor: Boolean(rawClass.isMultiPlatformMajor),

        requiredMinimum: rawClass.requiredMinimum ?? DEFAULT_REQUIRED_MINIMUM,
    };
}

function normalizeStudent(rawStudent) {
    const graduationFormula = rawStudent.graduationFormula
        ?? GraduationConverter(rawStudent.graduationDate);

    return {
        ...rawStudent,

        id: rawStudent.id ?? rawStudent.student_id ?? rawStudent.studentId,
        studentId: rawStudent.studentId ?? rawStudent.student_id ?? rawStudent.id,

        firstName: rawStudent.firstName ?? "",
        lastName: rawStudent.lastName ?? "",
        name:
            rawStudent.name
            ?? `${rawStudent.firstName ?? ""} ${rawStudent.lastName ?? ""}`.trim(),

        graduationDate: rawStudent.graduationDate,
        graduationFormula,
    };
}

function normalizeEnrollment(rawEnrollment) {
    return {
        ...rawEnrollment,

        id: rawEnrollment.id ?? rawEnrollment.enrollmentId,
        studentId:
            rawEnrollment.studentId
            ?? rawEnrollment.student_id,

        classId:
            rawEnrollment.classId
            ?? rawEnrollment.class_id
            ?? rawEnrollment.mountClass_id,

        status: Number(rawEnrollment.status),
        grade:
            rawEnrollment.grade === null || rawEnrollment.grade === undefined || rawEnrollment.grade === ""
                ? null
                : Number(rawEnrollment.grade),
    };
}


/* ----------------------------- generic data helpers ----------------------------- */

function buildClassById(classes) {
    return Object.fromEntries(classes.map((classItem) => [classItem.classId, classItem]));
}

function buildEnrollmentsByStudent(enrollments) {
    const map = {};

    enrollments.forEach((enrollment) => {
        if (!map[enrollment.studentId]) {
            map[enrollment.studentId] = [];
        }

        map[enrollment.studentId].push(enrollment);
    });

    return map;
}

function getStudentEnrollments(student, enrollmentsByStudent) {
    return enrollmentsByStudent[student.studentId] ?? [];
}

function getEnrollmentForClass(studentEnrollments, classId) {
    return studentEnrollments.find((enrollment) => enrollment.classId === classId) ?? null;
}

function isCompletedEnrollment(enrollment) {
    return enrollment?.status === ENROLLMENT_STATUS.COMPLETED;
}

function isInProgressEnrollment(enrollment) {
    return enrollment?.status === ENROLLMENT_STATUS.IN_PROGRESS;
}

function isPlannedEnrollment(enrollment) {
    return enrollment?.status === ENROLLMENT_STATUS.PLANNED;
}

function getLetterGrade(score) {
    if (score === null || score === undefined || Number.isNaN(score)) return "—";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

function getGradeStatusClass(score) {
    if (score === null || score === undefined || Number.isNaN(score)) return "status-planned";
    if (score >= 90) return "status-good";
    if (score >= 80) return "status-good-soft";
    if (score >= 70) return "status-warn";
    if (score >= 60) return "status-warn-soft";
    return "status-bad";
}

function getCourseRequirementStatus(classItem, enrollment) {
    if (!enrollment) return null;

    if (isCompletedEnrollment(enrollment)) {
        return "completed";
    }

    if (isInProgressEnrollment(enrollment)) {
        if (
            enrollment.grade !== null
            && enrollment.grade < (classItem.requiredMinimum ?? DEFAULT_REQUIRED_MINIMUM)
        ) {
            return "warning";
        }

        return "in_progress";
    }

    if (isPlannedEnrollment(enrollment)) {
        return "planned";
    }

    return null;
}


/* ----------------------------- warning-course helpers ----------------------------- */

function getPrerequisiteIdsForClass(classItem, prerequisites) {
    const targetClassId = classItem.classId;

    return prerequisites
        .filter((item) => {
            const classId =
                item.classId
                ?? item.class_id
                ?? item.class_id_id;

            return classId === targetClassId;
        })
        .map((item) => {
            return (
                item.prerequisiteId
                ?? item.prequisiteId // keep this typo because your CSV may use it
                ?? item.prereqId
                ?? item.requiredClassId
            );
        })
        .filter(Boolean);
}

function hasCompletedClass(studentEnrollments, classId) {
    const enrollment = getEnrollmentForClass(studentEnrollments, classId);
    return isCompletedEnrollment(enrollment);
}

function getMissingPrerequisites(classItem, studentEnrollments, prerequisites) {
    const prereqIds = getPrerequisiteIdsForClass(classItem, prerequisites);

    return prereqIds.filter((prereqId) => {
        return !hasCompletedClass(studentEnrollments, prereqId);
    });
}

function getOpportunitiesToTakeCourse(classItem, student, scheduleData) {
    /*
      UNIMPLEMENTED VARIABLES NEEDED:
      - COURSE_OFFERING_MAP
      - CURRENT_TERM_INDEX
      - GRADUATION_TERM_INDEX_BY_STUDENT_ID
      - scheduleData, if you want this based on actual future schedules instead of static offering rules

      Intended output:
      return number of future terms where this class is offered before the student graduates.
    */

    if (
        !COURSE_OFFERING_MAP
        || CURRENT_TERM_INDEX === null
        || !GRADUATION_TERM_INDEX_BY_STUDENT_ID
    ) {
        return null;
    }

    const graduationTermIndex = GRADUATION_TERM_INDEX_BY_STUDENT_ID[student.studentId];
    const offeredTerms = COURSE_OFFERING_MAP[classItem.code] ?? [];

    if (graduationTermIndex === undefined) {
        return null;
    }

    let opportunities = 0;

    for (let termIndex = CURRENT_TERM_INDEX; termIndex <= graduationTermIndex; termIndex++) {
        const termName = getTermNameFromIndex(termIndex);

        if (offeredTerms.includes(termName)) {
            opportunities += 1;
        }
    }

    return opportunities;
}

function getTermNameFromIndex(termIndex) {
    // Example convention only.
    // Even = spring, odd = fall.
    return termIndex % 2 === 0 ? "spring" : "fall";
}

function getWarningReason({
    classItem,
    student,
    enrollment,
    studentEnrollments,
    prerequisites,
    scheduleData,
}) {
    const missingPrerequisites = getMissingPrerequisites(
        classItem,
        studentEnrollments,
        prerequisites
    );

    const opportunitiesLeft = getOpportunitiesToTakeCourse(
        classItem,
        student,
        scheduleData
    );

    const hasGradeWarning =
        enrollment
        && enrollment.grade !== null
        && enrollment.grade < (classItem.requiredMinimum ?? DEFAULT_REQUIRED_MINIMUM);

    const hasMissingPrereqWarning = missingPrerequisites.length > 0;

    const hasOpportunityWarning =
        opportunitiesLeft !== null
        && opportunitiesLeft <= 1
        && !isCompletedEnrollment(enrollment);

    if (hasGradeWarning) {
        return "grade";
    }

    if (hasMissingPrereqWarning) {
        return "missing_prerequisite";
    }

    if (hasOpportunityWarning) {
        return "limited_opportunities";
    }

    return null;
}

function isWarningCourse({
    classItem,
    student,
    enrollment,
    studentEnrollments,
    prerequisites,
    scheduleData,
}) {
    return Boolean(
        getWarningReason({
            classItem,
            student,
            enrollment,
            studentEnrollments,
            prerequisites,
            scheduleData,
        })
    );
}


/* ----------------------------- widget-data builders ----------------------------- */

function buildRequirementRows({
    selectedStudent,
    classes,
    enrollmentsByStudent,
    prerequisites,
    scheduleData,
}) {
    if (!selectedStudent) return [];

    const studentEnrollments = getStudentEnrollments(selectedStudent, enrollmentsByStudent);

    const requirementGroups = [
        {
            label: "Major",
            totalRequired: classes.filter((classItem) => classItem.isCSMajor).length,
            classes: classes.filter((classItem) => classItem.isCSMajor),
        },
        {
            label: "Minor",
            totalRequired: classes.filter((classItem) => classItem.isCSMinor).length,
            classes: classes.filter((classItem) => classItem.isCSMinor),
        },
        {
            label: "Multi-Platform",
            totalRequired: classes.filter((classItem) => classItem.isMultiPlatformMajor).length,
            classes: classes.filter((classItem) => classItem.isMultiPlatformMajor),
        },
    ];

    return requirementGroups
        .filter((group) => group.totalRequired > 0)
        .map((group) => ({
            label: group.label,
            totalRequired: group.totalRequired,
            courses: group.classes.map((classItem) => {
                const enrollment = getEnrollmentForClass(studentEnrollments, classItem.classId);

                const warning = isWarningCourse({
                    classItem,
                    student: selectedStudent,
                    enrollment,
                    studentEnrollments,
                    prerequisites,
                    scheduleData,
                });

                const baseStatus = getCourseRequirementStatus(classItem, enrollment);

                return {
                    id: classItem.classId,
                    code: classItem.code,
                    name: classItem.name,
                    status: warning ? "warning" : baseStatus,
                    warningReason: warning
                        ? getWarningReason({
                            classItem,
                            student: selectedStudent,
                            enrollment,
                            studentEnrollments,
                            prerequisites,
                            scheduleData,
                        })
                        : null,
                };
            }),
        }));
}

function buildCreditStats({
    selectedStudent,
    classes,
    enrollmentsByStudent,
}) {
    if (!selectedStudent) {
        return {
            totalCredits: 0,
            completedCredits: 0,
            inProgressCredits: 0,
        };
    }

    const studentEnrollments = getStudentEnrollments(selectedStudent, enrollmentsByStudent);
    const requiredClasses = classes.filter((classItem) => classItem.isCSMajor);

    const totalCredits = requiredClasses.reduce(
        (sum, classItem) => sum + classItem.credits,
        0
    );

    const completedCredits = requiredClasses.reduce((sum, classItem) => {
        const enrollment = getEnrollmentForClass(studentEnrollments, classItem.classId);
        return isCompletedEnrollment(enrollment) ? sum + classItem.credits : sum;
    }, 0);

    const inProgressCredits = requiredClasses.reduce((sum, classItem) => {
        const enrollment = getEnrollmentForClass(studentEnrollments, classItem.classId);
        return isInProgressEnrollment(enrollment) ? sum + classItem.credits : sum;
    }, 0);

    return {
        totalCredits,
        completedCredits,
        inProgressCredits,
    };
}

function buildGradeSnapshot({
    selectedStudent,
    classes,
    enrollmentsByStudent,
}) {
    if (!selectedStudent) return [];

    const studentEnrollments = getStudentEnrollments(selectedStudent, enrollmentsByStudent);
    const classById = buildClassById(classes);

    return studentEnrollments
        .filter((enrollment) => isInProgressEnrollment(enrollment))
        .map((enrollment) => {
            const classItem = classById[enrollment.classId];

            return {
                id: enrollment.classId,
                name: classItem?.code ?? `Class ${enrollment.classId}`,
                grade: enrollment.grade ?? 0,
                requiredMinimum: classItem?.requiredMinimum ?? DEFAULT_REQUIRED_MINIMUM,
            };
        });
}

function buildAdviseeGradeCards({
    students,
    classes,
    enrollmentsByStudent,
}) {
    const classById = buildClassById(classes);

    return students.map((student) => {
        const studentEnrollments = getStudentEnrollments(student, enrollmentsByStudent);

        const displayClasses = studentEnrollments
            .filter((enrollment) => isInProgressEnrollment(enrollment))
            .map((enrollment) => {
                const classItem = classById[enrollment.classId];

                return {
                    code: classItem?.code ?? `Class ${enrollment.classId}`,
                    grade: getLetterGrade(enrollment.grade),
                    colorClass: getGradeStatusClass(enrollment.grade),
                };
            });

        return {
            id: student.studentId,
            name: student.name,
            classes: displayClasses,
        };
    });
}

function buildAdviseeStatusCards({
    students,
    classes,
    enrollmentsByStudent,
    prerequisites,
    scheduleData,
}) {
    const classById = buildClassById(classes);

    return students.map((student) => {
        const studentEnrollments = getStudentEnrollments(student, enrollmentsByStudent);

        const inProgress = studentEnrollments
            .filter((enrollment) => isInProgressEnrollment(enrollment))
            .map((enrollment) => {
                const classItem = classById[enrollment.classId];
                return classItem?.code ?? `Class ${enrollment.classId}`;
            });

        const warningEnrollment = studentEnrollments.find((enrollment) => {
            const classItem = classById[enrollment.classId];

            if (!classItem) return false;

            return isWarningCourse({
                classItem,
                student,
                enrollment,
                studentEnrollments,
                prerequisites,
                scheduleData,
            });
        });

        const warningClass = warningEnrollment
            ? classById[warningEnrollment.classId]
            : null;

        return {
            id: student.studentId,
            name: student.name,

            // derivable, but may be inaccurate depending on your graduation-date logic
            yearLabel: getApproximateYearLabel(student),

            warningCourse: warningClass?.code ?? null,
            summaryText: warningClass ? null : "No Warning Courses",
            summaryStatus: warningClass ? "bad" : "good",
            inProgress,
        };
    });
}

function getApproximateYearLabel(student) {
    /*
      Derivable from graduationDate/graduationFormula, but this is approximate.
      Replace with student.currentYear/classStanding if your backend adds it.
    */

    const semestersLeft = getSemestersLeft(student, CURRENT_YEAR, CURRENT_SEMESTER);

    if (semestersLeft >= 7) return "Year 1";
    if (semestersLeft >= 5) return "Year 2";
    if (semestersLeft >= 3) return "Year 3";
    return "Year 4";
}

function buildSemesterPlan({
    selectedStudent,
    schedules,
    scheduleEntries,
    classes,
    enrollmentsByStudent,
}) {
    /*
      This depends on your actual schedule.csv and scheduleEntry.csv shapes.
      The variables are included, but if your backend does not expose them yet,
      this will safely return [].
    */

    if (!selectedStudent || !schedules.length || !scheduleEntries.length) {
        return [];
    }

    const classById = buildClassById(classes);
    const studentEnrollments = getStudentEnrollments(selectedStudent, enrollmentsByStudent);

    const studentSchedules = schedules.filter((schedule) => {
        const studentId =
            schedule.studentId
            ?? schedule.student_id;

        return studentId === selectedStudent.studentId;
    });

    return studentSchedules.map((schedule, index) => {
        const scheduleId =
            schedule.id
            ?? schedule.scheduleId
            ?? schedule.schedule_id;

        const entries = scheduleEntries.filter((entry) => {
            const entryScheduleId =
                entry.scheduleId
                ?? entry.schedule_id;

            return entryScheduleId === scheduleId;
        });

        const courses = entries.map((entry) => {
            const classId =
                entry.classId
                ?? entry.class_id
                ?? entry.mountClass_id;

            const classItem = classById[classId];
            const enrollment = getEnrollmentForClass(studentEnrollments, classId);

            const grade = enrollment?.grade ?? null;
            const letterGrade = getLetterGrade(grade);

            return {
                code: classItem?.code ?? `Class ${classId}`,
                credits: classItem?.credits ?? 0,
                points: grade === null ? null : getGradePoints(grade) * (classItem?.credits ?? 0),
                grade: letterGrade === "—" ? null : letterGrade,
                status: getSemesterCourseStatus(enrollment),
            };
        });

        return {
            id: scheduleId,
            term: schedule.term ?? `Semester ${index + 1}`,
            label: schedule.label ?? buildScheduleLabel(schedule),
            courses,
        };
    });
}

function getGradePoints(score) {
    if (score === null || score === undefined || Number.isNaN(score)) return 0;
    if (score >= 90) return 4;
    if (score >= 80) return 3;
    if (score >= 70) return 2;
    if (score >= 60) return 1;
    return 0;
}

function getSemesterCourseStatus(enrollment) {
    if (!enrollment) return "planned";
    if (isCompletedEnrollment(enrollment)) return "good";
    if (isInProgressEnrollment(enrollment)) {
        if (
            enrollment.grade !== null
            && enrollment.grade < DEFAULT_REQUIRED_MINIMUM
        ) {
            return "bad";
        }

        return "warn";
    }

    if (isPlannedEnrollment(enrollment)) return "planned";

    return "planned";
}

function buildScheduleLabel(schedule) {
    const start =
        schedule.scheduleStartDate
        ?? schedule.startDate
        ?? schedule.start;

    if (!start) return "Unscheduled Term";

    const date = new Date(start);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const season = month < 6 ? "Spring" : "Fall";

    return `${season} ${year}`;
}


/* -------------------------------- dashboard -------------------------------- */

function Dashboard() {
    const [rawClasses, setRawClasses] = useState([]);
    const [rawEnrollments, setRawEnrollments] = useState([]);
    const [rawStudents, setRawStudents] = useState([]);

    const [rawPrerequisites, setRawPrerequisites] = useState([]);
    const [rawSchedules, setRawSchedules] = useState([]);
    const [rawScheduleEntries, setRawScheduleEntries] = useState([]);

    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
    const [dashboardError, setDashboardError] = useState(null);

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin";
    const isSupervisor = role === "supervisor";
    const isStudent = role === "user";

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setIsLoadingDashboard(true);
                setDashboardError(null);

                const [
                    classRes,
                    studentRes,
                    enrollmentRes,

                    // These endpoints may not exist yet.
                    // Keep them here as the intended variables.
                    prerequisiteRes,
                    scheduleRes,
                    scheduleEntryRes,
                ] = await Promise.all([
                    axios.get("http://localhost:8080/test/get/classes"),
                    axios.get("http://localhost:8080/test/get/students"),
                    axios.get("http://localhost:8080/test/get/enrollments"),

                    axios.get("http://localhost:8080/test/get/prerequisites").catch(() => ({ data: [] })),
                    axios.get("http://localhost:8080/test/get/schedules").catch(() => ({ data: [] })),
                    axios.get("http://localhost:8080/test/get/scheduleEntries").catch(() => ({ data: [] })),
                ]);

                setRawClasses(classRes.data ?? []);
                setRawStudents(studentRes.data ?? []);
                setRawEnrollments(enrollmentRes.data ?? []);

                setRawPrerequisites(prerequisiteRes.data ?? []);
                setRawSchedules(scheduleRes.data ?? []);
                setRawScheduleEntries(scheduleEntryRes.data ?? []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setDashboardError(error);
            } finally {
                setIsLoadingDashboard(false);
            }
        }

        fetchDashboardData();
    }, []);

    const classes = useMemo(() => {
        return rawClasses.map(normalizeClass);
    }, [rawClasses]);

    const students = useMemo(() => {
        return rawStudents
            .map(normalizeStudent)
            .sort((a, b) => a.lastName.localeCompare(b.lastName));
    }, [rawStudents]);

    const enrollments = useMemo(() => {
        return rawEnrollments.map(normalizeEnrollment);
    }, [rawEnrollments]);

    const prerequisites = useMemo(() => {
        return rawPrerequisites;
    }, [rawPrerequisites]);

    const schedules = useMemo(() => {
        return rawSchedules;
    }, [rawSchedules]);

    const scheduleEntries = useMemo(() => {
        return rawScheduleEntries;
    }, [rawScheduleEntries]);

    const enrollmentsByStudent = useMemo(() => {
        return buildEnrollmentsByStudent(enrollments);
    }, [enrollments]);

    /*
      TODO:
      For now, this picks the first student.
      Later, this should come from logged-in user identity or selected advisee.
    */
    const selectedStudent = useMemo(() => {
        if (!students.length) return null;

        if (isStudent) {
            return students[0];
        }

        return students[0];
    }, [students, isStudent]);

    const dashboardStats = useMemo(() => {
        if (!classes.length || !students.length || !enrollments.length) {
            return {
                processedStudents: [],
                behindCount: 0,
                onTimeCount: 0,
            };
        }

        return processStudents(
            students,
            classes,
            enrollments,
            CURRENT_YEAR,
            CURRENT_SEMESTER
        );
    }, [classes, students, enrollments]);

    const requirementData = useMemo(() => {
        return buildRequirementRows({
            selectedStudent,
            classes,
            enrollmentsByStudent,
            prerequisites,
            scheduleData: {
                schedules,
                scheduleEntries,
            },
        });
    }, [
        selectedStudent,
        classes,
        enrollmentsByStudent,
        prerequisites,
        schedules,
        scheduleEntries,
    ]);

    const creditStats = useMemo(() => {
        return buildCreditStats({
            selectedStudent,
            classes,
            enrollmentsByStudent,
        });
    }, [selectedStudent, classes, enrollmentsByStudent]);

    const gradeSnapshotData = useMemo(() => {
        return buildGradeSnapshot({
            selectedStudent,
            classes,
            enrollmentsByStudent,
        });
    }, [selectedStudent, classes, enrollmentsByStudent]);

    const adviseeGradeCards = useMemo(() => {
        return buildAdviseeGradeCards({
            students,
            classes,
            enrollmentsByStudent,
        });
    }, [students, classes, enrollmentsByStudent]);

    const adviseeStatusCards = useMemo(() => {
        return buildAdviseeStatusCards({
            students,
            classes,
            enrollmentsByStudent,
            prerequisites,
            scheduleData: {
                schedules,
                scheduleEntries,
            },
        });
    }, [
        students,
        classes,
        enrollmentsByStudent,
        prerequisites,
        schedules,
        scheduleEntries,
    ]);

    const semesterPlanData = useMemo(() => {
        return buildSemesterPlan({
            selectedStudent,
            schedules,
            scheduleEntries,
            classes,
            enrollmentsByStudent,
        });
    }, [
        selectedStudent,
        schedules,
        scheduleEntries,
        classes,
        enrollmentsByStudent,
    ]);

    if (isLoadingDashboard) {
        return (
            <div className="dashboard-page">
                <span className="dashboard-page-title">Dashboard</span>
                <div className="dashboard-surface">
                    <p className="dashboard-surface-subtitle">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (dashboardError) {
        return (
            <div className="dashboard-page">
                <span className="dashboard-page-title">Dashboard</span>
                <div className="dashboard-surface">
                    <h2 className="dashboard-surface-title">Dashboard failed to load</h2>
                    <p className="dashboard-surface-subtitle">
                        Check that the backend is running and that the dashboard endpoints are available.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <span className="dashboard-page-title">
                Dashboard
            </span>

            <div className="dashboard-top-section">
                {isStudent && (
                    <>
                        <RequirementProgressCard rows={requirementData} />

                        <SemesterPlanBoard semesterData={semesterPlanData} />

                        <CreditRingWidget
                            totalCredits={creditStats.totalCredits}
                            completedCredits={creditStats.completedCredits}
                            inProgressCredits={creditStats.inProgressCredits}
                        />

                        <GradeMeterWidget classes={gradeSnapshotData} />
                    </>
                )}

                {(isAdmin || isSupervisor) && (
                    <>
                        <AdviseesBoard students={adviseeGradeCards} />

                        <AdviseeStatusBoard advisees={adviseeStatusCards} />

                        <GraphComparison
                            behindCount={dashboardStats.behindCount}
                            onTimeCount={dashboardStats.onTimeCount}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;