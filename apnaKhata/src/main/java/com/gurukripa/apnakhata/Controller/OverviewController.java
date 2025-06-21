package com.gurukripa.apnakhata.Controller;


import com.gurukripa.apnakhata.DTO.OverviewDTO;
import com.gurukripa.apnakhata.Repository.BillRepository;
import com.gurukripa.apnakhata.Repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/overview")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class OverviewController {

    @Autowired
    RawMaterialRepository rawRepo;

    @Autowired
    BillRepository billRepo;

    @GetMapping("/list")
    public OverviewDTO getOverview() {
        // Sum of all raw material quantities as a proxy for "stock value"
        long totalQty = rawRepo.sumQuantityOnHand().orElse(0L);
        long billsCount = billRepo.count();
        return new OverviewDTO(totalQty, billsCount);
    }
}
