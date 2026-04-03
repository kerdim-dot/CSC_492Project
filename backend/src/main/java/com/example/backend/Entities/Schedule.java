package com.example.backend.Entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long schedule_id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(nullable = false)
    private LocalDate scheduleStartDate;

    public Schedule(){
        
    }

    public Schedule(Student student, LocalDate scheduleStartDate){
        this.student = student;
        this.scheduleStartDate = scheduleStartDate;
    }

    public Student getStudent(){
        return student;
    }

    public LocalDate getScheduleStartDate(){
        return scheduleStartDate;
    }


    public void setStudent(Student student){
        this.student = student;
    }

    public void setScheduleStartDate(LocalDate scheduleStartDate){
        this.scheduleStartDate = scheduleStartDate;
    }

}
