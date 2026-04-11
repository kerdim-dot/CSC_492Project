package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestAttribute;

import com.example.backend.Entities.ScheduleEntry;
import com.example.backend.dtos.ScheduleEntryDTO;

@Repository
public interface ScheduleEntryRepository extends JpaRepository<ScheduleEntry, Long> {


    @Query("SELECT new com.example.backend.dtos.ScheduleEntryDTO(" +
           "se.entry_id, " +                 
           "se.schedule.scheduleId, " +      
           "se.mountClass.class_id, " +      
           "se.isMonday, " +                 
           "se.isTuesday, " +
           "se.isWednesDay, " +
           "se.isThursday, " +
           "se.isFriday, " +
           "se.time) " +                     
           "FROM ScheduleEntry se " +
           "WHERE se.schedule.scheduleId = :scheduleId")
    List<ScheduleEntryDTO> findAllScheduleEntryDTOs(@Param("scheduleId") Long scheduleId);



    @Modifying
    @Transactional
    @Query("DELETE FROM ScheduleEntry se WHERE se.schedule.scheduleId = :scheduleId")
    int deleteByScheduleId(@Param("scheduleId") Long scheduleId);

} 