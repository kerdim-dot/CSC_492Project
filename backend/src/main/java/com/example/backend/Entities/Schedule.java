package com.example.backend.Entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
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
    @Column(name = "schedule_id")  // maps to the DB column
    private Long scheduleId;         // use camelCase in Java

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(nullable = false)
    private LocalDate scheduleStartDate;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScheduleEntry> scheduleEntries = new ArrayList<>();

    public Schedule() {}

    public Schedule(Student student, LocalDate scheduleStartDate){
        this.student = student;
        this.scheduleStartDate = scheduleStartDate;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public Student getStudent() {
        return student;
    }

    public LocalDate getScheduleStartDate() {
        return scheduleStartDate;
    }

    public List<ScheduleEntry> getScheduleEntries() {
        return scheduleEntries;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setScheduleStartDate(LocalDate scheduleStartDate) {
        this.scheduleStartDate = scheduleStartDate;
    }
}