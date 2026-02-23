import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import "../searchers.css"
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

    // function which allows the user to click on a student and nav to individual 

    // replace this with a fetch students method
    const students = [
            {studentId:1,firstName:"Bill" , lastName:"Hart", graduation: "1/2029", classes:null, credits:0},
            {studentId:1,firstName:"John" , lastName:"Doe", graduation: "2/2028", classes:null, credits:0}
    ]

    students.sort((a,b)=>{return a.lastName.localeCompare(b.lastName)})

    return(

        <div className="entry-list">
            {students.map((item,index)=>{
                return(
                <div className="entry">
                    <p>{item.firstName} {item.lastName}</p>
                    <p>{item.graduation}</p>
                </div>
                )
            })}
        </div>
    ) 
}