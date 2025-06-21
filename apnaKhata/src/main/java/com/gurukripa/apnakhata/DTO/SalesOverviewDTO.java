package com.gurukripa.apnakhata.DTO;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesOverviewDTO {
    double totalSales;
    double avgOrderValue;
    long totalItemsSold;
    double pctSalesChange;
    double pctAOVChange;
    double pctItemsChange;
    List<TopItem> topItems;

    @Value
    public static class TopItem {
        Long productId;
        String itemName;
        long unitsSold;
    }
}
