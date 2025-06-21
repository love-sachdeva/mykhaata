package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.DTO.RecipeRequestDTO;
import com.gurukripa.apnakhata.DTO.RecipeResponseDTO;
import com.gurukripa.apnakhata.Service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/recipe")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RecipeController {

    @Autowired
    RecipeService service;

    @PostMapping("/create")
    public ResponseEntity<RecipeResponseDTO> create(@RequestBody RecipeRequestDTO req) {
        return ResponseEntity.ok(service.create(req));
    }

    @GetMapping("/list")
    public ResponseEntity<List<RecipeResponseDTO>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<RecipeResponseDTO>> getRecipe(@PathVariable Long id) {
        return ResponseEntity.ok(service.getRecipe(id));
    }
}
