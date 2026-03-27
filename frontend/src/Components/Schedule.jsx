import { useState } from "react";
import "../schedule.css"
function Schedule(){
    return(
        <div className="schedule_container">
            <ScheduleBlock/>
            <AddClass/>
        </div>
    )
}


function ScheduleBlock(){

    const timesMWF = ["7:30am","8:45am","10am","11:15am","12:30pm","1:45pm","3:00pm"];
    const daysMWF = ["Monday","Wednesday","Friday"];

    const timesTTH = ["7:30am","9:20am","11:00am","12:30am","2:20pm"];
    const daysTTH =["Tuesday","Thursday"];
    return (

        <div className="schedule-grids">
            <div className="schedule-grid">

                <div className="cell header-cell-vertical"></div>

                {daysMWF.map((day, dayIndex) => (
                    <div key={day} className="cell header-cell-vertical">{day}</div>
                ))}

                {timesMWF.map((time,timeIndex)=> (
                    <>
                        <div className="cell header-cell">{time}</div>

                        {daysMWF.map(day => (
                            <div key={`${day}-${time}`} className="cell"></div>
                        ))}
                    </>
                ))}
            </div>

            <div className="schedule-grid-2">

                <div className="cell header-cell"></div>

                {daysTTH.map(day => (
                    <div key={day} className="cell header-cell">{day}</div>
                ))}

                {timesTTH.map(time=> (
                    <>
                        <div className="cell header-cell">{time}</div>

                        {daysTTH.map(day => (
                            <div key={`${day}-${time}`} className="cell"></div>
                        ))}
                    </>
                ))}
            </div>
        </div>
        
        
    )
}


