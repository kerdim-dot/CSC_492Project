package com.example.backend.dtos;

import java.time.LocalDate;

import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Student;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class EnrollmentDTO {

    private long enrollment_id;
    private long mountClass_id;
    private long student_id;
    private int status;
    private String grade;
    private LocalDate enrollment_date;

    // this is used to fetch all possible enrollments
    // all enrollments for a certain student
    // all enrollments for a certain class
    
    public EnrollmentDTO(long enrollment_id, long mountClass_id, long student_id, int status, String grade, LocalDate enrollment_date){
        this.enrollment_id = enrollment_id;
        this.mountClass_id = mountClass_id;
        this.student_id = student_id;
        this.status = status;
        this.grade = grade;
        this.enrollment_date = enrollment_date;
    } 

    // this is used to add enrollments
    public EnrollmentDTO(long mountClass_id, long student_id, int status, String grade, LocalDate enrollment_date){
        this.mountClass_id = mountClass_id;
        this.student_id = student_id;
        this.status = status;
        this.grade  = grade;
        this.enrollment_date = enrollment_date;
    } 

    public EnrollmentDTO(){
        
    }
    
    public long getEnrollment_id() {
        return enrollment_id;
    }

    public void setEnrollment_id(long enrollment_id) {
        this.enrollment_id = enrollment_id;
    }

    public long getMountClass_id() {
        return mountClass_id;
    }

    public void setMountClass_id(long mountClass_id) {
        this.mountClass_id = mountClass_id;
    }

    public long getStudent_id() {
        return student_id;
    }

    public void setStudent_id(long student_id) {
        this.student_id = student_id;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public LocalDate getEnrollment_date() {
        return enrollment_date;
    }

    public void setEnrollment_date(LocalDate enrollment_date) {
        this.enrollment_date = enrollment_date;
    }
}
