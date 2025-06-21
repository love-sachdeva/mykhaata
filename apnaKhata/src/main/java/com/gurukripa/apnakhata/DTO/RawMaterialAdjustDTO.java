package com.gurukripa.apnakhata.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialAdjustDTO {
    String name ;
    int quantity;
    int threshold;
}