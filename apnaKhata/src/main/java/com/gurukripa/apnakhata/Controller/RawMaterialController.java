package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.DTO.RawMaterialAdjustDTO;
import com.gurukripa.apnakhata.DTO.RawMaterialRequestDTO;
import com.gurukripa.apnakhata.DTO.RawMaterialResponseDTO;
import com.gurukripa.apnakhata.Service.RawMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rawMaterial")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RawMaterialController {

    @Autowired
    RawMaterialService service;

    @PostMapping("/insert")
    public ResponseEntity<RawMaterialResponseDTO> upsert(@RequestBody RawMaterialRequestDTO req) {
        return ResponseEntity.ok(service.upsert(req));
    }

    @PostMapping("/adjust")
    public ResponseEntity<String> adjust(@RequestBody RawMaterialAdjustDTO req) {
        return ResponseEntity.ok(service.adjustQuantity(req.getName(),req.getQuantity(), req.getThreshold()));
    }

    @GetMapping("/list")
    public ResponseEntity<List<RawMaterialResponseDTO>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<RawMaterialResponseDTO>> getRawMaterial(@PathVariable Long id) {
        return ResponseEntity.ok(service.getRawMaterial(id));
    }
}