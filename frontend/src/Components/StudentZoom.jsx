

function StudentZoom(){

    // fetch data reguarding the singular student

    return(
        <div>
            <Schedule/>
            <InProgress/>
            <Completed/>
            <Incomplete/>

        </div>
    )
}

export default StudentZoom;

function Schedules(){
    <></>
}

function InProgress(){
    return(
        <div>
            <p>Classes in Progress by Student</p>
            <div>
                <p>Header</p>
            </div>
        </div>
    )
}

function Completed(){
    return(
        <div>
            <p>Classes Completed by Student</p>
            <div>
                <p>Header</p>
            </div>
        </div>
    )
}

function Incomplete(){
    return(
        <div>
            <p>Classes Incomplete by Student</p>
            <div>
                <p>Header</p>
            </div>
        </div>
    )
}
