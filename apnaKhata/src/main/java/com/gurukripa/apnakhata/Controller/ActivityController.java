package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.DTO.ActivityDTO;
import com.gurukripa.apnakhata.Entity.Activity;
import com.gurukripa.apnakhata.Service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/activity")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ActivityController {

    @Autowired
    ActivityService activityService;

    @GetMapping("/list")
    public List<ActivityDTO> getActivities() {
        return activityService.getRecentActivities();
    }
}
