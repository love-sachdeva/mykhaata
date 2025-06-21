package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.DTO.BillDraftEditDTO;
import com.gurukripa.apnakhata.DTO.BillDraftRequestDTO;
import com.gurukripa.apnakhata.DTO.BillDraftResponseDTO;
import com.gurukripa.apnakhata.Service.BillDraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/draftBill")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BillDraftController {

    private final BillDraftService service;

    public BillDraftController(BillDraftService service) { this.service = service; }

    @PostMapping("/create")
    public ResponseEntity<BillDraftResponseDTO> create(@RequestBody BillDraftRequestDTO req) {
        return ResponseEntity.ok(service.createDraft(req));
    }

    @PostMapping("/update")
    public ResponseEntity<BillDraftResponseDTO> update(@RequestBody BillDraftEditDTO req) {
        return ResponseEntity.ok(service.updateDraft(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDraftResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDraft(id));
    }

    @GetMapping("/list")
    public ResponseEntity<List<BillDraftResponseDTO>> getAllDraftBills() {
        List<BillDraftResponseDTO> draftBills = service.getAllDraftBills();
        return new ResponseEntity<>(draftBills, HttpStatus.OK);
    }
}
