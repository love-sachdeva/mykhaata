package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.DTO.RawMaterialRequestDTO;
import com.gurukripa.apnakhata.DTO.RawMaterialResponseDTO;
import com.gurukripa.apnakhata.Entity.RawMaterial;
import com.gurukripa.apnakhata.Repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RawMaterialService {
    @Autowired
    RawMaterialRepository repo;

    @Autowired
    ActivityService activityService;

    @Transactional
    public RawMaterialResponseDTO upsert(RawMaterialRequestDTO req) {
        RawMaterial mat = new RawMaterial();
        mat.setName(req.getName());
        mat.setQuantityOnHand(req.getQuantityOnHand());
        mat.setMinThreshold(req.getMinThreshold());
        RawMaterial saved = repo.save(mat);
        activityService.logActivity("stock" , "Raw Material Added" , "New Raw Material added - "+mat.getName());
        return new RawMaterialResponseDTO(saved.getId(), saved.getName(), saved.getQuantityOnHand(), saved.getMinThreshold());
    }

    @Transactional(readOnly = true)
    public List<RawMaterialResponseDTO> list() {
        return repo.findAll().stream()
                .map(m -> new RawMaterialResponseDTO(m.getId(), m.getName(), m.getQuantityOnHand(), m.getMinThreshold()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<RawMaterialResponseDTO> getRawMaterial(Long id) {
        return repo.findById(id)
                .map(m -> new RawMaterialResponseDTO(m.getId(), m.getName(), m.getQuantityOnHand(), m.getMinThreshold()));
    }

    @Transactional
    public String adjustQuantity(String name, int delta , int threshold) {
        RawMaterial mat = repo.findByName(name).orElseThrow(() -> new RuntimeException("Material not found"));
        mat.setQuantityOnHand(mat.getQuantityOnHand() + delta);
        if(threshold != 0) {
            mat.setMinThreshold(threshold);
        }
        repo.save(mat);
        activityService.logActivity("stock" , "Raw Material Updated" , "Raw Material Updated - "
                +mat.getName()+" to quantity "+mat.getQuantityOnHand()+" and threshold "+mat.getMinThreshold());
        return "Quantity of" + name + "added successfully . New quantity is " + mat.getQuantityOnHand() + delta ;
    }
}
