import { useEffect, useState } from "react";
import '../adminPanel.css'
import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import { ReactFlow, Background, Controls, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { data } from "react-router-dom";

function ClassManager(){
      const [activeTab, setActiveTab] = useState("update");
        const [edges, setEdges] = useState(null);
      const requiredClasses = [
        {title:	"Programming Problem Solving I",header:"CSC-120", credits: 4, isActive: true}, 
        {title: "Programming Problem Solving II" ,header:"CSC-220", credits: 4,isActive: true},
        {title:"Computer Organization" , header:"CSC-270", credits: 4,isActive: true}, 
        {title:"Database Theory Implementation",header:"CSC-310", credits: 4,isActive: true}, 
        {title:"Algorithms and Data Structures",header:"CSC-320", credits: 4,isActive: true}, 
        {title:"Computer Networks",header:"CSC-360", credits: 4,isActive: false}, 
        {title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2,isActive: false}, 
        {title:"Practice Software Engineering",header:"CSC-492", credits: 2,isActive: false}
     ];

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
    
      
      return (
        <div className="tab-pane-container">
          <div className="top-container">
                <HeaderPanel activeTab = {activeTab} setActiveTab={setActiveTab}/>
                {(activeTab === "delete" || activeTab === "update") && <SearchBar/>}
          </div>
          
          <BodyPanel activeTab={activeTab} requiredClasses={requiredClasses} edges={edges}/>
          
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
    
    function SearchBar(){
        return(
            <div className="search">
                <img src={search} className="search-icon"></img>
                <input type="search" className="search-input" placeholder="Search Student..."></input>
                <img src={filter} className="filter"></img>
            </div>
        )  
    }
    
    function BodyPanel({activeTab, requiredClasses,edges}){
        const [selectedEntry, setSelectedEntry] = useState(null);
        const [warning, setWarning] = useState(null);
        const [nodes,setNodes] = useState(null);
        const [classPool, setClassPool] = useState(null);
    
        const makeSelectedEntry = (index) =>{
            setSelectedEntry(index);
        }
    
        const deleteEntry = () =>{
            if(!selectedEntry){
                setWarning("No Entry Selected")
                setTimeout(()=>{
                    setWarning("");
                },2000)
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
        return(
            <div className="tab-content">
                {activeTab === "add" && 
                <div className="placeholder">
                    <p>Add Class</p>
                    <div className="name-container">
                        <input type= "text" placeholder="Title"/>
                        <input type= "text" placeholder="Header"/>
                    </div>
                    <div className="graduation-container">
                        <input type="text" placeholder="Credits"></input>
                    </div>
                    <div>
                        
                    </div>
                    
                </div>
                }
                {activeTab === "update" && 
                    <div className="placeholder">
                        
                        <p>Update Class</p> 
    
                        <div className="entry-list">
                            {requiredClasses.map((item,index)=>{
                                return(
                                <div className="entry">
                                        <p>{item.title} </p>
                                        <p>{item.header} </p>
                                </div>)
                            })}
                        </div>
    
                    </div>}
                {activeTab === "delete" && 
                    <div className="placeholder">
                        <p>Delete Class</p>
                        <div className="entry-list">
                            {requiredClasses.map((item,index)=>{
                                return(
                                <div className={selectedEntry === index ?"entry highlighted":"entry"} onClick={()=>{makeSelectedEntry(index)}}>
                                        <p>{item.title} </p>
                                        <p>{item.header} </p>
                                </div>)
                            })}
                        </div>
                        <p>{warning}</p>
                        <button onClick={deleteEntry} className="btn-delete-student">Delete Student</button>
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

