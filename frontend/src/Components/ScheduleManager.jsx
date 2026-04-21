import axios from "axios";
import { useEffect, useState } from "react";

function ScheduleManager() {
    const [activeTab, setActiveTab] = useState("important-dates");
    const [importantDates, setImportantDates] = useState(null);
    const [classes, setClasses] = useState(null);
    const [classEntries, setClassEntries] = useState(null);

    const [isBeginning, setIsBeginning] = useState(true);

    // Important date update state
    const [selectedUpdateImportantDate, setSelectedUpdateImportantDate] = useState(null);
    const [updateHeader, setUpdateHeader] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [updateDate, setUpdateDate] = useState("");
    const [updateTime, setUpdateTime] = useState("");

    // Class entry update state
    const [selectedUpdateClassEntry, setSelectedUpdateClassEntry] = useState(null);
    const [updateClassHeader, setUpdateClassHeader] = useState("");
    const [updateProfessor, setUpdateProfessor] = useState("");
    const [updateTotalSeats, setUpdateTotalSeats] = useState("");
    const [updateMeetingTime, setUpdateMeetingTime] = useState("");
    const [updateMonday, setUpdateMonday] = useState(false);
    const [updateTuesday, setUpdateTuesday] = useState(false);
    const [updateWednesday, setUpdateWednesday] = useState(false);
    const [updateThursday, setUpdateThursday] = useState(false);
    const [updateFriday, setUpdateFriday] = useState(false);

    useEffect(() => {
        const getAllData = async () => {
            const retrieveImportantDatesData = await axios.get(`http://localhost:8080/test/get/important/dates`);
            const classesResp = await axios.get(`http://localhost:8080/test/get/classes`);
            const classEntriesResp = await axios.get(`http://localhost:8080/test/get/class/entries`);

            setImportantDates(retrieveImportantDatesData.data);
            setClasses(classesResp.data);
            setClassEntries(classEntriesResp.data);
        };
        getAllData();
    }, []);

    return (
        <div>
            <HeaderPanel activeTab={activeTab} setActiveTab={setActiveTab} />
            <BodyPanel
                activeTab={activeTab}
                importantDates={importantDates}
                classes={classes}
                classEntries={classEntries}
                isBeginning={isBeginning}
                setIsBeginning={setIsBeginning}
                selectedUpdateImportantDate={selectedUpdateImportantDate}
                setSelectedUpdateImportantDate={setSelectedUpdateImportantDate}
                updateHeader={updateHeader}
                setUpdateHeader={setUpdateHeader}
                updateDescription={updateDescription}
                setUpdateDescription={setUpdateDescription}
                updateDate={updateDate}
                setUpdateDate={setUpdateDate}
                updateTime={updateTime}
                setUpdateTime={setUpdateTime}
                selectedUpdateClassEntry={selectedUpdateClassEntry}
                setSelectedUpdateClassEntry={setSelectedUpdateClassEntry}
                updateClassHeader={updateClassHeader}
                setUpdateClassHeader={setUpdateClassHeader}
                updateProfessor={updateProfessor}
                setUpdateProfessor={setUpdateProfessor}
                updateTotalSeats={updateTotalSeats}
                setUpdateTotalSeats={setUpdateTotalSeats}
                updateMeetingTime={updateMeetingTime}
                setUpdateMeetingTime={setUpdateMeetingTime}
                updateMonday={updateMonday}
                setUpdateMonday={setUpdateMonday}
                updateTuesday={updateTuesday}
                setUpdateTuesday={setUpdateTuesday}
                updateWednesday={updateWednesday}
                setUpdateWednesday={setUpdateWednesday}
                updateThursday={updateThursday}
                setUpdateThursday={setUpdateThursday}
                updateFriday={updateFriday}
                setUpdateFriday={setUpdateFriday}
            />
        </div>
    );
}

export default ScheduleManager;

function HeaderPanel({ activeTab, setActiveTab }) {
    return (
        <div className="tab-header">
            <button
                className={activeTab === "important-dates" ? "tab active" : "tab"}
                onClick={() => { setActiveTab("important-dates") }}
            >
                Important Dates
            </button>

            <button
                className={activeTab === "class-entries" ? "tab active" : "tab"}
                onClick={() => { setActiveTab("class-entries") }}
            >
                Class Entries
            </button>
        </div>
    );
}

