import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import "../searchers.css"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function Students(){
    return(
        <div className="students-container">
            <SearchBar/>
            <StudentList/>
        </div>
        
    )
}

export default Students;

//function which takes the input of the search and gets people that match input

//function which opens up a filter menu, where we can see students with certain attributes

function SearchBar(){
    return(
        <div className="search">
            <img src={search} className="search-icon"></img>
            <input type="search" className="search-input" placeholder="Search Student..."></input>
            <img src={filter} className="filter"></img>
        </div>
    )
}

function StudentList(){
    const navigate = useNavigate();
    // function which allows the user to click on a student and nav to individual 

    // replace this with a fetch students method

    useEffect(()=>{
        const retrieveStudents = async() =>{
            const studentRes = await fetch('http://localhost:8080/student/all',{
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const studentData = await studentRes.json();
            console.log(studentData);
        }   
        retrieveStudents();
    },[])

    const students = [
            {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", classes:null, credits:0},
            {studentId:1,firstName:"John" , lastName:"Doe", graduation: "2/2028", classes:null, credits:0}
    ]

    students.sort((a,b)=>{return a.lastName.localeCompare(b.lastName)})

    return(

        <div className="entry-list">
            {students.map((item,index)=>{
                return(
                <div className="entry" onClick={()=>{navigate(`/students/${item.firstName}/${item.lastName}`)}}>
                    <p>{item.firstName} {item.lastName}</p>
                    <p>{item.graduation}</p>
                </div>
                )
            })}
        </div>
    ) 
}