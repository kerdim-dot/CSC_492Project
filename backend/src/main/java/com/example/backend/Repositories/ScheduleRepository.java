package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.Schedule;
import com.example.backend.Entities.ScheduleEntry;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long>{
    List<Schedule> findAllByStudent_StudentId(Long studentId);
}
