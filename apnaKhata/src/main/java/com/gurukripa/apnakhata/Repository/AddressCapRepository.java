package com.gurukripa.apnakhata.Repository;

import com.gurukripa.apnakhata.Entity.AddressCap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressCapRepository extends JpaRepository<AddressCap, Long> {
    Optional<AddressCap> findByAddress(String address);
}
