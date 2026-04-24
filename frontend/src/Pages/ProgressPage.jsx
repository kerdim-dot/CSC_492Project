import SideBar from "../Components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../progress_page.css";

const CLASS_ROUTE_PREFIX = "/classes/";

/*
 * These should match your CSS:
 *
 * .progress-node {
 *   width: 18%;
 *   height: 7%;
 *   transform: translateX(-50%);
 * }
 *
 * Since x is treated as the CENTER of the node,
 * NODE_WIDTH is mostly useful for spacing validation / future math.
 */
const NODE_WIDTH = 18;
const NODE_HEIGHT = 7;

/*
 * Grid notes:
 * - row controls vertical level.
 * - col controls horizontal slot.
 * - expandedCol is used when non-CSC prerequisites are visible.
 *
 * Important:
 * Because nodes are wide, same-row courses should usually be
 * at least 2 columns apart.
 */
const mainCourses = [
    {
        id: "CSC120",
        code: "CSC120",
        credits: 4,
        grade: "A",
        score: 16,
        status: "good",
        row: 0,
        col: 3,
        expandedCol: 3,
    },

    {
        id: "CSC220",
        code: "CSC220",
        credits: 4,
        grade: "A",
        score: 16,
        status: "good",
        row: 1,
        col: 1,
        expandedCol: 1,
    },
    {
        id: "CSC320",
        code: "CSC320",
        credits: 4,
        grade: "A",
        score: 16,
        status: "good",
        row: 1,
        col: 3,
        expandedCol: 3,
    },
    {
        id: "CSC280",
        code: "CSC280",
        credits: 4,
        grade: "",
        score: "",
        status: "bad",
        row: 1,
        col: 5,
        expandedCol: 5,
    },

    {
        id: "CSC360A",
        code: "CSC360",
        credits: 4,
        grade: "B",
        score: 12,
        status: "in-progress",
        row: 2,
        col: 1,
        expandedCol: 1,
    },
    {
        id: "CSC360B",
        code: "CSC360",
        credits: 4,
        grade: "",
        score: "",
        status: "planned",
        row: 2,
        col: 3,
        expandedCol: 3,
    },
    {
        id: "CSC340",
        code: "CSC340",
        credits: 4,
        grade: "",
        score: "",
        status: "planned",
        row: 2,
        col: 5,
        expandedCol: 6,
    },

    {
        id: "CSC450",
        code: "CSC450",
        credits: 4,
        grade: "",
        score: "",
        status: "planned",
        row: 3,
        col: 2,
        expandedCol: 2,
    },
    {
        id: "CSC490",
        code: "CSC490",
        credits: 4,
        grade: "B",
        score: 12,
        status: "planned",
        row: 3,
        col: 4,
        expandedCol: 5,
    },
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

const mainEdges = [
    { from: "CSC120", to: "CSC220" },
    { from: "CSC120", to: "CSC320" },
    { from: "CSC320", to: "CSC280" },
    { from: "CSC220", to: "CSC360A" },
    { from: "CSC220", to: "CSC360B" },
    { from: "CSC360A", to: "CSC450" },
    { from: "CSC360B", to: "CSC450" },
    { from: "CSC280", to: "CSC490" },
];

const externalEdges = [
    { from: "MTH140", to: "CSC360B" },
    { from: "PHY150", to: "CSC340" },
    { from: "ENG101", to: "CSC490" },
];

const GRID_CONFIG = {
    collapsed: {
        left: 12,
        right: 88,
        cols: 7,
        rowYs: [8, 33, 58, 82],

        /*
         * Different offsets per row prevent vertical stacking.
         * These are fractions of one grid step.
         */
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
    /*
     * Small manual line-lane offsets.
     * These do not move the nodes — only the line attachment points.
     * Useful when two prerequisite lines visually stack.
     */
    const laneOffsets = {
        "CSC120-CSC220": -1.2,
        "CSC120-CSC320": 0,
        "CSC320-CSC280": 1.2,

        "CSC220-CSC360A": -1.2,
        "CSC220-CSC360B": 1.2,

        "CSC360A-CSC450": -1.1,
        "CSC360B-CSC450": 1.1,

        "CSC280-CSC490": 1.35,

        "MTH140-CSC360B": -1.6,
        "PHY150-CSC340": 2.2,
        "ENG101-CSC490": 2.4,
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

            /*
             * Since x is node center, the base line goes from center-bottom
             * to center-top. lane nudges the line left/right so overlapping
             * paths are easier to distinguish.
             */
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
        navigate(`${CLASS_ROUTE_PREFIX}${code.toLowerCase()}`);
    };

    return (
        <div className="progress-page-shell">
            <SideBar />

            <main className="progress-page-content">
                <section className="dashboard-surface progress-tree-surface">
                    <div className="dashboard-surface-header">
                        <div>
                            <h2 className="dashboard-surface-title">Progress Tree</h2>
                            <p className="dashboard-surface-subtitle">
                                CSC sequence with prerequisite structure and course status
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