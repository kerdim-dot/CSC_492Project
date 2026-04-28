import { useState, useMemo, useEffect, useCallback } from "react";
import "../schedule.css";
import down_arrow from "./../assets/down_arrow.svg";
import axios from "axios";

const API_BASE = "http://localhost:8080/test";

const ENROLLMENT_STATUS = {
    PLANNED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    DROPPED: 3,
};

function Schedule() {
    const DEMO_STUDENT_ID = 1;

    const role = localStorage.getItem("role") || "user";
    const isAdmin = role === "admin" || role === "supervisor";

    const [rawClasses, setRawClasses] = useState([]);
    const [rawStudents, setRawStudents] = useState([]);
    const [rawEnrollments, setRawEnrollments] = useState([]);
    const [rawPrerequisites, setRawPrerequisites] = useState([]);
    const [rawClassEntries, setRawClassEntries] = useState([]);
    const [rawImportantDates, setRawImportantDates] = useState([]);

    const [rawSchedules, setRawSchedules] = useState([]);
    const [rawScheduleEntries, setRawScheduleEntries] = useState([]);

    const [selectedStudentId, setSelectedStudentId] = useState(null);

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
                previousMeeting?.classId === meeting?.classId &&
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

    const handleRequiredPreviewChange = useCallback(
        (meeting) => {
            updatePreviewMeeting("required", meeting);
        },
        [updatePreviewMeeting]
    );

    const handleElectivePreviewChange = useCallback(
        (meeting) => {
            updatePreviewMeeting("elective", meeting);
        },
        [updatePreviewMeeting]
    );

    useEffect(() => {
        async function fetchScheduleData() {
            try {
                setIsLoadingSchedule(true);
                setScheduleError(null);

                const [
                    classRes,
                    studentRes,
                    enrollmentRes,
                    prerequisiteRes,
                    classEntryRes,
                    importantDateRes,
                ] = await Promise.all([
                    axios.get(`${API_BASE}/get/classes`),
                    axios.get(`${API_BASE}/get/students`),
                    axios.get(`${API_BASE}/get/enrollments`),
                    axios.get(`${API_BASE}/get/prequisiteMapping`).catch(() => ({ data: [] })),
                    axios.get(`${API_BASE}/get/class/entries`).catch(() => ({ data: [] })),
                    axios.get(`${API_BASE}/get/important/dates`).catch(() => ({ data: [] })),
                ]);

                setRawClasses(classRes.data ?? []);
                setRawStudents(studentRes.data ?? []);
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

    const students = useMemo(() => {
        return rawStudents.map(normalizeScheduleStudent);
    }, [rawStudents]);

    const enrollments = useMemo(() => {
        return rawEnrollments.map(normalizeScheduleEnrollment);
    }, [rawEnrollments]);

    const prerequisites = useMemo(() => {
        return rawPrerequisites.map(normalizeSchedulePrerequisite);
    }, [rawPrerequisites]);

    const classEntries = useMemo(() => {
        return rawClassEntries.map(normalizeClassEntry);
    }, [rawClassEntries]);

    const [demoAddedMeetings, setDemoAddedMeetings] = useState([]);
    const [demoRemovedMeetingKeys, setDemoRemovedMeetingKeys] = useState([]);

    useEffect(() => {
        if (!students.length) return;

        setSelectedStudentId((prev) => {
            if (prev) return prev;

            const demoStudent =
                students.find((student) => Number(student.studentId) === Number(DEMO_STUDENT_ID)) ??
                students[0];

            return demoStudent?.studentId ?? null;
        });
    }, [students]);

    const selectedStudent = useMemo(() => {
        if (!students.length) return null;

        return (
            students.find((student) => Number(student.studentId) === Number(selectedStudentId)) ??
            students[0]
        );
    }, [students, selectedStudentId]);

    const studentEnrollments = useMemo(() => {
        if (!selectedStudent) return [];

        return enrollments.filter(
            (enrollment) => Number(enrollment.studentId) === Number(selectedStudent.studentId)
        );
    }, [enrollments, selectedStudent]);

    useEffect(() => {
        async function fetchSelectedStudentSchedule() {
            if (!selectedStudent) {
                setRawSchedules([]);
                setRawScheduleEntries([]);
                return;
            }

            try {
                const scheduleRes = await axios.get(
                    `${API_BASE}/get/schedules?studentId=${selectedStudent.studentId}`
                );

                const schedules = scheduleRes.data ?? [];
                setRawSchedules(schedules);

                const firstSchedule =
                    schedules[0] ??
                    schedules.find((schedule) => {
                        const scheduleStudentId =
                            schedule.studentId ??
                            schedule.student_id ??
                            schedule.student?.id;

                        return Number(scheduleStudentId) === Number(selectedStudent.studentId);
                    });

                const scheduleId = getScheduleId(firstSchedule);

                if (!scheduleId) {
                    setRawScheduleEntries([]);
                    return;
                }

                const entryRes = await axios.get(
                    `${API_BASE}/get/schedule/entries?scheduleId=${scheduleId}`
                );

                setRawScheduleEntries(entryRes.data ?? []);
            } catch (error) {
                console.error("Failed to fetch selected student schedule:", error);
                setRawSchedules([]);
                setRawScheduleEntries([]);
            }
        }

        fetchSelectedStudentSchedule();
    }, [selectedStudent]);

    const scheduleEntries = useMemo(() => {
        return rawScheduleEntries.map(normalizeStudentScheduleEntry);
    }, [rawScheduleEntries]);

    const completedCourses = useMemo(() => {
        return buildCompletedCourseCodes(studentEnrollments, classes);
    }, [studentEnrollments, classes]);

    const inProgressCourses = useMemo(() => {
        return buildInProgressCourseCodes(studentEnrollments, classes);
    }, [studentEnrollments, classes]);

    const warningCourses = useMemo(() => {
        return buildWarningCourseCodes(studentEnrollments, classes);
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

    const selectedSchedule = useMemo(() => {
        return rawSchedules[0] ?? null;
    }, [rawSchedules]);

    const selectedScheduleId = useMemo(() => {
        return getScheduleId(selectedSchedule);
    }, [selectedSchedule]);

    const baseScheduledMeetings = useMemo(() => {
        return buildScheduledMeetingsFromEnrollments({
            studentEnrollments,
            classes,
            classEntries,
        });
    }, [studentEnrollments, classes, classEntries]);

    const scheduledMeetings = useMemo(() => {
        const filteredBase = baseScheduledMeetings.filter((meeting) => {
            return !demoRemovedMeetingKeys.includes(getMeetingKey(meeting));
        });

        return [...filteredBase, ...demoAddedMeetings];
    }, [baseScheduledMeetings, demoAddedMeetings, demoRemovedMeetingKeys]);

    const isPreviewScheduled = useMemo(() => {
        if (!previewMeeting) return false;

        return scheduleEntries.some((entry) => {
            const sameClass =
                Number(entry.classId) === Number(previewMeeting.classId);

            const sameDays =
                normalizeDays(entry.days) === normalizeDays(previewMeeting.days);

            const sameStart =
                normalizeComparableTime(entry.startTime) ===
                normalizeComparableTime(previewMeeting.startTime);

            const sameEnd =
                normalizeComparableTime(entry.endTime) ===
                normalizeComparableTime(previewMeeting.endTime);

            return sameClass && sameDays && sameStart && sameEnd;
        });
    }, [scheduleEntries, previewMeeting]);

    const studentTiles = useMemo(() => {
        return students.map((student) => {
            const studentSpecificEnrollments = enrollments.filter(
                (enrollment) => Number(enrollment.studentId) === Number(student.studentId)
            );

            return buildScheduleStudentTile({
                student,
                enrollments: studentSpecificEnrollments,
                classes,
            });
        });
    }, [students, enrollments, classes]);

    async function refreshSelectedScheduleEntries() {
        if (!selectedScheduleId) return;

        const entryRes = await axios.get(
            `${API_BASE}/get/schedule/entries?scheduleId=${selectedScheduleId}`
        );

        setRawScheduleEntries(entryRes.data ?? []);
    }

    function handleAddPreviewMeeting(meeting) {
        const key = getMeetingKey(meeting);

        setDemoRemovedMeetingKeys((prev) => prev.filter((item) => item !== key));

        setDemoAddedMeetings((prev) => {
            const alreadyExists = prev.some((item) => getMeetingKey(item) === key);

            if (alreadyExists) return prev;

            return [
                ...prev,
                {
                    ...meeting,
                    source: "scheduled",
                },
            ];
        });
    }

    function handleRemovePreviewMeeting(meeting) {
        const key = getMeetingKey(meeting);

        setDemoAddedMeetings((prev) =>
            prev.filter((item) => getMeetingKey(item) !== key)
        );

        setDemoRemovedMeetingKeys((prev) => {
            if (prev.includes(key)) return prev;
            return [...prev, key];
        });
    }

    function handleSelectStudent(studentId) {
        setSelectedStudentId(studentId);
        setPreviewMeetings({
            required: null,
            elective: null,
        });
    }

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
            {isAdmin ? (
                <AdminStudentSelector
                    students={studentTiles}
                    selectedStudentId={selectedStudent?.studentId}
                    onSelectStudent={handleSelectStudent}
                />
            ) : (
                <>
                    <RequiredCourseCarousel
                        courses={requiredCourses}
                        completedCourses={completedCourses}
                        inProgressCourses={inProgressCourses}
                        warningCourses={warningCourses}
                        scheduledMeetings={scheduledMeetings}
                        onPreviewChange={handleRequiredPreviewChange}
                    />

                    <ElectivesCarousel
                        courses={electiveCourses}
                        completedCourses={completedCourses}
                        inProgressCourses={inProgressCourses}
                        warningCourses={warningCourses}
                        scheduledMeetings={scheduledMeetings}
                        onPreviewChange={handleElectivePreviewChange}
                    />
                </>
            )}

            <ScheduleBlock
                selectedStudent={selectedStudent}
                scheduledMeetings={scheduledMeetings}
                previewMeeting={isAdmin ? null : previewMeeting}
                isPreviewScheduled={isPreviewScheduled}
                onAddPreviewMeeting={handleAddPreviewMeeting}
                onRemovePreviewMeeting={handleRemovePreviewMeeting}
            />

            <AdminControls
                importantDates={rawImportantDates}
                existingCourses={allCarouselCourses}
            />
        </div>
    );
}

/* ----------------------------- Normalizers ----------------------------- */

function getScheduleId(schedule) {
    return (
        schedule?.scheduleId ??
        schedule?.schedule_id ??
        schedule?.id ??
        null
    );
}

function cleanCsvDescription(value) {
    return String(value ?? "")
        .replaceAll("\\;", ",")
        .replaceAll(";", ",");
}

function normalizeCourseCode(value) {
    return String(value ?? "")
        .replace(/\s+/g, "")
        .replaceAll("-", "")
        .toUpperCase();
}

function normalizeDisplayCode(value) {
    const clean = normalizeCourseCode(value);
    const match = clean.match(/^([A-Z]+)(\d+[A-Z]*)$/);

    if (!match) return clean;

    return `${match[1]}-${match[2]}`;
}

function normalizeDays(days) {
    return String(days ?? "")
        .toUpperCase()
        .replace(/\s+/g, "")
        .split("")
        .sort()
        .join("");
}

function normalizeComparableTime(time) {
    return String(time ?? "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/^0/, "");
}

function normalizeScheduleStudent(rawStudent) {
    return {
        ...rawStudent,
        id: Number(rawStudent.id ?? rawStudent.student_id ?? rawStudent.studentId),
        studentId: Number(rawStudent.studentId ?? rawStudent.student_id ?? rawStudent.id),
        firstName: rawStudent.firstName ?? rawStudent.first_name ?? "",
        lastName: rawStudent.lastName ?? rawStudent.last_name ?? "",
        name:
            rawStudent.name ??
            `${rawStudent.firstName ?? rawStudent.first_name ?? ""} ${rawStudent.lastName ?? rawStudent.last_name ?? ""}`.trim(),
        isComputerScienceMajor: Boolean(
            rawStudent.isComputerScienceMajor ??
            rawStudent.is_computer_science_major
        ),
        isComputerScienceMinor: Boolean(
            rawStudent.isComputerScienceMinor ??
            rawStudent.is_computer_science_minor
        ),
        isMultiPlatformMajor: Boolean(
            rawStudent.isMultiPlatformMajor ??
            rawStudent.is_multi_platform_major
        ),
        graduationDate:
            rawStudent.graduationDate ??
            rawStudent.graduation_date,
    };
}

function getMeetingKey(meeting) {
    return [
        meeting.classId,
        normalizeDays(meeting.days),
        normalizeComparableTime(meeting.startTime),
        normalizeComparableTime(meeting.endTime),
    ].join("|");
}

function normalizeScheduleClass(rawClass) {
    const classId =
        rawClass.classId ??
        rawClass.class_id ??
        rawClass.id;

    const rawCode =
        rawClass.code ??
        rawClass.header ??
        rawClass.classCode;

    return {
        ...rawClass,

        id: Number(classId),
        classId: Number(classId),

        code: normalizeDisplayCode(rawCode),
        normalizedCode: normalizeCourseCode(rawCode),

        title:
            rawClass.title ??
            rawClass.name ??
            rawClass.className ??
            rawClass.header,

        credits: Number(rawClass.credits ?? 0),
        description: cleanCsvDescription(rawClass.description ?? ""),

        isRequired:
            Boolean(rawClass.isRequiredComputerScienceMajor)
            || Boolean(rawClass.is_required_computer_science_major)
            || Boolean(rawClass.isRequiredComputerScienceMinor)
            || Boolean(rawClass.is_required_computer_science_minor)
            || Boolean(rawClass.isRequiredMultiPlatformMajor)
            || Boolean(rawClass.is_required_multi_platform_major)
            || Boolean(rawClass.isCSMajor)
            || Boolean(rawClass.isCSMinor)
            || Boolean(rawClass.isMultiPlatformMajor),
    };
}

function normalizeScheduleEnrollment(rawEnrollment) {
    return {
        ...rawEnrollment,

        id:
            rawEnrollment.enrollment_id ??
            rawEnrollment.enrollmentId ??
            rawEnrollment.id,

        studentId:
            rawEnrollment.student_id ??
            rawEnrollment.studentId ??
            rawEnrollment.student?.id,

        classId:
            rawEnrollment.mountClass_id ??
            rawEnrollment.class_id ??
            rawEnrollment.classId ??
            rawEnrollment.mountClass?.id,

        status: Number(rawEnrollment.status),

        grade:
            rawEnrollment.grade === null ||
                rawEnrollment.grade === undefined ||
                rawEnrollment.grade === ""
                ? null
                : Number(rawEnrollment.grade),
    };
}

function normalizeSchedulePrerequisite(rawPrereq) {
    return {
        classId:
            rawPrereq.class_id ??
            rawPrereq.classId ??
            rawPrereq.mountClass_id,

        prerequisiteId:
            rawPrereq.prerequisiteId ??
            rawPrereq.prequisiteId ??
            rawPrereq.prereqId ??
            rawPrereq.prerequisite_class_id,
    };
}

function normalizeClassEntry(rawEntry) {
    const classId =
        rawEntry.mountClass_id ??
        rawEntry.mount_class_id ??
        rawEntry.class_id ??
        rawEntry.classId ??
        rawEntry.mountClass?.id;

    const meetingTime =
        rawEntry.meetingTime ??
        rawEntry.meeting_time ??
        rawEntry.time ??
        "";

    return {
        ...rawEntry,

        id:
            rawEntry.classEntry_id ??
            rawEntry.classEntryId ??
            rawEntry.id,

        classId: Number(classId),

        sectionNumber:
            rawEntry.sectionNumber ??
            rawEntry.section_number ??
            rawEntry.section ??
            rawEntry.id ??
            "01",

        days:
            rawEntry.days ??
            buildDaysString(rawEntry),

        meetingTime,

        startTime:
            rawEntry.startTime ??
            rawEntry.start_time ??
            parseStartFromRange(meetingTime),

        endTime:
            rawEntry.endTime ??
            rawEntry.end_time ??
            parseEndFromRange(meetingTime),

        seatsFilled:
            rawEntry.seatsFilled ??
            rawEntry.seats_filled ??
            0,

        totalSeats:
            rawEntry.totalSeats ??
            rawEntry.total_seats ??
            rawEntry.capacity ??
            0,

        professor:
            rawEntry.professor ??
            rawEntry.professorName ??
            rawEntry.professor_name ??
            rawEntry.instructor ??
            "TBA",
    };
}

function normalizeStudentScheduleEntry(rawEntry) {
    const classId =
        rawEntry.classId ??
        rawEntry.class_id ??
        rawEntry.mountClassId ??
        rawEntry.mountClass_id ??
        rawEntry.mountClass?.id;

    const time =
        rawEntry.time ??
        rawEntry.meetingTime ??
        rawEntry.meeting_time ??
        "";

    return {
        ...rawEntry,

        id:
            rawEntry.id ??
            rawEntry.scheduleEntryId ??
            rawEntry.schedule_entry_id,

        scheduleId:
            rawEntry.scheduleId ??
            rawEntry.schedule_id ??
            rawEntry.schedule?.id,

        classId: Number(classId),

        days:
            rawEntry.days ??
            buildDaysString(rawEntry),

        time,

        startTime:
            rawEntry.startTime ??
            rawEntry.start_time ??
            parseStartFromRange(time),

        endTime:
            rawEntry.endTime ??
            rawEntry.end_time ??
            parseEndFromRange(time),
    };
}

function buildDaysString(entry) {
    const days = [];

    if (entry.isMonday ?? entry.is_monday) days.push("M");
    if (entry.isTuesday ?? entry.is_tuesday) days.push("T");

    if (
        entry.isWednesDay ??
        entry.isWednesday ??
        entry.is_wednes_day ??
        entry.is_wednesday
    ) {
        days.push("W");
    }

    if (entry.isThursday ?? entry.is_thursday) days.push("R");
    if (entry.isFriday ?? entry.is_friday) days.push("F");

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

    if (!match) return String(value).trim();

    const hour = match[1];
    const minute = match[2] ?? "00";
    const meridian = match[3].toUpperCase();

    return `${hour}:${minute} ${meridian}`;
}

/* ----------------------------- Data builders ----------------------------- */

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

function buildWarningCourseCodes(studentEnrollments, classes) {
    const classById = Object.fromEntries(
        classes.map((course) => [Number(course.classId), course])
    );

    return studentEnrollments
        .filter((enrollment) => {
            if (enrollment.status !== ENROLLMENT_STATUS.IN_PROGRESS) return false;
            if (enrollment.grade === null || enrollment.grade === undefined) return false;

            return Number(enrollment.grade) < 70;
        })
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

        const sections = (entriesByClassId[Number(course.classId)] ?? []).map((entry, index) => ({
            id: entry.id ?? `${course.classId}-${index}`,
            classId: course.classId,
            sectionNumber:
                entry.sectionNumber && entry.sectionNumber !== "01"
                    ? entry.sectionNumber
                    : String(index + 1).padStart(2, "0"),
            days: entry.days,
            meetingTime: entry.meetingTime,
            startTime: entry.startTime,
            endTime: entry.endTime,
            seatsFilled: entry.seatsFilled,
            totalSeats: entry.totalSeats,
            professor: entry.professor,
        }));

        return {
            classId: course.classId,
            code: course.code,
            normalizedCode: course.normalizedCode,
            title: course.title,
            credits: course.credits,
            description: course.description,
            prerequisites: prereqCodes,
            sections,
            isRequired: course.isRequired,
        };
    });
}

function buildScheduledMeetings({
    scheduleEntries,
    classes,
    classEntries,
}) {
    const classById = Object.fromEntries(
        classes.map((course) => [Number(course.classId), course])
    );

    return scheduleEntries
        .map((entry) => {
            const course = classById[Number(entry.classId)];
            if (!course) return null;

            const matchingClassEntry =
                classEntries.find((classEntry) => {
                    return (
                        Number(classEntry.classId) === Number(entry.classId) &&
                        normalizeComparableTime(classEntry.startTime) === normalizeComparableTime(entry.startTime) &&
                        normalizeComparableTime(classEntry.endTime) === normalizeComparableTime(entry.endTime)
                    );
                }) ??
                classEntries.find((classEntry) => Number(classEntry.classId) === Number(entry.classId));

            return {
                source: "scheduled",
                classId: course.classId,
                courseCode: course.code,
                courseTitle: course.title,
                sectionNumber: matchingClassEntry?.sectionNumber ?? "—",
                days: entry.days || matchingClassEntry?.days,
                meetingTime: entry.time || matchingClassEntry?.meetingTime,
                startTime: entry.startTime || matchingClassEntry?.startTime,
                endTime: entry.endTime || matchingClassEntry?.endTime,
                professor: matchingClassEntry?.professor ?? "TBA",
            };
        })
        .filter(Boolean);
}

function buildScheduledMeetingsFromEnrollments({
    studentEnrollments,
    classes,
    classEntries,
}) {
    const classById = Object.fromEntries(
        classes.map((course) => [Number(course.classId), course])
    );

    const entriesByClassId = {};

    classEntries.forEach((entry) => {
        const classId = Number(entry.classId);

        if (!entriesByClassId[classId]) {
            entriesByClassId[classId] = [];
        }

        entriesByClassId[classId].push(entry);
    });

    return studentEnrollments
        .filter((enrollment) => enrollment.status === ENROLLMENT_STATUS.IN_PROGRESS)
        .map((enrollment) => {
            const course = classById[Number(enrollment.classId)];

            if (!course) return null;

            const firstSection = entriesByClassId[Number(course.classId)]?.[0];

            if (!firstSection) {
                return {
                    source: "scheduled",
                    classId: course.classId,
                    courseCode: course.code,
                    courseTitle: course.title,
                    sectionNumber: "—",
                    days: "",
                    meetingTime: "",
                    startTime: null,
                    endTime: null,
                    professor: "TBA",
                };
            }

            return {
                source: "scheduled",
                classId: course.classId,
                courseCode: course.code,
                courseTitle: course.title,
                sectionNumber: firstSection.sectionNumber,
                days: firstSection.days,
                meetingTime: firstSection.meetingTime,
                startTime: firstSection.startTime,
                endTime: firstSection.endTime,
                professor: firstSection.professor,
            };
        })
        .filter(Boolean);
}

function getStudentProgramLabel(student) {
    const programs = [];

    if (student.isComputerScienceMajor) programs.push("CS Major");
    if (student.isComputerScienceMinor) programs.push("CS Minor");
    if (student.isMultiPlatformMajor) programs.push("Multi-Platform Major");

    return programs.length ? programs.join(" + ") : "Program unavailable";
}

function getStudentYearLabel(student) {
    if (!student.graduationDate) return "Year unavailable";

    const gradYear = Number(String(student.graduationDate).slice(0, 4));
    if (!Number.isFinite(gradYear)) return "Year unavailable";

    const currentYear = new Date().getFullYear();
    const yearsUntilGrad = gradYear - currentYear;

    if (yearsUntilGrad <= 0) return "Senior";
    if (yearsUntilGrad === 1) return "Junior";
    if (yearsUntilGrad === 2) return "Sophomore";
    return "First Year";
}

function timeToMinutes(timeString) {
    if (!timeString) return null;

    const cleaned = String(timeString).trim().toLowerCase();
    const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);

    if (!match) return null;

    let hours = Number(match[1]);
    const minutes = Number(match[2] ?? 0);
    const meridian = match[3];

    if (meridian === "pm" && hours !== 12) hours += 12;
    if (meridian === "am" && hours === 12) hours = 0;

    return hours * 60 + minutes;
}

function expandMeetingDays(daysString) {
    if (!daysString) return [];

    const normalized = String(daysString).toUpperCase().replace(/\s/g, "");

    if (normalized === "MWF") return ["M", "W", "F"];
    if (normalized === "TR" || normalized === "TTH") return ["T", "R"];

    const days = [];

    if (normalized.includes("M")) days.push("M");
    if (normalized.includes("T")) days.push("T");
    if (normalized.includes("W")) days.push("W");
    if (normalized.includes("R")) days.push("R");
    if (normalized.includes("F")) days.push("F");

    return days;
}

function meetingsOverlap(a, b) {
    const aStart = timeToMinutes(a.startTime);
    const aEnd = timeToMinutes(a.endTime);
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);

    if (aStart === null || aEnd === null || bStart === null || bEnd === null) {
        return false;
    }

    const aDays = expandMeetingDays(a.days);
    const bDays = expandMeetingDays(b.days);

    const sharesDay = aDays.some((day) => bDays.includes(day));
    if (!sharesDay) return false;

    return aStart < bEnd && bStart < aEnd;
}

function isSameMeeting(a, b) {
    return (
        Number(a.classId) === Number(b.classId) &&
        normalizeDays(a.days) === normalizeDays(b.days) &&
        normalizeComparableTime(a.startTime) === normalizeComparableTime(b.startTime) &&
        normalizeComparableTime(a.endTime) === normalizeComparableTime(b.endTime)
    );
}

function getSectionAvailability(sectionMeeting, scheduledMeetings) {
    const exactMatch = scheduledMeetings.find((scheduled) =>
        isSameMeeting(sectionMeeting, scheduled)
    );

    if (exactMatch) {
        return {
            state: "scheduled",
            label: "Already scheduled",
            conflict: exactMatch,
        };
    }

    const conflict = scheduledMeetings.find((scheduled) =>
        meetingsOverlap(sectionMeeting, scheduled)
    );

    if (conflict) {
        return {
            state: "conflict",
            label: `Conflicts with ${conflict.courseCode}`,
            conflict,
        };
    }

    return {
        state: "available",
        label: "Preview section",
        conflict: null,
    };
}

function buildScheduleStudentTile({ student, enrollments, classes }) {
    const classById = Object.fromEntries(
        classes.map((course) => [Number(course.classId), course])
    );

    const currentEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === ENROLLMENT_STATUS.IN_PROGRESS
    );

    const completedCount = enrollments.filter(
        (enrollment) => enrollment.status === ENROLLMENT_STATUS.COMPLETED
    ).length;

    const warningCount = currentEnrollments.filter((enrollment) => {
        if (enrollment.grade === null || enrollment.grade === undefined) return false;
        return Number(enrollment.grade) < 70;
    }).length;

    const currentCourses = currentEnrollments
        .map((enrollment) => classById[Number(enrollment.classId)]?.code)
        .filter(Boolean);

    return {
        studentId: student.studentId,
        name: student.name || `${student.firstName} ${student.lastName}`.trim(),
        programLabel: getStudentProgramLabel(student),
        yearLabel: getStudentYearLabel(student),
        currentCourses,
        completedCount,
        warningCount,
        status: warningCount > 0 ? "warning" : "good",
    };
}

/* ----------------------------- Carousels ----------------------------- */

function CourseCarousel({
    label,
    sectionClassName,
    courses = [],
    completedCourses = [],
    inProgressCourses = [],
    warningCourses = [],
    scheduledMeetings = [],
    onPreviewChange,
    source,
}) {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (selectedIndex >= courses.length) {
            setSelectedIndex(0);
        }
    }, [courses.length, selectedIndex]);

    const selectedCourse = courses[selectedIndex];

    const prevCourse = selectedIndex > 0 ? courses[selectedIndex - 1] : null;
    const nextCourse =
        selectedIndex < courses.length - 1
            ? courses[selectedIndex + 1]
            : null;

    const sections = selectedCourse && Array.isArray(selectedCourse.sections)
        ? selectedCourse.sections
        : [];

    const selectedSection = sections[selectedSectionIndex] ?? sections[0];

    const courseMap = useMemo(
        () => Object.fromEntries(courses.map((course) => [course.code, course])),
        [courses]
    );

    const completedSet = useMemo(() => new Set(completedCourses), [completedCourses]);
    const inProgressSet = useMemo(() => new Set(inProgressCourses), [inProgressCourses]);
    const warningSet = useMemo(() => new Set(warningCourses), [warningCourses]);

    function isCompleted(code) {
        return completedSet.has(code);
    }

    function isInProgress(code) {
        return inProgressSet.has(code);
    }

    function isWarning(code) {
        return warningSet.has(code);
    }

    function getCourseState(course) {
        if (!course) return "locked";
        if (isCompleted(course.code)) return "completed";
        if (isWarning(course.code)) return "warning";
        if (isInProgress(course.code)) return "in-progress";

        const prereqsMet = course.prerequisites.every((prereq) => isCompleted(prereq));
        return prereqsMet ? "available" : "locked";
    }

    function getStatusText(course) {
        const state = getCourseState(course);

        if (state === "completed") return "Completed";
        if (state === "warning") return "At risk";
        if (state === "in-progress") return "Currently taking";
        if (state === "available") return "Eligible to take";

        const missingCount = course.prerequisites.filter((code) => !isCompleted(code)).length;
        return `Missing ${missingCount} prerequisite${missingCount === 1 ? "" : "s"}`;
    }

    const selectedCourseState = getCourseState(selectedCourse);

    function goPrev() {
        if (selectedIndex === 0) return;

        setSlideDirection("slide-right");
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    function goNext() {
        if (selectedIndex === courses.length - 1) return;

        setSlideDirection("slide-left");
        setSelectedIndex((prev) => Math.min(prev + 1, courses.length - 1));
    }

    function jumpToCourse(code) {
        const newIndex = courses.findIndex((course) => course.code === code);
        if (newIndex === -1 || newIndex === selectedIndex) return;

        setSlideDirection(newIndex > selectedIndex ? "slide-left" : "slide-right");
        setSelectedIndex(newIndex);
    }

    useEffect(() => {
        if (!onPreviewChange) return;

        if (!isOpen || !selectedCourse || !selectedSection) {
            onPreviewChange(null);
            return;
        }

        onPreviewChange({
            source,
            classId: selectedCourse.classId,
            courseCode: selectedCourse.code,
            courseTitle: selectedCourse.title,
            sectionNumber: selectedSection.sectionNumber,
            days: selectedSection.days,
            meetingTime: selectedSection.meetingTime,
            startTime: selectedSection.startTime,
            endTime: selectedSection.endTime,
            professor: selectedSection.professor,
        });
    }, [isOpen, selectedCourse, selectedSection, onPreviewChange, source]);

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

    useEffect(() => {
        if (!selectedCourse || sections.length === 0) return;

        const currentSection = sections[selectedSectionIndex];

        const currentMeeting = currentSection
            ? {
                classId: selectedCourse.classId,
                courseCode: selectedCourse.code,
                courseTitle: selectedCourse.title,
                sectionNumber: currentSection.sectionNumber,
                days: currentSection.days,
                startTime: currentSection.startTime,
                endTime: currentSection.endTime,
                professor: currentSection.professor,
            }
            : null;

        const currentAvailability = currentMeeting
            ? getSectionAvailability(currentMeeting, scheduledMeetings)
            : { state: "available" };

        if (currentAvailability.state === "available") return;

        const firstAvailableIndex = sections.findIndex((section) => {
            const meeting = {
                classId: selectedCourse.classId,
                courseCode: selectedCourse.code,
                courseTitle: selectedCourse.title,
                sectionNumber: section.sectionNumber,
                days: section.days,
                startTime: section.startTime,
                endTime: section.endTime,
                professor: section.professor,
            };

            return getSectionAvailability(meeting, scheduledMeetings).state === "available";
        });

        setSelectedSectionIndex(firstAvailableIndex >= 0 ? firstAvailableIndex : 0);
    }, [selectedCourse, sections, selectedSectionIndex, scheduledMeetings]);

    useEffect(() => {
        if (!onPreviewChange) return;

        if (!isOpen || !selectedCourse || !selectedSection) {
            onPreviewChange(null);
            return;
        }

        const meeting = {
            source,
            classId: selectedCourse.classId,
            courseCode: selectedCourse.code,
            courseTitle: selectedCourse.title,
            sectionNumber: selectedSection.sectionNumber,
            days: selectedSection.days,
            meetingTime: selectedSection.meetingTime,
            startTime: selectedSection.startTime,
            endTime: selectedSection.endTime,
            professor: selectedSection.professor,
        };

        const availability = getSectionAvailability(meeting, scheduledMeetings);

        if (availability.state !== "available") {
            onPreviewChange(null);
            return;
        }

        onPreviewChange(meeting);
    }, [
        isOpen,
        selectedCourse,
        selectedSection,
        scheduledMeetings,
        onPreviewChange,
        source,
    ]);

    return (
        <section className={sectionClassName}>
            <button
                type="button"
                className={`required-carousel-toggle ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
            >
                <span>{label}</span>
                <img
                    src={down_arrow}
                    className={`dropdown-arrow ${isOpen ? "dropdown-arrow-open" : ""}`}
                    alt=""
                />
            </button>

            <div className={`required-carousel-collapse ${isOpen ? "open" : ""}`}>
                <div className="required-carousel-collapse-inner">
                    {!selectedCourse ? (
                        <div className="required-carousel-empty">
                            No courses available.
                        </div>
                    ) : (
                        <div className="required-carousel-shell">
                            {prevCourse ? (
                                <button
                                    type="button"
                                    className="carousel-arrow"
                                    onClick={goPrev}
                                    aria-label={`Previous ${label}`}
                                >
                                    ‹
                                </button>
                            ) : (
                                <div className="carousel-arrow-placeholder" aria-hidden="true" />
                            )}

                            <div className="required-carousel-center">
                                <div className="carousel-position">
                                    {selectedIndex + 1} of {courses.length}
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
                                                    {sections.length === 0 ? (
                                                        <div className="section-choice-empty">
                                                            No section data
                                                        </div>
                                                    ) : (
                                                        sections.map((section, index) => {
                                                            const sectionMeeting = {
                                                                classId: selectedCourse.classId,
                                                                courseCode: selectedCourse.code,
                                                                courseTitle: selectedCourse.title,
                                                                sectionNumber: section.sectionNumber,
                                                                days: section.days,
                                                                startTime: section.startTime,
                                                                endTime: section.endTime,
                                                                professor: section.professor,
                                                            };

                                                            const availability = getSectionAvailability(
                                                                sectionMeeting,
                                                                scheduledMeetings
                                                            );

                                                            const isBlocked = availability.state !== "available";

                                                            return (
                                                                <button
                                                                    key={section.id ?? `${section.sectionNumber}-${section.startTime}-${section.endTime}`}
                                                                    type="button"
                                                                    className={`section-choice-card ${index === selectedSectionIndex ? "active" : ""
                                                                        } section-${availability.state}`}
                                                                    disabled={isBlocked}
                                                                    title={
                                                                        availability.state === "conflict"
                                                                            ? `This section overlaps with ${availability.conflict?.courseCode}`
                                                                            : availability.label
                                                                    }
                                                                    onClick={() => {
                                                                        if (isBlocked) return;
                                                                        setSelectedSectionIndex(index);
                                                                    }}
                                                                >
                                                                    <div className="section-number-badge">
                                                                        {section.sectionNumber}
                                                                    </div>

                                                                    <div className="section-choice-stack">
                                                                        {section.days || "—"}
                                                                    </div>

                                                                    <div className="section-choice-stack">
                                                                        {section.startTime ?? "—"} - {section.endTime ?? "—"}
                                                                    </div>

                                                                    <div className="section-choice-stack">
                                                                        {section.seatsFilled}/{section.totalSeats}
                                                                    </div>

                                                                    {availability.state !== "available" && (
                                                                        <div className="section-blocked-reason">
                                                                            {availability.label}
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            );
                                                        })
                                                    )}
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
                                    aria-label={`Next ${label}`}
                                >
                                    ›
                                </button>
                            ) : (
                                <div className="carousel-arrow-placeholder" aria-hidden="true" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function RequiredCourseCarousel(props) {
    return (
        <CourseCarousel
            {...props}
            label="Required Courses"
            source="required"
            sectionClassName="required-carousel-section"
        />
    );
}

function ElectivesCarousel(props) {
    return (
        <CourseCarousel
            {...props}
            label="Electives"
            source="elective"
            sectionClassName="required-carousel-section-2"
        />
    );
}

/* ----------------------------- Admin student tiles ----------------------------- */

function AdminStudentSelector({
    students = [],
    selectedStudentId,
    onSelectStudent,
}) {
    return (
        <section className="schedule-admin-students-surface">
            <div className="schedule-surface-header">
                <div>
                    <h2 className="schedule-surface-title">Student Schedules</h2>
                    <p className="schedule-surface-subtitle">
                        Select a student to view their current weekly schedule.
                    </p>
                </div>
            </div>

            <div className="schedule-student-tile-scroll">
                <div className="schedule-student-tile-grid">
                    {students.map((student) => {
                        const isSelected =
                            Number(student.studentId) === Number(selectedStudentId);

                        return (
                            <button
                                key={student.studentId}
                                type="button"
                                className={`schedule-student-tile ${student.status} ${isSelected ? "selected" : ""
                                    }`}
                                onClick={() => onSelectStudent?.(student.studentId)}
                            >
                                <div className="schedule-student-tile-top">
                                    <div>
                                        <div className="schedule-student-name">
                                            {student.name || "Unnamed Student"}
                                        </div>
                                        <div className="schedule-student-meta">
                                            {student.programLabel}
                                        </div>
                                        <div className="schedule-student-meta">
                                            {student.yearLabel}
                                        </div>
                                    </div>

                                    <div className={`schedule-student-status-pill ${student.status}`}>
                                        {student.warningCount > 0
                                            ? `${student.warningCount} warning`
                                            : "On track"}
                                    </div>
                                </div>

                                <div className="schedule-student-course-row">
                                    {student.currentCourses.length > 0 ? (
                                        student.currentCourses.slice(0, 4).map((courseCode) => (
                                            <span
                                                key={courseCode}
                                                className="schedule-student-course-pill"
                                            >
                                                {courseCode}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="schedule-student-empty-courses">
                                            No current courses
                                        </span>
                                    )}
                                </div>

                                <div className="schedule-student-footer">
                                    <span>{student.completedCount} completed</span>
                                    <span>{student.currentCourses.length} active</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ----------------------------- Schedule grid ----------------------------- */

function ScheduleBlock({
    selectedStudent,
    scheduledMeetings = [],
    previewMeeting,
    isPreviewScheduled = false,
    onAddPreviewMeeting,
    onRemovePreviewMeeting,
}) {
    const [openPreviewMenu, setOpenPreviewMenu] = useState(null);
    const [openScheduledMenu, setOpenScheduledMenu] = useState(null);

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
        if (normalized.includes("T")) parsedDays.push("Tuesday");
        if (normalized.includes("R")) parsedDays.push("Thursday");

        return parsedDays;
    }

    function buildBlocks(meeting) {
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

    const previewBlocks = buildBlocks(previewMeeting);

    return (
        <section className="schedule-surface">
            <div className="schedule-surface-header">
                <div>
                    <h2 className="schedule-surface-title">
                        Weekly Schedule
                    </h2>
                    <p className="schedule-surface-subtitle">
                        {selectedStudent
                            ? `Viewing ${selectedStudent.name || "selected student"}`
                            : "No student selected"}
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

                {scheduledMeetings.flatMap((meeting) => {
                    const blocks = buildBlocks(meeting);

                    return blocks.map((block) => {
                        const menuKey = `scheduled-${meeting.courseCode}-${block.day}`;
                        const isMenuOpen = openScheduledMenu === menuKey;

                        return (
                            <div
                                key={menuKey}
                                className={`schedule-scheduled-block-shell ${isMenuOpen ? "menu-open" : ""}`}
                                style={{
                                    gridColumn: block.gridColumn,
                                    gridRow: block.gridRow,
                                }}
                            >
                                <button
                                    type="button"
                                    className="schedule-scheduled-block temporary-clickable-block"
                                    onClick={() => {
                                        setOpenScheduledMenu((prev) =>
                                            prev === menuKey ? null : menuKey
                                        );
                                    }}
                                >
                                    <div className="schedule-preview-code">
                                        {meeting.courseCode}
                                    </div>
                                    <div className="schedule-preview-meta">
                                        Scheduled
                                    </div>
                                    <div className="schedule-preview-time">
                                        {meeting.startTime} – {meeting.endTime}
                                    </div>
                                </button>

                                {isMenuOpen && (
                                    <ScheduleMeetingMenu
                                        meeting={meeting}
                                        actionLabel="Remove course"
                                        danger
                                        onAction={() => {
                                            onRemovePreviewMeeting?.(meeting);
                                            setOpenScheduledMenu(null);
                                        }}
                                    />
                                )}
                            </div>
                        );
                    });
                })}

                {previewBlocks.map((block) => {
                    const menuKey = `preview-${previewMeeting.courseCode}-${previewMeeting.sectionNumber}-${block.day}`;
                    const isMenuOpen = openPreviewMenu === menuKey;

                    return (
                        <div
                            key={menuKey}
                            className={`schedule-preview-block-shell ${isMenuOpen ? "menu-open" : ""}`}
                            style={{
                                gridColumn: block.gridColumn,
                                gridRow: block.gridRow,
                            }}
                        >
                            <button
                                type="button"
                                className="schedule-preview-block temporary-clickable-block"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setOpenPreviewMenu((prev) =>
                                        prev === menuKey ? null : menuKey
                                    );
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
                            </button>

                            {isMenuOpen && (
                                <ScheduleMeetingMenu
                                    meeting={previewMeeting}
                                    actionLabel={isPreviewScheduled ? "Remove course" : "Add course to schedule"}
                                    danger={isPreviewScheduled}
                                    onAction={() => {
                                        if (isPreviewScheduled) {
                                            onRemovePreviewMeeting?.(previewMeeting);
                                        } else {
                                            onAddPreviewMeeting?.(previewMeeting);
                                        }

                                        setOpenPreviewMenu(null);
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function ScheduleMeetingMenu({
    meeting,
    actionLabel,
    danger = false,
    onAction,
}) {
    return (
        <div className="schedule-temp-menu">
            <div className="schedule-temp-menu-title">
                {meeting.courseCode}
            </div>

            <div className="schedule-temp-menu-subtitle">
                {meeting.courseTitle}
            </div>

            <div className="schedule-temp-menu-line">
                Professor: {meeting.professor ?? "TBA"}
            </div>

            <div className="schedule-temp-menu-line">
                Time: {meeting.startTime} – {meeting.endTime}
            </div>

            <div className="schedule-temp-menu-line">
                Days: {meeting.days}
            </div>

            <button
                type="button"
                className={`schedule-temp-menu-action ${danger ? "danger" : ""}`}
                onClick={onAction}
            >
                {actionLabel}
            </button>
        </div>
    );
}

/* ----------------------------- Admin controls ----------------------------- */

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
        (course) => course.code === selectedCourseCode
    );

    const hasMultipleSections = selectedCourse?.sections?.length > 1;

    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [meetingTimes, setMeetingTimes] = useState("");
    const [totalSeats, setTotalSeats] = useState("");
    const [professor, setProfessor] = useState("");

    function handleCourseSelect(e) {
        const code = e.target.value;
        setSelectedCourseCode(code);
        setSelectedSectionId("");

        const course = courses.find((c) => c.code === code);
        if (!course) return;

        setCourseCode(course.code);
        setCourseName(course.title);

        if (course.sections.length === 1) {
            const onlySection = course.sections[0];
            const sectionId = String(onlySection.id ?? onlySection.sectionNumber);

            setSelectedSectionId(sectionId);
            setMeetingTimes(
                onlySection.meetingTime ??
                `${onlySection.startTime ?? ""}-${onlySection.endTime ?? ""}`
            );
            setTotalSeats(onlySection.totalSeats ?? "");
            setProfessor(onlySection.professor ?? "");
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
            (s) => String(s.id ?? s.sectionNumber) === String(sectionId)
        );

        if (!section) return;

        setMeetingTimes(
            section.meetingTime ??
            `${section.startTime ?? ""}-${section.endTime ?? ""}`
        );
        setTotalSeats(section.totalSeats ?? "");
        setProfessor(section.professor ?? "");
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
                                <option key={course.code} value={course.code}>
                                    {course.code}
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
                                        {selectedCourse.sections.map((section) => {
                                            const sectionId = String(section.id ?? section.sectionNumber);

                                            return (
                                                <option key={sectionId} value={sectionId}>
                                                    Section {section.sectionNumber}
                                                </option>
                                            );
                                        })}
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

    function getImportantDateValue(item) {
        return (
            item.dateOfEvent ??
            item.date_of_event ??
            item.dateStart ??
            item.date
        );
    }

    function parseDate(dateStr) {
        if (!dateStr) return new Date(0);

        if (dateStr.includes("-")) {
            const [year, month, day] = dateStr.split("-");
            return new Date(Number(year), Number(month) - 1, Number(day));
        }

        if (dateStr.includes("/")) {
            const [month, day, year] = dateStr.split("/");
            const fullYear = year.length === 2 ? `20${year}` : year;
            return new Date(Number(fullYear), Number(month) - 1, Number(day));
        }

        return new Date(dateStr);
    }

    const sortedDates = [...importantDates].sort(
        (a, b) =>
            parseDate(getImportantDateValue(a)) -
            parseDate(getImportantDateValue(b))
    );

    return (
        <div className="class-controls">
            <div className="important-dates-box">
                <div className="important-dates-title">Important Dates</div>

                <div className="important-dates-list">
                    {sortedDates.map((item, index) => {
                        const rawDate =
                            item.dateOfEvent ??
                            item.date_of_event ??
                            item.dateStart ??
                            item.date;

                        const rawTime =
                            item.timeOfEvent ??
                            item.time_of_event ??
                            item.timeStart ??
                            item.time;

                        const parsedDate = parseDate(rawDate);

                        const dayOfWeek = Number.isNaN(parsedDate.getTime())
                            ? ""
                            : parsedDate.toLocaleDateString("en-US", {
                                weekday: "long",
                            });

                        const formattedDate = Number.isNaN(parsedDate.getTime())
                            ? rawDate ?? ""
                            : parsedDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            });

                        return (
                            <div
                                className="important-date-item"
                                key={item.id ?? `${item.header}-${rawDate}-${index}`}
                            >
                                <div className="important-date-name">
                                    {item.header ?? item.title ?? "Important Date"}
                                </div>

                                <div className="important-date-range">
                                    {dayOfWeek}
                                    {dayOfWeek && formattedDate ? ", " : ""}
                                    {formattedDate}
                                    {rawTime ? ` • ${rawTime}` : ""}
                                </div>

                                {item.description && (
                                    <div className="important-date-description">
                                        {item.description}
                                    </div>
                                )}
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