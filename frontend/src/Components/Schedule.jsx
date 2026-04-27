import { useState, useMemo, useEffect, useCallback } from "react";
import "../schedule.css"
import down_arrow from './../assets/down_arrow.svg'
import axios from "axios";


function Schedule() {
    const DEMO_STUDENT_ID = 1;

    const [rawClasses, setRawClasses] = useState([]);
    const [rawEnrollments, setRawEnrollments] = useState([]);
    const [rawPrerequisites, setRawPrerequisites] = useState([]);
    const [rawClassEntries, setRawClassEntries] = useState([]);
    const [rawImportantDates, setRawImportantDates] = useState([]);

    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
    const [scheduleError, setScheduleError] = useState(null);

    const [previewMeetings, setPreviewMeetings] = useState({
        required: null,
        elective: null,
    });

    const previewMeeting = previewMeetings.required ?? previewMeetings.elective;

    const updatePreviewMeeting = useCallback((source, meeting) => {
        setPreviewMeetings((prev) => {
            const previousMeeting = prev[source];

            const sameMeeting =
                previousMeeting?.courseCode === meeting?.courseCode &&
                previousMeeting?.sectionNumber === meeting?.sectionNumber &&
                previousMeeting?.days === meeting?.days &&
                previousMeeting?.startTime === meeting?.startTime &&
                previousMeeting?.endTime === meeting?.endTime;

            if (sameMeeting) return prev;

            return {
                ...prev,
                [source]: meeting,
            };
        });
    }, []);

    const handleRequiredPreviewChange = useCallback((meeting) => {
        updatePreviewMeeting("required", meeting);
    }, [updatePreviewMeeting]);

    const handleElectivePreviewChange = useCallback((meeting) => {
        updatePreviewMeeting("elective", meeting);
    }, [updatePreviewMeeting]);

    useEffect(() => {
        async function fetchScheduleData() {
            try {
                setIsLoadingSchedule(true);
                setScheduleError(null);

                const [
                    classRes,
                    enrollmentRes,
                    prerequisiteRes,
                    classEntryRes,
                    importantDateRes,
                ] = await Promise.all([
                    axios.get("http://localhost:8080/test/get/classes"),
                    axios.get("http://localhost:8080/test/get/enrollments"),
                    axios.get("http://localhost:8080/test/get/prerequisites").catch(() => ({ data: [] })),
                    axios.get("http://localhost:8080/test/get/class/entries").catch(() => ({ data: [] })),
                    axios.get("http://localhost:8080/test/get/importantDates").catch(() => ({ data: [] })),
                ]);

                setRawClasses(classRes.data ?? []);
                setRawEnrollments(enrollmentRes.data ?? []);
                setRawPrerequisites(prerequisiteRes.data ?? []);
                setRawClassEntries(classEntryRes.data ?? []);
                setRawImportantDates(importantDateRes.data ?? []);
            } catch (error) {
                console.error("Failed to fetch schedule data:", error);
                setScheduleError(error);
            } finally {
                setIsLoadingSchedule(false);
            }
        }

        fetchScheduleData();
    }, []);

    const classes = useMemo(() => {
        return rawClasses.map(normalizeScheduleClass);
    }, [rawClasses]);

    const enrollments = useMemo(() => {
        return rawEnrollments.map(normalizeScheduleEnrollment);
    }, [rawEnrollments]);

    const prerequisites = useMemo(() => {
        return rawPrerequisites.map(normalizeSchedulePrerequisite);
    }, [rawPrerequisites]);

    const classEntries = useMemo(() => {
        return rawClassEntries.map(normalizeClassEntry);
    }, [rawClassEntries]);

    const studentEnrollments = useMemo(() => {
        return enrollments.filter(
            (enrollment) => Number(enrollment.studentId) === Number(DEMO_STUDENT_ID)
        );
    }, [enrollments]);

    const completedCourses = useMemo(() => {
        return buildCompletedCourseCodes(studentEnrollments, classes);
    }, [studentEnrollments, classes]);

    const inProgressCourses = useMemo(() => {
        return buildInProgressCourseCodes(studentEnrollments, classes);
    }, [studentEnrollments, classes]);

    const allCarouselCourses = useMemo(() => {
        return buildCarouselCourses({
            classes,
            prerequisites,
            classEntries,
        });
    }, [classes, prerequisites, classEntries]);

    const requiredCourses = useMemo(() => {
        return allCarouselCourses.filter((course) => course.isRequired);
    }, [allCarouselCourses]);

    const electiveCourses = useMemo(() => {
        return allCarouselCourses.filter((course) => !course.isRequired);
    }, [allCarouselCourses]);

    if (isLoadingSchedule) {
        return (
            <div className="schedule-container">
                <section className="schedule-surface">
                    <p className="schedule-surface-subtitle">Loading schedule data...</p>
                </section>
            </div>
        );
    }

    if (scheduleError) {
        return (
            <div className="schedule-container">
                <section className="schedule-surface">
                    <h2 className="schedule-surface-title">Schedule failed to load</h2>
                    <p className="schedule-surface-subtitle">
                        Check that the backend is running and that schedule endpoints exist.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className="schedule-container">
            <RequiredCourseCarousel
                courses={requiredCourses}
                completedCourses={completedCourses}
                inProgressCourses={inProgressCourses}
                onPreviewChange={handleRequiredPreviewChange}
            />

            <ElectivesCarousel
                courses={electiveCourses}
                completedCourses={completedCourses}
                inProgressCourses={inProgressCourses}
                onPreviewChange={handleElectivePreviewChange}
            />

            <ScheduleBlock previewMeeting={previewMeeting} />

            <AdminControls importantDates={rawImportantDates} existingCourses={allCarouselCourses} />
        </div>
    );
}

const ENROLLMENT_STATUS = {
    PLANNED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    DROPPED: 3,
};

function normalizeScheduleClass(rawClass) {
    const classId =
        rawClass.classId
        ?? rawClass.class_id
        ?? rawClass.id;

    return {
        ...rawClass,
        id: Number(classId),
        classId: Number(classId),

        code: rawClass.code ?? rawClass.header ?? rawClass.classCode,
        title: rawClass.title ?? rawClass.name ?? rawClass.className ?? rawClass.header,
        credits: Number(rawClass.credits ?? 0),
        description: rawClass.description ?? "",

        isRequired:
            Boolean(rawClass.isRequiredComputerScienceMajor)
            || Boolean(rawClass.isRequiredComputerScienceMinor)
            || Boolean(rawClass.isRequiredMultiPlatformMajor)
            || Boolean(rawClass.isCSMajor)
            || Boolean(rawClass.isCSMinor)
            || Boolean(rawClass.isMultiPlatformMajor),
    };
}

function normalizeScheduleEnrollment(rawEnrollment) {
    return {
        ...rawEnrollment,

        id: rawEnrollment.enrollment_id ?? rawEnrollment.enrollmentId ?? rawEnrollment.id,

        studentId:
            rawEnrollment.student_id
            ?? rawEnrollment.studentId
            ?? rawEnrollment.student?.id,

        classId:
            rawEnrollment.mountClass_id
            ?? rawEnrollment.class_id
            ?? rawEnrollment.classId
            ?? rawEnrollment.mountClass?.id,

        status: Number(rawEnrollment.status),
        grade:
            rawEnrollment.grade === null
                || rawEnrollment.grade === undefined
                || rawEnrollment.grade === ""
                ? null
                : Number(rawEnrollment.grade),
    };
}

function normalizeSchedulePrerequisite(rawPrereq) {
    return {
        classId:
            rawPrereq.class_id
            ?? rawPrereq.classId
            ?? rawPrereq.mountClass_id,

        prerequisiteId:
            rawPrereq.prerequisiteId
            ?? rawPrereq.prequisiteId
            ?? rawPrereq.prereqId,
    };
}

function normalizeClassEntry(rawEntry) {
    return {
        ...rawEntry,

        id: rawEntry.classEntry_id ?? rawEntry.classEntryId ?? rawEntry.id,

        classId:
            rawEntry.mountClass_id
            ?? rawEntry.class_id
            ?? rawEntry.classId
            ?? rawEntry.mountClass?.id,

        sectionNumber:
            rawEntry.sectionNumber
            ?? rawEntry.section_number
            ?? rawEntry.section
            ?? "01",

        days:
            rawEntry.days
            ?? buildDaysString(rawEntry),

        startTime:
            rawEntry.startTime
            ?? rawEntry.start_time
            ?? parseStartFromRange(rawEntry.time),

        endTime:
            rawEntry.endTime
            ?? rawEntry.end_time
            ?? parseEndFromRange(rawEntry.time),

        seatsFilled:
            rawEntry.seatsFilled
            ?? rawEntry.seats_filled
            ?? 0,

        totalSeats:
            rawEntry.totalSeats
            ?? rawEntry.total_seats
            ?? rawEntry.capacity
            ?? 0,

        professor:
            rawEntry.professor
            ?? rawEntry.instructor
            ?? "TBA",
    };
}

function buildDaysString(entry) {
    const days = [];

    if (entry.isMonday) days.push("M");
    if (entry.isTuesday) days.push("T");
    if (entry.isWednesDay || entry.isWednesday) days.push("W");
    if (entry.isThursday) days.push("R");
    if (entry.isFriday) days.push("F");

    return days.join("");
}

function parseStartFromRange(timeRange) {
    if (!timeRange) return null;

    const [start] = String(timeRange).split("-");
    return normalizeTimeString(start);
}

function parseEndFromRange(timeRange) {
    if (!timeRange) return null;

    const [, end] = String(timeRange).split("-");
    return normalizeTimeString(end);
}

function normalizeTimeString(value) {
    if (!value) return null;

    const cleaned = String(value).trim().toLowerCase();

    const match = cleaned.match(/^(\d{1,2})(?::?(\d{2}))?\s*(am|pm)$/);
    if (!match) return value;

    const hour = match[1];
    const minute = match[2] ?? "00";
    const meridian = match[3].toUpperCase();

    return `${hour}:${minute} ${meridian}`;
}

function buildCompletedCourseCodes(studentEnrollments, classes) {
    const classById = Object.fromEntries(
        classes.map((course) => [Number(course.classId), course])
    );

    return studentEnrollments
        .filter((enrollment) => enrollment.status === ENROLLMENT_STATUS.COMPLETED)
        .map((enrollment) => classById[Number(enrollment.classId)]?.code)
        .filter(Boolean);
}

function buildInProgressCourseCodes(studentEnrollments, classes) {
    const classById = Object.fromEntries(
        classes.map((course) => [Number(course.classId), course])
    );

    return studentEnrollments
        .filter((enrollment) => enrollment.status === ENROLLMENT_STATUS.IN_PROGRESS)
        .map((enrollment) => classById[Number(enrollment.classId)]?.code)
        .filter(Boolean);
}

function buildCarouselCourses({
    classes,
    prerequisites,
    classEntries,
}) {
    const entriesByClassId = {};

    classEntries.forEach((entry) => {
        const classId = Number(entry.classId);

        if (!entriesByClassId[classId]) {
            entriesByClassId[classId] = [];
        }

        entriesByClassId[classId].push(entry);
    });

    const classById = Object.fromEntries(
        classes.map((course) => [Number(course.classId), course])
    );

    return classes.map((course) => {
        const prereqCodes = prerequisites
            .filter((prereq) => Number(prereq.classId) === Number(course.classId))
            .map((prereq) => classById[Number(prereq.prerequisiteId)]?.code)
            .filter(Boolean);

        const sections = (entriesByClassId[Number(course.classId)] ?? []).map((entry) => ({
            sectionNumber: entry.sectionNumber,
            days: entry.days,
            startTime: entry.startTime,
            endTime: entry.endTime,
            seatsFilled: entry.seatsFilled,
            totalSeats: entry.totalSeats,
            professor: entry.professor,
        }));

        return {
            code: course.code,
            title: course.title,
            credits: course.credits,
            description: course.description,
            prerequisites: prereqCodes,
            sections,
            isRequired: course.isRequired,
        };
    });
}

function RequiredCourseCarousel({
    courses = [],
    completedCourses = [],
    inProgressCourses = [],
    onPreviewChange,
}) {

    const requiredCourses = courses;


    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState("");

    const selectedCourse = requiredCourses[selectedIndex];
    const prevCourse = selectedIndex > 0 ? requiredCourses[selectedIndex - 1] : null;
    const nextCourse =
        selectedIndex < requiredCourses.length - 1
            ? requiredCourses[selectedIndex + 1]
            : null;

    const sections = Array.isArray(selectedCourse.sections) ? selectedCourse.sections : [];
    const selectedSection = sections[selectedSectionIndex] ?? sections[0];

    const courseMap = useMemo(
        () => Object.fromEntries(requiredCourses.map((course) => [course.code, course])),
        [requiredCourses]
    );

    const completedSet = useMemo(() => new Set(completedCourses), [completedCourses]);
    const inProgressSet = useMemo(() => new Set(inProgressCourses), [inProgressCourses]);


    function isCompleted(code) {
        return completedSet.has(code);
    }

    function isInProgress(code) {
        return inProgressSet.has(code);
    }

    function getCourseState(course) {
        if (isCompleted(course.code)) return "completed";
        if (isInProgress(course.code)) return "in-progress";

        const prereqsMet = course.prerequisites.every((prereq) => isCompleted(prereq));
        return prereqsMet ? "available" : "locked";
    }

    const selectedCourseState = getCourseState(selectedCourse);

    function getStatusText(course) {
        const state = getCourseState(course);

        if (state === "completed") return "Completed";
        if (state === "in-progress") return "Currently taking";
        if (state === "available") return "Eligible to take";

        const missingCount = course.prerequisites.filter((code) => !isCompleted(code)).length;
        return `Missing ${missingCount} prerequisite${missingCount === 1 ? "" : "s"}`;
    }

    function goPrev() {
        if (selectedIndex === 0) return;
        setSlideDirection("slide-right");
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    function goNext() {
        if (selectedIndex === requiredCourses.length - 1) return;
        setSlideDirection("slide-left");
        setSelectedIndex((prev) => Math.min(prev + 1, requiredCourses.length - 1));
    }

    function jumpToCourse(code) {
        const newIndex = requiredCourses.findIndex((course) => course.code === code);
        if (newIndex === -1 || newIndex === selectedIndex) return;

        setSlideDirection(newIndex > selectedIndex ? "slide-left" : "slide-right");
        setSelectedIndex(newIndex);
    }

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!onPreviewChange) return;

        if (!isOpen || !selectedCourse || !selectedSection) {
            onPreviewChange(null);
            return;
        }

        onPreviewChange({
            source: "required",
            courseCode: selectedCourse.code,
            courseTitle: selectedCourse.title,
            sectionNumber: selectedSection.sectionNumber,
            days: selectedSection.days,
            startTime: selectedSection.startTime,
            endTime: selectedSection.endTime,
            professor: selectedSection.professor,
        });
    }, [isOpen, selectedCourse, selectedSection, onPreviewChange]);

    useEffect(() => {
        if (!slideDirection) return;

        const timer = setTimeout(() => {
            setSlideDirection("");
        }, 320);

        return () => clearTimeout(timer);
    }, [slideDirection]);

    useEffect(() => {
        setSelectedSectionIndex(0);
    }, [selectedIndex]);

    return (
        <section className="required-carousel-section">
            <button
                type="button"
                className={`required-carousel-toggle ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="required-course-carousel-panel"
            >
                <span>Required Courses</span>
                <img
                    src={down_arrow}
                    className={`dropdown-arrow ${isOpen ? "dropdown-arrow-open" : ""}`}
                    alt=""
                />
            </button>

            <div
                id="required-course-carousel-panel"
                className={`required-carousel-collapse ${isOpen ? "open" : ""}`}
            >
                <div className="required-carousel-collapse-inner">
                    <div className="required-carousel-shell">
                        {prevCourse ? (
                            <button
                                type="button"
                                className="carousel-arrow"
                                onClick={goPrev}
                                aria-label="Previous required course"
                            >
                                ‹
                            </button>
                        ) : (
                            <div className="carousel-arrow-placeholder" aria-hidden="true" />
                        )}

                        <div className="required-carousel-center">
                            <div className="carousel-position">
                                {selectedIndex + 1} of {requiredCourses.length}
                            </div>

                            <div className="carousel-track-preview">
                                {prevCourse ? (
                                    <div className="course-preview preview-left" aria-hidden="true">
                                        <span className="preview-code">{prevCourse.code}</span>
                                        <span className="preview-title">{prevCourse.title}</span>
                                    </div>
                                ) : (
                                    <div className="course-preview-placeholder" aria-hidden="true" />
                                )}

                                <article className={`focused-course-card ${selectedCourseState} ${slideDirection}`}>
                                    <div className="focused-course-main">
                                        <div className="focused-course-top">
                                            <div className="focused-course-header-box">
                                                <div className="course-code-pill">{selectedCourse.code}</div>
                                                <div className="course-name-pill">{selectedCourse.title}</div>
                                                <div className="course-card-credits">{selectedCourse.credits} credits</div>
                                                <div className={`focused-course-badge ${selectedCourseState}`}>
                                                    {getStatusText(selectedCourse)}
                                                </div>
                                            </div>

                                            <div className="focused-course-sections-area">
                                                {sections.map((section, index) => (
                                                    <button
                                                        key={section.sectionNumber}
                                                        type="button"
                                                        className={`section-choice-card ${index === selectedSectionIndex ? "active" : ""}`}
                                                        onClick={() => setSelectedSectionIndex(index)}
                                                    >
                                                        <div className="section-number-badge">{section.sectionNumber}</div>
                                                        <div className="section-choice-stack">{section.days}</div>
                                                        <div className="section-choice-stack">
                                                            {section.startTime} - {section.endTime}
                                                        </div>
                                                        <div className="section-choice-stack">
                                                            {section.seatsFilled}/{section.totalSeats}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="focused-course-professor-description-row">
                                            <div className="course-professor-box">
                                                <div className="course-professor-label">Professor</div>
                                                <div className="course-card-professor">
                                                    {selectedSection?.professor ?? "TBA"}
                                                </div>
                                            </div>

                                            <div className="focused-course-description-box">
                                                <span className="focused-course-description-text">
                                                    {selectedCourse.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="focused-course-footer">
                                        <div className="prereq-label">Prerequisites</div>

                                        {selectedCourse.prerequisites.length === 0 ? (
                                            <div className="no-prereqs-chip">No prerequisites</div>
                                        ) : (
                                            <div className="prereq-chip-row">
                                                {selectedCourse.prerequisites.map((prereqCode) => {
                                                    const prereqCourse = courseMap[prereqCode];
                                                    const prereqCompleted = isCompleted(prereqCode);

                                                    return (
                                                        <button
                                                            key={prereqCode}
                                                            type="button"
                                                            className={`prereq-chip ${prereqCompleted ? "completed" : "missing"}`}
                                                            onClick={() => jumpToCourse(prereqCode)}
                                                            title={prereqCourse ? prereqCourse.title : prereqCode}
                                                        >
                                                            <span className="prereq-chip-code">
                                                                {prereqCode}
                                                            </span>
                                                            {prereqCourse && (
                                                                <span className="prereq-chip-title">
                                                                    {prereqCourse.title}
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </article>

                                {nextCourse ? (
                                    <div className="course-preview preview-right" aria-hidden="true">
                                        <span className="preview-code">{nextCourse.code}</span>
                                        <span className="preview-title">{nextCourse.title}</span>
                                    </div>
                                ) : (
                                    <div className="course-preview-placeholder" aria-hidden="true" />
                                )}
                            </div>
                        </div>

                        {nextCourse ? (
                            <button
                                type="button"
                                className="carousel-arrow"
                                onClick={goNext}
                                aria-label="Next required course"
                            >
                                ›
                            </button>
                        ) : (
                            <div className="carousel-arrow-placeholder" aria-hidden="true" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ElectivesCarousel({
    completedCourses = [],
    inProgressCourses = [],
    onPreviewChange,
}) {

    const requiredCourses = [
        {
            code: "CSC-120",
            title: "Programming Problem Solving I",
            credits: 4,
            description:
                "Introduction to programming fundamentals, structured problem solving, and basic software development practices.",
            prerequisites: [],
            sections: [
                {
                    sectionNumber: "01",
                    days: "MWF",
                    startTime: "7:30 AM",
                    endTime: "8:35 AM",
                    seatsFilled: 18,
                    totalSeats: 24,
                    professor: "Dr. Smith",
                },
            ],
        },
        {
            code: "CSC-130",
            title: "Programming Problem Solving II",
            credits: 4,
            description:
                "Continuation of introductory programming with more complex data structures, abstraction, and program design.",
            prerequisites: ["CSC-120"],
            sections: [
                {
                    sectionNumber: "01",
                    days: "MWF",
                    startTime: "8:45 AM",
                    endTime: "9:50 AM",
                    seatsFilled: 20,
                    totalSeats: 24,
                    professor: "Dr. Allen",
                },
                {
                    sectionNumber: "02",
                    days: "TR",
                    startTime: "2:20 PM",
                    endTime: "3:35 PM",
                    seatsFilled: 16,
                    totalSeats: 24,
                    professor: "Dr. Allen",
                },
            ],
        },
        {
            code: "CSC-220",
            title: "Discrete Structures",
            credits: 3,
            description:
                "Logic, sets, functions, counting, relations, graphs, and proof techniques used in computer science.",
            prerequisites: ["CSC-120"],
            sections: [
                {
                    sectionNumber: "01",
                    days: "MWF",
                    startTime: "10:00 AM",
                    endTime: "11:05 AM",
                    seatsFilled: 15,
                    totalSeats: 24,
                    professor: "Dr. Brown",
                },
            ],
        },
        {
            code: "CSC-320",
            title: "Algorithms and Data Structures",
            credits: 4,
            description:
                "Study of algorithm design, asymptotic analysis, linear and non-linear data structures, and implementation techniques.",
            prerequisites: ["CSC-130", "CSC-220"],
            sections: [
                {
                    sectionNumber: "01",
                    days: "MWF",
                    startTime: "10:00 AM",
                    endTime: "11:05 AM",
                    seatsFilled: 22,
                    totalSeats: 30,
                    professor: "Dr. Jones",
                },
                {
                    sectionNumber: "02",
                    days: "TR",
                    startTime: "2:20 PM",
                    endTime: "4:00 PM",
                    seatsFilled: 28,
                    totalSeats: 28,
                    professor: "Dr. Patel",
                },
            ],
        },
    ];


    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState("");

    const selectedCourse = requiredCourses[selectedIndex];
    const prevCourse = selectedIndex > 0 ? requiredCourses[selectedIndex - 1] : null;
    const nextCourse =
        selectedIndex < requiredCourses.length - 1
            ? requiredCourses[selectedIndex + 1]
            : null;

    const sections = Array.isArray(selectedCourse.sections) ? selectedCourse.sections : [];
    const selectedSection = sections[selectedSectionIndex] ?? sections[0];

    const courseMap = useMemo(
        () => Object.fromEntries(requiredCourses.map((course) => [course.code, course])),
        []
    );

    const completedSet = useMemo(() => new Set(completedCourses), [completedCourses]);
    const inProgressSet = useMemo(() => new Set(inProgressCourses), [inProgressCourses]);


    function isCompleted(code) {
        return completedSet.has(code);
    }

    function isInProgress(code) {
        return inProgressSet.has(code);
    }

    function getCourseState(course) {
        if (isCompleted(course.code)) return "completed";
        if (isInProgress(course.code)) return "in-progress";

        const prereqsMet = course.prerequisites.every((prereq) => isCompleted(prereq));
        return prereqsMet ? "available" : "locked";
    }

    const selectedCourseState = getCourseState(selectedCourse);

    function getStatusText(course) {
        const state = getCourseState(course);

        if (state === "completed") return "Completed";
        if (state === "in-progress") return "Currently taking";
        if (state === "available") return "Eligible to take";

        const missingCount = course.prerequisites.filter((code) => !isCompleted(code)).length;
        return `Missing ${missingCount} prerequisite${missingCount === 1 ? "" : "s"}`;
    }

    function goPrev() {
        if (selectedIndex === 0) return;
        setSlideDirection("slide-right");
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    function goNext() {
        if (selectedIndex === requiredCourses.length - 1) return;
        setSlideDirection("slide-left");
        setSelectedIndex((prev) => Math.min(prev + 1, requiredCourses.length - 1));
    }

    function jumpToCourse(code) {
        const newIndex = requiredCourses.findIndex((course) => course.code === code);
        if (newIndex === -1 || newIndex === selectedIndex) return;

        setSlideDirection(newIndex > selectedIndex ? "slide-left" : "slide-right");
        setSelectedIndex(newIndex);
    }

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!onPreviewChange) return;

        if (!isOpen || !selectedCourse || !selectedSection) {
            onPreviewChange(null);
            return;
        }

        onPreviewChange({
            source: "elective",
            courseCode: selectedCourse.code,
            courseTitle: selectedCourse.title,
            sectionNumber: selectedSection.sectionNumber,
            days: selectedSection.days,
            startTime: selectedSection.startTime,
            endTime: selectedSection.endTime,
            professor: selectedSection.professor,
        });
    }, [isOpen, selectedCourse, selectedSection, onPreviewChange]);

    useEffect(() => {
        if (!slideDirection) return;

        const timer = setTimeout(() => {
            setSlideDirection("");
        }, 320);

        return () => clearTimeout(timer);
    }, [slideDirection]);

    useEffect(() => {
        setSelectedSectionIndex(0);
    }, [selectedIndex]);

    return (
        <section className="required-carousel-section-2">
            <button
                type="button"
                className={`required-carousel-toggle ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="required-course-carousel-panel"
            >
                <span>Electives</span>
                <img
                    src={down_arrow}
                    className={`dropdown-arrow ${isOpen ? "dropdown-arrow-open" : ""}`}
                    alt=""
                />
            </button>

            <div
                id="required-course-carousel-panel"
                className={`required-carousel-collapse ${isOpen ? "open" : ""}`}
            >
                <div className="required-carousel-collapse-inner">
                    <div className="required-carousel-shell">
                        {prevCourse ? (
                            <button
                                type="button"
                                className="carousel-arrow"
                                onClick={goPrev}
                                aria-label="Previous required course"
                            >
                                ‹
                            </button>
                        ) : (
                            <div className="carousel-arrow-placeholder" aria-hidden="true" />
                        )}

                        <div className="required-carousel-center">
                            <div className="carousel-position">
                                {selectedIndex + 1} of {requiredCourses.length}
                            </div>

                            <div className="carousel-track-preview">
                                {prevCourse ? (
                                    <div className="course-preview preview-left" aria-hidden="true">
                                        <span className="preview-code">{prevCourse.code}</span>
                                        <span className="preview-title">{prevCourse.title}</span>
                                    </div>
                                ) : (
                                    <div className="course-preview-placeholder" aria-hidden="true" />
                                )}

                                <article className={`focused-course-card ${selectedCourseState} ${slideDirection}`}>
                                    <div className="focused-course-main">
                                        <div className="focused-course-top">
                                            <div className="focused-course-header-box">
                                                <div className="course-code-pill">{selectedCourse.code}</div>
                                                <div className="course-name-pill">{selectedCourse.title}</div>
                                                <div className="course-card-credits">{selectedCourse.credits} credits</div>
                                                <div className={`focused-course-badge ${selectedCourseState}`}>
                                                    {getStatusText(selectedCourse)}
                                                </div>
                                            </div>

                                            <div className="focused-course-sections-area">
                                                {sections.map((section, index) => (
                                                    <button
                                                        key={section.sectionNumber}
                                                        type="button"
                                                        className={`section-choice-card ${index === selectedSectionIndex ? "active" : ""}`}
                                                        onClick={() => setSelectedSectionIndex(index)}
                                                    >
                                                        <div className="section-number-badge">{section.sectionNumber}</div>
                                                        <div className="section-choice-stack">{section.days}</div>
                                                        <div className="section-choice-stack">
                                                            {section.startTime} - {section.endTime}
                                                        </div>
                                                        <div className="section-choice-stack">
                                                            {section.seatsFilled}/{section.totalSeats}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="focused-course-professor-description-row">
                                            <div className="course-professor-box">
                                                <div className="course-professor-label">Professor</div>
                                                <div className="course-card-professor">
                                                    {selectedSection?.professor ?? "TBA"}
                                                </div>
                                            </div>

                                            <div className="focused-course-description-box">
                                                <span className="focused-course-description-text">
                                                    {selectedCourse.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="focused-course-footer">
                                        <div className="prereq-label">Prerequisites</div>

                                        {selectedCourse.prerequisites.length === 0 ? (
                                            <div className="no-prereqs-chip">No prerequisites</div>
                                        ) : (
                                            <div className="prereq-chip-row">
                                                {selectedCourse.prerequisites.map((prereqCode) => {
                                                    const prereqCourse = courseMap[prereqCode];
                                                    const prereqCompleted = isCompleted(prereqCode);

                                                    return (
                                                        <button
                                                            key={prereqCode}
                                                            type="button"
                                                            className={`prereq-chip ${prereqCompleted ? "completed" : "missing"}`}
                                                            onClick={() => jumpToCourse(prereqCode)}
                                                            title={prereqCourse ? prereqCourse.title : prereqCode}
                                                        >
                                                            <span className="prereq-chip-code">
                                                                {prereqCode}
                                                            </span>
                                                            {prereqCourse && (
                                                                <span className="prereq-chip-title">
                                                                    {prereqCourse.title}
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </article>

                                {nextCourse ? (
                                    <div className="course-preview preview-right" aria-hidden="true">
                                        <span className="preview-code">{nextCourse.code}</span>
                                        <span className="preview-title">{nextCourse.title}</span>
                                    </div>
                                ) : (
                                    <div className="course-preview-placeholder" aria-hidden="true" />
                                )}
                            </div>
                        </div>

                        {nextCourse ? (
                            <button
                                type="button"
                                className="carousel-arrow"
                                onClick={goNext}
                                aria-label="Next required course"
                            >
                                ›
                            </button>
                        ) : (
                            <div className="carousel-arrow-placeholder" aria-hidden="true" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}



function ScheduleBlock({ previewMeeting }) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const startHour = 7;
    const endHour = 22;
    const slotMinutes = 15;

    const totalSlots = ((endHour - startHour) * 60) / slotMinutes;

    const hourLabels = Array.from(
        { length: endHour - startHour + 1 },
        (_, i) => startHour + i
    );

    const slotRows = Array.from({ length: totalSlots }, (_, i) => i);

    function formatHour(hour) {
        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour}:00 ${suffix}`;
    }

    function parseTimeToMinutes(timeString) {
        if (!timeString) return null;

        const cleaned = timeString.trim().toLowerCase();
        const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);

        if (!match) return null;

        let hours = Number(match[1]);
        const minutes = Number(match[2] ?? 0);
        const meridian = match[3];

        if (meridian === "pm" && hours !== 12) hours += 12;
        if (meridian === "am" && hours === 12) hours = 0;

        return hours * 60 + minutes;
    }

    function getMeetingDays(daysString) {
        if (!daysString) return [];

        const normalized = daysString.toUpperCase().replace(/\s/g, "");

        if (normalized === "MWF") return ["Monday", "Wednesday", "Friday"];
        if (normalized === "TR" || normalized === "TTH") return ["Tuesday", "Thursday"];

        const parsedDays = [];

        if (normalized.includes("M")) parsedDays.push("Monday");
        if (normalized.includes("W")) parsedDays.push("Wednesday");
        if (normalized.includes("F")) parsedDays.push("Friday");

        // Treat R as Thursday so T can safely mean Tuesday.
        if (normalized.includes("T")) parsedDays.push("Tuesday");
        if (normalized.includes("R")) parsedDays.push("Thursday");

        return parsedDays;
    }

    function buildPreviewBlocks(meeting) {
        if (!meeting) return [];

        const start = parseTimeToMinutes(meeting.startTime);
        const end = parseTimeToMinutes(meeting.endTime);

        if (start === null || end === null || end <= start) return [];

        const startOffset = start - startHour * 60;
        const endOffset = end - startHour * 60;

        if (endOffset <= 0 || startOffset >= totalSlots * slotMinutes) return [];

        const clampedStart = Math.max(0, startOffset);
        const clampedEnd = Math.min(totalSlots * slotMinutes, endOffset);

        const rowStart = Math.floor(clampedStart / slotMinutes) + 2;
        const rowSpan = Math.max(1, Math.ceil((clampedEnd - clampedStart) / slotMinutes));

        return getMeetingDays(meeting.days)
            .map((day) => {
                const dayIndex = days.indexOf(day);
                if (dayIndex === -1) return null;

                return {
                    day,
                    gridColumn: dayIndex + 2,
                    gridRow: `${rowStart} / span ${rowSpan}`,
                };
            })
            .filter(Boolean);
    }

    const previewBlocks = buildPreviewBlocks(previewMeeting);

    return (
        <section className="schedule-surface">
            <div className="schedule-surface-header">
                <div>
                    <h2 className="schedule-surface-title">Weekly Schedule</h2>
                    <p className="schedule-surface-subtitle">
                        Selected sections preview temporarily while their dropdown is open.
                    </p>
                </div>

                {previewMeeting && (
                    <div className="schedule-preview-chip">
                        Previewing {previewMeeting.courseCode}-{previewMeeting.sectionNumber}
                    </div>
                )}
            </div>

            <div
                className="schedule-grid"
                style={{
                    gridTemplateColumns: `100px repeat(${days.length}, minmax(0, 1fr))`,
                    gridTemplateRows: `56px repeat(${totalSlots}, 12px)`,
                }}
            >
                <div className="schedule-corner-cell" />

                {days.map((day) => (
                    <div key={day} className="schedule-day-header">
                        {day}
                    </div>
                ))}

                {hourLabels.slice(0, -1).map((hour, index) => (
                    <div
                        key={`time-${hour}`}
                        className="schedule-time-cell"
                        style={{
                            gridColumn: 1,
                            gridRow: `${index * 4 + 2} / span 4`,
                        }}
                    >
                        {formatHour(hour)}
                    </div>
                ))}

                {slotRows.flatMap((slot) =>
                    days.map((day, dayIndex) => (
                        <div
                            key={`${day}-${slot}`}
                            className={`schedule-slot ${slot % 4 === 0 ? "hour-start" : ""}`}
                            style={{
                                gridColumn: dayIndex + 2,
                                gridRow: slot + 2,
                            }}
                        />
                    ))
                )}

                {previewBlocks.map((block) => (
                    <div
                        key={`${previewMeeting.courseCode}-${previewMeeting.sectionNumber}-${block.day}`}
                        className="schedule-preview-block"
                        style={{
                            gridColumn: block.gridColumn,
                            gridRow: block.gridRow,
                        }}
                    >
                        <div className="schedule-preview-code">
                            {previewMeeting.courseCode}
                        </div>
                        <div className="schedule-preview-meta">
                            Sec. {previewMeeting.sectionNumber}
                        </div>
                        <div className="schedule-preview-time">
                            {previewMeeting.startTime} – {previewMeeting.endTime}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function AdminAssign({ isAdmin = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [studentName, setStudentName] = useState("");

    if (!isAdmin) return null;

    return (
        <div className={`admin-assign ${isOpen ? "open" : ""}`}>
            {isOpen && (
                <input
                    type="text"
                    className="admin-assign-input"
                    placeholder="Enter student name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                />
            )}

            <button
                className="admin-assign-button"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                Assign
            </button>


        </div>
    );
}

function AdminAlterButton({ isAdmin = false, onClick }) {
    if (!isAdmin) return null;

    return (
        <button className="admin-alter-button" onClick={onClick}>
            Alter
        </button>
    );
}

function AlterCoursesModal({ isAdmin = false, courses = [], onClose }) {
    const [selectedCourseCode, setSelectedCourseCode] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState("");

    const selectedCourse = courses.find(
        (course) => course.courseCode === selectedCourseCode
    );

    const hasMultipleSections = selectedCourse?.sections?.length > 1;

    const selectedSection = selectedCourse?.sections?.find(
        (section) => section.sectionId === selectedSectionId
    );

    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [meetingTimes, setMeetingTimes] = useState("");
    const [totalSeats, setTotalSeats] = useState("");
    const [professor, setProfessor] = useState("");

    function handleCourseSelect(e) {
        const code = e.target.value;
        setSelectedCourseCode(code);
        setSelectedSectionId("");

        const course = courses.find((c) => c.courseCode === code);
        if (!course) return;

        setCourseCode(course.courseCode);
        setCourseName(course.courseName);

        if (course.sections.length === 1) {
            const onlySection = course.sections[0];
            setSelectedSectionId(onlySection.sectionId);
            setMeetingTimes(onlySection.meetingTimes);
            setTotalSeats(onlySection.totalSeats);
            setProfessor(onlySection.professor);
        } else {
            setMeetingTimes("");
            setTotalSeats("");
            setProfessor("");
        }
    }

    function handleSectionSelect(e) {
        const sectionId = e.target.value;
        setSelectedSectionId(sectionId);

        const section = selectedCourse?.sections.find(
            (s) => s.sectionId === sectionId
        );

        if (!section) return;

        setMeetingTimes(section.meetingTimes);
        setTotalSeats(section.totalSeats);
        setProfessor(section.professor);
    }

    if (!isAdmin) return null;

    return (
        <div className="alter-modal-backdrop">
            <div className="alter-modal">
                <div className="alter-modal-header">
                    <h2>Alter Existing Class</h2>
                    <button className="alter-close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="alter-form">
                    <label>
                        Course Code
                        <select value={selectedCourseCode} onChange={handleCourseSelect}>
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                                <option key={course.courseCode} value={course.courseCode}>
                                    {course.courseCode}
                                </option>
                            ))}
                        </select>
                    </label>

                    {selectedCourse && (
                        <>
                            <label>
                                Edit Course Code
                                <input
                                    type="text"
                                    value={courseCode}
                                    onChange={(e) => setCourseCode(e.target.value)}
                                />
                            </label>

                            <label>
                                Edit Course Name
                                <input
                                    type="text"
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                />
                            </label>

                            {hasMultipleSections && (
                                <label>
                                    Section
                                    <select value={selectedSectionId} onChange={handleSectionSelect}>
                                        <option value="">Select a section</option>
                                        {selectedCourse.sections.map((section) => (
                                            <option key={section.sectionId} value={section.sectionId}>
                                                Section {section.sectionId}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            {(!hasMultipleSections || selectedSectionId) && (
                                <>
                                    <label>
                                        Meeting Times
                                        <input
                                            type="text"
                                            value={meetingTimes}
                                            onChange={(e) => setMeetingTimes(e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Total Seats
                                        <input
                                            type="number"
                                            value={totalSeats}
                                            onChange={(e) => setTotalSeats(e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Professor
                                        <input
                                            type="text"
                                            value={professor}
                                            onChange={(e) => setProfessor(e.target.value)}
                                        />
                                    </label>
                                </>
                            )}

                            <div className="alter-form-actions">
                                <button className="alter-save-button">Save Changes</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function AdminControls({ importantDates = [], existingCourses = [] }) {
    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin" || role === "supervisor";
    const [showAlter, setShowAlter] = useState(false);

    function parseDate(dateStr) {
        const [month, day, year] = dateStr.split("/");
        return new Date(`20${year}`, month - 1, day);
    }

    const sortedDates = [...importantDates].sort(
        (a, b) => parseDate(a.dateStart) - parseDate(b.dateStart)
    );

    return (
        <div className="class-controls">
            <div className="important-dates-box">
                <div className="important-dates-title">Important Dates</div>

                <div className="important-dates-list">
                    {sortedDates.map((item, index) => {
                        const isSingleDay = item.dateStart === item.dateEnd;

                        return (
                            <div className="important-date-item" key={index}>
                                <div className="important-date-name">{item.dayName}</div>

                                <div className="important-date-range">
                                    {isSingleDay ? (
                                        <>
                                            {item.dayOfWeekStart}, {item.dateStart}
                                        </>
                                    ) : (
                                        <>
                                            {item.dayOfWeekStart}, {item.dateStart} -{" "}
                                            {item.dayOfWeekEnd}, {item.dateEnd}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="admin-actions">
                <AdminAssign isAdmin={isAdmin} />

                <div className="alter-popover-wrapper">
                    <AdminAlterButton
                        isAdmin={isAdmin}
                        onClick={() => setShowAlter((prev) => !prev)}
                    />

                    {showAlter && (
                        <AlterCoursesModal
                            isAdmin={isAdmin}
                            courses={existingCourses}
                            onClose={() => setShowAlter(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Schedule;