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

    private boolean isMonday;
    private boolean isTuesday;
    private boolean isWednesDay;
    private boolean isThursday;
    private boolean isFriday;

    private String time;


    public ScheduleEntry() {
    }


    public ScheduleEntry(Schedule schedule, MountClass mountClass,
                         boolean isMonday, boolean isTuesday, boolean isWednesDay,
                         boolean isThursday, boolean isFriday, String time) {
        this.schedule = schedule;
        this.mountClass = mountClass;
        this.isMonday = isMonday;
        this.isTuesday = isTuesday;
        this.isWednesDay = isWednesDay;
        this.isThursday = isThursday;
        this.isFriday = isFriday;
        this.time = time;
    }


    public Long getEntry_id() {
        return entry_id;
    }

    public void setEntry_id(Long entry_id) {
        this.entry_id = entry_id;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public MountClass getMountClass() {
        return mountClass;
    }

    public void setMountClass(MountClass mountClass) {
        this.mountClass = mountClass;
    }

    public boolean isMonday() {
        return isMonday;
    }

    public void setMonday(boolean monday) {
        isMonday = monday;
    }

    public boolean isTuesday() {
        return isTuesday;
    }

    public void setTuesday(boolean tuesday) {
        isTuesday = tuesday;
    }

    public boolean isWednesDay() {
        return isWednesDay;
    }

    public void setWednesDay(boolean wednesDay) {
        isWednesDay = wednesDay;
    }

    public boolean isThursday() {
        return isThursday;
    }

    public void setThursday(boolean thursday) {
        isThursday = thursday;
    }

    public boolean isFriday() {
        return isFriday;
    }

    public void setFriday(boolean friday) {
        isFriday = friday;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

}
