function ClassZoom(){
    return(
        <div>
            <InProgress/>
            <Completed/>
            <Incomplete/>
        </div>
    )
}

function InProgress(){
    return(
        <div>
            <p>Students in Progress with Class</p>
            <div>
                <p>first name</p>
                <p>Last name</p>
                <p>grad</p>
            </div>
        </div>
    )
}

function Completed(){
      return(
        <div>
            <p>Students Completed with Class</p>
            <div>
                <p>first name</p>
                <p>Last name</p>
                <p>grad</p>
            </div>
        </div>
    )  
}

function Incomplete(){
    return(
        <div>
            <p>Students Incomplete with Class</p>
            <div>
                <p>first name</p>
                <p>Last name</p>
                <p>grad</p>
            </div>
        </div>
    )
}

export default ClassZoom;