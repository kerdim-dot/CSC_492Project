package com.example.backend.dtos;

public class PrerequisiteDTO {

    long mapping_id;

    long class_id;

    long prerequisite_class_id;


    public PrerequisiteDTO(long mapping_id, long class_id, long prerequisite_class_id){
        this.mapping_id = mapping_id;
        this.class_id = class_id;
        this.prerequisite_class_id = prerequisite_class_id;
    }

    public PrerequisiteDTO(){

    }

    public long getMapping_id() {
        return mapping_id;
    }

    public void setMapping_id(long mapping_id) {
        this.mapping_id = mapping_id;
    }

    public long getClass_id() {
        return class_id;
    }

    public void setClass_id(long class_id) {
        this.class_id = class_id;
    }

    public long getPrerequisite_class_id() {
        return prerequisite_class_id;
    }

    public void setPrerequisite_class_id(long prerequisite_class_id) {
        this.prerequisite_class_id = prerequisite_class_id;
    }

}
