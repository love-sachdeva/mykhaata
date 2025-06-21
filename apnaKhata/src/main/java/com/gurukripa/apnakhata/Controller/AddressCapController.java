package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.DTO.AddressCapRequestDTO;
import com.gurukripa.apnakhata.DTO.AddressCapResponseDTO;
import com.gurukripa.apnakhata.Entity.AddressCap;
import com.gurukripa.apnakhata.Service.AddressCapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("addressCap")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AddressCapController {

    @Autowired
    AddressCapService capService;

    @PostMapping("/insertCap")
    public ResponseEntity<AddressCapResponseDTO> upsert(@RequestBody AddressCapRequestDTO req) {
        return ResponseEntity.ok(capService.upsertCap(req));
    }

    @GetMapping("/listCaps")
    public ResponseEntity<List<AddressCapResponseDTO>> list() {
        return ResponseEntity.ok(capService.listCaps());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<AddressCap>> findById(@PathVariable String id) {
        return ResponseEntity.ok(capService.findById(id));
    }
}
