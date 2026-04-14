package com.example.backend.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Services.ScheduleEntryService;

@RestController
@RequestMapping("/schedule/entry")
public class ScheduleEntryController {
    private final ScheduleEntryService scheduleEntryService;

    public ScheduleEntryController(ScheduleEntryService scheduleEntryService){
        this.scheduleEntryService = scheduleEntryService;
    }
}
