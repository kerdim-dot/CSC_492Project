package com.example.backend.dtos;

import com.example.backend.Entities.MountClass;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class MountClassEntryDTO {
    

    private long entry_id;

    private long class_id;

    String meetingTime;

    int totalSeats;

    String professorName;

    boolean isMonday;

    boolean isTuesday;

    boolean isWednesday;

    boolean isThursday;

    boolean isFriday;

    public MountClassEntryDTO(long entry_id, long class_id, String meetingTime, int totalSeats, String professorName, boolean isMonday,
        boolean isTuesday, boolean isWednesDay, boolean isThursday, boolean isFriday
    ){
        this.entry_id = entry_id;
        this.class_id =class_id;
        this.meetingTime = meetingTime;
        this.totalSeats = totalSeats;
        this.professorName = professorName;
        this.isMonday = isMonday;
        this.isTuesday = isTuesday;
        this.isWednesday = isWednesDay;
        this.isThursday = isThursday;
        this.isFriday = isFriday;
    }

    public MountClassEntryDTO(){

    }

    public long getEntry_id() { return entry_id; }
    public void setEntry_id(long entry_id) { this.entry_id = entry_id; }

    public long getClass_id() { return class_id; }
    public void setClass_id(long class_id) { this.class_id = class_id; }

    public String getMeetingTime() { return meetingTime; }
    public void setMeetingTime(String meetingTime) { this.meetingTime = meetingTime; }

    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }

    public String getProfessorName() { return professorName; }
    public void setProfessorName(String professorName) { this.professorName = professorName; }

    public boolean isMonday() { return isMonday; }
    public void setMonday(boolean monday) { isMonday = monday; }

    public boolean isTuesday() { return isTuesday; }
    public void setTuesday(boolean tuesday) { isTuesday = tuesday; }

    public boolean isWednesday() { return isWednesday; }
    public void setWednesday(boolean wednesday) { isWednesday = wednesday; }

    public boolean isThursday() { return isThursday; }
    public void setThursday(boolean thursday) { isThursday = thursday; }

    public boolean isFriday() { return isFriday; }
    public void setFriday(boolean friday) { isFriday = friday; }

}
