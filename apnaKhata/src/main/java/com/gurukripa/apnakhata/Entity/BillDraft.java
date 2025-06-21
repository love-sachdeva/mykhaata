package com.gurukripa.apnakhata.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bill_drafts")
public class BillDraft {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    private LocalDateTime createdAt = LocalDateTime.now();
    private String status = "DRAFT";

    @OneToMany(mappedBy = "billDraft", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillDraftLine> lines = new ArrayList<>();

    // getters, setters, helper to addLine
}
