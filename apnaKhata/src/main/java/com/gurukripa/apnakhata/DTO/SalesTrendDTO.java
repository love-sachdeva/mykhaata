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
public class SalesTrendDTO {
    String       period;
    List<String> labels;
    List<Double> series;
    double currentTotal;
    double pctChange;

    public SalesTrendDTO(String period, List<String> labels, List<Double> values, double pct) {
        this.period = period;
        this.labels = labels;
        this.series = values;
        this.pctChange = pct;
    }
}
