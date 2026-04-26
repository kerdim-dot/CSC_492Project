package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entities.Enrollment;
import com.example.backend.Entities.ImportantDate;
import com.example.backend.Repositories.EnrollmentRepository;
import com.example.backend.Repositories.ImportantDateRepository;

@Service
public class ImportantDateService {

    private final ImportantDateRepository importantDateRepository;

    public ImportantDateService(ImportantDateRepository importantDateRepository){
        this.importantDateRepository = importantDateRepository;
    }

    public void addImportantDate(ImportantDate importantDate){
        importantDateRepository.save(importantDate);
    }


    public List<ImportantDate> getAllImportantDates(){
        return importantDateRepository.findAll();
    }

    public void deleteImportantDate(Long id){
        Optional <ImportantDate> importantDateOptional = importantDateRepository.findById(id);
        if(importantDateOptional.isPresent()){
            importantDateRepository.delete(importantDateOptional.get());
        }
    }

    public void updateImportantDate(ImportantDate importantDate, long id) {
        ImportantDate currentImportantDate = importantDateRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Important date not found: " + id));

        currentImportantDate.setHeader(importantDate.getHeader());
        currentImportantDate.setDescription(importantDate.getDescription());
        currentImportantDate.setDateOfEvent(importantDate.getDateOfEvent());
        currentImportantDate.setTimeOfEvent(importantDate.getTimeOfEvent());

        importantDateRepository.save(currentImportantDate);
    }


}