function AddClass(){
    // first block is M/W/F
    //second block is T/TH
    const [selectedFirstBlock,setSelectedFirstBlock] = useState(false);
    const [selectedSecondBlock,setSelectedSecondBlock] = useState(false);
    const [selectedClass,setSelectedClass] = useState(null);
    const [selectedDays, setSelectedDays] = useState([new Set()]);
    const [selectedCheck,setSelectedCheck] = useState([false,false,false,false,false]);
    const [availableFirstTimes,setAvailableFirstTimes] = useState(["7:30-8:35","8:45-9:50","10:00-11:05","11:15-12:20","12:30-1:35","1:45-2:50","3:00-4:05"]);
    const [availableSecondTimes,setAvailableSecondTimes] = useState(["7:30-9:10","9:20-10:50","11:00-12:20","12:30-2:10","2:20-4:00"]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [gridValues, setGridValues] = useState([]);

    const makeSelectedClass = (header, index) =>{
        setSelectedClass(header)
    }

    // This allows the user to make the new class a M/W/F, automatically adds all these days to the checklist, user can change that later
    const makeSelectedFirstBlock = () =>{
        if(!selectedFirstBlock){
            setSelectedSecondBlock(false);
            setSelectedFirstBlock(true);
            setSelectedDays(["Monday","Wednesday", "Friday"]);
            setSelectedCheck(prev =>{
                const monday_wednesday_friday = [...prev]
                monday_wednesday_friday[0] = true;
                monday_wednesday_friday[2] = true;
                monday_wednesday_friday[4] = true;
                monday_wednesday_friday[1] = false;
                monday_wednesday_friday[3] = false;
                return monday_wednesday_friday;
            })
        }

    }
    // This allows the user to make the new class a T/Th, automatically adds all these days to the checklist, user can change that later
    const makeSelectedSecondBlock = () =>{
        if(!selectedSecondBlock){
            setSelectedFirstBlock(false);
            setSelectedSecondBlock(true);
            setSelectedDays(["Tuesday","Thursday"]);
            setSelectedCheck(prev =>{
                const tuesday_thursday = [...prev]
                tuesday_thursday[0] = false;
                tuesday_thursday[2] = false;
                tuesday_thursday[4] = false;
                tuesday_thursday[1] = true;
                tuesday_thursday[3] = true;
                return tuesday_thursday;
            })
        }
    }
    
    // this allows the user to change what they have in their checklist for days. For example if the class is only a monday class,
    // they would deselect the wednesay and friday class. But then they realize it is a monday and wednesday class, they can reselect wednesday

    /* 
        this can probably be optimized using a hashmap and a single case, rather than 5 cases  
    */
    const changeCheckBox = (day) =>{
        setSelectedCheck(prev =>{
                const currentList= [...prev]
                switch(day){
                    case "Monday":
                        if(currentList[0]==true){
                            currentList[0] = false;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                const removeElementIndex = tempDays.indexOf("Monday");
                                if (removeElementIndex !== -1) {
                                    tempDays.splice(removeElementIndex, 1);
                                }
                                return new Set(tempDays);
                            })
                        }
                        else{
                            currentList[0] = true;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                tempDays.splice(0,0,"Monday")
                                return new Set(tempDays);
                            })
                        }
                        break;
                    case "Tuesday":
                        if(currentList[1]==true){
                            currentList[1] = false;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                const removeElementIndex = tempDays.indexOf("Tuesday");
                                if (removeElementIndex !== -1) {
                                    tempDays.splice(removeElementIndex, 1);
                                }
                                return new Set(tempDays);
                            })
                        }
                        else{
                            currentList[1] = true;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                tempDays.splice(0,0,"Tuesday")
                                return new Set(tempDays);
                            })
                        }
                        break;
                    case "Wednesday":
                        if(currentList[2]==true){
                            currentList[2] = false;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                const removeElementIndex = tempDays.indexOf("Wednesday");
                                console.log(removeElementIndex)
                                if (removeElementIndex !== -1) {
                                    tempDays.splice(removeElementIndex, 1);
                                }
                                return new Set(tempDays);
                            })
                        }
                        else{
                            currentList[2] = true;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                // preserves the order of the list to always be [monday,wednesday,friday]
                                if(currentList[0]){
                                    tempDays.splice(1,0,"Wednesday");
                                }else{
                                    tempDays.splice(0,0,"Wednesday");
                                }
                                return new Set(tempDays);
                            })
                        }
                        break;
                    case "Thursday":
                        if(currentList[3]==true){
                            currentList[3] = false;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                const removeElementIndex = tempDays.indexOf("Thursday");
                                console.log(removeElementIndex)
                                if (removeElementIndex !== -1) {
                                    tempDays.splice(removeElementIndex, 1);
                                }
                                return new Set(tempDays);
                            })
                        }
                        else{
                            currentList[3] = true;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                tempDays.push("Thursday");
                                return new Set(tempDays);
                            })
                        }
                        break;
                    case "Friday":
                        if(currentList[4]==true){
                            currentList[4] = false;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                const removeElementIndex = tempDays.indexOf("Friday");
                                if (removeElementIndex !== -1) {
                                    tempDays.splice(removeElementIndex, 1);
                                }
                                return new Set(tempDays);
                            })
                        }
                        else{
                            currentList[4] = true;
                            setSelectedDays(prev=>{
                                const tempDays = [...prev]
                                tempDays.push("Friday");
                                return new Set(tempDays);
                            })
                        }
                        break;
                }
                
                        
                return currentList;
            })
    }

    const classes = [
        {classId:1, title:	"Programming Problem Solving I",header:"CSC-120", credits: 4, isActive: true,isRequired:true}, 
        {classId:2,title: "Programming Problem Solving II" ,header:"CSC-220", credits: 4,isActive: true,isRequired:true},
        {classId:3,title:"Computer Organization" , header:"CSC-270", credits: 4,isActive: true,isRequired:true}, 
        {classId:4,title:"Database Theory Implementation",header:"CSC-310", credits: 4,isActive: true,isRequired:true}, 
        {classId:5,title:"Algorithms and Data Structures",header:"CSC-320", credits: 4,isActive: true,isRequired:true}, 
        {classId:6,title:"Computer Networks",header:"CSC-360", credits: 4,isActive: false,isRequired:true}, 
        {classId:7,title:"Software Engineer Fundamentals",header:"CSC-491", credits: 2,isActive: false,isRequired:true}, 
        {classId:8,title:"Practice Software Engineering",header:"CSC-492", credits: 2,isActive: false,isRequired:true}
    ];

    // function that goes off once the add button has been clicked
    const addClass = () =>{
        if(selectedDays.length != 0 && selectedClass && selectedTime){
            const values = [];
            const columnMap = {};
            const rowMap = {};
            const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
            const firstBlockTimes = ["7:30-8:35","8:45-9:50","10:00-11:05","11:15-12:20","12:30-1:35","1:45-2:50","3:00-4:05"];
            const secondBlockTImes = ["7:30-9:10","9:20-10:50","11:00-12:20","12:30-2:10","2:20-4:00"]

            days.forEach((item,index)=>{
                rowMap[item] = index;
            })
            firstBlockTimes.forEach((item,index)=>{
                firstBlockTimes
            })
            secondBlockTImes((item,index)=>{
                firstBlockTimes
            })

            selectedDays.forEach(()=>{
                values.push(
                    {
                        class: selectedClass,
                        time : selectedTime,
                        days : selectedDays,
                        column : rowMap[time],
                        
                    }
                )
            })
            setGridValues(values);
        }
    }



    return(
        <div className="schedule-class">
            <div className="schedule-class-creator">
                <div className="schedule-class-list">
                    {classes && classes.map((item,index)=>{
                        return(
                            <div className="schedule-class-individual" onClick={()=>{makeSelectedClass(item.header,index)}}>
                                {item.header}
                            </div>
                        )
                    })}
                </div>
                <div className="days-radio-group">
                    <div className="days-segment-radio-block">
                        <p>M/W/F</p>
                        <input name = "days"type = "radio" onChange={makeSelectedFirstBlock}/>
                    </div>
                    
                    <div className="days-segment-radio-block">
                        <p>T/TH</p>
                        <input name = "days"type = "radio" onChange={makeSelectedSecondBlock}/>
                    </div>
                </div>

                
                { selectedFirstBlock ?
                    <div className="days-checklist-group">
                        <div className="days-checkbox-block">
                            <p>Monday</p>
                            <input onChange={() => changeCheckBox("Monday")} type = "checkbox" checked={selectedFirstBlock && selectedCheck[0]}/>
                        </div>
                        <div className="days-checkbox-block">
                            <p>Wednesday</p>
                            <input type = "checkbox" onChange={() => changeCheckBox("Wednesday")} checked={selectedFirstBlock && selectedCheck[2]}/>
                        </div>
                        <div className="days-checkbox-block">
                            <p>Friday</p>
                            <input type = "checkbox" onChange={() => changeCheckBox("Friday")} checked={selectedFirstBlock && selectedCheck[4]}/>
                        </div>
                    </div>
                    :
                    selectedSecondBlock?
                    <div className="days-checklist-group">
                        <div className="days-checkbox-block">
                            <p>Tuesday</p>
                            <input type = "checkbox" onChange={() => changeCheckBox("Tuesday")} checked={selectedSecondBlock && selectedCheck[1]}/>
                        </div>
                        <div className="days-checkbox-block">
                            <p>Thursday</p>
                            <input type = "checkbox" onChange={() => changeCheckBox("Thursday")} checked={selectedSecondBlock && selectedCheck[3]}/>
                        </div>
                    </div>
                    :
                    <></>
                    }
                    <div>
                        {selectedFirstBlock? availableFirstTimes.map((item)=>{
                            return(
                                <p>{item}</p>
                            )
                        })
                    :
                        selectedSecondBlock? availableSecondTimes.map((item)=>{
                            return(
                                <p>{item}</p>
                            )
                        })
                    :
                        <></>
                    }
                    

                    </div>

                    <button className="schedule-add-class-btn">Add Class</button>
            </div>
            <div className="schedule-class-response">
                {selectedClass&& <p>{selectedClass}</p>}
                {selectedFirstBlock?<p>{"M/W/F"}</p>:selectedSecondBlock?<p>{"T/TH"}</p>:<></>}
                [{Array.from(selectedDays).map((item,index)=>{return (<p>{index != selectedDays.length?item+",":item}</p>)})}]
            </div>
        </div>
    )
}
export default Schedule;