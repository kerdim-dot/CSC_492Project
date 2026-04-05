package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.MountClassEntry;
import com.example.backend.dtos.MountClassEntryDTO;

@Repository
public interface MountClassEntryRepository extends JpaRepository<MountClassEntry, Long> {

    @Query("SELECT new com.example.backend.dtos.MountClassEntryDTO(" +
        "m.entry_id, " +
        "m.mountClass.class_id, " +
        "m.meetingTime, " +
        "m.totalSeats,"+
        "m.professorName, " +
        "m.isMonday, " +
        "m.isTuesday, " +
        "m.isWednesday, " +
        "m.isThursday, " +
        "m.isFriday) " +
        "FROM MountClassEntry m")
    List<MountClassEntryDTO> findAllMountClassEntryDTOs();
} 