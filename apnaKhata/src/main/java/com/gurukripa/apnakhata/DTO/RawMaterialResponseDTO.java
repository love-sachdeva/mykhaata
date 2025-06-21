package com.gurukripa.apnakhata.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialResponseDTO {
    private Long id;
    private String name;
    private Integer quantityOnHand;
    private Integer minThreshold;
}
