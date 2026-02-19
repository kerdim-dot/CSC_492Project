package com.example.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long> {

} 