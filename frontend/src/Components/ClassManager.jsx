import { useEffect, useState, useMemo } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"
import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
import '@xyflow/react/dist/style.css';
import { data } from "react-router-dom";
import axios from 'axios';
import { useRef } from "react";
import dagre from 'dagre';

const nodeTypes = { course: CourseNode };

/* Backend Needs
- Fetch classes c
- Update classes
- Delete classes
- add prerequisites
- delete prerequisities
*/


function ClassManager(){
    
    const [activeTab, setActiveTab] = useState("add");
    const [searchInput, setSearchInput] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const [year, setYear] = useState("All");
    const [requirement, setRequirement] = useState("All");
    const [credits, setCredits] = useState("");

    const [filteredClasses, setFilteredClasses] = useState([]);

    const [selectedEntry, setSelectedEntry] = useState(null);
    const [classUpdateEntry,setClassUpdateEntry] = useState(null);

    const [addClassTitle, setAddClassTitle] = useState(null);
    const [addClassHeader, setAddClassHeader] = useState(null);
    const [addClassDescription, setAddClassDescription] = useState(null);
    const [addClassCredits, setAddClassCredits] = useState(null);
    const [addIsRequiredComputerScienceMajor, setAddIsRequiredComputerScienceMajor] = useState(false);
    const [addIsRequiredComputerScienceMinor, setAddIsRequiredComputerScienceMinor] = useState(false);
    const [addIsRequiredMultiPlatformMajor, setAddIsRequiredMultiPlatformMajor] = useState(false);

    const [updateClassTitle, setUpdateClassTitle] = useState(null);
    const [updateClassHeader, setUpdateClassHeader] = useState(null);
    const [updateClassDescription, setUpdateClassDescription] = useState(null);
    const [updateClassCredits, setUpdateClassCredits] = useState(null);
    const [updateIsRequiredComputerScienceMajor, setUpdateIsRequiredComputerScienceMajor] = useState(null);
    const [updateIsRequiredComputerScienceMinor, setUpdateIsRequiredComputerScienceMinor] = useState(null);
    const [updateIsRequiredMultiPlatformMajor, setUpdateIsRequiredMultiPlatformMajor] = useState(null);


    const [classes,setClasses] = useState([]);
    const [prerequisiteMapping, setPrerequisiteMapping] = useState([]);  

    const [isBeginning, setIsBeginning] = useState(true);


    const [toasts, setToasts] = useState([]);
    
    const [refreshSwitch, setRefreshSwitch] = useState(false);

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
        const fetchData = async () => {
        const [classData, prereqData] = await Promise.all([
            axios.get('http://localhost:8080/test/get/classes'),
            axios.get('http://localhost:8080/test/get/prequisiteMapping'),
        ]);
        setClasses(classData.data);
        setPrerequisiteMapping(prereqData.data);
        };
        fetchData();
    }, [refreshSwitch]);

    //   const [requiredClasses, setRequiredClasses ]= useState ([
    //     {classId:1, title:	"Programming Problem Solving I",header:"CSC-120", credits: 4, isActive: true}, 
    //     {classId:2,title: "Programming Problem Solving II" ,header:"CSC-220", credits: 4,isActive: true},
    //     {classId:3,title:"Computer Organization" , header:"CSC-270", credits: 4,isActive: true}, 
    //     {classId:4,title:"Database Theory Implementation",header:"CSC-310", credits: 4,isActive: true}, 
    //     {classId:5,title:"Algorithms and Data Structures",header:"CSC-320", credits: 4,isActive: true}, 
    //     {classId:6,title:"Computer Networks",header:"CSC-360", credits: 4,isActive: false}, 
    //     {classId:7,title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2,isActive: false}, 
    //     {classId:8,title:"Practice Software Engineering",header:"CSC-492", credits: 2,isActive: false}
    //  ]);


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

     

    useEffect(() => {
        let filtered = [...classes];

        if (searchInput) {
            filtered = filtered.filter((item) => {
                const header = item.header.toLowerCase();
                const title = item.title.toLowerCase();
                const search = searchInput.toLowerCase();

                return header.includes(search) || title.includes(search);
            });
        }

        if (year !== "All") {
            filtered = filtered.filter((item) => {
                const num = Number(item.header.split("-")[1]);

                if (year === "First") return num < 200;
                if (year === "Second") return num >= 200 && num < 300;
                if (year === "Third") return num >= 300 && num < 400;
                if (year === "Fourth") return num >= 400;

                return true;
            });
        }

        if (requirement !== "All") {
            if (requirement === "Required") {
                filtered = filtered.filter(c => c.isActive); 
            } else {
                filtered = filtered.filter(c => !c.isActive);
            }
        }

        if (credits) {
            filtered = filtered.filter(c => c.credits === Number(credits));
        }

        setFilteredClasses(filtered);

    }, [classes, searchInput, year, requirement, credits]);
    
      
      return (
        <div className="tab-pane-container">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            {showFilter && 
                <FilterBlock 
                    year={year}
                    setYear={setYear}
                    requirement={requirement}
                    setRequirement={setRequirement}
                    credits={credits}
                    setCredits={setCredits}
                    setShowFilter={setShowFilter}
                />
            }
          <div className="top-container">
                <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab} setClassUpdateEntry={setClassUpdateEntry} setSelectedEntry = {setSelectedEntry} setIsBeginning={setIsBeginning}/>
                {(activeTab === "delete" || activeTab === "update") && 
                    <SearchBar 
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        setShowFilter={setShowFilter}
                    />
                }
          </div>
          
          <BodyPanel isBeginning = {isBeginning} setIsBeginning = {setIsBeginning} activeTab={activeTab} classes={classes} filteredClasses= {filteredClasses} classUpdateEntry = {classUpdateEntry} setClassUpdateEntry = {setClassUpdateEntry} updateClassTitle={updateClassTitle} setUpdateClassTitle={setUpdateClassTitle} updateClassHeader={updateClassHeader} setUpdateClassHeader={setUpdateClassHeader} updateClassDescription = {updateClassDescription} setUpdateClassDescription = {setUpdateClassDescription} updateClassCredits={updateClassCredits} setUpdateClassCredits = {setUpdateClassCredits} setUpdateIsRequiredComputerScienceMajor={setUpdateIsRequiredComputerScienceMajor} updateIsRequiredComputerScienceMajor={updateIsRequiredComputerScienceMajor} setUpdateIsRequiredComputerScienceMinor={setUpdateIsRequiredComputerScienceMinor} updateIsRequiredComputerScienceMinor={updateIsRequiredComputerScienceMinor} setUpdateIsRequiredMultiPlatformMajor={setUpdateIsRequiredMultiPlatformMajor} updateIsRequiredMultiPlatformMajor={updateIsRequiredMultiPlatformMajor} selectedEntry={selectedEntry} setSelectedEntry={setSelectedEntry} prerequisiteMapping={prerequisiteMapping}
          addClassTitle={addClassTitle} addClassHeader={addClassHeader} addClassDescription={addClassDescription} addClassCredits={addClassCredits} 
          addIsRequiredComputerScienceMajor={addIsRequiredComputerScienceMajor} addIsRequiredComputerScienceMinor={addIsRequiredComputerScienceMinor} 
          addIsRequiredMultiPlatformMajor={addIsRequiredMultiPlatformMajor} setAddClassTitle={setAddClassTitle} setAddClassHeader={setAddClassHeader}
          setAddClassDescription={setAddClassDescription} setAddClassCredits={setAddClassCredits} setAddIsRequiredComputerScienceMajor={setAddIsRequiredComputerScienceMajor} 
          setAddIsRequiredComputerScienceMinor={setAddIsRequiredComputerScienceMinor} setAddIsRequiredMultiPlatformMajor={setAddIsRequiredMultiPlatformMajor} addToast={addToast} setRefreshSwitch = {setRefreshSwitch}/>
          
        </div>
      );
    }
    
    export default ClassManager;
    
    function HeaderPanel({activeTab, setActiveTab, setClassUpdateEntry, setSelectedEntry ,setIsBeginning}){

        const onClickAdd = () =>{
            setClassUpdateEntry(null);
            setSelectedEntry(null);
            setActiveTab("add");
            setIsBeginning(true);
        }

        const onClickUpdate = () =>{
            setSelectedEntry(null);
            setActiveTab("update");
        }
        const onClickDelete = () =>{
            setClassUpdateEntry(null);
            setActiveTab("delete");
            setIsBeginning(true);
        }

        const onClickTree = () =>{
            setClassUpdateEntry(null);
            setSelectedEntry(null);
            setActiveTab("tree");
            setIsBeginning(true);
        }

        return(
            <div className="tab-header">
                <button className={activeTab === "add" ? "tab active" : "tab"}
                    onClick={onClickAdd}>
                Add
                </button>
    
                <button
                    className={activeTab === "update" ? "tab active" : "tab"}
                    onClick={onClickUpdate}
                >
                Update
                </button>
    
                <button className={activeTab === "delete" ? "tab active" : "tab"}
                onClick={onClickDelete}>
                Delete
                </button>
                <button className={activeTab === "tree" ? "tab active" : "tab"}
                onClick={onClickTree}>
                Tree
                </button>
            </div>
        )
    }


    function UpdateBlock({isBeginning, classUpdateEntry, setClassUpdateEntry, updateClassTitle, setUpdateClassTitle, updateClassHeader,setUpdateClassHeader, updateClassDescription, setUpdateClassDescription, updateClassCredits, setUpdateClassCredits, updateIsRequiredComputerScienceMajor, setUpdateIsRequiredComputerScienceMajor, updateIsRequiredComputerScienceMinor, setUpdateIsRequiredComputerScienceMinor, updateIsRequiredMultiPlatformMajor, setUpdateIsRequiredMultiPlatformMajor,  addToast, setRefreshSwitch}){
      
        const [processingClassUpate, setProcessingClassUpdate] = useState(false);

        const updateClassEntry = async () => {
            setProcessingClassUpdate(true);

            const impossibleTitle = !updateClassTitle;
            const impossibleHeader = !updateClassHeader;
            const impossibleDescription = !updateClassDescription;
            const creditsNum = Number(updateClassCredits);
            const impossibleCredits = updateClassCredits === "" || Number.isNaN(creditsNum) || creditsNum <= 0;
            const impossibleRequiredCSMajor = typeof updateIsRequiredComputerScienceMajor !== "boolean";
            const impossibleRequiredCSMinor = typeof updateIsRequiredComputerScienceMinor !== "boolean";
            const impossibleRequiredMultiPlatform = typeof updateIsRequiredMultiPlatformMajor !== "boolean";

            const isImpossibleClass =
                impossibleTitle ||
                impossibleHeader ||
                impossibleDescription ||
                impossibleCredits ||
                impossibleRequiredCSMajor ||
                impossibleRequiredCSMinor ||
                impossibleRequiredMultiPlatform;

            if (isImpossibleClass) {
                const impossibleList = [];
                if (impossibleTitle) impossibleList.push("title");
                if (impossibleHeader) impossibleList.push("header");
                if (impossibleDescription) impossibleList.push("description");
                if (impossibleCredits) impossibleList.push("credits");
                if (impossibleRequiredCSMajor) impossibleList.push("CS major flag");
                if (impossibleRequiredCSMinor) impossibleList.push("CS minor flag");
                if (impossibleRequiredMultiPlatform) impossibleList.push("multiplatform major flag");

                addToast(`Invalid fields: ${impossibleList.join(", ")}`, "error");
                setProcessingClassUpdate(false);
                return;
            }

            const mountClass = {
                title: updateClassTitle.trim(),
                header: updateClassHeader.trim(),
                description: updateClassDescription.trim(),
                credits: creditsNum,
                isRequiredComputerScienceMajor: updateIsRequiredComputerScienceMajor,
                isRequiredComputerScienceMinor: updateIsRequiredComputerScienceMinor,
                isRequiredMultiPlatformMajor: updateIsRequiredMultiPlatformMajor
            };

            try {
                await axios.put(`http://localhost:8080/test/update/class?id=${classUpdateEntry}`, mountClass);
                addToast("Class updated successfully", "success");
            } catch (error) {
                console.error("Failed to update class:", error);
                addToast("Failed to update class", "error");
            }

            setProcessingClassUpdate(false);
            setRefreshSwitch(prev => !prev);
        };

        return(
            <div className={classUpdateEntry?"update-student-panel-out":isBeginning?"update-student-panel":"update-student-panel-hidden"}>
                

                <img className="close-img-two" src={close} onClick={()=>{setClassUpdateEntry(null)}}></img>
    
                <p className="student-panel-title">Update Class Panel</p>
    
                <div className="panel-entry">
                    <p>Class Title</p>
                    <input 
                        className="panel-input" 
                        value={updateClassTitle} 
                        onChange={(e)=>{setUpdateClassTitle(e.target.value)}}
                    />
                </div>
                
                <div className="panel-entry">
                    <p>Class Header</p>
                    <input 
                        className="panel-input" 
                        value={updateClassHeader} 
                        onChange={(e)=>{setUpdateClassHeader(e.target.value)}}
                    />
                </div>

                <div className="panel-entry">
                    <p>Class Description</p>
                    <input 
                        className="panel-input" 
                        value={updateClassDescription} 
                        onChange={(e)=>{setUpdateClassDescription(e.target.value)}}
                    />
                </div>
    
                <div className="panel-entry">
                    <p>Class Credits</p>
                    <input type="number"
                        className="panel-input" 
                        value={updateClassCredits} 
                        onChange={(e)=>{setUpdateClassCredits(e.target.value)}}
                    />
                </div>

                <div className="panel-entry">
                    <p>Is Required for Computer Science Majors</p>
                    <input type = "text"
                        className="panel-input" 
                        value={updateIsRequiredComputerScienceMajor} 
                        onChange={(e)=>{setUpdateIsRequiredComputerScienceMajor(e.target.value)}}
                    />
                </div>

                <div className="panel-entry">
                    <p>Is Required for Computer Science Minors</p>
                    <input type = "text"
                        className="panel-input" 
                        value={updateIsRequiredComputerScienceMinor} 
                        onChange={(e)=>{setUpdateIsRequiredComputerScienceMinor(e.target.value)}}
                    />
                </div>
                
                <div className="panel-entry">
                    <p>Is Required for Multiplatform Minors</p>
                    <input type = "text"
                        className="panel-input" 
                        value={updateIsRequiredMultiPlatformMajor} 
                        onChange={(e)=>{setUpdateIsRequiredMultiPlatformMajor(e.target.value)}}
                    />
                </div>
    
                <button className="panel-button" onClick={updateClassEntry}>{processingClassUpate?"Processing...":"Confirm Update"}</button>
            </div>
        )
    }

    function getLayoutedElements(nodes, edges) {
        const g = new dagre.graphlib.Graph();
        g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80 });
        g.setDefaultEdgeLabel(() => ({}));
        nodes.forEach(n => g.setNode(n.id, { width: 120, height: 40 }));
        edges.forEach(e => g.setEdge(e.source, e.target));
        dagre.layout(g);
        return {
            nodes: nodes.map(n => {
            const { x, y } = g.node(n.id);
            return { ...n, position: { x: x - 60, y: y - 20 } };
            }),
            edges,
        };
    }

    function CourseNode({ data }) {
        return (
            <div style={{
            padding: 10,
            borderRadius: 6,
            border: '1px solid #333',
            backgroundColor: data.color,
            color: 'white',
            }}>
            <Handle type="target" position={Position.Top} />
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} />
            </div>
        );
    }

    

    function FilterBlock({ year, setYear, requirement, setRequirement,credits,setCredits, setShowFilter}) {

        const onReset = ()=>{
            setCredits(null);
            setYear("All");
            setRequirement("All");
        }

        const onFilter = () =>{

        }

        return (
            <div>
                <div className="filter-container">
                    <img className="close-img" src={close} onClick={()=>{setShowFilter(false)}}></img>

                    <p className="filter-title">Filter Classes</p>


                    <div className="filter-graduation-overview">
                        <label>Credit Filter</label>
                        <input className="credit-input" type = "number" value = {credits} onChange = {(e)=>{setCredits(e.target.value)}}/>
                    </div>

                    <div className="filter-graduation-overview">
                        <label>Requirement Filter</label>
                        <select className="year-select" value={requirement} onChange={(e)=>setRequirement(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Required">First Year</option>
                            <option value="Not Required">Second Year</option>
                        </select>
                    </div>

                    
                    <div className="filter-graduation-overview">
                        <label>Year Filter</label>
                        <select className="year-select" value={year} onChange={(e)=>setYear(e.target.value)}>
                            <option value="All">All</option>
                            <option value="First">First Year</option>
                            <option value="Second">Second Year</option>
                            <option value="Third">Third Year</option>
                            <option value="Fourth">Fourth Year</option>
                        </select>
                    </div>

                    <div className="filter-buttons">
                        <button onClick={onFilter} className="btn-apply">Apply Filter</button>
                        <button onClick={onReset} className="btn-reset">Reset</button>
                    </div>
                </div>

                <div className="blocker">
                </div>

            </div>
        );
    }
        
    function SearchBar({ searchInput, setSearchInput, setShowFilter }) {
        return (
            <div className="search-two">
                <img src={search} className="search-icon" />
                <input
                    type="search"
                    className="search-input"
                    placeholder="Search Class..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <img src={filter} className="filter" onClick={() => setShowFilter(true)} />
            </div>
        );
    }
    
    function BodyPanel({isBeginning, setIsBeginning, activeTab, classes, filteredClasses,classUpdateEntry,setClassUpdateEntry,updateClassTitle, setUpdateClassTitle, updateClassHeader, 
        setUpdateClassHeader,updateClassDescription,setUpdateClassDescription, updateClassCredits, setUpdateClassCredits,updateIsRequiredComputerScienceMajor,setUpdateIsRequiredComputerScienceMajor, 
        updateIsRequiredComputerScienceMinor, setUpdateIsRequiredComputerScienceMinor, updateIsRequiredMultiPlatformMajor, setUpdateIsRequiredMultiPlatformMajor, 
        selectedEntry, setSelectedEntry,prerequisiteMapping, addClassTitle, addClassHeader, addClassDescription,addClassCredits, addIsRequiredComputerScienceMinor,
        addIsRequiredComputerScienceMajor, addIsRequiredMultiPlatformMajor, setAddClassTitle, setAddClassHeader, setAddClassDescription, setAddClassCredits,
        setAddIsRequiredComputerScienceMajor, setAddIsRequiredComputerScienceMinor, setAddIsRequiredMultiPlatformMajor, addToast, setRefreshSwitch}){
       
        const [warning, setWarning] = useState(null);
        const [classPool, setClassPool] = useState(null);


        const makeSelectedEntry = (index) =>{
            setSelectedEntry(index);
        }
    
        const deleteEntry = () =>{
            if(selectedEntry == null){
                setWarning("No Entry Selected")
                setTimeout(()=>{
                    setWarning("");
                },2000)
            }
            else{
                console.log("This is the Class id that needs to be deleted: "+selectedEntry)
            }
        }
        

        useEffect(()=>{
            if(classes){               
                const classPool = [];
                classes.forEach((item,index)=>{
                    classPool.push(item.header);
                })

                setClassPool(classPool);
                
            }
        },[classes])
    

        const clickOnUpdateEntry = (item) =>{
            setIsBeginning(false);
            setClassUpdateEntry(item.class_id);
            setUpdateClassTitle(item.title);
            setUpdateClassHeader(item.header);
            setUpdateClassDescription(item.description);
            setUpdateClassCredits(item.credits);
            setUpdateIsRequiredComputerScienceMajor(item.isRequiredComputerScienceMajor);
            setUpdateIsRequiredComputerScienceMinor(item.isRequiredComputerScienceMinor);
            setUpdateIsRequiredMultiPlatformMajor(item.isRequiredMultiPlatformMajor)
        }


        const addClass = async () => {
            const title = (addClassTitle ?? "").trim();
            const header = (addClassHeader ?? "").trim();
            const description = (addClassDescription ?? "").trim();
            const creditsNum = Number(addClassCredits);

            const impossibleTitle = !title;
            const impossibleHeader = !header;
            const impossibleDescription = !description;
            const impossibleCredits = addClassCredits === "" || addClassCredits === null || Number.isNaN(creditsNum) || creditsNum <= 0;
            const impossibleRequiredCSMajor = typeof addIsRequiredComputerScienceMajor !== "boolean";
            const impossibleRequiredCSMinor = typeof addIsRequiredComputerScienceMinor !== "boolean";
            const impossibleRequiredMultiPlatform = typeof addIsRequiredMultiPlatformMajor !== "boolean";

            const isImpossible =
                impossibleTitle ||
                impossibleHeader ||
                impossibleDescription ||
                impossibleCredits ||
                impossibleRequiredCSMajor ||
                impossibleRequiredCSMinor ||
                impossibleRequiredMultiPlatform;

            if (isImpossible) {
                const impossibleList = [];
                if (impossibleTitle) impossibleList.push("title");
                if (impossibleHeader) impossibleList.push("header");
                if (impossibleDescription) impossibleList.push("description");
                if (impossibleCredits) impossibleList.push("credits");
                if (impossibleRequiredCSMajor) impossibleList.push("CS major flag");
                if (impossibleRequiredCSMinor) impossibleList.push("CS minor flag");
                if (impossibleRequiredMultiPlatform) impossibleList.push("multiplatform major flag");

                addToast(`Invalid fields: ${impossibleList.join(", ")}`, "error");
                return;
            }

            const mountClass = {
                title,
                header,
                description,
                credits: creditsNum,
                isRequiredComputerScienceMajor: addIsRequiredComputerScienceMajor,
                isRequiredComputerScienceMinor: addIsRequiredComputerScienceMinor,
                isRequiredMultiPlatformMajor: addIsRequiredMultiPlatformMajor
            };

            try {
                const response = await axios.post("http://localhost:8080/test/add/class", mountClass);
                if (response.status === 200 || response.status === 201) {
                    setAddClassTitle("");
                    setAddClassHeader("");
                    setAddClassDescription("");
                    setAddClassCredits("");
                    setAddIsRequiredComputerScienceMajor(false);
                    setAddIsRequiredComputerScienceMinor(false);
                    setAddIsRequiredMultiPlatformMajor(false);
                    addToast("Class added successfully", "success");
                    setRefreshSwitch(prev => !prev)
                }
            } catch (error) {
                console.error("Failed to add class:", error);
                addToast("Failed to add class", "error");
            }
        };


        const { nodes, edges } = useMemo(() => {
            if (!classes || !prerequisiteMapping) return { nodes: [], edges: [] };
        
            const rawNodes = classes.map(c => ({
            id: String(c.class_id),
            type: 'course',
            data: { label: c.header, color: '#ac30e6' },
            }));
        
            const rawEdges = prerequisiteMapping.map((p, i) => ({
            id: `e${i}`,
            source: String(p.prerequisite_class_id),
            target: String(p.class_id),
            }));
        
            return getLayoutedElements(rawNodes, rawEdges);
        }, [classes, prerequisiteMapping]);

       
        
        if (!classes || !prerequisiteMapping) return <div>Loading...</div>;
                


        return(
            <div className="tab-content">
                {activeTab === "add" && 
                <div className="class-add-container">
                    <p  className="add-class-title">Add Class</p>
                    <div className="class-headers-container">
                        <input type= "text" className="title-input" placeholder="Title" onChange={(e)=>{setAddClassTitle(e.target.value)}} value={addClassTitle}/>
                        <input type= "text" className="header-input" placeholder="Header" onChange={(e)=>{setAddClassHeader(e.target.value)}} value={addClassHeader}/>
                    </div>

                    <div className="graduation-container">
                        <input type="text" className="description-input" placeholder="Class Description"  onChange={(e)=>{setAddClassDescription(e.target.value)}} value={addClassDescription}></input>
                         <input type="number" className="description-input" placeholder="Class Credits"  onChange={(e)=>{setAddClassCredits(e.target.value)}} value={addClassCredits}></input>
                    </div>

                    

                    <div className="boolean-container">
                        <label className="boolean-label">Required for Computer Science Major</label>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={!!addIsRequiredComputerScienceMajor}
                                onChange={(e) => { setAddIsRequiredComputerScienceMajor(e.target.checked) }}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="boolean-container">
                        <label className="boolean-label">Required for Computer Science Minor</label>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={!!addIsRequiredComputerScienceMinor}
                                onChange={(e) => { setAddIsRequiredComputerScienceMinor(e.target.checked) }}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="boolean-container">
                        <label className="boolean-label">Required for Multiplatform Major</label>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={!!addIsRequiredMultiPlatformMajor}
                                onChange={(e) => { setAddIsRequiredMultiPlatformMajor(e.target.checked) }}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div className="graduation-container">
                        <button className="adding-buttons" onClick={addClass}>Add Class</button>
                    </div>
                    
                </div>
                }
                {activeTab === "update" && 
                    <div className="placeholder">
                        
                        <p>Update Class</p> 
    
                        <div className="entry-list">
                            {filteredClasses.map((item,index)=>{
                                return(
                                <div className={item.class_id == classUpdateEntry?"entry highlighted":"entry"} onClick={()=>{clickOnUpdateEntry(item)}}>
                                        <p>{item.title} </p>
                                        <p>{item.header} </p>
                                </div>)
                            })}
                            
                        </div>
                            <UpdateBlock isBeginning={isBeginning} setIsBeginning={setIsBeginning} classUpdateEntry = {classUpdateEntry} setClassUpdateEntry = {setClassUpdateEntry} updateClassTitle={updateClassTitle} setUpdateClassTitle={setUpdateClassTitle} updateClassHeader={updateClassHeader} setUpdateClassHeader={setUpdateClassHeader} updateClassDescription={updateClassDescription} setUpdateClassDescription={setUpdateClassDescription} updateClassCredits={updateClassCredits} setUpdateClassCredits = {setUpdateClassCredits} updateIsRequiredComputerScienceMajor={updateIsRequiredComputerScienceMajor} setUpdateIsRequiredComputerScienceMajor={setUpdateIsRequiredMultiPlatformMajor} updateIsRequiredComputerScienceMinor = {updateIsRequiredComputerScienceMinor} setUpdateIsRequiredComputerScienceMinor={setUpdateIsRequiredComputerScienceMinor} updateIsRequiredMultiPlatformMajor={updateIsRequiredMultiPlatformMajor} setUpdateIsRequiredMultiPlatformMajor={setUpdateIsRequiredMultiPlatformMajor}  addToast={addToast} setRefreshSwitch={setRefreshSwitch}/>
                    </div>}
                {activeTab === "delete" && 
                    <div className="placeholder">
                        <p>Delete Class</p>
                        <div className="entry-list">
                            {filteredClasses.map((item,index)=>{
                                return(
                                <div className={selectedEntry === item.class_id ?"entry highlighted":"entry"} onClick={()=>{makeSelectedEntry(item.class_id)}}>
                                        <p>{item.title} </p>
                                        <p>{item.header} </p>
                                </div>)
                            })}
                        </div>
                        <p>{warning}</p>
                        <button onClick={deleteEntry} className={"btn-delete-student" } disabled={!selectedEntry}>Delete Class</button>
                    </div>}
                {activeTab === "tree" && 
                    <div className="graph-container">
                         <div style={{ width: '80%', height: '500px' }}>
                            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </div>


                        <div className="class-pool">
                            <h3>Class Pool</h3>

                            {classPool.map((item,index)=>(
                                <div key={index} className="class-card">
                                    {item}
                                </div>
                            ))}

                        </div>
                    </div>}
            </div>
        )
}

