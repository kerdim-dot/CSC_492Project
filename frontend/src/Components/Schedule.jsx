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
    const [selectedDays, setSelectedDays] = useState([]);

    const makeSelectedClass = (header, index) =>{
        setSelectedClass(header)
    }

    const makeSelectedFirstBlock = () =>{
        if(!selectedFirstBlock){
            setSelectedSecondBlock(false);
            setSelectedFirstBlock(true);
            setSelectedDays(["Monday","WednesDay", "Friday"]);
        }

    }

    const makeSelectedSecondBlock = () =>{
        if(!selectedSecondBlock){
            setSelectedFirstBlock(false);
            setSelectedSecondBlock(true);
            setSelectedDays(["Tuesday","Thursday"]);
        }
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

    return(
        <div className="schedule-class">
            <div className="schedule-class-creator">
                <div className="schedule-class-list">
                    {classes && classes.map((item,index)=>{
                        return(
                            <div className="schedule-class" onClick={()=>{makeSelectedClass(item.header,index)}}>
                                {item.header}
                            </div>
                        )
                    })}
                </div>
                <div className="days-radio-group">
                    <div className="days-segment-radio-block">
                        <p>M/W/F</p>
                        <input name = "days"type = "radio" onClick={makeSelectedFirstBlock}/>
                    </div>
                    
                    <div className="days-segment-radio-block">
                        <p>T/TH</p>
                        <input name = "days"type = "radio" onClick={makeSelectedSecondBlock}/>
                    </div>
                </div>

                
                { selectedFirstBlock ?
                    <div className="days-checklist-group">
                        <div className="days-checkbox-block">
                            <p>Monday</p>
                            <input type = "checkbox" checked={selectedFirstBlock}/>
                        </div>
                        <div className="days-checkbox-block">
                            <p>Wednesday</p>
                            <input type = "checkbox" checked={selectedFirstBlock}/>
                        </div>
                        <div className="days-checkbox-block">
                            <p>Friday</p>
                            <input type = "checkbox" checked={selectedFirstBlock}/>
                        </div>
                    </div>
                    :
                    selectedSecondBlock?
                    <div className="days-checklist-group">
                        <div className="days-checkbox-block" checked={selectedSecondBlock}>
                            <p>Tuesday</p>
                            <input type = "checkbox"/>
                        </div>
                        <div className="days-checkbox-block" checked={selectedSecondBlock}>
                            <p>Thursday</p>
                            <input type = "checkbox"/>
                        </div>
                    </div>
                    :
                    <></>
                    }

                    <button className="schedule-add-class-btn">Add Class</button>
            </div>
            <div className="schedule-class-creator">
                {selectedClass&& <p>{selectedClass}</p>}
                {selectedFirstBlock?<p>{"M/W/F"}</p>:selectedSecondBlock?<p>{"T/TH"}</p>:<></>}
                [{selectedDays.map((item)=>{return (<p>{item}</p>)})}]
            </div>
        </div>
    )
}
export default Schedule;