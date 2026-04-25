import { useState, useMemo, useEffect } from "react";
import "../schedule.css"
import down_arrow from './../assets/down_arrow.svg'
import axios from "axios";


function Schedule() {
    const [previewMeetings, setPreviewMeetings] = useState({
        required: null,
        elective: null,
    });

    const previewMeeting = previewMeetings.required ?? previewMeetings.elective;

    function updatePreviewMeeting(source, meeting) {
        setPreviewMeetings((prev) => ({
            ...prev,
            [source]: meeting,
        }));
    }

    useEffect(() => {
        const student_id = 1;
        const fetchSchedules = async () => {
            const scheduleData = await axios.get(`http://localhost:8080/test/get/schedules?studentId=${student_id}`);
            console.log(`Schedules for student ${student_id}`, scheduleData.data);

            for (let i = 0; i < scheduleData.data.length; i++) {
                const scheduleEntryData = await axios.get(`http://localhost:8080/test/get/schedule/entries?scheduleId=${scheduleData.data[i].schedule_id}`);
                console.log(`Entries for schedule ${scheduleData.data[i].schedule_id}:`, scheduleEntryData.data);
            }
        };

        fetchSchedules();
    }, []);

    const addScheduleEntry = async () => {
        const entry = {
            schedule_id: 1,
            mountClass_id: 1,
            isMonday: true,
            isTuesday: false,
            isWednesDay: true,
            isThursday: false,
            isFriday: true,
            time: "730am-8:45am"
        };

        const addScheduleData = await axios.post("http://localhost:8080/test/add/schedule/Entry", entry);
        console.log("scheduleData confirmation", addScheduleData);
    };

    const addSchedule = async () => {
        const student_id = 1;
        const startDate = "2025-11-25";
        const endDate = "2026-11-25";

        const entry = {
            student_id: student_id,
            scheduleStartDate: startDate,
            scheduleEndDate: endDate
        };

        const addScheduleData = await axios.post("http://localhost:8080/test/add/schedule", entry);
        console.log("scheduleData confirmation", addScheduleData);
    };

    const deleteSchedule = async () => {
        const schedule_id = 1;
        await axios.delete(`http://localhost:8080/test/delete/schedule/entries?id=${schedule_id}`);
        await axios.delete(`http://localhost:8080/test/delete/schedule?id=${schedule_id}`);
    };

    return (
        <div className="schedule-container">
            <RequiredCourseCarousel
                completedCourses={["CSC-120", "CSC-220"]}
                inProgressCourses={["CSC-130"]}
                onPreviewChange={(meeting) => updatePreviewMeeting("required", meeting)}
            />

            <ElectivesCarousel
                completedCourses={["CSC-120", "CSC-220"]}
                inProgressCourses={["CSC-130"]}
                onPreviewChange={(meeting) => updatePreviewMeeting("elective", meeting)}
            />

            <ScheduleBlock previewMeeting={previewMeeting} />

            <AdminControls />

            <div className="schedule-dev-buttons">
                <button onClick={addScheduleEntry}>Add Schedule Entry</button>
                <button onClick={addSchedule}>Add Schedule</button>
                <button onClick={deleteSchedule}>Delete Schedule</button>
            </div>
        </div>
    );
}

function RequiredCourseCarousel({
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

function AdminControls() {

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin" || role === "supervisor";
    const [showAlter, setShowAlter] = useState(false);

    const importantDates = [
        {
            dayName: "Graduation",
            dateStart: "5/9/26",
            dateEnd: "5/9/26",
            dayOfWeekStart: "Saturday",
            dayOfWeekEnd: "Saturday",
        },
        {
            dayName: "Classes Resume from Easter Recess",
            dateStart: "4/6/26",
            dateEnd: "4/6/26",
            dayOfWeekStart: "Monday",
            dayOfWeekEnd: "Monday",
        },
        {
            dayName: "Last Day to Petition to Change Day/Time of a Final Exam",
            dateStart: "4/17/26",
            dateEnd: "4/17/26",
            dayOfWeekStart: "Friday",
            dayOfWeekEnd: "Friday",
        },
        {
            dayName: "SCHOLAR Day/Honors Convo (No Day Classes; Classes Resume at 6pm)",
            dateStart: "4/21/26",
            dateEnd: "4/21/26",
            dayOfWeekStart: "Tuesday",
            dayOfWeekEnd: "Tuesday",
        },
        {
            dayName: "Last Day of Regular Classes",
            dateStart: "4/30/26",
            dateEnd: "4/30/26",
            dayOfWeekStart: "Thursday",
            dayOfWeekEnd: "Thursday",
        },
        {
            dayName: "Final Exam Period (Includes Sunday 6pm Exam; No Saturday Exams)",
            dateStart: "5/1/26",
            dateEnd: "5/6/26",
            dayOfWeekStart: "Friday",
            dayOfWeekEnd: "Wednesday",
        },
        {
            dayName: "Semester Ends at 11:00pm",
            dateStart: "5/6/26",
            dateEnd: "5/6/26",
            dayOfWeekStart: "Wednesday",
            dayOfWeekEnd: "Wednesday",
        },
        {
            dayName: "Commencement",
            dateStart: "5/9/26",
            dateEnd: "5/9/26",
            dayOfWeekStart: "Saturday",
            dayOfWeekEnd: "Saturday",
        },


    ]

    const existingCourses = [
        {
            courseCode: "CSC-220",
            courseName: "Programming Problem Solving II",
            sections: [
                {
                    sectionId: "A",
                    meetingTimes: "MWF 8:45-9:50",
                    totalSeats: 24,
                    professor: "Dr. Smith",
                },
            ],
        },
        {
            courseCode: "CSC-320",
            courseName: "Algorithms and Data Structures",
            sections: [
                {
                    sectionId: "A",
                    meetingTimes: "MWF 10:00-11:05",
                    totalSeats: 30,
                    professor: "Dr. Jones",
                },
                {
                    sectionId: "B",
                    meetingTimes: "TR 2:20-4:00",
                    totalSeats: 28,
                    professor: "Dr. Acula",
                },
            ],
        },
    ];

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