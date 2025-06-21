package com.gurukripa.apnakhata.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDTO {
    private Long id;
    private String type;      // "stock" or "bill"
    private String title;
    private String subtitle;
    private String timeAgo;
}
