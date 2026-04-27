import SideBar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../progress_page.css";
import { formatClassUrlCode } from "../tools/classRoutes.jsx";


const CLASS_ROUTE_PREFIX = "/classes/";

const NODE_HEIGHT = 7;
const DEMO_STUDENT_ID = 1;

const ENROLLMENT_STATUS = {
    PLANNED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    DROPPED: 3,
};

/* -------------------------------------------------------------------------- */
/*                            Course plan templates                           */
/* -------------------------------------------------------------------------- */

const CS_SEMESTER_PLAN_TEMPLATE = [
    {
        id: 1,
        term: "Semester 1",
        label: "Fall Year 1",
        courses: [
            { type: "core", label: "Integrative Core - First-Year Seminar", group: "ICF", credits: 4 },
            { type: "specific", code: "CSC120" },
            { type: "specific", code: "MTH123", creditsOverride: 3 },
            { type: "choice", label: "Foreign Language or Elective", options: ["foreign-language", "elective"], credits: 4 },
        ],
    },
    {
        id: 2,
        term: "Semester 2",
        label: "Spring Year 1",
        courses: [
            { type: "core", label: "Integrative Core - Foundation", group: "ICF", credits: 4 },
            { type: "specific", code: "CSC220" },
            { type: "specific", code: "MTH125", creditsOverride: 3 },
            { type: "choice", label: "Foreign Language or Elective", options: ["foreign-language", "elective"], credits: 4 },
        ],
    },
    {
        id: 3,
        term: "Semester 3",
        label: "Fall Year 2",
        courses: [
            { type: "core", label: "Integrative Core - Foundation", group: "ICF", credits: 4 },
            { type: "core", label: "Integrative Core - Foundation", group: "ICF", credits: 4 },
            { type: "specific", code: "CSC270" },
            { type: "specific", code: "MTH141" },
        ],
    },
    {
        id: 4,
        term: "Semester 4",
        label: "Spring Year 2",
        courses: [
            { type: "core", label: "Integrative Core - Foundation", group: "ICF", credits: 4 },
            { type: "elective", label: "Elective", credits: 4 },
            {
                type: "choice",
                label: "CSC310 or CSC320",
                options: [
                    { type: "specific", code: "CSC310" },
                    { type: "specific", code: "CSC320" },
                ],
                credits: 4,
            },
            { type: "minor-elective", label: "Declared Minor Elective", credits: 4 },
        ],
    },
    {
        id: 5,
        term: "Semester 5",
        label: "Fall Year 3",
        courses: [
            { type: "core", label: "Integrative Core - Exploration", group: "ICF", credits: 4 },
            {
                type: "choice",
                label: "CSC360 or Elective",
                options: [
                    { type: "specific", code: "CSC360" },
                    { type: "elective", label: "Elective", credits: 4 },
                ],
                credits: 4,
            },
            {
                type: "csc-level",
                label: "CSC3XX or CSC4XX",
                level: "300-or-400",
                credits: 4,
            },
            { type: "minor-elective", label: "Declared Minor Elective", credits: 4 },
        ],
    },
    {
        id: 6,
        term: "Semester 6",
        label: "Spring Year 3",
        courses: [
            { type: "core", label: "Integrative Core - Exploration", group: "ICF", credits: 4 },
            {
                type: "choice",
                label: "CSC310 or CSC320",
                options: [
                    { type: "specific", code: "CSC310" },
                    { type: "specific", code: "CSC320" },
                ],
                credits: 4,
            },
            {
                type: "csc-level",
                label: "CSC3XX or CSC4XX",
                level: "300-or-400",
                credits: 4,
            },
            { type: "minor-elective", label: "Declared Minor Elective", credits: 4 },
        ],
    },
    {
        id: 7,
        term: "Semester 7",
        label: "Fall Year 4",
        courses: [
            { type: "core", label: "Integrative Core - Capstone", group: "ICF", credits: 4 },
            {
                type: "choice",
                label: "CSC360 or Elective",
                options: [
                    { type: "specific", code: "CSC360" },
                    { type: "elective", label: "Elective", credits: 4 },
                ],
                credits: 4,
            },
            {
                type: "csc-level",
                label: "CSC3XX or CSC4XX",
                level: "300-or-400",
                credits: 4,
            },
            { type: "specific", code: "CSC491", creditsOverride: 2 },
            { type: "elective", label: "Elective", credits: 4 },
        ],
    },
    {
        id: 8,
        term: "Semester 8",
        label: "Spring Year 4",
        courses: [
            { type: "specific", code: "CSC492", creditsOverride: 2 },
            {
                type: "csc-level",
                label: "CSC3XX or CSC4XX",
                level: "300-or-400",
                credits: 4,
            },
            { type: "minor-elective", label: "Declared Minor Elective", credits: 4 },
            { type: "elective", label: "Elective", credits: 4 },
        ],
    },
];

