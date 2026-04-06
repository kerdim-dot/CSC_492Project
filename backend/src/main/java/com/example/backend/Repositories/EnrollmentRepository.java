package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.Enrollment;
import com.example.backend.dtos.EnrollmentDTO;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>{
    
     @Query("SELECT new com.example.backend.dtos.EnrollmentDTO(" +
           "e.id, e.mountClass.id, e.student.id, e.status) " +
           "FROM Enrollment e")
     List<EnrollmentDTO> findAllEnrollmentDTOs();
}
