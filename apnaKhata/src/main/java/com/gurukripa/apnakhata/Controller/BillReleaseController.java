package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.DTO.BillLineResponseDTO;
import com.gurukripa.apnakhata.DTO.BillResponseDTO;
import com.gurukripa.apnakhata.DTO.ReleaseRequestDTO;
import com.gurukripa.apnakhata.DTO.ReleaseResponseDTO;
import com.gurukripa.apnakhata.Entity.Bill;
import com.gurukripa.apnakhata.Repository.BillRepository;
import com.gurukripa.apnakhata.Service.BillReleaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bills")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BillReleaseController {

    @Autowired
    BillReleaseService service;

    @Autowired
    BillRepository billRepository;

    @PostMapping("/release")
    public ResponseEntity<ReleaseResponseDTO> release(@RequestBody ReleaseRequestDTO req) {
        return ResponseEntity.ok(service.releaseBill(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponseDTO> getBill(@PathVariable Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        List<BillLineResponseDTO> lines = bill.getLines().stream()
                .map(l -> new BillLineResponseDTO(l.getItemName(), l.getQuantity(), l.getUnitCost(),l.getDraftId(), l.getLineTotal()))
                .collect(Collectors.toList());
        BillResponseDTO resp = new BillResponseDTO(bill.getId(), bill.getAccount().getId(), bill.getReleasedAt(), lines);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/list")
    public ResponseEntity<List<BillResponseDTO>> getAllBill() {
        List<Bill> bills = billRepository.findAll();
        List<BillResponseDTO> result = new ArrayList<>();
        for(Bill bill : bills ) {
            List<BillLineResponseDTO> lines = bill.getLines().stream()
                    .map(l -> new BillLineResponseDTO(l.getItemName(), l.getQuantity(), l.getUnitCost(),l.getDraftId(), l.getLineTotal()))
                    .collect(Collectors.toList());
            BillResponseDTO resp = new BillResponseDTO(bill.getId(), bill.getAccount().getId(), bill.getReleasedAt(), lines);
            result.add(resp);
        }
        return ResponseEntity.ok(result);
    }
}
