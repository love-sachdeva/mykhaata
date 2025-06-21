package com.gurukripa.apnakhata.Repository;

import com.gurukripa.apnakhata.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
