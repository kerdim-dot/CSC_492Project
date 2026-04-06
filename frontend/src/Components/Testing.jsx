import { useEffect, useRef, useState } from "react";
import { buildRoots,buildTree, findPreReqs, findParams } from "../tools/treeBuilder";
import { GraduationConverter } from "../tools/GraduationConverter";
// feel free to break this as much as you want
// to get here do '/testing'
function Testing(){
    const [selected, setSelected] = useState(null);
    const [studentList,setStudentList] = useState(null); 
    const [requiredClasses, setRequiredClasses] = useState(null);
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentSemester, setCurrentSemester] = useState(2);
    const [timer,setTimer] = useState(null);
    const [currentStudent,setCurrentStudent] = useState(null);

    useEffect(()=>{
        let students = [
            {firstName:"John" , lastName:"Doe", graduation: "2/2028", classes:null, credits:0},
            {firstName:"Bill" , lastName:"Hart", graduation: "1/2029", classes:null, credits:0},
        ]

        setStudentList(students);

        const requiredClasses = [
            {title:	"Programming Problem Solving I",header:"CSC-120", credits: 4}, 
            {title: "Programming Problem Solving II" ,header:"CSC-220", credits: 4},
            {title:"Computer Organization" , header:"CSC-270", credits: 4}, 
            {title:"Database Theory Implementation",header:"CSC-310", credits: 4}, 
            {title:"Algorithms and Data Structures",header:"CSC-320", credits: 4}, 
            {title:"Computer Networks",header:"CSC-360", credits: 4}, 
            {title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2}, 
            {title:"Practice Software Engineering",header:"CSC-492", credits: 2}
        ];

        // we make a forest, starting with classes that are not prereqs of another class
        // using prereqs current -> csc 220 prereq -> csc 120
        // using postreqs current -> csc 120 postreq -> csc 220
        // in sql, do we map to postreq or prereq? I think it would be easier to map the posreqs of current class, because then we can simply map
        // through the classes and see if they have any postreqs, but then would it be harder to get the children of the postreq?

        setRequiredClasses(requiredClasses);

    },[])
    
    function changeSelected(index,item){
        setSelected(index);
        setCurrentStudent(item);
    }

    function addClass(c) {
        if (selected !== null) {
            setStudentList(prev => {
                const updated = [...prev]; // copy array

                // ensure classes array exists
                const classes = updated[selected].classes || [];
                if(!classes.includes(c.header)){
                    const credits = updated[selected].credits 
                    updated[selected] = {
                        ...updated[selected],
                        classes: [...classes, c.header], // new array
                        credits: credits + c.credits
                    };
                }
                 return updated;
                
            });
        }
    }

    function timeCalculator(student){
        const graduationSemester = student.graduation.substring(0,student.graduation.indexOf("/"));
        const graduationYear = student.graduation.substring(1+student.graduation.indexOf("/"));
        const timerFormula =  ((graduationYear - currentYear)*2) + (graduationSemester - currentSemester)
        setTimer(timerFormula);
    }


const classes = ["csc-120","csc-220","csc-270","csc-310","csc-320","csc-410"];

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

useEffect(() => {
    // addPrereq("csc-410","csc-320")
    // addPostreq("csc-310","csc-410")
    console.log(findPreReqs(data, classes,"csc-320"));
    console.log(findParams(data, classes))
}, []);



function addPrereq(current, prereq){
    const exists = data.some(
        item => item.current === prereq && item.postreq === current
    );

    if (!exists) {
        data.push({
            current: prereq,
            postreq: current
        });
    }
}

function addPostreq(current, postreq){
    const exists = data.some(
        item => item.current === current && item.postreq === postreq
    );

    if (!exists) {
        data.push({
            current: current,
            postreq: postreq
        });
    }
}



// console.log(GraduationConverter("2028-02-01"));


// function AddClassToTree(header,classes){
//     classes.forEach((item)=>{
//         if(header == item){

//         }
//     })
// }



    // const root = {
    //     value: "CSC-120",
    //     children: [{
    //         value: "CSC-220",
    //         children: [{
    //             value: "CSC-270",
    //             children:[{
    //                 value:"CSC-310"
    //             },
    //             {
    //                 value:"CSC-320"
    //             }]
    //         }]
    //     }]
     }


    const treeHelper = (tree) =>{
        if (!tree){
            return;
        }
        const queue = [];
        queue.push(tree);
        
        //bfs starts
        while (queue.length != 0){
            const thisLength = queue.length;
            for (let i = 0 ; i<thisLength;i++){
                const current = queue.shift();
                console.log(current); 

                if (current.children && current.children.length > 0) {
                    for (let j = 0; j < current.children.length; j++) {
                        queue.push(current.children[j]);
                    }
                }
            }
        }
    

    console.log(treeHelper(root));

    return (
        <div className="test_div">
            {/*
            <p className="year_title">Semester: {currentSemester}, Year: {currentYear}</p>
            {studentList? studentList.map((item,index)=>{
                return(
                    <p className={selected == index?"highlight hoverPointer":"hoverPointer"} onClick={()=>{changeSelected(index,item)}}>{index}. {item.firstName} {item.lastName} {item.graduation} {item.classes} credits:{item.credits}</p>
                )
            }):<></>}
            {requiredClasses ? requiredClasses.map((item)=>{
                return(
                    <div className="class_div">
                        <p>{item.header.substring(1+item.header.indexOf("-"),2+item.header.indexOf("-"))*2}</p>
                        <button onClick={()=>{addClass(item)}}>{item.header}</button>
                    </div>
                )
            }):<></>}
            <button onClick={()=>{timeCalculator(currentStudent)}}>graduation timer:</button>
            <p>{timer}</p>*/}
            
        </div>
    )
}
export default Testing;