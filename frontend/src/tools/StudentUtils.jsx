import { timeCalculator } from "./FlagFormula";
import { GraduationConverter } from "./GraduationConverter";

function GradeConverter(grade_as_percentage) {
    if (grade_as_percentage >= 90 && grade_as_percentage <= 100) {
        return 'A';
    } else if (grade_as_percentage >= 80) {
        return 'B';
    } else if (grade_as_percentage >= 70) {
        return 'C';
    } else if (grade_as_percentage >= 60) {
        return 'D';
    } else if (grade_as_percentage >= 0) {
        return 'F';
    } else {
        return 'Invalid grade';
    }
}


function GradeStatus(grade_as_percentage) {
    if (grade_as_percentage >= 90 && grade_as_percentage <= 100) {
        return 'status-good';
    } else if (grade_as_percentage >= 80) {
        return 'status-good-soft';
    } else if (grade_as_percentage >= 70) {
        return 'status-warn';
    } else if (grade_as_percentage >= 60) {
        return 'status-warn-soft';
    } else if (grade_as_percentage >= 0) {
        return 'status-bad';
    } else {
        return 'Invalid grade';
    }
}


function CalculateSemester(enrollmentDate, graduationDate){
    const enrollmentTimer = GradeConverter(enrollmentDate);
    const graduationTimer = GradeConverter(graduationDate);

    const graduationSemester = Number(graduationTimer.split("/")[0]);
    const graduationYear = Number(graduationTimer.split("/")[1]);

    const enrollmentSemester = Number(enrollmentTimer.split("/")[0]);
    const enrollmentYear = Number(enrollmentTimer.split("/")[1]);

    const timerFormula =  ((graduationYear - enrollmentYear)*2) + (graduationSemester - enrollmentSemester)

    return timerFormula;

}