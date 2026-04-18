
function GraduationConverter(date){
    
    const splitDate = date.split("-");
    if(2< Number(splitDate[1]) && Number(splitDate[1]) <7){
        return "1/"+splitDate[0];
    }
    else{
        return "2/"+splitDate[0];
    }
}

  // checks how many semesters a student has, not including the current semester
function timeCalculator(student,currentYear,currentSemester){
    const grad = GraduationConverter(student.graduationDate);
    const graduationSemester = Number(grad.split("/")[0]);
    const graduationYear = Number(grad.split("/")[1]);
    const timerFormula =  ((graduationYear - currentYear)*2) + (graduationSemester - currentSemester)
    return timerFormula;
}

function computerScienceMajorRequirements(studentItem,enrollmentMap,currentYear,currentSemester,requiredClassHeaders){
    const requiredClasses = ["MTH-123","MTH-125","MTH-141","CSC-120","CSC-220","CSC-270","CSC-310","CSC-320","CSC-360","CSC-491","CSC-492"];
    const requiredCreditHours = 54;
    const aboveThreeHundredClasses = 4;

    let isBehindRequiredClasses = false;
        const studentSemestersLeft = timeCalculator(studentItem,currentYear,currentSemester,);
        requiredClasses.forEach((classItem)=>{
            const headerNumber = Number(classItem.substring(classItem.indexOf("-")+1,classItem.indexOf("-")+2));
            const hasTakenClass = enrollmentMap[studentItem.student_id].includes(classItem.class_id);
            const classSemesters = 8-(headerNumber*2)
            if(!hasTakenClass && studentSemestersLeft<=classSemesters){
                //console.log(classItem.header,classSemesters,studentSemestersLeft);
                isBehindRequiredClasses = true;
            }
        })
    return isBehindRequiredClasses;
    //let isBehindCredits = false
}

function computerScienceMinorRequirements(studentItem,enrollmentMap,currentYear,currentSemester,requiredClassHeaders){
    const requiredClasses = ["CSC-120","CSC-220","CSC-270","CSC-320","CSC-370"];
    const requiredCreditHours = 54;
    const aboveThreeHundredClasses = 4;

    let isBehindRequiredClasses = false;
        const studentSemestersLeft = timeCalculator(studentItem,currentYear,currentSemester);
        requiredClasses.forEach((classItem)=>{
            const headerNumber = Number(classItem.substring(classItem.indexOf("-")+1,classItem.indexOf("-")+2));
            const hasTakenClass = enrollmentMap[studentItem.student_id].includes(classItem.class_id);
            const classSemesters = 8-(headerNumber*2)
            if(!hasTakenClass && studentSemestersLeft<=classSemesters){
                //console.log(classItem.header,classSemesters,studentSemestersLeft);
                isBehindRequiredClasses = true;
            }
        })
    return isBehindRequiredClasses;
    //let isBehindCredits = false
}

function multiPlatformMajorRequirements(studentItem,enrollmentMap,currentYear,currentSemester,requiredClassHeaders){
    const requiredClasses = ["MTH-123","MTH-125","CSW-123","CSW-223","CSW-423","CSC-120","CSC-220","CSC-310","CSC-360","CSC-491","CSC-492"];
    const requiredCreditHours = 50;
    const aboveThreeHundredClasses = 3;

    let isBehindRequiredClasses = false;
        const studentSemestersLeft = timeCalculator(studentItem,currentYear,currentSemester);
        requiredClasses.forEach((classItem)=>{
            const headerNumber = Number(classItem.substring(classItem.indexOf("-")+1,classItem.indexOf("-")+2));
            const hasTakenClass = enrollmentMap[studentItem.student_id].includes(classItem.class_id);
            const classSemesters = 8-(headerNumber*2)
            if(!hasTakenClass && studentSemestersLeft<=classSemesters){
                //console.log(classItem.header,classSemesters,studentSemestersLeft);
                isBehindRequiredClasses = true;
            }
        })
    return isBehindRequiredClasses;
    //let isBehindCredits = false
}
 
export {computerScienceMajorRequirements,computerScienceMinorRequirements,multiPlatformMajorRequirements}