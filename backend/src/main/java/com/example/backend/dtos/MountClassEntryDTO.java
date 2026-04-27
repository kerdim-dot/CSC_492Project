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

    public MountClassEntryDTO(long class_id, String meetingTime, int totalSeats, String professorName, boolean isMonday,
        boolean isTuesday, boolean isWednesDay, boolean isThursday, boolean isFriday
    ){
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

    public boolean getIsMonday() { return isMonday; }
    public void setIsMonday(boolean isMonday) { this.isMonday = isMonday; }

    public boolean getIsTuesday() { return isTuesday; }
    public void setIsTuesday(boolean isTuesday) { this.isTuesday = isTuesday; }

    public boolean getIsWednesday() { return isWednesday; }
    public void setIsWednesday(boolean isWednesday) { this.isWednesday = isWednesday; }

    public boolean getIsThursday() { return isThursday; }
    public void setIsThursday(boolean isThursday) { this.isThursday = isThursday; }

    public boolean getIsFriday() { return isFriday; }
    public void setIsFriday(boolean isFriday) { this.isFriday = isFriday; }

}
