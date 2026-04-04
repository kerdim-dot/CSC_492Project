import search from "./../assets/search.svg"
import filter from "./../assets/filter.svg"
import close from "./../assets/close.svg"
import "../searchers.css"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from 'axios'


function Classes(){

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
    
    const [classes, setClasses] = useState([]);

    useEffect(()=>{
        
        const retriveClassData = async() =>{
            const classData = await axios.get('http://localhost:8080/test/get/classes');
            setClasses (classData);
            console.log("class fetch:", classData.data)
        }

        retriveClassData();
    },[])


    const [classSearchList, setClassSearchList] = useState(null);
    
    const [showFilter, setShowFilter] = useState(false);
    const [year,setYear] = useState("All");
    const [requirement,setRequirement] = useState("All");
    const [credits,setCredits] = useState(null);

    const [searchInput, setSearchInput] = useState("");

     

    useEffect(() => {
    if (!requiredClasses) return;

        let filtered = [...requiredClasses];

        // 🔍 SEARCH
        if (searchInput) {
            filtered = filtered.filter((item) => {
                const header = item.header.toLowerCase();
                const title = item.title.toLowerCase();
                const search = searchInput.toLowerCase();

                return header.includes(search) || title.includes(search);
            });
        }

        // 🎓 YEAR FILTER (based on class number)
        if (year !== "All") {
            filtered = filtered.filter((item) => {
                const num = Number(item.header.split("-")[1]);

                if (year === "First") return num < 200;
                if (year === "Second") return num >= 200 && num < 300;
                if (year === "Third") return num >= 300 && num < 400;
                if (year === "Fourth") return num >= 400;

                return true;
            });
        }

        // 📘 REQUIREMENT FILTER (you need to define this better later)
        if (requirement !== "All") {
            // TEMP: assume all are required
            if (requirement === "Required") {
                filtered = filtered;
            } else if (requirement === "Not Required") {
                filtered = [];
            }
        }

        // 🔢 CREDIT FILTER
        if (credits) {
            filtered = filtered.filter((item) => item.credits === Number(credits));
        }

        setClassSearchList(filtered);

    }, [requiredClasses, searchInput, year, requirement, credits]);

    return(
        <div className="classes-container">
            {showFilter && <FilterBlock year ={year} setYear ={setYear} requirement = {requirement} setRequirement = {setRequirement} credits = {credits} setCredits = {setCredits} setShowFilter = {setShowFilter}/>}
            <SearchBar  searchInput={searchInput} setSearchInput={setSearchInput} setShowFilter={setShowFilter}/>
            <ClassList classSearchList={classSearchList}/>
        </div>
    )
}


function FilterBlock({ year, setYear, requirement, setRequirement,credits,setCredits, setShowFilter}) {

    const onReset = ()=>{
        setCredits(null);
        setYear("All");
        setRequirement("All");
    }

    const onFilter = () =>{

    }

    return (
        <div>
            <div className="filter-container">
                <img className="close-img" src={close} onClick={()=>{setShowFilter(false)}}></img>

                <p className="filter-title">Filter Classes</p>


                <div className="filter-graduation-overview">
                    <label>Credit Filter</label>
                    <input className="credit-input" type = "number" value = {credits} onChange = {(e)=>{setCredits(e.target.value)}}/>
                </div>

                 <div className="filter-graduation-overview">
                    <label>Requirement Filter</label>
                    <select className="year-select" value={requirement} onChange={(e)=>setRequirement(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Required">First Year</option>
                        <option value="Not Required">Second Year</option>
                    </select>
                </div>

                
                <div className="filter-graduation-overview">
                    <label>Year Filter</label>
                    <select className="year-select" value={year} onChange={(e)=>setYear(e.target.value)}>
                        <option value="All">All</option>
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

function SearchBar({ searchInput, setSearchInput, setShowFilter }) {
    return (
        <div className="search">
            <img src={search} className="search-icon" />
            <input
                type="search"
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Class..."
            />
            <img src={filter} className="filter" onClick={() => setShowFilter(true)} />
        </div>
    );
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