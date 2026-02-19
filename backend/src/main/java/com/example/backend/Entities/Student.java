package com.example.backend.Entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long student_id;
    private String first_name;
    private String last_name;

    @ManyToMany
    @JoinTable( name = "enrollment", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "class_id"))
    private List <MountClass> mountClasses;


    public Student(){

    }

    public Student(String firstName, String lastName){
        this.first_name = firstName;
        this.last_name = lastName;
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

    public void setFirstName(String firstName){
        this.first_name = firstName;
    }

    public void setLastName(String lastName){
        this.last_name = lastName;
    }
}   
