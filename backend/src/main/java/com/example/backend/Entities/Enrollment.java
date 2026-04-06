package com.example.backend.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrollment_id;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private MountClass mountClass;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(nullable = false)
    private int status;


    public Enrollment(){

    }

    public Enrollment(MountClass mountClass, Student student, int status){
        this.mountClass = mountClass;
        this.student = student;
        this.status = status;
    }

    public Long getEnrollment_id() {
        return enrollment_id;
    }

    public void setEnrollment_id(Long enrollment_id) {
        this.enrollment_id = enrollment_id;
    }

    public MountClass getMountClass() {
        return mountClass;
    }

    public void setMountClass(MountClass mountClass) {
        this.mountClass = mountClass;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
