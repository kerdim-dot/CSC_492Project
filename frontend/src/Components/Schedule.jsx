import { useState } from "react";
import "../schedule.css"
// import down_arrow_black from './../assets/down_arrow_black.svg'

function Schedule() {
    return (
        <div className="schedule-container">
            <ScheduleBlock />
            <ClassControls />
        </div>
    )
}


function ScheduleBlock() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const startHour = 7;
    const endHour = 22;

    const times = Array.from(
        { length: endHour - startHour + 1 },
        (_, i) => startHour + i
    );

    function formatHour(hour) {
        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour}:00 ${suffix}`;
    }

    return (
        <div
            className="schedule-grid"
            style={{
                display: "grid",
                gridTemplateColumns: `100px repeat(${days.length}, 1fr)`,
            }}
        >
            <div className="cell header-cell"></div>

            {days.map((day) => (
                <div key={day} className="cell header-cell">
                    {day}
                </div>
            ))}

            {times.flatMap((hour) => [
                <div key={`time-${hour}`} className="cell time-cell">
                    {formatHour(hour)}
                </div>,
                ...days.map((day) => (
                    <div key={`${day}-${hour}`} className="cell schedule-slot"></div>
                )),
            ])}
        </div>
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

function ClassControls() {
    const [showCSC, setShowCSC] = useState(false);
    const [showElectives, setShowElectives] = useState(false);

    const cscClasses = [
        "CSC-120",
        "CSC-220",
        "CSC-270",
        "CSC-310",
        "CSC-320",
        "CSC-360",
        "CSC-491",
        "CSC-492",
    ];

    const electives = [
        "Elective 1",
        "Elective 2",
        "Elective 3",
    ];

    const isAdmin = true;
    const [showAlter, setShowAlter] = useState(false);

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
                    professor: "Dr. Patel",
                },
            ],
        },
    ];

    return (
        <div className="class-controls">
            <div className="dropdown-group">
                <button
                    className="dropdown-button"
                    onClick={() => setShowCSC((prev) => !prev)}
                    >
                    <span>CSC Classes</span>
                    <img
                        src={down_arrow_black}
                        className={`dropdown-arrow ${showCSC ? "dropdown-arrow-open" : ""}`}
                        alt=""
                    />
                    </button>

                {showCSC && (
                    <div className="dropdown-menu">
                        {cscClasses.map((course) => (
                            <button key={course} className="dropdown-item">
                                {course}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="dropdown-group">
                <button
                    className="dropdown-button"
                    onClick={() => setShowElectives((prev) => !prev)}
                    >
                    <span>Electives</span>
                    <img
                        src={down_arrow_black}
                        className={`dropdown-arrow ${showElectives ? "dropdown-arrow-open" : ""}`}
                        alt=""
                    />
                    </button>

                {showElectives && (
                    <div className="dropdown-menu">
                        {electives.map((course) => (
                            <button key={course} className="dropdown-item">
                                {course}
                            </button>
                        ))}
                    </div>
                )}
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