const MPSD_SEMESTER_PLAN_TEMPLATE = [
    {
        id: 1,
        term: "Semester 1",
        label: "Fall Year 1",
        courses: [
            { type: "core", label: "Integrative Core - First-Year Seminar", group: "ICF", credits: 4 },
            { type: "choice", label: "Foreign Language or Elective", options: ["foreign-language", "elective"], credits: 4 },
            { type: "specific", code: "CSC120" },
            { type: "specific", code: "MTH123" },
        ],
    },
    {
        id: 2,
        term: "Semester 2",
        label: "Spring Year 1",
        courses: [
            { type: "core", label: "Integrative Core - Foundation", group: "ICF", credits: 4 },
            { type: "core", label: "Integrative Core - Foundation", group: "ICF", credits: 4 },
            { type: "choice", label: "Foreign Language or Elective", options: ["foreign-language", "elective"], credits: 4 },
            { type: "specific", code: "CSC220" },
        ],
    },
    {
        id: 3,
        term: "Semester 3",
        label: "Fall Year 2",
        courses: [
            { type: "core", label: "Integrative Core - Foundation", group: "ICF", credits: 4 },
            { type: "elective", label: "Elective", credits: 4 },
            { type: "specific", code: "CSW123" },
            { type: "minor-elective", label: "Declared Minor Elective", credits: 4 },
        ],
    },
    {
        id: 4,
        term: "Semester 4",
        label: "Spring Year 2",
        courses: [
            { type: "core", label: "Integrative Core - Foundation", group: "ICF", credits: 4 },
            { type: "specific", code: "MTH125" },
            {
                type: "choice",
                label: "CSW223 or Elective",
                options: [
                    { type: "specific", code: "CSW223" },
                    { type: "elective", label: "Elective", credits: 4 },
                ],
                credits: 4,
            },
            {
                type: "choice",
                label: "CSC310 or CSC330",
                options: [
                    { type: "specific", code: "CSC310" },
                    { type: "specific", code: "CSC330" },
                ],
                credits: 4,
            },
        ],
    },
    {
        id: 5,
        term: "Semester 5",
        label: "Fall Year 3",
        courses: [
            { type: "core", label: "Integrative Core - Exploration", group: "ICF", credits: 4 },
            { type: "minor-elective", label: "Declared Minor Elective", credits: 4 },
            {
                type: "choice",
                label: "CSC360 or CSC410",
                options: [
                    { type: "specific", code: "CSC360" },
                    { type: "specific", code: "CSC410" },
                ],
                credits: 4,
            },
            {
                type: "csc-level",
                label: "CSC3XX or CSC4XX",
                level: "300-or-400",
                credits: 4,
            },
        ],
    },
    {
        id: 6,
        term: "Semester 6",
        label: "Spring Year 3",
        courses: [
            { type: "core", label: "Integrative Core - Exploration", group: "ICF", credits: 4 },
            { type: "minor-elective", label: "Declared Minor Elective", credits: 4 },
            {
                type: "choice",
                label: "CSW223 or CSW423",
                options: [
                    { type: "specific", code: "CSW223" },
                    { type: "specific", code: "CSW423" },
                ],
                credits: 4,
            },
            {
                type: "choice",
                label: "CSC310 or CSC330",
                options: [
                    { type: "specific", code: "CSC310" },
                    { type: "specific", code: "CSC330" },
                ],
                credits: 4,
            },
        ],
    },
    {
        id: 7,
        term: "Semester 7",
        label: "Fall Year 4",
        courses: [
            { type: "core", label: "Integrative Core - Capstone", group: "ICF", credits: 4 },
            { type: "specific", code: "CSC491", creditsOverride: 2 },
            {
                type: "choice",
                label: "CSC360 or CSC410",
                options: [
                    { type: "specific", code: "CSC360" },
                    { type: "specific", code: "CSC410" },
                ],
                credits: 4,
            },
            {
                type: "csc-level",
                label: "CSC3XX or CSC4XX",
                level: "300-or-400",
                credits: 4,
            },
            { type: "elective", label: "Elective", credits: 4 },
        ],
    },
    {
        id: 8,
        term: "Semester 8",
        label: "Spring Year 4",
        courses: [
            { type: "specific", code: "CSC492", creditsOverride: 2 },
            { type: "elective", label: "Elective", credits: 4 },
            {
                type: "choice",
                label: "CSW423 or Elective",
                options: [
                    { type: "specific", code: "CSW423" },
                    { type: "elective", label: "Elective", credits: 4 },
                ],
                credits: 4,
            },
            { type: "elective", label: "Elective", credits: 4 },
        ],
    },
];

