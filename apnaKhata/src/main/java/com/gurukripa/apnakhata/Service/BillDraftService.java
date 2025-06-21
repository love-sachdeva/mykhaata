package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.DTO.*;
import com.gurukripa.apnakhata.Entity.*;
import com.gurukripa.apnakhata.Repository.AccountRepository;
import com.gurukripa.apnakhata.Repository.BillDraftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
@Service
public class BillDraftService {

    @Autowired
    BillDraftRepository draftRepo;

    @Autowired
    AccountRepository accountRepo;

    @Autowired
    ActivityService activityService;

    @Transactional
    public BillDraftResponseDTO createDraft(BillDraftRequestDTO req) {
        Account account = accountRepo.findById(req.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        BillDraft draft = new BillDraft();
        draft.setAccount(account);

        int lineNum = 1;
        for (BillLineRequestDTO lr : req.getLines()) {
            BillDraftLine line = new BillDraftLine();
            line.setBillDraft(draft);
            line.setId(new BillDraftLinePK());
            line.getId().setDraftId(draft.getId());
            line.getId().setLineNumber(lineNum++);
            line.setItemName(lr.getItemName());
            line.setQuantity(lr.getQuantity());
            line.setUnitCost(lr.getUnitCost());
            line.setLineTotal(lr.getQuantity() * lr.getUnitCost());
            draft.getLines().add(line);
        }

        BillDraft saved = draftRepo.save(draft);
        activityService.logActivity("bill" , "New Draft Created" , "Draft Created for "+account.getName());
        return new BillDraftResponseDTO(
                saved.getId(), saved.getAccount().getId(), saved.getStatus(),
                saved.getLines().stream()
                        .map(l -> new BillLineResponseDTO(l.getItemName(), l.getQuantity(),l.getUnitCost(),l.getBillDraft().getId(), l.getLineTotal()))
                        .collect(Collectors.toList())
        );
    }

    @Transactional(readOnly = true)
    public BillDraftResponseDTO getDraft(Long id) {
        BillDraft d = draftRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        return new BillDraftResponseDTO(
                d.getId(), d.getAccount().getId(), d.getStatus(),
                d.getLines().stream()
                        .map(l -> new BillLineResponseDTO(l.getItemName(), l.getQuantity(), l.getUnitCost(), l.getBillDraft().getId(),l.getLineTotal()))
                        .collect(Collectors.toList())
        );
    }

    @Transactional(readOnly = true)
    public List<BillDraftResponseDTO> getAllDraftBills() {
        List<BillDraft> billDrafts = draftRepo.findAll();
        return billDrafts.stream()
                .map(d -> new BillDraftResponseDTO(
                        d.getId(),
                        d.getAccount().getId(),
                        d.getStatus(),
                        d.getLines().stream()
                                .map(l -> new BillLineResponseDTO(
                                        l.getItemName(),
                                        l.getQuantity(),
                                        l.getUnitCost(),
                                        l.getBillDraft().getId(),
                                        l.getLineTotal()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public BillDraftResponseDTO updateDraft(BillDraftEditDTO req) {
        BillDraft draft = draftRepo.findById(req.getDraftId())
                .orElseThrow(() -> new RuntimeException("Draft not found"));

        if ("RELEASED".equalsIgnoreCase(draft.getStatus())) {
            return null;
        }

        // Map existing lines by itemName for quick lookup
        Map<String, BillDraftLine> existing = draft.getLines()
                .stream().collect(Collectors.toMap(BillDraftLine::getItemName, Function.identity()));

        int nextLineNumber = existing.size() + 1;

        for (BillLineRequestDTO dto : req.getLines()) {
            BillDraftLine line = existing.remove(dto.getItemName());
            if (line == null) {
                line = new BillDraftLine();
                BillDraftLinePK pk = new BillDraftLinePK(draft.getId(), nextLineNumber++);
                line.setId(pk);
                line.setBillDraft(draft);
                draft.getLines().add(line);
            }
            line.setItemName(dto.getItemName());
            line.setQuantity(dto.getQuantity());
            line.setUnitCost(dto.getUnitCost());
            line.setLineTotal(dto.getQuantity() * dto.getUnitCost());
        }

        // Any entries still in `existing` are “deleted” by orphanRemoval
        // Now just save the parent:
        draftRepo.save(draft);
        activityService.logActivity("bill" , "Draft Updated" , "Draft Updated for "+draft.getAccount().getName());
        return new BillDraftResponseDTO(
                draft.getId(), draft.getAccount().getId(), draft.getStatus(),
                draft.getLines().stream()
                        .map(l -> new BillLineResponseDTO(l.getItemName(), l.getQuantity(), l.getUnitCost(), l.getBillDraft().getId(),l.getLineTotal()))
                        .collect(Collectors.toList())
        );
    }

}