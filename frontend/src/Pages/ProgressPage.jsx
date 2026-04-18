import SideBar from "../Components/Sidebar";
import TestPage from "./TestPage";
import { useEffect, useState } from "react";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
//import { findParams } from "../tools/treeBuilder";

function ProgressPage({ requiredClasses }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [classPool, setClassPool] = useState([]);

    const classes = ["csc-120", "csc-220", "csc-270", "csc-310", "csc-320", "csc-410"];

    const data = [
        { current: "csc-120", postreq: "csc-220" },
        { current: "csc-220", postreq: "csc-270" },
        { current: "csc-270", postreq: "csc-310" },
        { current: "csc-270", postreq: "csc-320" },
    ];

    useEffect(() => {
        const builtNodes = [];
        const builtEdges = [];
        const tree = findParams(data, classes);

        tree.forEach((item) => {
            builtNodes.push({
                id: item.val,
                data: { label: item.val },
                position: { x: item.width * 100, y: item.height * 100 },
                style: { width: 50, backgroundColor: "#f0f0f0" },
            });
        });

        setNodes(builtNodes);

        let edgeCount = 1;
        tree.forEach((item) => {
            for (let i = 0; i < item.children; i++) {
                builtEdges.push({
                    id: `e-${edgeCount}-${i}`,
                    // fill these in with real source/target values
                });
            }
            edgeCount++;
        });

        setEdges(builtEdges);
    }, []);

    useEffect(() => {
        if (requiredClasses) {
            setClassPool(requiredClasses.map((item) => item.header));
        }
    }, [requiredClasses]);

    return (
        <div className="graph-container">
            <SideBar />
            <div style={{ height: "80vh", width: "50vw" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={true}
                />
            </div>

            <div className="class-pool">
                <h3>Class Pool</h3>
                {classPool.map((item, index) => (
                    <div key={index} className="class-card">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProgressPage;