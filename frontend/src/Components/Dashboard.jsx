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



function AdviseesBoard() {
    const navigate = useNavigate();

    const students = [
        {
            name: "Student 1",
            classes: [
                { code: "CSC120", grade: "A", colorClass: "status-good" },
                { code: "CSC220", grade: "B", colorClass: "status-good-soft" },
                { code: "CSC320", grade: "C", colorClass: "status-warn" },
                { code: "CSC330", grade: "D", colorClass: "status-warn-soft" },
                { code: "CSC340", grade: "F", colorClass: "status-bad" },
            ],
        },
    ];

    return (
        <section className="dashboard-surface advisees-board">
            <div className="dashboard-surface-header">
                <div>
                    <button
                        type="button"
                        className="surface-title-link dashboard-surface-title2"
                        onClick={() => navigate("/students")}
                    >
                        <span className="dashboard-surface-title2">Advisees</span>
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

function SemesterPlanBoard() {
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
                <CreditRingWidget />
                <GradeMeterWidget />
                <AdviseesBoard />
                <SemesterPlanBoard />
                <AdviseeStatusBoard />
            </div>
        </div>
    );
}

export default Dashboard;

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

function getGradeStatusClass(grade) {
    if (grade >= 90) return "status-good";
    if (grade >= 80) return "status-good-soft";
    if (grade >= 70) return "status-warn";
    if (grade >= 60) return "status-warn-soft";
    return "status-bad";
}

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

function AdviseeStatusBoard() {
    const navigate = useNavigate();

    const advisees = [
        {
            id: 1,
            name: "Student 1",
            yearLabel: "Year 3",
            warningCourse: null,
            summaryText: "No Warning Courses",
            summaryStatus: "good",
            inProgress: ["CSC220", "CSC320", "CSC360"],
        },
        {
            id: 2,
            name: "Student 2",
            yearLabel: "Year 2",
            warningCourse: "CSC120",
            summaryText: null,
            summaryStatus: "bad",
            inProgress: ["CSC220", "CSC320", "CSC360"],
        },
    ];

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