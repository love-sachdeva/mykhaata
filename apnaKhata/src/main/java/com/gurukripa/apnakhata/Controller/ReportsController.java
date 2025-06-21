package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.DTO.*;
import com.gurukripa.apnakhata.Service.AlertEmailService;
import com.gurukripa.apnakhata.Service.ReportsService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReportsController {

    @Autowired
    ReportsService service;

    @Autowired
    AlertEmailService alertEmailService;

    @GetMapping("/overview")
    public SalesOverviewDTO overview() {
        return service.getOverview();
    }

    @GetMapping("/trends/{period}")
    public SalesTrendDTO trends(@PathVariable String period) {
        return service.getTrend(period);
    }

    @GetMapping("/itemTrends/{period}")
    public ItemTrendDTO itemTrends(@PathVariable String period) {
        return service.getTopItemTrends(period);
    }

    @GetMapping("/inventory")
    public InventoryStatusDTO inventory() {
        return service.getInventoryStatus();
    }

    @GetMapping("/consumption/{period}")
    public ConsumptionDTO consumption(@PathVariable String period) {
        return service.getConsumption(period);
    }

    @GetMapping("/sendMail")
    public void sendMail() throws MessagingException {
        alertEmailService.sendLowStock("sachdevalove2@gmail.com","biscuit",5,1);
    }
}

