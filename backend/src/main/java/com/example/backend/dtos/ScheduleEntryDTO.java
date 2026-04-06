package com.example.backend.dtos;

import com.example.backend.Entities.MountClass;
import com.example.backend.Entities.Schedule;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class ScheduleEntryDTO {

    private Long entry_id;


    private long schedule_id;

    private long mountClass_id;

    private boolean isMonday;
    private boolean isTuesday;
    private boolean isWednesDay;
    private boolean isThursday;
    private boolean isFriday;
    private String time;

    public ScheduleEntryDTO(long entry_id, long schedule_id, long mountClass_id, boolean isMonday, boolean isTuesday,
        boolean isWednesDay, boolean isThursday, boolean isFriday, String time
    ){
        this.entry_id = entry_id;
        this.schedule_id = schedule_id;
        this.mountClass_id = mountClass_id;
        this.isMonday = isMonday;
        this.isTuesday = isTuesday;
        this.isWednesDay = isWednesDay;
        this.isThursday = isThursday;
        this.isFriday = isFriday;
        this.time = time;
    }

    public ScheduleEntryDTO(){
        
    }

    public Long getEntry_id() {
        return entry_id;
    }

    public void setEntry_id(Long entry_id) {
        this.entry_id = entry_id;
    }

    public long getSchedule_id() {
        return schedule_id;
    }

    public void setSchedule_id(long schedule_id) {
        this.schedule_id = schedule_id;
    }

    public long getMountClass_id() {
        return mountClass_id;
    }

    public void setMountClass_id(long mountClass_id) {
        this.mountClass_id = mountClass_id;
    }

    public boolean isMonday() {
        return isMonday;
    }

    public void setMonday(boolean isMonday) {
        this.isMonday = isMonday;
    }

    public boolean isTuesday() {
        return isTuesday;
    }

    public void setTuesday(boolean isTuesday) {
        this.isTuesday = isTuesday;
    }

    public boolean isWednesDay() {
        return isWednesDay;
    }

    public void setWednesDay(boolean isWednesDay) {
        this.isWednesDay = isWednesDay;
    }

    public boolean isThursday() {
        return isThursday;
    }

    public void setThursday(boolean isThursday) {
        this.isThursday = isThursday;
    }

    public boolean isFriday() {
        return isFriday;
    }

    public void setFriday(boolean isFriday) {
        this.isFriday = isFriday;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
