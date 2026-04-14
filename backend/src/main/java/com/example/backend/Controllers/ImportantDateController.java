package com.example.backend.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Services.ImportantDateService;

@RestController
@RequestMapping("/important/date")
public class ImportantDateController {
    private final ImportantDateService importantDateService;

    public ImportantDateController(ImportantDateService importantDateService){
        this.importantDateService = importantDateService;
    }
}
