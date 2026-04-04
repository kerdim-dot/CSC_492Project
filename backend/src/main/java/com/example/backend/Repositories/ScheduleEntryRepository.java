package com.example.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.ScheduleEntry;

@Repository
public interface ScheduleEntryRepository extends JpaRepository<ScheduleEntry, Long> {

} 