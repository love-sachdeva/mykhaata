package com.gurukripa.apnakhata.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeComponentRequestDTO {
    private String rawMaterialName;
    private Integer quantityPerUnit;
}
