package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.DTO.AddressCapRequestDTO;
import com.gurukripa.apnakhata.DTO.AddressCapResponseDTO;
import com.gurukripa.apnakhata.Entity.AddressCap;
import com.gurukripa.apnakhata.Repository.AddressCapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AddressCapService {

    @Autowired
    AddressCapRepository capRepo;

    @Autowired
    ActivityService activityService;

    @Transactional
    public AddressCapResponseDTO upsertCap(AddressCapRequestDTO req) {
        AddressCap cap = capRepo.findByAddress(req.getAddress())
                .orElseGet(AddressCap::new);
        cap.setAddress(req.getAddress());
        cap.setMaxQuantity(req.getMaxQuantity());
        AddressCap saved = capRepo.save(cap);
        activityService.logActivity("address" , "Address Cap updated" , "Address Cap updated for "+cap.getAddress()+" to "+cap.getMaxQuantity());
        return new AddressCapResponseDTO(saved.getId(), saved.getAddress(), saved.getMaxQuantity());
    }

    @Transactional(readOnly = true)
    public List<AddressCapResponseDTO> listCaps() {
        return capRepo.findAll().stream()
                .map(c -> new AddressCapResponseDTO(c.getId(), c.getAddress(), c.getMaxQuantity()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<AddressCap> findById(String address) {
        return capRepo.findByAddress(address);
    }
}
