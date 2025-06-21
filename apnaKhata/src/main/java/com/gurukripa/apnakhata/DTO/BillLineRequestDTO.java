package com.gurukripa.apnakhata.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillLineRequestDTO {
    private String itemName;
    private Integer quantity;
    private Double unitCost;
}
