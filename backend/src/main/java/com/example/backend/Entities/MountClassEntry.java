package com.example.backend.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class MountClassEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long entry_id;
    
    @ManyToOne
    @JoinColumn(name = "class_id")
    private MountClass mountClass;

    String meetingTime;

    int totalSeats;

    String professorName;

    boolean isMonday;

    boolean isTuesday;

    boolean isWednesday;

    boolean isThursday;

    boolean isFriday;

    public MountClassEntry() {
    }

    public MountClassEntry(MountClass mountClass, String meetingTime, int totalSeats, String professorName, boolean isMonday, boolean isTuesday, boolean isWednesday, boolean isThursday, boolean isFriday) {
        this.mountClass = mountClass;
        this.meetingTime = meetingTime;
        this.totalSeats = totalSeats;
        this.professorName = professorName;

        this.isMonday = isMonday;
        this.isTuesday = isTuesday;
        this.isWednesday = isWednesday;
        this.isThursday = isThursday;
        this.isFriday = isFriday;

    }

    public long getEntry_id() {
        return entry_id;
    }

    public void setEntry_id(long entry_id) {
        this.entry_id = entry_id;
    }

    public MountClass getMountClass() {
        return mountClass;
    }

    public void setMountClass(MountClass mountClass) {
        this.mountClass = mountClass;
    }

    public String getMeetingTime() {
        return meetingTime;
    }

    public void setMeetingTime(String meetingTime) {
        this.meetingTime = meetingTime;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public String getProfessorName() {
        return professorName;
    }

    public void setProfessorName(String professorName) {
        this.professorName = professorName;
    }


    public boolean getIsMonday() {
        return isMonday;
    }

    public void setIsMonday(boolean monday) {
        isMonday = monday;
    }

    public boolean getIsTuesday() {
        return isTuesday;
    }

    public void setIsTuesday(boolean tuesday) {
        isTuesday = tuesday;
    }

    public boolean getIsWednesday() {
        return isWednesday;
    }

    public void setIsWednesday(boolean wednesday) {
        isWednesday = wednesday;
    }

    public boolean getIsThursday() {
        return isThursday;
    }

    public void setIsThursday(boolean thursday) {
        isThursday = thursday;
    }

    public boolean getIsFriday() {
        return isFriday;
    }

    public void setIsFriday(boolean friday) {
        isFriday = friday;
    }

}
