import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const nodeTypes = { course: CourseNode };

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

function Testing() {
  const [classes, setClasses] = useState(null);
  const [prerequisiteMapping, setPrerequisiteMapping] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [classData, prereqData] = await Promise.all([
        axios.get('http://localhost:8080/test/get/classes'),
        axios.get('http://localhost:8080/test/get/prequisiteMapping'),
      ]);
      setClasses(classData.data);
      setPrerequisiteMapping(prereqData.data);
      console.log(prereqData.data)
    };
    fetchData();
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (!classes || !prerequisiteMapping) return { nodes: [], edges: [] };

    const rawNodes = classes.map(c => ({
      id: String(c.class_id),
      type: 'course',
      data: { label: c.header, color: '#754913' },
    }));

    const rawEdges = prerequisiteMapping.map((p, i) => ({
      id: `e${i}`,
      source: String(p.prerequisite_class_id),
      target: String(p.class_id),
    }));

    return getLayoutedElements(rawNodes, rawEdges);
  }, [classes, prerequisiteMapping]);

  if (!classes || !prerequisiteMapping) return <div>Loading...</div>;

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
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

export default Testing;