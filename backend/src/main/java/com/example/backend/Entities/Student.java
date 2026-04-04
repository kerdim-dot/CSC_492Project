package com.example.backend.Entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long student_id;

    @Column(nullable = false)
    private String first_name;
    
    @Column(nullable = false)
    private String last_name;

    @Column(nullable = false)
    private LocalDate graduation_date;

    @Column(nullable = false)
    private Boolean is_major;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <Schedule> schedules = new ArrayList<>();

    // @ManyToMany
    // @JoinTable( name = "enrollment", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "class_id"))
    // private List <MountClass> mountClasses;


    public Student(){

    }

    public Student(String firstName, String lastName,LocalDate graduationDate, Boolean isMajor){
        this.first_name = firstName;
        this.last_name = lastName;
        this.graduation_date = graduationDate;
        this.is_major = isMajor;
    }

    public Long getStudentId(){
        return student_id;
    }
    public String getFirstName(){
        return first_name;
    }

    public String getLastName(){
        return last_name;
    }

    public LocalDate getGraduationDate(){
        return graduation_date;
    }

    public Boolean getIsMajor(){
        return is_major;
    }

    public void setFirstName(String firstName){
        this.first_name = firstName;
    }

    public void setLastName(String lastName){
        this.last_name = lastName;
    }

    public void setGraduationDate(LocalDate date){
        this.graduation_date = date;
    }

    public void setIsMajor(Boolean isMajor){
        this.is_major = isMajor;
    }
}   