function UpdateImportantDateBlock({
    isBeginning,
    selectedUpdateImportantDate,
    setSelectedUpdateImportantDate,
    updateHeader,
    setUpdateHeader,
    updateDescription,
    setUpdateDescription,
    updateDate,
    setUpdateDate,
    updateTime,
    setUpdateTime
}) {
    const [processingImportantDateUpdate, setProcessingImportantDateUpdate] = useState(false);

    const updateImportantDateEntry = () => {
        setProcessingImportantDateUpdate(true);
    };

    return (
        <div className={
            selectedUpdateImportantDate
                ? "update-important-date-panel-out"
                : isBeginning
                    ? "update-important-date-panel"
                    : "update-important-date-panel-hidden"
        }>
            <img
                className="close-img-two"
                src={close}
                onClick={() => { setSelectedUpdateImportantDate(null) }}
            />

            <p className="student-panel-title">Update Important Date Panel</p>

            <div className="panel-entry">
                <p>Header</p>
                <input
                    className="panel-input"
                    value={updateHeader}
                    onChange={(e) => { setUpdateHeader(e.target.value) }}
                />
            </div>

            <div className="panel-entry">
                <p>Description</p>
                <input
                    className="panel-input"
                    value={updateDescription}
                    onChange={(e) => { setUpdateDescription(e.target.value) }}
                />
            </div>

            <div className="panel-entry">
                <p>Date of Event</p>
                <input
                    type="date"
                    className="panel-input"
                    value={updateDate}
                    onChange={(e) => { setUpdateDate(e.target.value) }}
                />
            </div>

            <div className="panel-entry">
                <p>Time of Event</p>
                <input
                    type="time"
                    className="panel-input"
                    value={updateTime}
                    onChange={(e) => { setUpdateTime(e.target.value) }}
                />
            </div>

            <button className="panel-button" onClick={updateImportantDateEntry}>
                {processingImportantDateUpdate ? "Processing..." : "Confirm Update"}
            </button>
        </div>
    );
}

function CreateImportantDate() {
    return (
        <div className="create-date-container">
            <p className="create-date-title">Create Important Date</p>

            <div className="create-date-row">
                <input type="text" className="create-date-input" placeholder="Header" />
                <input type="text" className="create-date-input" placeholder="Description" />
            </div>

            <div className="create-date-row">
                <input type="date" className="create-date-input" />

                <div className="important-date-time-container">
                    <input type="time" className="create-date-input" />
                    <p>-</p>
                    <input type="time" className="create-date-input" />
                </div>
            </div>

            <button className="create-date-button">Add Date</button>
        </div>
    );
}

