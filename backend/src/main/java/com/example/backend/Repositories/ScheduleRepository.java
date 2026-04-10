package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.Schedule;
import com.example.backend.dtos.ScheduleDTO;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long>{
    @Query("SELECT new com.example.backend.dtos.ScheduleDTO(s.scheduleId, s.student.student_id, s.scheduleStartDate, s.scheduleEndDate) " +
           "FROM Schedule s WHERE s.student.student_id = :studentId")
    List<ScheduleDTO> findSchedulesByStudentId(long studentId);
}
