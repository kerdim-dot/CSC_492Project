package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.Entities.Enrollment;
import com.example.backend.dtos.EnrollmentDTO;


@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>{
    
      @Query("SELECT new com.example.backend.dtos.EnrollmentDTO(" +
            "e.id, e.mountClass.id, e.student.id, e.status) " +
            "FROM Enrollment e")
      List<EnrollmentDTO> findAllEnrollmentDTOs();


      @Query("SELECT new com.example.backend.dtos.EnrollmentDTO(" +
            "e.id, e.mountClass.id, e.student.id, e.status) " +
            "FROM Enrollment e where e.student.id = :studentId")
      List<EnrollmentDTO> findEnrollmentPerStudentDTOs(@Param("studentId") Long studentId);

      @Query("SELECT new com.example.backend.dtos.EnrollmentDTO(" +
            "e.id, e.mountClass.id, e.student.id, e.status) " +
            "FROM Enrollment e where e.mountClass.id = :classId")
      List<EnrollmentDTO> findEnrollmentPerClassDTOs(@Param("classId") Long classId);

      @Modifying
      @Transactional
      @Query("DELETE FROM Enrollment e WHERE e.student.id = :studentId")
      int deleteByStudentId(@Param("studentId") Long studentId);

      @Modifying
      @Transactional
      @Query("DELETE FROM Enrollment e WHERE e.mountClass.id = :classId")
      int deleteByClassId(@Param("classId") Long classId);

}
