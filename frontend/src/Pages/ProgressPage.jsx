import SideBar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../progress_page.css";

const CLASS_ROUTE_PREFIX = "/classes/";

const NODE_WIDTH = 18;
const NODE_HEIGHT = 7;

const DEMO_STUDENT_ID = 1;

const ENROLLMENT_STATUS = {
    PLANNED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    DROPPED: 3,
};

/*
 * These are layout-only templates.
 * Grades, credits, status, and score are filled from backend data.
 */
const CS_PROGRESS_LAYOUT = {
    CSC120: { row: 0, col: 3, expandedCol: 3 },

    CSC220: { row: 1, col: 1, expandedCol: 1 },
    CSC320: { row: 1, col: 3, expandedCol: 3 },
    CSC280: { row: 1, col: 5, expandedCol: 5 },

    CSC360: { row: 2, col: 1, expandedCol: 1 },
    CSC340: { row: 2, col: 5, expandedCol: 6 },

    CSC450: { row: 3, col: 2, expandedCol: 2 },
    CSC490: { row: 3, col: 4, expandedCol: 5 },
};

const MPSD_PROGRESS_LAYOUT = {
    CSC120: { row: 0, col: 3, expandedCol: 3 },

    CSC220: { row: 1, col: 1, expandedCol: 1 },
    CSC320: { row: 1, col: 3, expandedCol: 3 },
    CSC280: { row: 1, col: 5, expandedCol: 5 },

    CSC360: { row: 2, col: 1, expandedCol: 1 },
    CSC340: { row: 2, col: 5, expandedCol: 6 },

    CSC450: { row: 3, col: 2, expandedCol: 2 },
    CSC490: { row: 3, col: 4, expandedCol: 5 },

    // TODO: replace these with real MPSD-specific classes/layout if needed.
    MPSD100: { row: 0, col: 5, expandedCol: 5 },
    MPSD200: { row: 1, col: 6, expandedCol: 7 },
    MPSD300: { row: 2, col: 6, expandedCol: 8 },
};

const CS_PROGRESS_EDGES = [
    { from: "CSC120", to: "CSC220" },
    { from: "CSC120", to: "CSC320" },
    { from: "CSC320", to: "CSC280" },
    { from: "CSC220", to: "CSC360" },
    { from: "CSC360", to: "CSC450" },
    { from: "CSC280", to: "CSC490" },
];

const MPSD_PROGRESS_EDGES = [
    ...CS_PROGRESS_EDGES,

    // TODO: replace these with real MPSD prerequisite edges if needed.
    { from: "MPSD100", to: "MPSD200" },
    { from: "MPSD200", to: "MPSD300" },
];

const externalCourses = [
    {
        id: "MTH140",
        code: "MTH140",
        credits: "",
        grade: "",
        score: "",
        status: "planned",
        row: 1,
        expandedCol: 0,
    },
    {
        id: "PHY150",
        code: "PHY150",
        credits: "",
        grade: "",
        score: "",
        status: "planned",
        row: 0,
        expandedCol: 6,
    },
    {
        id: "ENG101",
        code: "ENG101",
        credits: "",
        grade: "",
        score: "",
        status: "planned",
        row: 0,
        expandedCol: 8,
    },
];

const externalEdges = [
    { from: "MTH140", to: "CSC360" },
    { from: "PHY150", to: "CSC340" },
    { from: "ENG101", to: "CSC490" },
];

const GRID_CONFIG = {
    collapsed: {
        left: 12,
        right: 88,
        cols: 7,
        rowYs: [8, 33, 58, 82],
        rowOffsets: [0, 0.5, 0.25, 0.75],
    },

    expanded: {
        left: 8,
        right: 92,
        cols: 9,
        rowYs: [8, 33, 58, 82],
        rowOffsets: [0, 0.5, 0.25, 0.75],
    },
};

function normalizeCourseCode(code) {
    return String(code ?? "")
        .replace("-", "")
        .replace(/\s+/g, "")
        .toUpperCase();
}

function normalizeStudent(rawStudent) {
    const studentId =
        rawStudent.studentId ??
        rawStudent.student_id ??
        rawStudent.id;

    return {
        ...rawStudent,
        id: Number(studentId),
        studentId: Number(studentId),
        name:
            rawStudent.name ??
            `${rawStudent.firstName ?? ""} ${rawStudent.lastName ?? ""}`.trim(),
        isMultiPlatformMajor: Boolean(rawStudent.isMultiPlatformMajor),
    };
}

