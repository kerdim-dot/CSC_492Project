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
    private Boolean is_computer_science_major;

    @Column(nullable = false)
    private Boolean is_computer_science_minor;
    
    @Column(nullable = false)
    private Boolean is_multi_platform_major;
    
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <Schedule> schedules = new ArrayList<>();

    // @ManyToMany
    // @JoinTable( name = "enrollment", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "class_id"))
    // private List <MountClass> mountClasses;


    public Student(){

    }

    public Student(String firstName, String lastName,LocalDate graduationDate, Boolean isComputerScienceMajor,Boolean isComputerScienceMinor,Boolean isMultiPlatformMajor){
        this.first_name = firstName;
        this.last_name = lastName;
        this.graduation_date = graduationDate;
        this.is_computer_science_major = isComputerScienceMajor;
        this.is_computer_science_minor = isComputerScienceMinor;
        this.is_multi_platform_major = isMultiPlatformMajor;
    }

    public Long getStudent_id(){
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

    public Boolean getIsComputerScienceMajor(){
        return is_computer_science_major;
    }

    public Boolean getIsComputerScienceMinor(){
        return is_computer_science_minor;
    }
    public Boolean getIsMultiPlatformMajor(){
        return is_multi_platform_major;
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

    public void setIsComputerScienceMajor(Boolean isComputerScienceMajor){
        this.is_computer_science_major = isComputerScienceMajor;
    }

    public void setIsComputerScienceMinor(Boolean isComputerScienceMinor){
        this.is_computer_science_minor = isComputerScienceMinor;
    }

    public void setIsOtherMajor(Boolean isMultiPlatformMajor){
        this.is_multi_platform_major = isMultiPlatformMajor;
    } 


}   
