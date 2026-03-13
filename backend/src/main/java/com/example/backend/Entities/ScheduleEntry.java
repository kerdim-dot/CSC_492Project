package com.example.backend.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ScheduleEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long entry_id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private MountClass mountClass;


}
