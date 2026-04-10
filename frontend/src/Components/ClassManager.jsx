import { useEffect, useState } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"
import { ReactFlow, Background, Controls, Position,applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { data } from "react-router-dom";
import { findParams, findPreReqs } from "../tools/treeBuilder";
import axios from 'axios';
import { useRef } from "react";


/* Backend Needs
- Fetch classes c
- Update classes
- Delete classes
- add prerequisites
- delete prerequisities
*/

function ClassManager(){
    
      const [activeTab, setActiveTab] = useState("update");
      const [edges, setEdges] = useState([]);
      const [nodes, setNodes] = useState(null);
      const [searchInput, setSearchInput] = useState("");
      const [showFilter, setShowFilter] = useState(false);

      const [year, setYear] = useState("All");
      const [requirement, setRequirement] = useState("All");
      const [credits, setCredits] = useState("");

      const [filteredClasses, setFilteredClasses] = useState([]);

      const [selectedEntry, setSelectedEntry] = useState(null);
      const [classUpdateEntry,setClassUpdateEntry] = useState(null);
      const [updateClassTitle, setUpdateClassTitle] = useState(null);
      const [updateClassHeader, setUpdateClassHeader] = useState(null);
      const [updateClassCredits, setUpdateClassCredits] = useState(null);

      const [classes,setClasses] = useState([]);
      const [isBeginning, setIsBeginning] = useState(true);

      useEffect(()=>{
        
        const retriveClassData = async() =>{
            const classData = await axios.get('http://localhost:8080/test/get/classes');
            setClasses(classData.data);
            console.log("class fetch:", classData.data)
        }
        retriveClassData();
    },[])

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

     
     
    const classess = ["csc-120","csc-220","csc-270","csc-310","csc-320","csc-410"];

    const data = [
        {
            current: "csc-120",
            postreq: "csc-220"
        },

        {
            current: "csc-220",
            postreq: "csc-270"
        },

        {
            current: "csc-270",
            postreq: "csc-310"
        },


        {
            current: "csc-270",
            postreq: "csc-320"
        },
    ]

    useEffect(()=>{
        const nodes = [];
        const edges = [];
        const tree = findParams(data,classess)

        let count = 1;
        tree.map((item)=>{
            nodes.push({
                id: item.val,
                data: {label:item.val},
                position: {x:item.width * 100,y: item.height*100},
                style: { width: 50, backgroundColor: '#f0f0f0' },
            })
            count +=1 ;
        })
        
                        
        // edges.push({
        //                 id: "e1-" + count,
        //                 source: String(parent),
        //                 target: String(count),
        //             });
        setNodes(nodes);

        let edgeCount = 1;
        tree.map((item)=>{
            for (let i = 0; i<item.children ; i++)
            edges.push({
                id: edgeCount
                
            })
            edgeCount++;
        })

    },[])

   



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
                <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab} setClassUpdateEntry={setClassUpdateEntry} setSelectedEntry = {setSelectedEntry}/>
                {(activeTab === "delete" || activeTab === "update") && 
                    <SearchBar 
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        setShowFilter={setShowFilter}
                    />
                }
          </div>
          
          <BodyPanel isBeginning = {isBeginning} setIsBeginning = {setIsBeginning} activeTab={activeTab} nodes = {nodes} classes={classes} filteredClasses= {filteredClasses} edges={edges}classUpdateEntry = {classUpdateEntry} setClassUpdateEntry = {setClassUpdateEntry} updateClassTitle={updateClassTitle} setUpdateClassTitle={setUpdateClassTitle} updateClassHeader={updateClassHeader} setUpdateClassHeader={setUpdateClassHeader} updateClassCredits={updateClassCredits} setUpdateClassCredits = {setUpdateClassCredits} selectedEntry={selectedEntry} setSelectedEntry={setSelectedEntry}/>
          
        </div>
      );
    }
    
    export default ClassManager;
    
    function HeaderPanel({activeTab, setActiveTab, setClassUpdateEntry, setSelectedEntry}){

        const onClickAdd = () =>{
            setClassUpdateEntry(null);
            setSelectedEntry(null);
            setActiveTab("add");
        }

        const onClickUpdate = () =>{
            setSelectedEntry(null);
            setActiveTab("update");
        }
        const onClickDelete = () =>{
            setClassUpdateEntry(null);
            setActiveTab("delete");
        }

        const onClickTree = () =>{
            setClassUpdateEntry(null);
            setSelectedEntry(null);
            setActiveTab("tree");
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


    function UpdateBlock({isBeginning, classUpdateEntry, setClassUpdateEntry, updateClassTitle, setUpdateClassTitle, updateClassHeader,setUpdateClassHeader,updateClassCredits, setUpdateClassCredits}){
      
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
    
    function BodyPanel({isBeginning, setIsBeginning, activeTab, nodes, classes, filteredClasses, edges,classUpdateEntry,setClassUpdateEntry,updateClassTitle, setUpdateClassTitle, updateClassHeader, setUpdateClassHeader, updateClassCredits, setUpdateClassCredits, selectedEntry, setSelectedEntry}){
       
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
                
                //console.log(nodes)

                setClassPool(classPool);
                
            }
        },[classes])
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

        const clickOnEntry = (item) =>{
            setIsBeginning(false);
            setClassUpdateEntry(item.class_id);
            setUpdateClassTitle(item.title);
            setUpdateClassHeader(item.header);
            setUpdateClassCredits(item.credits);
        }
        


        return(
            <div className="tab-content">
                {activeTab === "add" && 
                <div className="class-add-container">
                    <p className="add-class-title">Add Class</p>
                    <div className="class-headers-container">
                        <input type= "text" className="title-input" placeholder="Title"/>
                        <input type= "text" className="header-input" placeholder="Header"/>
                    </div>

                    <div className="graduation-container">
                        <input type="text" className="description-input" placeholder="Class Description"></input>
                    </div>

                    <div className="graduation-container">
                        <input type="text" className="credits-input" placeholder="Credits"></input>
                    </div>
                    
                    <div className="graduation-container">
                        <button>Add Class</button>
                    </div>
                    
                </div>
                }
                {activeTab === "update" && 
                    <div className="placeholder">
                        
                        <p>Update Class</p> 
    
                        <div className="entry-list">
                            {filteredClasses.map((item,index)=>{
                                return(
                                <div className={item.class_id == classUpdateEntry?"entry highlighted":"entry"} onClick={()=>{clickOnEntry(item)}}>
                                        <p>{item.title} </p>
                                        <p>{item.header} </p>
                                </div>)
                            })}
                            
                        </div>
                            <UpdateBlock isBeginning={isBeginning} setIsBeginning={setIsBeginning} classUpdateEntry = {classUpdateEntry} setClassUpdateEntry = {setClassUpdateEntry} updateClassTitle={updateClassTitle} setUpdateClassTitle={setUpdateClassTitle} updateClassHeader={updateClassHeader} setUpdateClassHeader={setUpdateClassHeader} updateClassCredits={updateClassCredits} setUpdateClassCredits = {setUpdateClassCredits}/>
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
                        <div style={{ height: '80vh', width: '50vw' }}>
                            {(nodes) && <ReactFlow nodes={nodes} edges={edges}fitView nodesDraggable={false}
                            nodesConnectable={true}
                            ></ReactFlow>}
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

