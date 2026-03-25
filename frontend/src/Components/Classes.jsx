import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import "../searchers.css"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Classes(){

    const [classSearchList, setClassSearchList] = useState(null);
    
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
    return(
        <div className="classes-container">
            <SearchBar requiredClasses= {requiredClasses} setClassSearchList={setClassSearchList}/>
            <ClassList classSearchList={classSearchList}/>
        </div>
    )
}


function FilterBlock({ year, setYear, requirement, setRequirement}) {

    const onReset = ()=>{
        setYear("All");
        setRequirement("All");
    }

    const onFilter = () =>{

    }
    console.log(overview)

    return (
        <div>
            <div className="filter-container">
                <img className="close-img" src={close} onClick={()=>{setShowFilter(false)}}></img>

                <p className="filter-title">Filter Classes</p>

                 <div className="filter-graduation-overview">
                    <label>Year Filter</label>
                    <select className="year-select" value={requirement} onChange={(e)=>setRequirement(e.target.value)}>
                        <option value="First">All</option>
                        <option value="First">First Year</option>
                        <option value="Second">Second Year</option>
                        <option value="Third">Third Year</option>
                        <option value="Fourth">Fourth Year</option>
                    </select>
                </div>

                
                <div className="filter-graduation-overview">
                    <label>Year Filter</label>
                    <select className="year-select" value={year} onChange={(e)=>setYear(e.target.value)}>
                        <option value="First">All</option>
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

function SearchBar({requiredClasses,setClassSearchList}){

    
    const [searchInput, setSearchInput] = useState(null);

    useState(()=>{
        if(requiredClasses){
            setClassSearchList(requiredClasses);
        }
    },[requiredClasses])
    
    const searchExplorer = () =>{
        const searchResult = requiredClasses.filter((item) => checkEqual(item, searchInput));
        setClassSearchList(searchResult);
        console.log(searchResult);
    }   

    function checkEqual(item,searchInput){
        const headerFormat = item.header.trim().toLowerCase();
        const titleFormat = item.title.trim().toLowerCase();
        const searchFormat = searchInput.trim().toLowerCase()

        return(headerFormat.includes(searchFormat)|| titleFormat.includes(searchFormat))
        
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter") searchExplorer();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [searchInput, requiredClasses]);


    //function which takes the input of the search and gets people that match input

    //function which opens up a filter menu, where we can see students with certain attributes

    return(
        <div className="search">
            <img src={search} className="search-icon"></img>
            <input type="search" className="search-input" value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}} placeholder="Search Class..."></input>
            <img src={filter} className="filter"></img>
        </div>
    )
}

function ClassList({classSearchList}){
    const navigate = useNavigate();
    // function which allows the user to click on a student and nav to individual 

    // replace with classes method, add an isrequired field
   

    return(

        <div className="entry-list">
            {classSearchList && classSearchList.map((item,index)=>{
                return(
                <div className="entry" onClick={()=>{navigate(`/classes/${item.header}`)}}>
                    <p>{item.title} </p>
                    <p>{item.header} </p>
                </div>
                )
            })}
        </div>
    ) 
}

export default Classes;