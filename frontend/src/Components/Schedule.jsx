import { useState } from "react";
import "../schedule.css"
import down_arrow_black from './../assets/down_arrow_black.svg'

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

function CourseDropdownItem({ course }) {
    const sections = Array.isArray(course.sections) ? course.sections : [];
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [isWide, setIsWide] = useState(false);

    if (!course || sections.length === 0) return null;

    const selectedSection = sections[selectedSectionIndex] ?? sections[0];
    const canExpandWide = sections.length > 3;

    return (
        <div className={`course-layout-card ${isWide ? "wide" : ""}`}>

            {/* Top row: header box + sections */}
            <div className="course-layout-top">
                <div className="course-header-box">
                    <div className="course-code-pill">{course.code}</div>
                    <div className="course-name-pill">{course.title}</div>
                    <div className="course-card-credits">{course.credits} credits</div>
                </div>
                <div className="course-sections-area">
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
                    {canExpandWide && (
                        <button
                            type="button"
                            className="section-width-toggle"
                            onClick={() => setIsWide((prev) => !prev)}
                        >
                            {isWide ? "←" : "→"}
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom row: professor + description, fully independent */}
            <div className="course-professor-description-row">
                <div className="course-professor-box">
                    <div className="course-professor-label">Professor</div>
                    <div className="course-card-professor">{selectedSection.professor}</div>
                </div>
                <div className="course-description-box">
                    <span className="course-description-text">{course.description}</span>
                </div>
            </div>

            {showDetails && (
                <CourseDetailsModal
                    course={course}
                    onClose={() => setShowDetails(false)}
                />
            )}

        </div>
    );
}

function CourseDetailsModal({ course, onClose }) {
    return (
        <div className="course-details-backdrop">
            <div className="course-details-modal">
                <div className="course-details-header">
                    <div>
                        <h2>{course.code}</h2>
                        <p>{course.title}</p>
                    </div>
                    <button className="alter-close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="course-details-body">
                    <p>{course.description}</p>

                    <div className="course-details-sections">
                        {course.sections.map((section) => (
                            <div key={section.sectionNumber} className="course-details-section-card">
                                <strong>Section {section.sectionNumber}</strong>
                                <p>{section.professor}</p>
                                <p>{section.days}</p>
                                <p>
                                    {section.startTime} - {section.endTime}
                                </p>
                                <p>
                                    {section.seatsFilled}/{section.totalSeats} seats
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClassControls() {
    const [showCSC, setShowCSC] = useState(false);
    const [showElectives, setShowElectives] = useState(false);

    const cscClasses = [
        {
            code: "CSC-120",
            title: "Programming Problem Solving I",
            credits: 4,
            description:
                "Introduction to programming fundamentals, structured problem solving, and basic software development practices.",
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
            code: "CSC-320",
            title: "Algorithms and Data Structures",
            credits: 4,
            description:
                "Study of data structures, algorithm design, asymptotic analysis, and implementation techniques for efficient software systems.",
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
        {
            code: "CSC-360",
            title: "Computer Networks",
            credits: 4,
            description: "This course discusses network traffic, packets, DNS, DHCP, and more.",
            sections: [
                {
                    sectionNumber: "01",
                    days: "MWF",
                    startTime: "8:45 AM",
                    endTime: "9:50 AM",
                    seatsFilled: 10,
                    totalSeats: 15,
                    professor: "Dr. Acula",
                }
            ]
        }
    ];

    const electives = [
        "Elective 1",
        "Elective 2",
        "Elective 3",
    ];

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin" || role === "supervisor";
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
                            <CourseDropdownItem key={course.code} course={course} />
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
                            <CourseDropdownItem key={course.code} course={course} />
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