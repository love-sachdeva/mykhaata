package com.gurukripa.apnakhata.Repository;

import com.gurukripa.apnakhata.Entity.RawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {
    Optional<RawMaterial> findByName(String name);

    @Query("SELECT SUM(r.quantityOnHand) FROM RawMaterial r")
    Optional<Long> sumQuantityOnHand();

    List<RawMaterial> findByQuantityOnHandLessThan(int threshold);
}