function DisplayImportantDates({
    importantDates,
    setIsBeginning,
    setSelectedUpdateImportantDate,
    setUpdateHeader,
    setUpdateDescription,
    setUpdateDate,
    setUpdateTime
}) {
    const clickOnUpdateEntry = (item) => {
        setIsBeginning(false);
        setSelectedUpdateImportantDate(item.id);
        setUpdateHeader(item.header);
        setUpdateDescription(item.description);
        setUpdateDate(item.dateOfEvent);
        setUpdateTime(item.timeOfEvent);
    };

    if (!importantDates) return <p>Loading...</p>;

    return (
        <div className="important-dates-container">
            <CreateImportantDate />

            <div className="important-dates-scroll">
                {importantDates.length === 0 ? (
                    <p className="empty-message">No important dates yet.</p>
                ) : (
                    importantDates.map((item) => (
                        <div
                            key={item.id}
                            className="date-card"
                            onClick={() => { clickOnUpdateEntry(item) }}
                        >
                            <div className="date-card-header">
                                <p className="date-card-title">{item.header}</p>
                                <p className="date-card-datetime">
                                    {item.dateOfEvent} · {item.timeOfEvent}
                                </p>
                            </div>
                            <p className="date-card-description">{item.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function UpdateClassEntryBlock({
    isBeginning,
    selectedUpdateClassEntry,
    setSelectedUpdateClassEntry,
    updateClassHeader,
    setUpdateClassHeader,
    updateProfessor,
    setUpdateProfessor,
    updateTotalSeats,
    setUpdateTotalSeats,
    updateMeetingTime,
    setUpdateMeetingTime,
    updateMonday,
    setUpdateMonday,
    updateTuesday,
    setUpdateTuesday,
    updateWednesday,
    setUpdateWednesday,
    updateThursday,
    setUpdateThursday,
    updateFriday,
    setUpdateFriday
}) {
    const [processingClassEntryUpdate, setProcessingClassEntryUpdate] = useState(false);

    const updateClassEntryEntry = () => {
        setProcessingClassEntryUpdate(true);
    };

    return (
        <div className={
            selectedUpdateClassEntry
                ? "update-class-entry-panel-out"
                : isBeginning
                    ? "update-class-entry-panel"
                    : "update-class-entry-panel-hidden"
        }>
            <img
                className="close-img-two"
                src={close}
                onClick={() => { setSelectedUpdateClassEntry(null) }}
            />

            <p className="student-panel-title">Update Class Entry Panel</p>

            <div className="panel-entry">
                <p>Class Header</p>
                <input
                    className="panel-input"
                    value={updateClassHeader}
                    onChange={(e) => { setUpdateClassHeader(e.target.value) }}
                />
            </div>

            <div className="panel-entry">
                <p>Professor</p>
                <input
                    className="panel-input"
                    value={updateProfessor}
                    onChange={(e) => { setUpdateProfessor(e.target.value) }}
                />
            </div>

            <div className="panel-entry">
                <p>Total Seats</p>
                <input
                    type="number"
                    className="panel-input"
                    value={updateTotalSeats}
                    onChange={(e) => { setUpdateTotalSeats(e.target.value) }}
                    min="1"
                />
            </div>

            <div className="panel-entry">
                <p>Meeting Time</p>
                <input
                    className="panel-input"
                    value={updateMeetingTime}
                    onChange={(e) => { setUpdateMeetingTime(e.target.value) }}
                    placeholder="e.g. 10:00 AM - 11:15 AM"
                />
            </div>

            <div className="panel-entry">
                <p>Meeting Days</p>
                <div className="day-checkbox-row">
                    <label className="day-checkbox">
                        <input
                            type="checkbox"
                            checked={!!updateMonday}
                            onChange={(e) => { setUpdateMonday(e.target.checked) }}
                        />
                        <span>Mon</span>
                    </label>
                    <label className="day-checkbox">
                        <input
                            type="checkbox"
                            checked={!!updateTuesday}
                            onChange={(e) => { setUpdateTuesday(e.target.checked) }}
                        />
                        <span>Tue</span>
                    </label>
                    <label className="day-checkbox">
                        <input
                            type="checkbox"
                            checked={!!updateWednesday}
                            onChange={(e) => { setUpdateWednesday(e.target.checked) }}
                        />
                        <span>Wed</span>
                    </label>
                    <label className="day-checkbox">
                        <input
                            type="checkbox"
                            checked={!!updateThursday}
                            onChange={(e) => { setUpdateThursday(e.target.checked) }}
                        />
                        <span>Thu</span>
                    </label>
                    <label className="day-checkbox">
                        <input
                            type="checkbox"
                            checked={!!updateFriday}
                            onChange={(e) => { setUpdateFriday(e.target.checked) }}
                        />
                        <span>Fri</span>
                    </label>
                </div>
            </div>

            <button className="panel-button" onClick={updateClassEntryEntry}>
                {processingClassEntryUpdate ? "Processing..." : "Confirm Update"}
            </button>
        </div>
    );
}

function CreateClassEntries() {
    return (
        <div className="create-entry-container">
            <p className="create-entry-title">Create Class Entry</p>

            <div className="create-entry-row">
                <input type="text" className="create-entry-input" placeholder="Class header (e.g. CSC-120)" />
                <input type="text" className="create-entry-input" placeholder="Professor name" />
            </div>

            <div className="create-entry-row">
                <input type="number" className="create-entry-input" placeholder="Total seats" min="1" />
                <input type="text" className="create-entry-input" placeholder="Meeting time (e.g. 10:00 AM - 11:15 AM)" />
            </div>

            <div className="create-entry-days">
                <p className="create-entry-label">Meeting days</p>
                <div className="day-checkbox-row">
                    <label className="day-checkbox"><input type="checkbox" /> <span>Mon</span></label>
                    <label className="day-checkbox"><input type="checkbox" /> <span>Tue</span></label>
                    <label className="day-checkbox"><input type="checkbox" /> <span>Wed</span></label>
                    <label className="day-checkbox"><input type="checkbox" /> <span>Thu</span></label>
                    <label className="day-checkbox"><input type="checkbox" /> <span>Fri</span></label>
                </div>
            </div>

            <button className="create-entry-button">Add Entry</button>
        </div>
    );
}

function DisplayClassEntries({
    classes,
    classEntries,
    setIsBeginning,
    setSelectedUpdateClassEntry,
    setUpdateClassHeader,
    setUpdateProfessor,
    setUpdateTotalSeats,
    setUpdateMeetingTime,
    setUpdateMonday,
    setUpdateTuesday,
    setUpdateWednesday,
    setUpdateThursday,
    setUpdateFriday
}) {
    const [classEntryList, setClassEntryList] = useState(null);

    useEffect(() => {
        if (!classes || !classEntries) return;

        const grouping = {};

        classEntries.forEach((entry) => {
            const matchedClass = classes.find(
                (mountClass) => mountClass.class_id == entry.class_id
            );
            if (!matchedClass) return;

            if (!grouping[entry.class_id]) {
                grouping[entry.class_id] = {
                    header: matchedClass.header,
                    classId: matchedClass.class_id,
                    entries: [],
                };
            }
            grouping[entry.class_id].entries.push(entry);
        });

        setClassEntryList(grouping);
    }, [classes, classEntries]);

    const clickOnUpdateEntry = (entry, groupHeader) => {
        setIsBeginning(false);
        setSelectedUpdateClassEntry(entry.entry_id);
        setUpdateClassHeader(groupHeader);
        setUpdateProfessor(entry.professorName);
        setUpdateTotalSeats(entry.totalSeats);
        setUpdateMeetingTime(entry.meetingTime);
        setUpdateMonday(!!entry.monday);
        setUpdateTuesday(!!entry.tuesday);
        setUpdateWednesday(!!entry.wednesday);
        setUpdateThursday(!!entry.thursday);
        setUpdateFriday(!!entry.friday);
    };

    if (!classEntryList) return <p>Loading...</p>;

    const groupKeys = Object.keys(classEntryList);

    return (
        <div className="class-entries-container">
            <CreateClassEntries />

            <div className="class-entries-scroll">
                {groupKeys.length === 0 ? (
                    <p className="empty-message">No class entries yet.</p>
                ) : (
                    groupKeys.map((classId) => {
                        const group = classEntryList[classId];
                        return (
                            <div key={classId} className="entry-group">
                                <div className="entry-group-header">
                                    <p className="entry-group-title">{group.header}</p>
                                    <p className="entry-group-subtitle">
                                        Class ID: {group.classId}
                                    </p>
                                </div>

                                <div className="entry-list">
                                    {group.entries.map((entry) => (
                                        <div
                                            key={entry.entry_id}
                                            className="entry-card"
                                            onClick={() => { clickOnUpdateEntry(entry, group.header) }}
                                        >
                                            <div className="entry-card-row">
                                                <span className="entry-card-label">Professor</span>
                                                <span>{entry.professorName}</span>
                                            </div>
                                            <div className="entry-card-row">
                                                <span className="entry-card-label">Seats</span>
                                                <span>{entry.totalSeats}</span>
                                            </div>
                                            <div className="entry-card-row">
                                                <span className="entry-card-label">Time</span>
                                                <span>{entry.meetingTime}</span>
                                            </div>
                                            <div className="entry-card-row">
                                                <span className="entry-card-label">Days</span>
                                                <span className="entry-card-days">
                                                    {entry.monday && <span className="day-pill">M</span>}
                                                    {entry.tuesday && <span className="day-pill">T</span>}
                                                    {entry.wednesday && <span className="day-pill">W</span>}
                                                    {entry.thursday && <span className="day-pill">Th</span>}
                                                    {entry.friday && <span className="day-pill">F</span>}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function BodyPanel({
    activeTab,
    importantDates,
    classes,
    classEntries,
    isBeginning,
    setIsBeginning,
    selectedUpdateImportantDate,
    setSelectedUpdateImportantDate,
    updateHeader,
    setUpdateHeader,
    updateDescription,
    setUpdateDescription,
    updateDate,
    setUpdateDate,
    updateTime,
    setUpdateTime,
    selectedUpdateClassEntry,
    setSelectedUpdateClassEntry,
    updateClassHeader,
    setUpdateClassHeader,
    updateProfessor,
    setUpdateProfessor,
    updateTotalSeats,
    setUpdateTotalSeats,
    updateMeetingTime,
    setUpdateMeetingTime,
    updateMonday,
    setUpdateMonday,
    updateTuesday,
    setUpdateTuesday,
    updateWednesday,
    setUpdateWednesday,
    updateThursday,
    setUpdateThursday,
    updateFriday,
    setUpdateFriday
}) {
    return (
        <div className="tab-content">
            {activeTab === "schedules" &&
                <div className="placeholder">
                </div>
            }

            {activeTab === "important-dates" &&
                <div className="placeholder">
                    <DisplayImportantDates
                        importantDates={importantDates}
                        setIsBeginning={setIsBeginning}
                        setSelectedUpdateImportantDate={setSelectedUpdateImportantDate}
                        setUpdateHeader={setUpdateHeader}
                        setUpdateDescription={setUpdateDescription}
                        setUpdateDate={setUpdateDate}
                        setUpdateTime={setUpdateTime}
                    />
                    <UpdateImportantDateBlock
                        isBeginning={isBeginning}
                        selectedUpdateImportantDate={selectedUpdateImportantDate}
                        setSelectedUpdateImportantDate={setSelectedUpdateImportantDate}
                        updateHeader={updateHeader}
                        setUpdateHeader={setUpdateHeader}
                        updateDescription={updateDescription}
                        setUpdateDescription={setUpdateDescription}
                        updateDate={updateDate}
                        setUpdateDate={setUpdateDate}
                        updateTime={updateTime}
                        setUpdateTime={setUpdateTime}
                    />
                </div>
            }

            {activeTab === "class-entries" &&
                <div className="placeholder">
                    <DisplayClassEntries
                        classes={classes}
                        classEntries={classEntries}
                        setIsBeginning={setIsBeginning}
                        setSelectedUpdateClassEntry={setSelectedUpdateClassEntry}
                        setUpdateClassHeader={setUpdateClassHeader}
                        setUpdateProfessor={setUpdateProfessor}
                        setUpdateTotalSeats={setUpdateTotalSeats}
                        setUpdateMeetingTime={setUpdateMeetingTime}
                        setUpdateMonday={setUpdateMonday}
                        setUpdateTuesday={setUpdateTuesday}
                        setUpdateWednesday={setUpdateWednesday}
                        setUpdateThursday={setUpdateThursday}
                        setUpdateFriday={setUpdateFriday}
                    />
                    <UpdateClassEntryBlock
                        isBeginning={isBeginning}
                        selectedUpdateClassEntry={selectedUpdateClassEntry}
                        setSelectedUpdateClassEntry={setSelectedUpdateClassEntry}
                        updateClassHeader={updateClassHeader}
                        setUpdateClassHeader={setUpdateClassHeader}
                        updateProfessor={updateProfessor}
                        setUpdateProfessor={setUpdateProfessor}
                        updateTotalSeats={updateTotalSeats}
                        setUpdateTotalSeats={setUpdateTotalSeats}
                        updateMeetingTime={updateMeetingTime}
                        setUpdateMeetingTime={setUpdateMeetingTime}
                        updateMonday={updateMonday}
                        setUpdateMonday={setUpdateMonday}
                        updateTuesday={updateTuesday}
                        setUpdateTuesday={setUpdateTuesday}
                        updateWednesday={updateWednesday}
                        setUpdateWednesday={setUpdateWednesday}
                        updateThursday={updateThursday}
                        setUpdateThursday={setUpdateThursday}
                        updateFriday={updateFriday}
                        setUpdateFriday={setUpdateFriday}
                    />
                </div>
            }
        </div>
    );
}