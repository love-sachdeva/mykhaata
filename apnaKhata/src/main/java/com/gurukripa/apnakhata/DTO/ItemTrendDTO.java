package com.gurukripa.apnakhata.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemTrendDTO {
    private List<String> labels;
    private List<ItemSeries> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemSeries {
        private String itemName;
        private List<Long> values;
    }
}
