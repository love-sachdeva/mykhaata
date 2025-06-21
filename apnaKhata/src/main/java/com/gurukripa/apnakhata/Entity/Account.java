package com.gurukripa.apnakhata.Entity;

import com.gurukripa.apnakhata.Enums.AccountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String city;
    private String gstOrAadhaar;

    @Enumerated(EnumType.STRING)
    private AccountType type; // CREDITOR or DEBTOR

    // getters and setters
}