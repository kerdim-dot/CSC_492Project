package com.example.backend.dtos;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.backend.Entities.ScheduleEntry;
import com.example.backend.Entities.Student;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

public class ScheduleDTO {
    //  @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // @Column(name = "schedule_id")  // maps to the DB column
    // private Long scheduleId;         // use camelCase in Java

    // @ManyToOne
    // @JoinColumn(name = "student_id")
    // private Student student;

    // @Column(nullable = false)
    // private LocalDate scheduleStartDate;

    // @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<ScheduleEntry> scheduleEntries = new ArrayList<>();

    private long schedule_id;
    private long student_id;
    private LocalDate scheduleStartDate;
    private LocalDate scheduleEndDate;

    // this to get a schedule
    public ScheduleDTO(long schedule_id, long student_id, LocalDate scheduleStartDate, LocalDate scheduleEndDate){
        this.schedule_id = schedule_id;
        this.student_id = student_id;
        this.scheduleStartDate = scheduleStartDate;
        this.scheduleEndDate = scheduleEndDate;
    }

    // this to add a schedule
    public ScheduleDTO(long student_id, LocalDate scheduleStartDate, LocalDate scheduleEndDate){
        this.student_id = student_id;
        this.scheduleStartDate = scheduleStartDate;
        this.scheduleEndDate = scheduleEndDate;
    }

    public ScheduleDTO(){
        
    }

    public long getSchedule_id() {
        return schedule_id;
    }

    public void setSchedule_id(long schedule_id) {
        this.schedule_id = schedule_id;
    }

    public long getStudent_id() {
        return student_id;
    }

    public void setStudent_id(long student_id) {
        this.student_id = student_id;
    }

    public LocalDate getScheduleStartDate() {
        return scheduleStartDate;
    }

    public void setScheduleStartDate(LocalDate scheduleStartDate) {
        this.scheduleStartDate = scheduleStartDate;
    }


    public LocalDate getScheduleEndDate() {
        return scheduleEndDate;
    }

    public void setScheduleEndDate(LocalDate scheduleEndDate) {
        this.scheduleEndDate = scheduleEndDate;
    }

}
