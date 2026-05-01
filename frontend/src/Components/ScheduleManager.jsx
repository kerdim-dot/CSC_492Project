import axios from "axios";
import { useEffect, useState } from "react";
import close from "./../assets/close.svg"
import trash from "./../assets/trash.svg"

function ScheduleManager() {
    const [activeTab, setActiveTab] = useState("important-dates");
    const [importantDates, setImportantDates] = useState(null);
    const [classes, setClasses] = useState(null);
    const [classEntries, setClassEntries] = useState(null);

    const [isBeginningDate, setIsBeginningDate] = useState(true);
    const [isBeginningEntry, setIsBeginningEntry] = useState(true);

    // Important date update state
    const [selectedUpdateImportantDate, setSelectedUpdateImportantDate] = useState(null);
    const [updateHeader, setUpdateHeader] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [updateDate, setUpdateDate] = useState("");
    const [updateTime, setUpdateTime] = useState("");


    const [addHeader, setAddHeader] = useState("");
    const [addDescription, setAddDescription] = useState("");
    const [addDate, setAddDate] = useState("");
    const [addTime, setAddTime] = useState("");
    

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


    const [addClassHeader, setAddClassHeader] = useState("");
    const [addProfessor, setAddProfessor] = useState("");
    const [addTotalSeats, setAddTotalSeats] = useState("");
    const [addStartingMeetingTime, setAddStartingMeetingTime] = useState("");
    const [addEndingMeetingTime, setAddEndingMeetingTime] = useState("");
    const [addMonday, setAddMonday] = useState(false);
    const [addTuesday, setAddTuesday] = useState(false);
    const [addWednesday, setAddWednesday] = useState(false);
    const [addThursday, setAddThursday] = useState(false);
    const [addFriday, setAddFriday] = useState(false);

    const [updateListSwitch, setUpdateListSwitch] = useState(false);
    
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "warning") => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        const getAllData = async () => {
            const retrieveImportantDatesData = await axios.get(`http://localhost:8080/test/get/important/dates`);
            const classesResp = await axios.get(`http://localhost:8080/test/get/classes`);
            const classEntriesResp = await axios.get(`http://localhost:8080/test/get/class/entries`);

            const sortedDates = retrieveImportantDatesData.data.sort((a, b) => a.dateOfEvent.localeCompare(b.dateOfEvent));
            setImportantDates(sortedDates);
            console.log(retrieveImportantDatesData.data)
            setClasses(classesResp.data);
            setClassEntries(classEntriesResp.data);
        };
        getAllData();
    }, [updateListSwitch]);

    return (
        <div>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <HeaderPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setSelectedUpdateClassEntry={setSelectedUpdateClassEntry}
                setSelectedUpdateImportantDate={setSelectedUpdateImportantDate}
                setUpdateHeader={setUpdateHeader}
                setUpdateDescription={setUpdateDescription}
                setUpdateDate={setUpdateDate}
                setUpdateTime={setUpdateTime}
                setUpdateClassHeader={setUpdateClassHeader}
                setUpdateProfessor={setUpdateProfessor}
                setUpdateTotalSeats={setUpdateTotalSeats}
                setUpdateMeetingTime={setUpdateMeetingTime}
                setUpdateMonday={setUpdateMonday}
                setUpdateTuesday={setUpdateTuesday}
                setUpdateWednesday={setUpdateWednesday}
                setUpdateThursday={setUpdateThursday}
                setUpdateFriday={setUpdateFriday}
                setIsBeginningDate = {setIsBeginningDate}
                setIsBeginningEntry = {setIsBeginningEntry}
            />
            <BodyPanel
                activeTab={activeTab}
                importantDates={importantDates}
                classes={classes}
                classEntries={classEntries}
                isBeginningDate={isBeginningDate}
                isBeginningEntry={isBeginningEntry}
                setIsBeginningDate={setIsBeginningDate}
                setIsBeginningEntry={setIsBeginningEntry}
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
                setUpdateListSwitch={setUpdateListSwitch}

                addHeader={addHeader}
                setAddHeader={setAddHeader}
                addDescription={addDescription}
                setAddDescription={setAddDescription}
                addDate={addDate}
                setAddDate={setAddDate}
                addTime={addTime}
                setAddTime={setAddTime}

                addClassHeader={addClassHeader}
                setAddClassHeader={setAddClassHeader}
                addProfessor={addProfessor}
                setAddProfessor={setAddProfessor}
                addTotalSeats={addTotalSeats}
                setAddTotalSeats={setAddTotalSeats}
                addStartingMeetingTime={addStartingMeetingTime}
                setAddStartingMeetingTime={setAddStartingMeetingTime}
                addEndingMeetingTime={addEndingMeetingTime}
                setAddEndingMeetingTime={setAddEndingMeetingTime}
                addMonday={addMonday}
                setAddMonday={setAddMonday}
                addTuesday={addTuesday}
                setAddTuesday={setAddTuesday}
                addWednesday={addWednesday}
                setAddWednesday={setAddWednesday}
                addThursday={addThursday}
                setAddThursday={setAddThursday}
                addFriday={addFriday}
                setAddFriday={setAddFriday}

                addToast={addToast}
            />
        </div>
    );
}

