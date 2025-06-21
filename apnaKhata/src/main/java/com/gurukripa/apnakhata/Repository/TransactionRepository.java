package com.gurukripa.apnakhata.Repository;

import com.gurukripa.apnakhata.Entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transactions, Long> {
    // find all transactions for an account, newest first
    List<Transactions> findByAccountIdOrderByTimestampDesc(Long accountId);
}
