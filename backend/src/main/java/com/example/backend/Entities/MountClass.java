package com.example.backend.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class MountClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long class_id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false, unique = true)
    private String header;
    @Column(nullable = false)
    private Integer credits;
    @Column(nullable = false)
    private String description; 

    @OneToMany(mappedBy = "mountClass", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "mountClass", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <ScheduleEntry> scheduleEntries = new ArrayList<>();

    @OneToMany(mappedBy = "mountClass", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <MountClassEntry> mountClassEntries = new ArrayList<>();

    @OneToMany(mappedBy = "mountClass", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrerequisiteMapping> preReqMappings = new ArrayList<>();


    // @ManyToMany
    // private List <Student> students;

    public MountClass() {
    }

    public MountClass(String title, String header, Integer credits, String description) {
        this.title = title;
        this.header = header;
        this.credits = credits;
        this.description = description;
    }

    public Long getClass_id() {
        return class_id;
    }

    public void setClass_id(Long class_id) {
        this.class_id = class_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public String getDescription() {
        return description;
    }

    public void  setDescription(String description) {
        this.description = description;
    }



}
