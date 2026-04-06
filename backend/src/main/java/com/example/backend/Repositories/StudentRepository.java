package com.example.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long> {
    // example of creating your own find query, can get more complex and may need to use @Query + DTOs, but this is a simple example
    /*
        public Student findByFirstName(String firstName);
    */
} 