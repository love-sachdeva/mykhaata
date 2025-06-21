package com.gurukripa.apnakhata.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReleaseRequestDTO {
    private Long draftId;
    private Double reductionPercentage; // optional extra reduction
}
