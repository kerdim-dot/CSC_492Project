package com.example.backend.Entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ImportantDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long important_date_id;

    @Column(nullable = false)
    private String header;

    private String description;

    @Column(nullable = false)
    private LocalDate dateOfEvent;

    @Column(nullable = false)
    private String timeOfEvent;


    public ImportantDate(String header,String description,LocalDate dateOfEvent,String timeOfEvent){
        this.header = header;
        this.description = description;
        this.dateOfEvent = dateOfEvent;
        this.timeOfEvent = timeOfEvent;
    }

    public ImportantDate(){

    }


    public Long get_important_date_id() {
        return important_date_id;
    }

    public void set_important_date_id(Long important_date_id) {
        this.important_date_id = important_date_id;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateOfEvent() {
        return dateOfEvent;
    }

    public void setDateOfEvent(LocalDate dateOfEvent) {
        this.dateOfEvent = dateOfEvent;
    }

    public String getTimeOfEvent() {
        return timeOfEvent;
    }

    public void setTimeOfEvent(String timeOfEvent) {
        this.timeOfEvent = timeOfEvent;
    }


}


