import { useEffect, useState } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"
import { ReactFlow, Background, Controls, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { data } from "react-router-dom";

function ClassManager(){
      const [activeTab, setActiveTab] = useState("update");
      const [edges, setEdges] = useState(null);
      const [searchInput, setSearchInput] = useState("");
      const [showFilter, setShowFilter] = useState(false);

      const [year, setYear] = useState("All");
      const [requirement, setRequirement] = useState("All");
      const [credits, setCredits] = useState("");

      const [filteredClasses, setFilteredClasses] = useState([]);

      const [classUpdateEntry,setClassUpdateEntry] = useState(null);
      const [updateClassTitle, setUpdateClassTitle] = useState(null);
      const [updateClassHeader, setUpdateClassHeader] = useState(null);
      const [updateClassCredits, setUpdateClassCredits] = useState(null);

      const [requiredClasses, setRequiredClasses ]= useState ([
        {classId:1, title:	"Programming Problem Solving I",header:"CSC-120", credits: 4, isActive: true}, 
        {classId:2,title: "Programming Problem Solving II" ,header:"CSC-220", credits: 4,isActive: true},
        {classId:3,title:"Computer Organization" , header:"CSC-270", credits: 4,isActive: true}, 
        {classId:4,title:"Database Theory Implementation",header:"CSC-310", credits: 4,isActive: true}, 
        {classId:5,title:"Algorithms and Data Structures",header:"CSC-320", credits: 4,isActive: true}, 
        {classId:6,title:"Computer Networks",header:"CSC-360", credits: 4,isActive: false}, 
        {classId:7,title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2,isActive: false}, 
        {classId:8,title:"Practice Software Engineering",header:"CSC-492", credits: 2,isActive: false}
     ]);

     const tree = [{
        value: "CSC-120",
        children: [{
            value: "CSC-220",
            children: [{
                value: "CSC-270",
                children:[{
                    value:"CSC-310"
                },
                {
                    value:"CSC-320"
                }]
            }]
        }]
     }]

     
     
    
    
    useEffect(()=>{
        let row = 1;
        let count = 1;
        const edges = [];
        function traverseTree(nodes, parent = null) {
            nodes.forEach(node => {
                if (parent !== null) {
                    edges.push({
                        id: "e1-" + count,
                        source: String(parent),
                        target: String(count),
                    });
                    
                }
                //console.log("node:", node.value, "row:", row, "count:", count, "parent:", parent);
                count++;

                if (node.children) {
                    row++;
                    traverseTree(node.children, count-1);
                }
                
            });
        }
        traverseTree(tree);
        setEdges(edges);
    },[])


    useEffect(() => {
        let filtered = [...requiredClasses];

        // 🔍 SEARCH
        if (searchInput) {
            filtered = filtered.filter((item) => {
                const header = item.header.toLowerCase();
                const title = item.title.toLowerCase();
                const search = searchInput.toLowerCase();

                return header.includes(search) || title.includes(search);
            });
        }

        // 🎓 YEAR FILTER
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

        // 📘 REQUIREMENT FILTER
        if (requirement !== "All") {
            if (requirement === "Required") {
                filtered = filtered.filter(c => c.isActive); // or isRequired later
            } else {
                filtered = filtered.filter(c => !c.isActive);
            }
        }

        // 🔢 CREDIT FILTER
        if (credits) {
            filtered = filtered.filter(c => c.credits === Number(credits));
        }

        setFilteredClasses(filtered);

    }, [requiredClasses, searchInput, year, requirement, credits]);
    
      
      return (
        <div className="tab-pane-container">
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
                <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab}/>
                {(activeTab === "delete" || activeTab === "update") && 
                    <SearchBar 
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        setShowFilter={setShowFilter}
                    />
                }
          </div>
          
          <BodyPanel activeTab={activeTab} requiredClasses={requiredClasses} filteredClasses= {filteredClasses} edges={edges}classUpdateEntry = {classUpdateEntry} setClassUpdateEntry = {setClassUpdateEntry} updateClassTitle={updateClassTitle} setUpdateClassTitle={setUpdateClassTitle} updateClassHeader={updateClassHeader} setUpdateClassHeader={setUpdateClassHeader} updateClassCredits={updateClassCredits} setUpdateClassCredits = {setUpdateClassCredits}/>
          
        </div>
      );
    }
    
    export default ClassManager;
    
    function HeaderPanel({activeTab, setActiveTab}){
        return(
            <div className="tab-header">
                <button className={activeTab === "add" ? "tab active" : "tab"}
                onClick={() => setActiveTab("add")}>
                Add
                </button>
    
                <button
                className={activeTab === "update" ? "tab active" : "tab"}
                onClick={() => setActiveTab("update")}
                >
                Update
                </button>
    
                <button className={activeTab === "delete" ? "tab active" : "tab"}
                onClick={() => setActiveTab("delete")}>
                Delete
                </button>
                <button className={activeTab === "tree" ? "tab active" : "tab"}
                onClick={() => setActiveTab("tree")}>
                Tree
                </button>
            </div>
        )
    }


    function UpdateBlock({updateClassTitle, setUpdateClassTitle, updateClassHeader,setUpdateClassHeader,updateClassCredits, setUpdateClassCredits}){
    
        return(
            <div className="update-student-panel">
                
    
                <img className="close-img-two" src={close}></img>
    
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
                    <p>Class Credits</p>
                    <input type="number"
                        className="panel-input" 
                        value={updateClassCredits} 
                        onChange={(e)=>{setUpdateClassCredits(e.target.value)}}
                    />
                </div>
    
                <button className="panel-button">Confirm</button>
            </div>
        )
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
    
    function BodyPanel({activeTab, requiredClasses, filteredClasses, edges,classUpdateEntry,setClassUpdateEntry,updateClassTitle, setUpdateClassTitle, updateClassHeader, setUpdateClassHeader, updateClassCredits, setUpdateClassCredits}){
        const [selectedEntry, setSelectedEntry] = useState(null);
        const [warning, setWarning] = useState(null);
        const [nodes,setNodes] = useState(null);
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
            if(requiredClasses){
                const nodes = [];
                const classPool = [];
                let count = 1;
                let y = 0
                let x =0
                requiredClasses.forEach((item,index)=>{
                    if(item.isActive){
                        nodes.push({
                        id: String(count),
                        data: {label:item.header},
                        position: {x:x,y:y}
                        })
                        count +=1;
                        y+=50;
                        x+=50
                    }
                    classPool.push(item.header);
                })
                
                //console.log(nodes)
                setNodes(nodes);
                setClassPool(classPool);
                
            }
        },[requiredClasses])
        // const nodes = [
        //     { id: "1", position: { x: 250, y: 0 }, data: { label: "CSC120" } },
        //     { id: "2", position: { x: 250, y: 100 }, data: { label: "CSC220" } },
        //     { id: "3", position: { x: 150, y: 200 }, data: { label: "CSC320" } },
        //     { id: "4", position: { x: 350, y: 200 }, data: { label: "CSC310" } }
        // ];

        // const edges = [
        //     { id: "e1-2", source: "1", target: "2" },
        //     { id: "e2-3", source: "2", target: "3" },
        //     { id: "e2-4", source: "2", target: "4" }
        // ];
        console.log(edges)

        const clickOnEntry = (item) =>{
            setClassUpdateEntry(item);
            setUpdateClassTitle(item.title);
            setUpdateClassHeader(item.header);
            setUpdateClassCredits(item.credits);
        }

        return(
            <div className="tab-content">
                {activeTab === "add" && 
                <div className="class-add-container">
                    <p>Add Class</p>
                    <div className="class-headers-container">
                        <input type= "text" className="title-input" placeholder="Title"/>
                        <input type= "text" className="header-input" placeholder="Header"/>
                    </div>
                    <div className="graduation-container">
                        <input type="text" className="credits-input" placeholder="Credits"></input>
                    </div>
                    <div>
                        
                    </div>
                    
                </div>
                }
                {activeTab === "update" && 
                    <div className="placeholder">
                        
                        <p>Update Class</p> 
    
                        <div className="entry-list">
                            {filteredClasses.map((item,index)=>{
                                return(
                                <div className="entry" onClick={()=>{clickOnEntry(item)}}>
                                        <p>{item.title} </p>
                                        <p>{item.header} </p>
                                </div>)
                            })}
                            
                        </div>
                            {classUpdateEntry && <UpdateBlock updateClassTitle={updateClassTitle} setUpdateClassTitle={setUpdateClassTitle} updateClassHeader={updateClassHeader} setUpdateClassHeader={setUpdateClassHeader} updateClassCredits={updateClassCredits} setUpdateClassCredits = {setUpdateClassCredits}/>}
                    </div>}
                {activeTab === "delete" && 
                    <div className="placeholder">
                        <p>Delete Class</p>
                        <div className="entry-list">
                            {filteredClasses.map((item,index)=>{
                                return(
                                <div className={selectedEntry === item.classId ?"entry highlighted":"entry"} onClick={()=>{makeSelectedEntry(item.classId)}}>
                                        <p>{item.title} </p>
                                        <p>{item.header} </p>
                                </div>)
                            })}
                        </div>
                        <p>{warning}</p>
                        <button onClick={deleteEntry} className="btn-delete-student">Delete Class</button>
                    </div>}
                {activeTab === "tree" && 
                    <div className="graph-container">
                        <div style={{ height: '80vh', width: '50vw' }}>
                            {(nodes && edges) && <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={false}
                            nodesConnectable={false}
                            elementsSelectable={false}
                            zoomOnScroll={false}
                            panOnDrag={false}/>}
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

