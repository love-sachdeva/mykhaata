package com.gurukripa.apnakhata.Repository;

import com.gurukripa.apnakhata.Entity.RawMaterial;
import com.gurukripa.apnakhata.Entity.Recipe;
import com.gurukripa.apnakhata.Entity.RecipeComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecipeComponentRepository extends JpaRepository<RecipeComponent, Long> {
    Optional<RecipeComponent> findByRecipeAndRawMaterial(Recipe recipe, RawMaterial rawMaterial);
}