function normalizeClass(rawClass) {
    const classId =
        rawClass.classId ??
        rawClass.class_id ??
        rawClass.id;

    return {
        ...rawClass,

        id: Number(classId),
        classId: Number(classId),

        code: rawClass.code ?? rawClass.header ?? rawClass.classCode,
        header: rawClass.header ?? rawClass.code ?? rawClass.classCode,
        name: rawClass.name ?? rawClass.title ?? rawClass.className,

        credits: Number(rawClass.credits ?? 0),

        isCSMajor: Boolean(
            rawClass.isCSMajor ??
            rawClass.isRequiredComputerScienceMajor
        ),

        isCSMinor: Boolean(
            rawClass.isCSMinor ??
            rawClass.isRequiredComputerScienceMinor
        ),

        isMultiPlatformMajor: Boolean(
            rawClass.isMultiPlatformMajor ??
            rawClass.isRequiredMultiPlatformMajor
        ),
    };
}

function normalizeEnrollment(rawEnrollment) {
    return {
        ...rawEnrollment,

        id:
            rawEnrollment.id ??
            rawEnrollment.enrollmentId ??
            rawEnrollment.enrollment_id,

        studentId: Number(
            rawEnrollment.studentId ??
            rawEnrollment.student_id ??
            rawEnrollment.student?.id
        ),

        classId: Number(
            rawEnrollment.classId ??
            rawEnrollment.class_id ??
            rawEnrollment.mountClass_id ??
            rawEnrollment.mountClass?.id
        ),

        status: Number(rawEnrollment.status),

        grade:
            rawEnrollment.grade === null ||
            rawEnrollment.grade === undefined ||
            rawEnrollment.grade === ""
                ? null
                : Number(rawEnrollment.grade),
    };
}

function buildEnrollmentsByStudent(enrollments) {
    const map = {};

    enrollments.forEach((enrollment) => {
        const studentId = Number(enrollment.studentId);

        if (!map[studentId]) {
            map[studentId] = [];
        }

        map[studentId].push(enrollment);
    });

    return map;
}

function getStudentEnrollments(student, enrollmentsByStudent) {
    return enrollmentsByStudent[Number(student.studentId)] ?? [];
}

function getEnrollmentForClass(studentEnrollments, classId) {
    return (
        studentEnrollments.find(
            (enrollment) => Number(enrollment.classId) === Number(classId)
        ) ?? null
    );
}

