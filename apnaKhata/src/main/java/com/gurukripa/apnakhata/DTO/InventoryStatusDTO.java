package com.gurukripa.apnakhata.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryStatusDTO {
    private long               totalItemsSold;
    private long               lowStockItems;
    private long               outOfStockItems;
    private List<String> lowStockNames;
    private List<String>       outOfStockNames;
}