/* -------------------------------------------------------------------------- */
/*                              Layout templates                              */
/* -------------------------------------------------------------------------- */

const CS_PROGRESS_LAYOUT = {
    ICF_FIRST_YEAR_SEMINAR: { row: 0, col: 0, expandedCol: 0 },
    CSC120: { row: 0, col: 2, expandedCol: 2 },
    MTH123: { row: 0, col: 4, expandedCol: 4 },
    FOREIGN_LANGUAGE_OR_ELECTIVE_1: { row: 0, col: 6, expandedCol: 6 },

    ICF_FOUNDATION_1: { row: 1, col: 0, expandedCol: 0 },
    CSC220: { row: 1, col: 2, expandedCol: 2 },
    MTH125: { row: 1, col: 4, expandedCol: 4 },
    FOREIGN_LANGUAGE_OR_ELECTIVE_2: { row: 1, col: 6, expandedCol: 6 },

    ICF_FOUNDATION_2: { row: 2, col: 0, expandedCol: 0 },
    ICF_FOUNDATION_3: { row: 2, col: 1.7, expandedCol: 1.7 },
    CSC270: { row: 2, col: 3.4, expandedCol: 3.4 },
    MTH141: { row: 2, col: 5.1, expandedCol: 5.1 },

    ICF_FOUNDATION_4: { row: 3, col: 0, expandedCol: 0 },
    ELECTIVE_1: { row: 3, col: 1.7, expandedCol: 1.7 },
    CSC310_OR_CSC320_1: { row: 3, col: 3.4, expandedCol: 3.4 },
    DECLARED_MINOR_ELECTIVE_1: { row: 3, col: 5.1, expandedCol: 5.1 },

    ICF_EXPLORATION_1: { row: 4, col: 0, expandedCol: 0 },
    CSC360_OR_ELECTIVE_1: { row: 4, col: 1.7, expandedCol: 1.7 },
    CSC3XX_OR_CSC4XX_1: { row: 4, col: 3.4, expandedCol: 3.4 },
    DECLARED_MINOR_ELECTIVE_2: { row: 4, col: 5.1, expandedCol: 5.1 },

    ICF_EXPLORATION_2: { row: 5, col: 0, expandedCol: 0 },
    CSC310_OR_CSC320_2: { row: 5, col: 1.7, expandedCol: 1.7 },
    CSC3XX_OR_CSC4XX_2: { row: 5, col: 3.4, expandedCol: 3.4 },
    DECLARED_MINOR_ELECTIVE_3: { row: 5, col: 5.1, expandedCol: 5.1 },

    ICF_CAPSTONE: { row: 6, col: 0, expandedCol: 0 },
    CSC360_OR_ELECTIVE_2: { row: 6, col: 1.4, expandedCol: 1.4 },
    CSC3XX_OR_CSC4XX_3: { row: 6, col: 2.8, expandedCol: 2.8 },
    CSC491: { row: 6, col: 4.2, expandedCol: 4.2 },
    ELECTIVE_2: { row: 6, col: 5.6, expandedCol: 5.6 },

    CSC492: { row: 7, col: 1, expandedCol: 1 },
    CSC3XX_OR_CSC4XX_4: { row: 7, col: 2.8, expandedCol: 2.8 },
    DECLARED_MINOR_ELECTIVE_4: { row: 7, col: 4.6, expandedCol: 4.6 },
    ELECTIVE_3: { row: 7, col: 6.2, expandedCol: 6.2 },
};

