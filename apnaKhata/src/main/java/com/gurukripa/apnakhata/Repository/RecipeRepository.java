package com.gurukripa.apnakhata.Repository;

import com.gurukripa.apnakhata.Entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Recipe findByProductName(String name);
}