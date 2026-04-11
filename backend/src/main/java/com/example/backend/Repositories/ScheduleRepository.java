package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.Entities.Schedule;
import com.example.backend.dtos.ScheduleDTO;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long>{
    @Query("SELECT new com.example.backend.dtos.ScheduleDTO(s.scheduleId, s.student.student_id, s.scheduleStartDate, s.scheduleEndDate) " +
           "FROM Schedule s WHERE s.student.student_id = :studentId")
    List<ScheduleDTO> findSchedulesByStudentId(long studentId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Schedule s WHERE s.student.student_id = :studentId")
    int deleteByStudentId(@Param("studentId") Long studentId);

}