export default ScheduleManager;

function HeaderPanel({ activeTab, setActiveTab,setSelectedUpdateClassEntry, setSelectedUpdateImportantDate,setUpdateHeader,setUpdateDescription,setUpdateDate,setUpdateTime,
    setUpdateClassHeader,setUpdateProfessor,setUpdateTotalSeats,setUpdateMeetingTime,setUpdateMonday,setUpdateTuesday,setUpdateWednesday,setUpdateThursday,setUpdateFriday,
    setIsBeginningDate, setIsBeginningEntry
 }) {

    const moveToImportantDates = () =>{
        setActiveTab("important-dates");
        setSelectedUpdateImportantDate(null);
        setUpdateHeader(null);
        setUpdateDescription(null);
        setUpdateDate(null);
        setUpdateTime(null);
        setIsBeginningDate(true);
    }

    const moveToClassEntries = () =>{
        setActiveTab("class-entries");
        setSelectedUpdateClassEntry(null);
        setUpdateClassHeader(null);
        setUpdateProfessor(null);
        setUpdateTotalSeats(null);
        setUpdateMeetingTime(null);
        setUpdateMonday(null);
        setUpdateTuesday(null);
        setUpdateWednesday(null);
        setUpdateThursday(null);
        setUpdateFriday(null);
        setIsBeginningEntry(true);
    }



    return (
        <div className="tab-header">
            <button
                className={activeTab === "important-dates" ? "tab active" : "tab"}
                onClick={moveToImportantDates}
            >
                Important Dates
            </button>

            <button
                className={activeTab === "class-entries" ? "tab active" : "tab"}
                onClick={moveToClassEntries}
            >
                Class Entries
            </button>
        </div>
    );
}


function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <p className="toast-message">{toast.message}</p>
                    <img
                        className="toast-close"
                        src={close}
                        alt="Close"
                        onClick={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}