const MPSD_PROGRESS_LAYOUT = {
    ICF_FIRST_YEAR_SEMINAR: { row: 0, col: 0, expandedCol: 0 },
    FOREIGN_LANGUAGE_OR_ELECTIVE_1: { row: 0, col: 1.8, expandedCol: 1.8 },
    CSC120: { row: 0, col: 3.6, expandedCol: 3.6 },
    MTH123: { row: 0, col: 5.4, expandedCol: 5.4 },

    ICF_FOUNDATION_1: { row: 1, col: 0, expandedCol: 0 },
    ICF_FOUNDATION_2: { row: 1, col: 1.8, expandedCol: 1.8 },
    FOREIGN_LANGUAGE_OR_ELECTIVE_2: { row: 1, col: 3.6, expandedCol: 3.6 },
    CSC220: { row: 1, col: 5.4, expandedCol: 5.4 },

    ICF_FOUNDATION_3: { row: 2, col: 0, expandedCol: 0 },
    ELECTIVE_1: { row: 2, col: 1.8, expandedCol: 1.8 },
    CSW123: { row: 2, col: 3.6, expandedCol: 3.6 },
    DECLARED_MINOR_ELECTIVE_1: { row: 2, col: 5.4, expandedCol: 5.4 },

    ICF_FOUNDATION_4: { row: 3, col: 0, expandedCol: 0 },
    MTH125: { row: 3, col: 1.8, expandedCol: 1.8 },
    CSW223_OR_ELECTIVE: { row: 3, col: 3.6, expandedCol: 3.6 },
    CSC310_OR_CSC330_1: { row: 3, col: 5.4, expandedCol: 5.4 },

    ICF_EXPLORATION_1: { row: 4, col: 0, expandedCol: 0 },
    DECLARED_MINOR_ELECTIVE_2: { row: 4, col: 1.8, expandedCol: 1.8 },
    CSC360_OR_CSC410_1: { row: 4, col: 3.6, expandedCol: 3.6 },
    CSC3XX_OR_CSC4XX_1: { row: 4, col: 5.4, expandedCol: 5.4 },

    ICF_EXPLORATION_2: { row: 5, col: 0, expandedCol: 0 },
    DECLARED_MINOR_ELECTIVE_3: { row: 5, col: 1.8, expandedCol: 1.8 },
    CSW223_OR_CSW423: { row: 5, col: 3.6, expandedCol: 3.6 },
    CSC310_OR_CSC330_2: { row: 5, col: 5.4, expandedCol: 5.4 },

    ICF_CAPSTONE: { row: 6, col: 0, expandedCol: 0 },
    CSC491: { row: 6, col: 1.4, expandedCol: 1.4 },
    CSC360_OR_CSC410_2: { row: 6, col: 2.8, expandedCol: 2.8 },
    CSC3XX_OR_CSC4XX_2: { row: 6, col: 4.2, expandedCol: 4.2 },
    ELECTIVE_2: { row: 6, col: 5.6, expandedCol: 5.6 },

    CSC492: { row: 7, col: 1, expandedCol: 1 },
    ELECTIVE_3: { row: 7, col: 2.8, expandedCol: 2.8 },
    CSW423_OR_ELECTIVE: { row: 7, col: 4.6, expandedCol: 4.6 },
    ELECTIVE_4: { row: 7, col: 6.2, expandedCol: 6.2 },
};

const CS_PROGRESS_EDGES = [
    { from: "CSC120", to: "CSC220" },
    { from: "CSC120", to: "CSC270" },
    { from: "CSC220", to: "CSC310_OR_CSC320_1" },
    { from: "CSC270", to: "CSC310_OR_CSC320_1" },
    { from: "CSC310_OR_CSC320_1", to: "CSC310_OR_CSC320_2" },
    { from: "CSC310_OR_CSC320_2", to: "CSC492" },
    { from: "CSC491", to: "CSC492" },
];

const MPSD_PROGRESS_EDGES = [
    { from: "CSC120", to: "CSC220" },
    { from: "CSC120", to: "CSW123" },
    { from: "CSC220", to: "CSC310_OR_CSC330_1" },
    { from: "CSC310_OR_CSC330_1", to: "CSC310_OR_CSC330_2" },
    { from: "CSC491", to: "CSC492" },
];

const GRID_CONFIG = {
    collapsed: {
        left: 8,
        right: 92,
        cols: 8,
        rowYs: [5, 17, 29, 41, 53, 65, 77, 89],
        rowOffsets: [0, 0.15, 0, 0.15, 0, 0.15, 0, 0.15],
    },

    expanded: {
        left: 8,
        right: 92,
        cols: 8,
        rowYs: [5, 17, 29, 41, 53, 65, 77, 89],
        rowOffsets: [0, 0.15, 0, 0.15, 0, 0.15, 0, 0.15],
    },
};

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function normalizeCourseCode(code) {
    return String(code ?? "")
        .replaceAll("-", "")
        .replace(/\s+/g, "")
        .toUpperCase();
}

