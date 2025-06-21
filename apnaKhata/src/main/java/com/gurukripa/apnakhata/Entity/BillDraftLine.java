package com.gurukripa.apnakhata.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "bill_draft_lines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillDraftLine {
    @EmbeddedId
    private BillDraftLinePK id;

    @ManyToOne
    @MapsId("draftId")
    private BillDraft billDraft;

    @Column(nullable = false)
    private String itemName;

    private Integer quantity;
    private Double unitCost;
    private Double lineTotal;
    // getters, setters
}

