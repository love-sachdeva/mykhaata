package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.DTO.RecipeComponentResponseDTO;
import com.gurukripa.apnakhata.DTO.RecipeRequestDTO;
import com.gurukripa.apnakhata.DTO.RecipeResponseDTO;
import com.gurukripa.apnakhata.Entity.RawMaterial;
import com.gurukripa.apnakhata.Entity.Recipe;
import com.gurukripa.apnakhata.Entity.RecipeComponent;
import com.gurukripa.apnakhata.Repository.RawMaterialRepository;
import com.gurukripa.apnakhata.Repository.RecipeComponentRepository;
import com.gurukripa.apnakhata.Repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    @Autowired
    RecipeRepository recipeRepo;

    @Autowired
    RawMaterialRepository materialRepo;

    @Autowired
    RecipeComponentRepository componentRepo;

    @Autowired
    ActivityService activityService;

    @Transactional
    public RecipeResponseDTO create(RecipeRequestDTO req) {

        Recipe recipe = recipeRepo.findByProductName(req.getProductName());
        Recipe saved = new Recipe();
        if (recipe == null) {
            saved.setProductName(req.getProductName());
            saved = recipeRepo.save(saved);
        } else {
            saved = recipe;
        }
        Recipe finalSaved = saved;
        List<RecipeComponentResponseDTO> compRes = req.getComponents().stream().map(rc -> {
            RawMaterial rawMaterial = materialRepo.findByName(rc.getRawMaterialName())
                    .orElseThrow(() -> new RuntimeException("Material not found"));

            Optional<RecipeComponent> existingComponentOpt = componentRepo.findByRecipeAndRawMaterial(finalSaved, rawMaterial);

            RecipeComponent comp;
            if (existingComponentOpt.isPresent()) {
                // Update the quantity
                comp = existingComponentOpt.get();
                comp.setQuantityPerUnit(rc.getQuantityPerUnit());
            } else {
                // Create new component
                comp = new RecipeComponent();
                comp.setRecipe(finalSaved);
                comp.setRawMaterial(rawMaterial);
                comp.setQuantityPerUnit(rc.getQuantityPerUnit());
            }
            RecipeComponent savedComp = componentRepo.save(comp);
            return new RecipeComponentResponseDTO(
                    savedComp.getRawMaterial().getId(),
                    savedComp.getRawMaterial().getName(),
                    savedComp.getQuantityPerUnit()
            );
        }).collect(Collectors.toList());
        activityService.logActivity("recipe" , "Recipe Updated" , "Recipe Updated - "+saved.getProductName());
        return new RecipeResponseDTO(saved.getId(), saved.getProductName(), compRes);
    }

    @Transactional(readOnly = true)
    public List<RecipeResponseDTO> list() {
        return recipeRepo.findAll().stream().map(r -> {
            List<RecipeComponentResponseDTO> comps = componentRepo.findAll().stream()
                    .filter(c -> c.getRecipe().getId().equals(r.getId()))
                    .map(c -> new RecipeComponentResponseDTO(c.getRawMaterial().getId(),
                            c.getRawMaterial().getName(), c.getQuantityPerUnit()))
                    .collect(Collectors.toList());
            return new RecipeResponseDTO(r.getId(), r.getProductName(), comps);
        }).collect(Collectors.toList());
    }

    @Transactional
    public Optional<RecipeResponseDTO> getRecipe(Long id) {
        return recipeRepo.findById(id).map(r -> {
            List<RecipeComponentResponseDTO> comps = componentRepo.findAll().stream()
                    .filter(c -> c.getRecipe().getId().equals(r.getId()))
                    .map(c -> new RecipeComponentResponseDTO(c.getRawMaterial().getId(),
                            c.getRawMaterial().getName(), c.getQuantityPerUnit()))
                    .collect(Collectors.toList());
            return new RecipeResponseDTO(r.getId(), r.getProductName(), comps);
        });
    }
}