function getLetterGrade(score) {
    if (score === null || score === undefined || Number.isNaN(score)) return "";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

function getGradePoints(score) {
    if (score === null || score === undefined || Number.isNaN(score)) return "";
    if (score >= 90) return 4;
    if (score >= 80) return 3;
    if (score >= 70) return 2;
    if (score >= 60) return 1;
    return 0;
}

function getCourseStatus(enrollment) {
    if (!enrollment) return "planned";

    const grade = enrollment.grade;

    if (grade !== null && grade !== undefined && Number(grade) < 60) {
        return "bad";
    }

    if (enrollment.status === ENROLLMENT_STATUS.COMPLETED) {
        return "good";
    }

    if (enrollment.status === ENROLLMENT_STATUS.IN_PROGRESS) {
        return "in-progress";
    }

    if (enrollment.status === ENROLLMENT_STATUS.PLANNED) {
        return "planned";
    }

    return "planned";
}

function getStudentProgramType(student) {
    if (student?.isMultiPlatformMajor) return "mpsd";
    return "cs";
}

function buildProgressCourses({
    selectedStudent,
    classes,
    enrollmentsByStudent,
}) {
    if (!selectedStudent) return [];

    const programType = getStudentProgramType(selectedStudent);

    const layout =
        programType === "mpsd"
            ? MPSD_PROGRESS_LAYOUT
            : CS_PROGRESS_LAYOUT;

    const studentEnrollments = getStudentEnrollments(
        selectedStudent,
        enrollmentsByStudent
    );

    const classByCode = Object.fromEntries(
        classes.map((classItem) => [
            normalizeCourseCode(classItem.code),
            classItem,
        ])
    );

    return Object.entries(layout).map(([courseCode, position]) => {
        const normalizedCode = normalizeCourseCode(courseCode);
        const classItem = classByCode[normalizedCode];

        const enrollment = classItem
            ? getEnrollmentForClass(studentEnrollments, classItem.classId)
            : null;

        const grade = enrollment?.grade ?? null;
        const credits = classItem?.credits ?? "";

        return {
            id: normalizedCode,
            code: courseCode,
            credits,
            grade: getLetterGrade(grade),
            score:
                grade === null || grade === undefined || credits === ""
                    ? ""
                    : getGradePoints(grade) * Number(credits),
            status: getCourseStatus(enrollment),

            ...position,
        };
    });
}

function getGridPosition(course, expanded) {
    const grid = expanded ? GRID_CONFIG.expanded : GRID_CONFIG.collapsed;

    const baseCol = expanded
        ? course.expandedCol ?? course.col
        : course.col;

    const rowOffset = grid.rowOffsets[course.row] ?? 0;
    const step = (grid.right - grid.left) / (grid.cols - 1);

    return {
        x: grid.left + (baseCol + rowOffset) * step,
        y: grid.rowYs[course.row],
    };
}

function getLineLaneOffset(edge) {
    const laneOffsets = {
        "CSC120-CSC220": -1.2,
        "CSC120-CSC320": 0,
        "CSC320-CSC280": 1.2,

        "CSC220-CSC360": -1.2,
        "CSC360-CSC450": 1.1,

        "CSC280-CSC490": 1.35,

        "MTH140-CSC360": -1.6,
        "PHY150-CSC340": 2.2,
        "ENG101-CSC490": 2.4,

        "MPSD100-MPSD200": 1.3,
        "MPSD200-MPSD300": 1.4,
    };

    return laneOffsets[`${edge.from}-${edge.to}`] ?? 0;
}

function buildLinePaths(edges, courseMap) {
    return edges
        .map((edge) => {
            const from = courseMap[edge.from];
            const to = courseMap[edge.to];

            if (!from || !to) return null;

            const lane = getLineLaneOffset(edge);
            const direction = to.x >= from.x ? 1 : -1;

            const x1 = from.x + lane;
            const y1 = from.y + NODE_HEIGHT;

            const x2 = to.x + lane * 0.45 - direction * 0.8;
            const y2 = to.y;

            const verticalDistance = Math.abs(y2 - y1);
            const curve = Math.max(5, verticalDistance * 0.42);

            return {
                id: `${edge.from}-${edge.to}`,
                d: `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`,
            };
        })
        .filter(Boolean);
}

function validateGridSpacing(courses, expanded) {
    const grid = expanded ? GRID_CONFIG.expanded : GRID_CONFIG.collapsed;
    const byRow = {};

    for (const course of courses) {
        const col = expanded
            ? course.expandedCol ?? course.col
            : course.col;

        if (col === undefined) continue;

        if (!byRow[course.row]) byRow[course.row] = [];
        byRow[course.row].push({
            id: course.id,
            col,
        });
    }

    for (const rowCourses of Object.values(byRow)) {
        rowCourses.sort((a, b) => a.col - b.col);

        for (let i = 1; i < rowCourses.length; i++) {
            const prev = rowCourses[i - 1];
            const curr = rowCourses[i];

            if (curr.col - prev.col < 2) {
                console.warn(
                    `Potential progress tree overlap in ${expanded ? "expanded" : "collapsed"} layout: ` +
                    `${prev.id} and ${curr.id} are less than 2 grid columns apart. ` +
                    `Grid has ${grid.cols} columns.`
                );
            }
        }
    }
}

function ProgressPage() {
    const navigate = useNavigate();
    const [showExternalPrereqs, setShowExternalPrereqs] = useState(false);

    const [rawStudents, setRawStudents] = useState([]);
    const [rawClasses, setRawClasses] = useState([]);
    const [rawEnrollments, setRawEnrollments] = useState([]);

    const [isLoadingProgress, setIsLoadingProgress] = useState(true);
    const [progressError, setProgressError] = useState(null);

    useEffect(() => {
        async function fetchProgressData() {
            try {
                setIsLoadingProgress(true);
                setProgressError(null);

                const [studentRes, classRes, enrollmentRes] = await Promise.all([
                    axios.get("http://localhost:8080/test/get/students"),
                    axios.get("http://localhost:8080/test/get/classes"),
                    axios.get("http://localhost:8080/test/get/enrollments"),
                ]);

                setRawStudents(studentRes.data ?? []);
                setRawClasses(classRes.data ?? []);
                setRawEnrollments(enrollmentRes.data ?? []);
            } catch (error) {
                console.error("Failed to fetch progress data:", error);
                setProgressError(error);
            } finally {
                setIsLoadingProgress(false);
            }
        }

        fetchProgressData();
    }, []);

    const students = useMemo(() => {
        return rawStudents.map(normalizeStudent);
    }, [rawStudents]);

    const classes = useMemo(() => {
        return rawClasses.map(normalizeClass);
    }, [rawClasses]);

    const enrollments = useMemo(() => {
        return rawEnrollments.map(normalizeEnrollment);
    }, [rawEnrollments]);

    const enrollmentsByStudent = useMemo(() => {
        return buildEnrollmentsByStudent(enrollments);
    }, [enrollments]);

    const selectedStudent = useMemo(() => {
        if (!students.length) return null;

        return (
            students.find(
                (student) => Number(student.studentId) === Number(DEMO_STUDENT_ID)
            ) ?? students[0]
        );
    }, [students]);

    const mainCourses = useMemo(() => {
        return buildProgressCourses({
            selectedStudent,
            classes,
            enrollmentsByStudent,
        });
    }, [selectedStudent, classes, enrollmentsByStudent]);

    const programType = getStudentProgramType(selectedStudent);

    const mainEdges =
        programType === "mpsd"
            ? MPSD_PROGRESS_EDGES
            : CS_PROGRESS_EDGES;

    const positionedMainCourses = mainCourses.map((course) => ({
        ...course,
        ...getGridPosition(course, showExternalPrereqs),
    }));

    const positionedExternalCourses = externalCourses.map((course) => ({
        ...course,
        ...getGridPosition(course, true),
    }));

    const courses = showExternalPrereqs
        ? [...positionedMainCourses, ...positionedExternalCourses]
        : positionedMainCourses;

    const edges = showExternalPrereqs
        ? [...mainEdges, ...externalEdges]
        : mainEdges;

    validateGridSpacing(courses, showExternalPrereqs);

    const courseMap = Object.fromEntries(
        courses.map((course) => [course.id, course])
    );

    const linePaths = buildLinePaths(edges, courseMap);

    const handleClick = (code) => {
        navigate(`${CLASS_ROUTE_PREFIX}${code}`);
    };

    if (isLoadingProgress) {
        return (
            <div className="progress-page-shell">
                <SideBar />

                <main className="progress-page-content">
                    <section className="dashboard-surface progress-tree-surface">
                        <p className="dashboard-surface-subtitle">
                            Loading progress data...
                        </p>
                    </section>
                </main>
            </div>
        );
    }

    if (progressError) {
        return (
            <div className="progress-page-shell">
                <SideBar />

                <main className="progress-page-content">
                    <section className="dashboard-surface progress-tree-surface">
                        <h2 className="dashboard-surface-title">
                            Progress failed to load
                        </h2>
                        <p className="dashboard-surface-subtitle">
                            Check that the backend is running and the progress endpoints are available.
                        </p>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="progress-page-shell">
            <SideBar />

            <main className="progress-page-content">
                <section className="dashboard-surface progress-tree-surface">
                    <div className="dashboard-surface-header">
                        <div>
                            <h2 className="dashboard-surface-title">
                                Progress Tree
                            </h2>
                            <p className="dashboard-surface-subtitle">
                                CSC sequence with prerequisite structure and course status
                                {selectedStudent ? ` for ${selectedStudent.name}` : ""}
                            </p>
                        </div>

                        <button
                            className="progress-tree-toggle"
                            onClick={() => setShowExternalPrereqs((prev) => !prev)}
                        >
                            {showExternalPrereqs
                                ? "Hide non-CSC prerequisites"
                                : "Show non-CSC prerequisites"}
                        </button>
                    </div>

                    <div className="progress-tree-board">
                        <span className="progress-level-label level-100">100</span>
                        <span className="progress-level-label level-200">200</span>
                        <span className="progress-level-label level-300">300</span>
                        <span className="progress-level-label level-400">400</span>

                        <div className="progress-divider divider-1" />
                        <div className="progress-divider divider-2" />
                        <div className="progress-divider divider-3" />

                        <svg
                            className="progress-tree-svg"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            {linePaths.map((line) => (
                                <path
                                    key={line.id}
                                    d={line.d}
                                    className="progress-tree-line"
                                />
                            ))}
                        </svg>

                        {courses.map((course) => (
                            <button
                                key={course.id}
                                type="button"
                                className={`progress-node progress-node-${course.status}`}
                                style={{
                                    left: `${course.x}%`,
                                    top: `${course.y}%`,
                                }}
                                onClick={() => handleClick(course.code)}
                            >
                                <span className="progress-node-code">
                                    {course.code}
                                </span>
                                <span className="progress-node-cell">
                                    {course.credits}
                                </span>
                                <span className="progress-node-cell">
                                    {course.grade}
                                </span>
                                <span className="progress-node-cell">
                                    {course.score}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ProgressPage;