function UpdateImportantDateBlock({
    isBeginningDate,
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
    setUpdateListSwitch
}) {
    const [processingImportantDateUpdate, setProcessingImportantDateUpdate] = useState(false);

    const updateImportantDateEntry = () => {
        setProcessingImportantDateUpdate(true);
    };

    const deleteImportantDate = async() =>{
        const deleteResponse = await axios.delete(`http://localhost:8080/test/delete/important/date?id=${selectedUpdateImportantDate}`);
        setSelectedUpdateImportantDate(null);
        setUpdateListSwitch(prev => !prev)
    }

    return (
        <div className={
            selectedUpdateImportantDate
                ? "update-important-date-panel-out"
                : isBeginningDate
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


            <img
                className="trash-img" onClick={deleteImportantDate}
                src={trash}
            />

            <button className="panel-button" onClick={updateImportantDateEntry}>
                {processingImportantDateUpdate ? "Processing..." : "Confirm Update"}
            </button>
        </div>
    );
}

function convertTo12Hour(time) {
        if (!time) return "";

        let [hours, minutes] = time.split(":");
        hours = parseInt(hours);

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${ampm}`;
    }


function CreateImportantDate({
    addHeader, setAddHeader,
    addDescription, setAddDescription,
    addDate, setAddDate,
    addTime, setAddTime,
    setUpdateListSwitch,
    addToast
}) {
    const [isProcessing, setIsProcessing] = useState(false);


    const addImportantDate = async () => {
        const header = (addHeader ?? "").trim();
        const description = (addDescription ?? "").trim();

        const impossibleHeader = !header;
        const impossibleDescription = !description;
        const impossibleDate = !addDate;
        const impossibleTime = !addTime;

        const isImpossible = impossibleHeader || impossibleDescription || impossibleDate || impossibleTime;

        if (isImpossible) {
            const fields = [];
            if (impossibleHeader) fields.push("header");
            if (impossibleDescription) fields.push("description");
            if (impossibleDate) fields.push("date");
            if (impossibleTime) fields.push("time");
            addToast(`Invalid fields: ${fields.join(", ")}`, "error");
            return;
        }

        const importantDate = {
            header,
            description,
            dateOfEvent: addDate,
            timeOfEvent: convertTo12Hour(time),
        };

        setIsProcessing(true);
        try {
            await axios.post(`http://localhost:8080/test/add/important/date`, importantDate);
            setAddHeader("");
            setAddDescription("");
            setAddDate("");
            setAddTime("");
            setUpdateListSwitch(prev => !prev);
            addToast("Important date added", "success");
        } catch (error) {
            console.error("Failed to add important date:", error);
            addToast("Failed to add important date", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="create-date-container">
            <p className="create-date-title">Create Important Date</p>

            <div className="create-date-row">
                <input
                    type="text"
                    className="create-date-input"
                    placeholder="Header"
                    value={addHeader}
                    onChange={(e) => setAddHeader(e.target.value)}
                />
                <input
                    type="text"
                    className="create-date-input"
                    placeholder="Description"
                    value={addDescription}
                    onChange={(e) => setAddDescription(e.target.value)}
                />
            </div>

            <div className="create-date-row">
                <input
                    type="date"
                    className="create-date-input"
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                />
                <input
                    type="time"
                    className="create-date-input"
                    value={addTime}
                    onChange={(e) => setAddTime(e.target.value)}
                />
            </div>

            <button
                className="create-date-button"
                onClick={addImportantDate}
                disabled={isProcessing}
            >
                {isProcessing ? "Processing..." : "Add Date"}
            </button>
        </div>
    );
}

function UpdateClassEntryBlock({
    isBeginningEntry,
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
    setUpdateFriday,
    setUpdateListSwitch
}) {
    const [processingClassEntryUpdate, setProcessingClassEntryUpdate] = useState(false);

    const updateClassEntryEntry = () => {
        setProcessingClassEntryUpdate(true);
    };

    const deleteClassEntry = async() =>{
        const deleteResponse = await axios.delete(`http://localhost:8080/test/delete/class/entry?id=${selectedUpdateClassEntry}`);
        setSelectedUpdateClassEntry(null);
        setUpdateListSwitch(prev => !prev)
    }

    return (
        <div className={
            selectedUpdateClassEntry
                ? "update-class-entry-panel-out"
                : isBeginningEntry
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

            <img
                className="trash-img"  onClick={deleteClassEntry}
                src={trash}
            />

            <button className="panel-button" onClick={updateClassEntryEntry}>
                {processingClassEntryUpdate ? "Processing..." : "Confirm Update"}
            </button>
        </div>
    );
}


function CreateClassEntries({
    classes,
    addClassHeader, setAddClassHeader,
    addProfessor, setAddProfessor,
    addTotalSeats, setAddTotalSeats,
    addStartingMeetingTime, setAddStartingMeetingTime,
    addEndingMeetingTime, setAddEndingMeetingTime,
    addMonday, setAddMonday,
    addTuesday, setAddTuesday,
    addWednesday, setAddWednesday,
    addThursday, setAddThursday,
    addFriday, setAddFriday,
    setUpdateListSwitch,
    addToast
}) {
    const [isProcessing, setIsProcessing] = useState(false);

    const addClassEntry = async () => {
        const headerTrim = (addClassHeader ?? "").trim();
        const professorTrim = (addProfessor ?? "").trim();
        const totalSeatsNum = Number(addTotalSeats);

        const matchedClass = classes?.find(c => c.header.toLowerCase() === headerTrim.toLowerCase());

        const impossibleHeader = !headerTrim;
        const impossibleClassMatch = headerTrim && !matchedClass;
        const impossibleProfessor = !professorTrim;
        const impossibleSeats = addTotalSeats === "" || Number.isNaN(totalSeatsNum) || totalSeatsNum <= 0;
        const impossibleStart = !addStartingMeetingTime;
        const impossibleEnd = !addEndingMeetingTime;
        const impossibleNoDays = !addMonday && !addTuesday && !addWednesday && !addThursday && !addFriday;

        const isImpossible =
            impossibleHeader ||
            impossibleClassMatch ||
            impossibleProfessor ||
            impossibleSeats ||
            impossibleStart ||
            impossibleEnd ||
            impossibleNoDays;

        if (isImpossible) {
            const fields = [];
            if (impossibleHeader) fields.push("class header");
            if (impossibleClassMatch) fields.push(`no class found matching "${headerTrim}"`);
            if (impossibleProfessor) fields.push("professor");
            if (impossibleSeats) fields.push("total seats");
            if (impossibleStart) fields.push("start time");
            if (impossibleEnd) fields.push("end time");
            if (impossibleNoDays) fields.push("at least one meeting day");
            addToast(`Invalid: ${fields.join(", ")}`, "error");
            return;
        }

        const classEntryDTO = {
            class_id: matchedClass.class_id,
            meetingTime: `${convertTo12Hour(addStartingMeetingTime)} - ${convertTo12Hour(addEndingMeetingTime)}`,
            totalSeats: totalSeatsNum,
            professorName: professorTrim,
            isMonday: addMonday,
            isTuesday: addTuesday,
            isWednesday: addWednesday,
            isThursday: addThursday,
            isFriday: addFriday,
        };

        setIsProcessing(true);
        try {
            await axios.post(`http://localhost:8080/test/add/class/entry`, classEntryDTO);
            setAddClassHeader("");
            setAddProfessor("");
            setAddTotalSeats("");
            setAddStartingMeetingTime("");
            setAddEndingMeetingTime("");
            setAddMonday(false);
            setAddTuesday(false);
            setAddWednesday(false);
            setAddThursday(false);
            setAddFriday(false);
            setUpdateListSwitch(prev => !prev);
            addToast("Class entry added", "success");
        } catch (error) {
            console.error("Failed to add class entry:", error);
            addToast("Failed to add class entry", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="create-entry-container">
            <p className="create-entry-title">Create Class Entry</p>

            <div className="create-entry-row">
                <input
                    type="text"
                    className="create-entry-input"
                    placeholder="Class header (e.g. CSC-120)"
                    value={addClassHeader}
                    onChange={(e) => setAddClassHeader(e.target.value)}
                />
                <input
                    type="text"
                    className="create-entry-input"
                    placeholder="Professor name"
                    value={addProfessor}
                    onChange={(e) => setAddProfessor(e.target.value)}
                />
            </div>

            <div className="create-entry-row">
                <input
                    type="number"
                    className="create-entry-input"
                    placeholder="Total seats"
                    min="1"
                    value={addTotalSeats}
                    onChange={(e) => setAddTotalSeats(e.target.value)}
                />
                <div className="important-date-time-container">
                    <input
                        type="time"
                        className="create-date-input"
                        value={addStartingMeetingTime}
                        onChange={(e) => setAddStartingMeetingTime(e.target.value)}
                    />
                    <p>-</p>
                    <input
                        type="time"
                        className="create-date-input"
                        value={addEndingMeetingTime}
                        onChange={(e) => setAddEndingMeetingTime(e.target.value)}
                    />
                </div>
            </div>

            <div className="create-entry-days">
                <p className="create-entry-label">Meeting days</p>
                <div className="day-checkbox-row">
                    <label className="day-checkbox">
                        <input type="checkbox" checked={addMonday} onChange={(e) => setAddMonday(e.target.checked)} />
                        <span>Mon</span>
                    </label>
                    <label className="day-checkbox">
                        <input type="checkbox" checked={addTuesday} onChange={(e) => setAddTuesday(e.target.checked)} />
                        <span>Tue</span>
                    </label>
                    <label className="day-checkbox">
                        <input type="checkbox" checked={addWednesday} onChange={(e) => setAddWednesday(e.target.checked)} />
                        <span>Wed</span>
                    </label>
                    <label className="day-checkbox">
                        <input type="checkbox" checked={addThursday} onChange={(e) => setAddThursday(e.target.checked)} />
                        <span>Thu</span>
                    </label>
                    <label className="day-checkbox">
                        <input type="checkbox" checked={addFriday} onChange={(e) => setAddFriday(e.target.checked)} />
                        <span>Fri</span>
                    </label>
                </div>
            </div>

            <button
                className="create-entry-button"
                onClick={addClassEntry}
                disabled={isProcessing}
            >
                {isProcessing ? "Processing..." : "Add Entry"}
            </button>
        </div>
    );
}


function DisplayImportantDates({
    importantDates,
    setIsBeginningDate,
    setSelectedUpdateImportantDate,
    setUpdateHeader,
    setUpdateDescription,
    setUpdateDate,
    setUpdateTime,
    setUpdateListSwitch,
    addHeader, setAddHeader,
    addDescription, setAddDescription,
    addDate, setAddDate,
    addTime, setAddTime,
    addToast
}) {
    const clickOnUpdateEntry = (item) => {
        setIsBeginningDate(false);
        setSelectedUpdateImportantDate(item.important_id);
        setUpdateHeader(item.header);
        setUpdateDescription(item.description);
        setUpdateDate(item.dateOfEvent);
        setUpdateTime(item.timeOfEvent);
    };

    if (!importantDates) return <p>Loading...</p>;

    return (
        <div className="important-dates-container">
            <div className="placeholder-two">
                <CreateImportantDate
                    addHeader={addHeader} setAddHeader={setAddHeader}
                    addDescription={addDescription} setAddDescription={setAddDescription}
                    addDate={addDate} setAddDate={setAddDate}
                    addTime={addTime} setAddTime={setAddTime}
                    setUpdateListSwitch={setUpdateListSwitch}
                    addToast={addToast}
                />
                <div className="important-dates-scroll">
                    {importantDates.length === 0 ? (
                        <p className="empty-message">No important dates yet.</p>
                    ) : (
                        importantDates.map((item) => (
                            <div
                                key={item.id}
                                className="date-card"
                                onClick={() => clickOnUpdateEntry(item)}
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
        </div>
    );
}

function DisplayClassEntries({
    classes,
    classEntries,
    setIsBeginningEntry,
    setSelectedUpdateClassEntry,
    setUpdateClassHeader,
    setUpdateProfessor,
    setUpdateTotalSeats,
    setUpdateMeetingTime,
    setUpdateMonday,
    setUpdateTuesday,
    setUpdateWednesday,
    setUpdateThursday,
    setUpdateFriday,
    setUpdateListSwitch,
    addClassHeader, setAddClassHeader,
    addProfessor, setAddProfessor,
    addTotalSeats, setAddTotalSeats,
    addStartingMeetingTime, setAddStartingMeetingTime,
    addEndingMeetingTime, setAddEndingMeetingTime,
    addMonday, setAddMonday,
    addTuesday, setAddTuesday,
    addWednesday, setAddWednesday,
    addThursday, setAddThursday,
    addFriday, setAddFriday,
    addToast
}) {
    const [classEntryList, setClassEntryList] = useState(null);

    useEffect(() => {
        if (!classes || !classEntries) return;
        const grouping = {};
        classEntries.forEach((entry) => {
            const matchedClass = classes.find((mountClass) => mountClass.class_id == entry.class_id);
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
        setIsBeginningEntry(false);
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
            <div className="placeholder-two">
                <CreateClassEntries
                    classes={classes}
                    addClassHeader={addClassHeader} setAddClassHeader={setAddClassHeader}
                    addProfessor={addProfessor} setAddProfessor={setAddProfessor}
                    addTotalSeats={addTotalSeats} setAddTotalSeats={setAddTotalSeats}
                    addStartingMeetingTime={addStartingMeetingTime} setAddStartingMeetingTime={setAddStartingMeetingTime}
                    addEndingMeetingTime={addEndingMeetingTime} setAddEndingMeetingTime={setAddEndingMeetingTime}
                    addMonday={addMonday} setAddMonday={setAddMonday}
                    addTuesday={addTuesday} setAddTuesday={setAddTuesday}
                    addWednesday={addWednesday} setAddWednesday={setAddWednesday}
                    addThursday={addThursday} setAddThursday={setAddThursday}
                    addFriday={addFriday} setAddFriday={setAddFriday}
                    setUpdateListSwitch={setUpdateListSwitch}
                    addToast={addToast}
                />
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
                                        <p className="entry-group-subtitle">Class ID: {group.classId}</p>
                                    </div>
                                    <div className="entry-list">
                                        {group.entries.map((entry) => (
                                            <div
                                                key={entry.entry_id}
                                                className="entry-card"
                                                onClick={() => clickOnUpdateEntry(entry, group.header)}
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
        </div>
    );
}

function BodyPanel({
    activeTab,
    importantDates,
    classes,
    classEntries,
    isBeginningDate,
    isBeginningEntry,
    setIsBeginningDate,
    setIsBeginningEntry,
    selectedUpdateImportantDate,
    setSelectedUpdateImportantDate,
    updateHeader, setUpdateHeader,
    updateDescription, setUpdateDescription,
    updateDate, setUpdateDate,
    updateTime, setUpdateTime,
    selectedUpdateClassEntry,
    setSelectedUpdateClassEntry,
    updateClassHeader, setUpdateClassHeader,
    updateProfessor, setUpdateProfessor,
    updateTotalSeats, setUpdateTotalSeats,
    updateMeetingTime, setUpdateMeetingTime,
    updateMonday, setUpdateMonday,
    updateTuesday, setUpdateTuesday,
    updateWednesday, setUpdateWednesday,
    updateThursday, setUpdateThursday,
    updateFriday, setUpdateFriday,
    setUpdateListSwitch,
    addHeader, setAddHeader,
    addDescription, setAddDescription,
    addDate, setAddDate,
    addTime, setAddTime,
    addClassHeader, setAddClassHeader,
    addProfessor, setAddProfessor,
    addTotalSeats, setAddTotalSeats,
    addStartingMeetingTime, setAddStartingMeetingTime,
    addEndingMeetingTime, setAddEndingMeetingTime,
    addMonday, setAddMonday,
    addTuesday, setAddTuesday,
    addWednesday, setAddWednesday,
    addThursday, setAddThursday,
    addFriday, setAddFriday,
    addToast
}) {
    return (
        <div className="tab-content">
            {activeTab === "important-dates" &&
                <div className="placeholder">
                    <DisplayImportantDates
                        importantDates={importantDates}
                        setIsBeginningDate={setIsBeginningDate}
                        setSelectedUpdateImportantDate={setSelectedUpdateImportantDate}
                        setUpdateHeader={setUpdateHeader}
                        setUpdateDescription={setUpdateDescription}
                        setUpdateDate={setUpdateDate}
                        setUpdateTime={setUpdateTime}
                        setUpdateListSwitch={setUpdateListSwitch}
                        addHeader={addHeader} setAddHeader={setAddHeader}
                        addDescription={addDescription} setAddDescription={setAddDescription}
                        addDate={addDate} setAddDate={setAddDate}
                        addTime={addTime} setAddTime={setAddTime}
                        addToast={addToast}
                    />
                    <UpdateImportantDateBlock
                        isBeginningDate={isBeginningDate}
                        selectedUpdateImportantDate={selectedUpdateImportantDate}
                        setSelectedUpdateImportantDate={setSelectedUpdateImportantDate}
                        updateHeader={updateHeader} setUpdateHeader={setUpdateHeader}
                        updateDescription={updateDescription} setUpdateDescription={setUpdateDescription}
                        updateDate={updateDate} setUpdateDate={setUpdateDate}
                        updateTime={updateTime} setUpdateTime={setUpdateTime}
                        setUpdateListSwitch={setUpdateListSwitch}
                    />
                </div>
            }

            {activeTab === "class-entries" &&
                <div className="placeholder">
                    <DisplayClassEntries
                        classes={classes}
                        classEntries={classEntries}
                        setIsBeginningEntry={setIsBeginningEntry}
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
                        setUpdateListSwitch={setUpdateListSwitch}
                        addClassHeader={addClassHeader} setAddClassHeader={setAddClassHeader}
                        addProfessor={addProfessor} setAddProfessor={setAddProfessor}
                        addTotalSeats={addTotalSeats} setAddTotalSeats={setAddTotalSeats}
                        addStartingMeetingTime={addStartingMeetingTime} setAddStartingMeetingTime={setAddStartingMeetingTime}
                        addEndingMeetingTime={addEndingMeetingTime} setAddEndingMeetingTime={setAddEndingMeetingTime}
                        addMonday={addMonday} setAddMonday={setAddMonday}
                        addTuesday={addTuesday} setAddTuesday={setAddTuesday}
                        addWednesday={addWednesday} setAddWednesday={setAddWednesday}
                        addThursday={addThursday} setAddThursday={setAddThursday}
                        addFriday={addFriday} setAddFriday={setAddFriday}
                        addToast={addToast}
                    />
                    <UpdateClassEntryBlock
                        isBeginningEntry={isBeginningEntry}
                        selectedUpdateClassEntry={selectedUpdateClassEntry}
                        setSelectedUpdateClassEntry={setSelectedUpdateClassEntry}
                        updateClassHeader={updateClassHeader} setUpdateClassHeader={setUpdateClassHeader}
                        updateProfessor={updateProfessor} setUpdateProfessor={setUpdateProfessor}
                        updateTotalSeats={updateTotalSeats} setUpdateTotalSeats={setUpdateTotalSeats}
                        updateMeetingTime={updateMeetingTime} setUpdateMeetingTime={setUpdateMeetingTime}
                        updateMonday={updateMonday} setUpdateMonday={setUpdateMonday}
                        updateTuesday={updateTuesday} setUpdateTuesday={setUpdateTuesday}
                        updateWednesday={updateWednesday} setUpdateWednesday={setUpdateWednesday}
                        updateThursday={updateThursday} setUpdateThursday={setUpdateThursday}
                        updateFriday={updateFriday} setUpdateFriday={setUpdateFriday}
                        setUpdateListSwitch={setUpdateListSwitch}
                    />
                </div>
            }
        </div>
    );
}