function makeKeyLabel(value) {
    return normalizeCourseCode(value)
        .replaceAll("INTEGRATIVECORE", "ICF")
        .replaceAll("FIRSTYEARSEMINAR", "FIRST_YEAR_SEMINAR")
        .replaceAll("FOUNDATION", "FOUNDATION")
        .replaceAll("EXPLORATION", "EXPLORATION")
        .replaceAll("CAPSTONE", "CAPSTONE");
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

function getNodeNavigationOptions(course) {
    const label = course.requirementLabel || course.code || "";
    const code = course.code || "";

    // "Foreign Language or Elective"
    if (label === "Foreign Language or Elective") {
        return [
            {
                label: "View foreign language courses",
                path: `/foreign-languages`,
            },
            {
                label: "View electives",
                path: `/electives`,
            },
        ];
    }

    // "CSC360 or Elective", "CSW223 or Elective", "CSW423 or Elective", etc.
    if (label.includes("or Elective")) {
        const specificCourse = label.replace("or Elective", "").trim();

        return [
            {
                label: `View ${specificCourse}`,
                path: `${CLASS_ROUTE_PREFIX}${formatClassUrlCode(specificCourse)}`,
            },
            {
                label: "View electives",
                path: `/electives`,
            },
        ];
    }

    // "CSC3XX or CSC4XX"
    if (
        label.includes("CSC3XX") ||
        label.includes("CSC4XX") ||
        code.includes("CSC3XX") ||
        code.includes("CSC4XX")
    ) {
        return [
            {
                label: "View CSC 300/400 courses",
                path: `/csc-upper-level`,
            },
        ];
    }

    // Normal course node
    if (!course.isPlaceholder) {
        return [
            {
                label: `View ${code}`,
                path: `${CLASS_ROUTE_PREFIX}${formatClassUrlCode(code)}`,
            },
        ];
    }

    return [];
}

function buildEnrollmentsByStudent(enrollments) {
    const map = {};

    enrollments.forEach((enrollment) => {
        const studentId = Number(enrollment.studentId);
        if (!map[studentId]) map[studentId] = [];
        map[studentId].push(enrollment);
    });

    return map;
}

function getStudentEnrollments(student, enrollmentsByStudent) {
    if (!student) return [];
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

function normalizePlanSlot(slot) {
    if (typeof slot !== "string") return slot;

    const normalized = normalizeCourseCode(slot);

    if (slot === "Elective") {
        return { type: "elective", label: "Elective", credits: 4 };
    }

    if (slot === "Declared Minor Elective") {
        return { type: "minor-elective", label: "Declared Minor Elective", credits: 4 };
    }

    if (normalized === "CSC3XX" || normalized === "CSC4XX") {
        return {
            type: "csc-level",
            label: "CSC3XX or CSC4XX",
            level: "300-or-400",
            credits: 4,
        };
    }

    return { type: "specific", code: slot };
}

/* -------------------------------------------------------------------------- */
/*                        Build progress courses from plan                    */
/* -------------------------------------------------------------------------- */

function buildProgressCourses({
    selectedStudent,
    classes,
    enrollmentsByStudent,
}) {
    if (!selectedStudent) return [];

    const programType = getStudentProgramType(selectedStudent);

    const template =
        programType === "mpsd"
            ? MPSD_SEMESTER_PLAN_TEMPLATE
            : CS_SEMESTER_PLAN_TEMPLATE;

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

    const usedClassIds = new Set();
    const slotCounts = {};

    return template
        .flatMap((semester) =>
            semester.courses.map((slot) => {
                const normalizedSlot = normalizePlanSlot(slot);
                const slotKey = getProgressSlotKey(normalizedSlot, slotCounts);
                const position = layout[slotKey];

                const course = buildProgressCourseFromSlot({
                    slot: normalizedSlot,
                    slotKey,
                    position,
                    classByCode,
                    classes,
                    studentEnrollments,
                    usedClassIds,
                });

                if (!course) return null;

                return {
                    ...course,
                    isNonCsc: !isCscProgressSlot(normalizedSlot),
                };
            })
        )
        .filter(Boolean);
}

function getProgressSlotKey(slot, slotCounts) {
    let baseKey;

    if (slot.type === "specific") {
        return normalizeCourseCode(slot.code);
    }

    baseKey = normalizeCourseCode(slot.label ?? slot.code ?? "REQUIREMENT");
    slotCounts[baseKey] = (slotCounts[baseKey] ?? 0) + 1;

    if (baseKey === "INTEGRATIVECOREFIRSTYEARSEMINAR") {
        return "ICF_FIRST_YEAR_SEMINAR";
    }

    if (baseKey === "INTEGRATIVECOREFOUNDATION") {
        return `ICF_FOUNDATION_${slotCounts[baseKey]}`;
    }

    if (baseKey === "INTEGRATIVECOREEXPLORATION") {
        return `ICF_EXPLORATION_${slotCounts[baseKey]}`;
    }

    if (baseKey === "INTEGRATIVECORECAPSTONE") {
        return "ICF_CAPSTONE";
    }

    if (baseKey === "ELECTIVE") {
        return `ELECTIVE_${slotCounts[baseKey]}`;
    }

    if (baseKey === "DECLAREDMINORELECTIVE") {
        return `DECLARED_MINOR_ELECTIVE_${slotCounts[baseKey]}`;
    }

    if (baseKey === "FOREIGNLANGUAGEORELECTIVE") {
        return `FOREIGN_LANGUAGE_OR_ELECTIVE_${slotCounts[baseKey]}`;
    }

    if (baseKey === "CSC310ORCSC320") {
        return `CSC310_OR_CSC320_${slotCounts[baseKey]}`;
    }

    if (baseKey === "CSC310ORCSC330") {
        return `CSC310_OR_CSC330_${slotCounts[baseKey]}`;
    }

    if (baseKey === "CSC360ORELECTIVE") {
        return `CSC360_OR_ELECTIVE_${slotCounts[baseKey]}`;
    }

    if (baseKey === "CSC360ORCSC410") {
        return `CSC360_OR_CSC410_${slotCounts[baseKey]}`;
    }

    if (baseKey === "CSW223ORELECTIVE") {
        return "CSW223_OR_ELECTIVE";
    }

    if (baseKey === "CSW223ORCSW423") {
        return "CSW223_OR_CSW423";
    }

    if (baseKey === "CSW423ORELECTIVE") {
        return "CSW423_OR_ELECTIVE";
    }

    if (baseKey === "CSC3XXORCSC4XX") {
        return `CSC3XX_OR_CSC4XX_${slotCounts[baseKey]}`;
    }

    return `${baseKey}_${slotCounts[baseKey]}`;
}

function buildProgressCourseFromSlot({
    slot,
    slotKey,
    position,
    classByCode,
    classes,
    studentEnrollments,
    usedClassIds,
}) {
    if (!position) {
        console.warn("No progress layout position for slot:", slotKey, slot);
        return null;
    }

    if (slot.type === "specific") {
        return buildProgressSpecificSlot({
            slot,
            slotKey,
            position,
            classByCode,
            studentEnrollments,
            usedClassIds,
        });
    }

    if (slot.type === "csc-level") {
        return buildProgressCscLevelSlot({
            slot,
            slotKey,
            position,
            classes,
            studentEnrollments,
            usedClassIds,
        });
    }

    if (slot.type === "choice") {
        return buildProgressChoiceSlot({
            slot,
            slotKey,
            position,
            classByCode,
            studentEnrollments,
            usedClassIds,
        });
    }

    return buildProgressPlaceholderSlot({
        slot,
        slotKey,
        position,
    });
}

function isCscProgressSlot(slot) {
    const normalizedSlot = normalizePlanSlot(slot);

    if (normalizedSlot.type === "specific") {
        const code = normalizeCourseCode(normalizedSlot.code);
        return code.startsWith("CSC") || code.startsWith("CSW");
    }

    if (normalizedSlot.type === "choice") {
        const label = normalizeCourseCode(normalizedSlot.label);
        return label.startsWith("CSC") || label.startsWith("CSW");
    }

    if (normalizedSlot.type === "csc-level") {
        return true;
    }

    return false;
}

function buildProgressSpecificSlot({
    slot,
    slotKey,
    position,
    classByCode,
    studentEnrollments,
    usedClassIds,
}) {
    const normalizedCode = normalizeCourseCode(slot.code);
    const classItem = classByCode[normalizedCode];

    const enrollment = classItem
        ? getEnrollmentForClass(studentEnrollments, classItem.classId)
        : null;

    if (classItem && enrollment) {
        usedClassIds.add(Number(classItem.classId));
    }

    const grade = enrollment?.grade ?? null;
    const credits = slot.creditsOverride ?? classItem?.credits ?? slot.credits ?? "";

    return {
        id: slotKey,
        code: slot.code,
        credits,
        grade: grade === null || grade === undefined ? "" : getLetterGrade(grade),
        score:
            grade === null || grade === undefined || credits === ""
                ? ""
                : getGradePoints(grade) * Number(credits),
        status: getCourseStatus(enrollment),
        isPlaceholder: !classItem,
        ...position,
    };
}

function buildProgressCscLevelSlot({
    slot,
    slotKey,
    position,
    classes,
    studentEnrollments,
    usedClassIds,
}) {
    const matchingEnrollment = studentEnrollments.find((enrollment) => {
        if (usedClassIds.has(Number(enrollment.classId))) return false;

        const classItem = classes.find(
            (course) => Number(course.classId) === Number(enrollment.classId)
        );

        if (!classItem) return false;

        const code = normalizeCourseCode(classItem.code);
        if (!code.startsWith("CSC")) return false;

        const courseNumber = Number(code.replace("CSC", ""));
        if (Number.isNaN(courseNumber)) return false;

        if (slot.level === "300-or-400") {
            return courseNumber >= 300 && courseNumber < 500;
        }

        if (slot.level === 300) {
            return courseNumber >= 300 && courseNumber < 400;
        }

        if (slot.level === 400) {
            return courseNumber >= 400 && courseNumber < 500;
        }

        return false;
    });

    if (!matchingEnrollment) {
        return buildProgressPlaceholderSlot({ slot, slotKey, position });
    }

    const classItem = classes.find(
        (course) => Number(course.classId) === Number(matchingEnrollment.classId)
    );

    if (!classItem) {
        return buildProgressPlaceholderSlot({ slot, slotKey, position });
    }

    usedClassIds.add(Number(classItem.classId));

    const grade = matchingEnrollment.grade ?? null;
    const credits = classItem.credits ?? slot.credits ?? "";

    return {
        id: slotKey,
        code: classItem.code,
        credits,
        grade: grade === null || grade === undefined ? "" : getLetterGrade(grade),
        score:
            grade === null || grade === undefined || credits === ""
                ? ""
                : getGradePoints(grade) * Number(credits),
        status: getCourseStatus(matchingEnrollment),
        requirementLabel: slot.label,
        isPlaceholder: false,
        ...position,
    };
}

function buildProgressChoiceSlot({
    slot,
    slotKey,
    position,
    classByCode,
    studentEnrollments,
    usedClassIds,
}) {
    const options = slot.options ?? [];

    for (const option of options) {
        if (typeof option === "string") continue;

        const normalizedOption = normalizePlanSlot(option);
        if (normalizedOption.type !== "specific") continue;

        const classItem = classByCode[normalizeCourseCode(normalizedOption.code)];
        if (!classItem) continue;

        if (usedClassIds.has(Number(classItem.classId))) continue;

        const enrollment = getEnrollmentForClass(studentEnrollments, classItem.classId);
        if (!enrollment) continue;

        usedClassIds.add(Number(classItem.classId));

        const grade = enrollment.grade ?? null;
        const credits =
            normalizedOption.creditsOverride ??
            classItem.credits ??
            slot.credits ??
            "";

        return {
            id: slotKey,
            code: classItem.code,
            credits,
            grade: grade === null || grade === undefined ? "" : getLetterGrade(grade),
            score:
                grade === null || grade === undefined || credits === ""
                    ? ""
                    : getGradePoints(grade) * Number(credits),
            status: getCourseStatus(enrollment),
            requirementLabel: slot.label,
            isPlaceholder: false,
            ...position,
        };
    }

    return buildProgressPlaceholderSlot({ slot, slotKey, position });
}

function buildProgressPlaceholderSlot({ slot, slotKey, position }) {
    return {
        id: slotKey,
        code: slot.label ?? slot.code ?? "Requirement",
        credits: slot.credits ?? null,
        creditsLabel: slot.creditsLabel ?? null,
        grade: "",
        score: "",
        status: "planned",
        isPlaceholder: true,
        requirementLabel: slot.label ?? null,
        ...position,
    };
}

/* -------------------------------------------------------------------------- */
/*                                Layout utils                                */
/* -------------------------------------------------------------------------- */

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
        "CSC120-CSC270": 0.8,
        "CSC120-CSW123": 0.8,
        "CSC220-CSC310_OR_CSC320_1": -1.2,
        "CSC270-CSC310_OR_CSC320_1": 1.2,
        "CSC310_OR_CSC320_1-CSC310_OR_CSC320_2": 0,
        "CSC310_OR_CSC320_2-CSC492": 1.2,
        "CSC491-CSC492": -1.2,
        "CSC220-CSC310_OR_CSC330_1": -1.2,
        "CSC310_OR_CSC330_1-CSC310_OR_CSC330_2": 0,
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
        byRow[course.row].push({ id: course.id, col });
    }

    for (const rowCourses of Object.values(byRow)) {
        rowCourses.sort((a, b) => a.col - b.col);

        for (let i = 1; i < rowCourses.length; i++) {
            const prev = rowCourses[i - 1];
            const curr = rowCourses[i];

            if (curr.col - prev.col < 1.1) {
                console.warn(
                    `Potential progress tree overlap in ${expanded ? "expanded" : "collapsed"} layout: ` +
                    `${prev.id} and ${curr.id} are close together. Grid has ${grid.cols} columns.`
                );
            }
        }
    }
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

function ProgressPage() {
    const navigate = useNavigate();
    const [showExternalPrereqs, setShowExternalPrereqs] = useState(false);
    const [openNavMenuId, setOpenNavMenuId] = useState(null);

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

    const students = useMemo(() => rawStudents.map(normalizeStudent), [rawStudents]);
    const classes = useMemo(() => rawClasses.map(normalizeClass), [rawClasses]);
    const enrollments = useMemo(() => rawEnrollments.map(normalizeEnrollment), [rawEnrollments]);

    const enrollmentsByStudent = useMemo(
        () => buildEnrollmentsByStudent(enrollments),
        [enrollments]
    );

    const selectedStudent = useMemo(() => {
        if (!students.length) return null;

        return (
            students.find(
                (student) => Number(student.studentId) === Number(DEMO_STUDENT_ID)
            ) ?? students[0]
        );
    }, [students]);

    const programType = getStudentProgramType(selectedStudent);

    const mainCourses = useMemo(() => {
        return buildProgressCourses({
            selectedStudent,
            classes,
            enrollmentsByStudent,
        });
    }, [selectedStudent, classes, enrollmentsByStudent]);

    const mainEdges =
        programType === "mpsd"
            ? MPSD_PROGRESS_EDGES
            : CS_PROGRESS_EDGES;

    const visibleCourses = useMemo(() => {
        return showExternalPrereqs
            ? mainCourses
            : mainCourses.filter((course) => !course.isNonCsc);
    }, [mainCourses, showExternalPrereqs]);

    const courses = visibleCourses.map((course) => ({
        ...course,
        ...getGridPosition(course, showExternalPrereqs),
    }));

    const visibleCourseIds = new Set(courses.map((course) => course.id));

    const edges = mainEdges.filter((edge) => {
        return visibleCourseIds.has(edge.from) && visibleCourseIds.has(edge.to);
    });

    validateGridSpacing(courses, showExternalPrereqs);

    const courseMap = Object.fromEntries(courses.map((course) => [course.id, course]));
    const linePaths = buildLinePaths(edges, courseMap);

    const handleClick = (course) => {
        const options = getNodeNavigationOptions(course);

        if (options.length === 0) return;

        if (options.length === 1) {
            navigate(options[0].path);
            return;
        }

        setOpenNavMenuId((prev) => (prev === course.id ? null : course.id));
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
                                Four-year course plan with requirement slots and course status
                                {selectedStudent ? ` for ${selectedStudent.name}` : ""}
                            </p>
                        </div>

                        <button
                            className="progress-tree-toggle"
                            onClick={() => setShowExternalPrereqs((prev) => !prev)}
                        >
                            {showExternalPrereqs
                                ? "Hide non-CSC courses"
                                : "Show non-CSC courses"}
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

                        {courses.map((course) => {
                            const navOptions = getNodeNavigationOptions(course);
                            const hasMultipleOptions = navOptions.length > 1;
                            const isMenuOpen = openNavMenuId === course.id;

                            return (
                                <div key={course.id} className="progress-node-layer">
                                    <button
                                        type="button"
                                        className={`progress-node progress-node-${course.status} ${course.isPlaceholder ? "progress-node-placeholder" : ""
                                            } ${hasMultipleOptions ? "progress-node-has-menu" : ""}`}
                                        style={{
                                            left: `${course.x}%`,
                                            top: `${course.y}%`,
                                        }}
                                        onClick={() => handleClick(course)}
                                    >
                                        <span className="progress-node-code">
                                            {course.code}
                                        </span>
                                        <span className="progress-node-cell">
                                            {course.creditsLabel ?? course.credits ?? ""}
                                        </span>
                                        <span className="progress-node-cell">
                                            {course.grade}
                                        </span>
                                        <span className="progress-node-cell">
                                            {course.score}
                                        </span>
                                    </button>

                                    {isMenuOpen && (
                                        <div
                                            className="progress-node-nav-menu"
                                            style={{
                                                left: `${course.x}%`,
                                                top: `calc(${course.y}% + 4.25rem)`,
                                            }}
                                        >
                                            {navOptions.map((option) => (
                                                <button
                                                    key={option.path}
                                                    type="button"
                                                    className="progress-node-nav-option"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        navigate(option.path);
                                                        setOpenNavMenuId(null);
                                                    }}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ProgressPage;