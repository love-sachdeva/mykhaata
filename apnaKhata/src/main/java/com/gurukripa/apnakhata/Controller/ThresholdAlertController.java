package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.Repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@Component
@RestController
@RequestMapping("/alert")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ThresholdAlertController {

    @Autowired
    RawMaterialRepository repo;

    // runs every hour
    //@Scheduled(cron = "0 0 * * * *")

    @GetMapping("/check")
    public void checkThresholds() {
        repo.findAll().stream()
                .filter(m -> m.getQuantityOnHand() <= m.getMinThreshold())
                .forEach(m -> System.out.println("ALERT: " + m.getName() + " below threshold."));
    }
}
