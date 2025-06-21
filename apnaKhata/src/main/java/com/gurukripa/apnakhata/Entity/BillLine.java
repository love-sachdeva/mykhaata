package com.gurukripa.apnakhata.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bill_lines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    private String itemName;
    private Integer quantity;
    private Double unitCost;
    private Double lineTotal;
    private Long draftId;
}
