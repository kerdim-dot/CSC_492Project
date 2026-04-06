package com.example.backend.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class PrerequisiteMapping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long mapping_id;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private MountClass mountClass;

    @ManyToOne
    @JoinColumn(name = "prerequisite_class_id")
    private MountClass mountClassPrerequisite;

    public PrerequisiteMapping(MountClass mountClass, MountClass mountClassPrerequisite){
        this.mountClass = mountClass;
        this.mountClassPrerequisite = mountClassPrerequisite;
    }


    public PrerequisiteMapping(){

    }

    public MountClass getMountClass() {
        return mountClass;
    }

    public void setMountClass(MountClass mountClassOne) {
        this.mountClass = mountClassOne;
    }

    public MountClass getMountClassPrerequisite() {
        return mountClassPrerequisite;
    }

    public void setMountClassPrerequisite(MountClass mountClassTwo) {
        this.mountClassPrerequisite = mountClassTwo;
    }



}
