package com.example.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.PrerequisiteMapping;
import com.example.backend.dtos.EnrollmentDTO;
import com.example.backend.dtos.PrerequisiteDTO;

@Repository
public interface PrerequisiteMappingRepository extends JpaRepository<PrerequisiteMapping, Long>{

    @Query("SELECT new com.example.backend.dtos.PrerequisiteDTO(" +
           "p.mapping_id, p.mountClass.id, p.mountClassPrerequisite.id) " +
           "FROM PrerequisiteMapping p")
           
    List<PrerequisiteDTO> findAllPrerequisiteDTOs();

} 