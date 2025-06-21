package com.gurukripa.apnakhata.Repository;


import com.gurukripa.apnakhata.Entity.BillDraft;
import com.gurukripa.apnakhata.Entity.BillDraftLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillDraftLineRepository extends JpaRepository<BillDraftLine, Long> {
    BillDraftLine findByItemNameAndBillDraft(String itemName, BillDraft billDraft);
}
