package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.DTO.ReleaseRequestDTO;
import com.gurukripa.apnakhata.DTO.ReleaseResponseDTO;
import com.gurukripa.apnakhata.Entity.*;
import com.gurukripa.apnakhata.Repository.*;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillReleaseService {

    @Autowired
    BillDraftRepository draftRepo;

    @Autowired
    AddressCapRepository capRepo;

    @Autowired
    BillRepository billRepo;

    @Autowired
    RawMaterialService rawMaterialService;

    @Autowired
    RecipeComponentRepository recipeComponentRepository;

    @Autowired
    ActivityService activityService;

    @Autowired
    RawMaterialRepository rawMaterialRepository;

    @Autowired
    AlertEmailService alertEmailService;

    @Transactional
    public ReleaseResponseDTO releaseBill(ReleaseRequestDTO req) {
        BillDraft draft = draftRepo.findById(req.getDraftId())
                .orElseThrow(() -> new RuntimeException("Draft not found"));

        if(draft.getStatus().equalsIgnoreCase("RELEASED")) {
            return null;
        }

        // fetch cap
        String addr = draft.getAccount().getCity();
        AddressCap cap = capRepo.findByAddress(addr)
                .orElseThrow(() -> new RuntimeException("No cap configured for address"));

        // calculate total draft qty
        int totalQty = draft.getLines().stream()
                .mapToInt(BillDraftLine::getQuantity).sum();

        double capRatio = cap.getMaxQuantity() / (double) totalQty;

        // create Bill
        Bill bill = new Bill();
        bill.setAccount(draft.getAccount());
        bill.setReleasedAt(LocalDateTime.now());

        // process lines with capping
        for (BillDraftLine dl : draft.getLines()) {
            int cappedQty ;
            // apply optional extra reduction
            if (req.getReductionPercentage() != null) {
                cappedQty = (int) Math.floor(dl.getQuantity() * (1 - req.getReductionPercentage() / 100));
            } else if( capRatio < 1){
                cappedQty = (int) Math.floor(dl.getQuantity() * capRatio);
            } else {
                cappedQty = dl.getQuantity();
            }

            BillLine bl = new BillLine();
            bl.setBill(bill);
            bl.setItemName(dl.getItemName());
            bl.setQuantity(cappedQty);
            bl.setUnitCost(dl.getUnitCost());
            bl.setLineTotal(cappedQty * dl.getUnitCost());
            bl.setDraftId(draft.getId());
            bill.getLines().add(bl);
        }

        Bill saved = billRepo.save(bill);

        draft.setStatus("RELEASED");
        draftRepo.save(draft);

        saved.getLines().forEach(line -> {
            List<RecipeComponent> comps = recipeComponentRepository.findAll().stream()
                    .filter(c -> c.getRecipe().getProductName().equals(line.getItemName()))
                    .toList();
            comps.forEach(c -> {
                int deductQty = c.getQuantityPerUnit() * line.getQuantity();
                rawMaterialService.adjustQuantity(c.getRawMaterial().getName(), -deductQty , 0);
            });
        });

        activityService.logActivity("bill" , "Bill Released" , "Bill Released for "+draft.getAccount().getName());
        checkLowQuantity();
        return new ReleaseResponseDTO(saved.getId(), "RELEASED");
    }

    public void checkLowQuantity() {
        rawMaterialRepository.findAll().stream()
                .filter(m -> m.getQuantityOnHand() <= m.getMinThreshold())
                .forEach(m -> {
                    try {
                        alertEmailService.sendLowStock("sachdevalove2@gmail.com",m.getName(),m.getQuantityOnHand(),m.getMinThreshold());
                    } catch (MessagingException e) {
                        throw new RuntimeException(e);
                    }
                } );
    }
}