import { useEffect, useRef, useState } from "react";
import { buildRoots,buildTree, findPreReqs, findParams } from "../tools/treeBuilder";
import { GraduationConverter } from "../tools/GraduationConverter";
// feel free to break this as much as you want
// to get here do '/testing'
function Testing(){
    const classesHeaders = [
        {header:"MTH-123",class_id:9},
        {header:"MTH-125",class_id:10},
        {header:"MTH-141",class_id:11},
        {header:"CSC-120",class_id:1},
        {header:"CSC-220",class_id:2},
        {header:"CSC-270",class_id:3},
        {header:"CSC-310",class_id:4},
        {header:"CSC-320",class_id:5},
        {header:"CSC-360",class_id:6},
        {header:"CSC-491",class_id:7},
        {header:"CSC-492",class_id:8},
        {header:"CSW-123",class_id:12},
        {header:"CSW-223",class_id:13},
        {header:"CSW-423",class_id:14}];

    const prerequisiteMapping = [
        {}
    ]
}
export default Testing;