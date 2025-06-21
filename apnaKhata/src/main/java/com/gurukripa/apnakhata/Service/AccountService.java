package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.DTO.AccountRequestDTO;
import com.gurukripa.apnakhata.DTO.AccountResponseDTO;
import com.gurukripa.apnakhata.Entity.Account;
import com.gurukripa.apnakhata.Enums.AccountType;
import com.gurukripa.apnakhata.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    AccountRepository repo;

    @Autowired
    ActivityService activityService;

    @Transactional
    public AccountResponseDTO createAccount(AccountRequestDTO req) {
        Account account = new Account();
        account.setName(req.getName());
        account.setAddress(req.getAddress());
        account.setCity(req.getCity());
        account.setGstOrAadhaar(req.getGstOrAadhaar());
        account.setType(Enum.valueOf(AccountType.class, req.getType()));
        Account saved = repo.save(account);
        activityService.logActivity("accounts" , "New Account" , "Account Created for "+account.getName());
        return new AccountResponseDTO(saved.getId(), saved.getName(), saved.getAddress(), saved.getCity(), saved.getGstOrAadhaar(), saved.getType().name());
    }

    @Transactional(readOnly = true)
    public List<AccountResponseDTO> listAccounts() {
        return repo.findAll().stream()
                .map(a -> new AccountResponseDTO(a.getId(), a.getName(), a.getAddress(), a.getCity(), a.getGstOrAadhaar(), a.getType().name()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<AccountResponseDTO> getAccount(Long id) {
        return repo.findById(id)
                .map(a -> new AccountResponseDTO(a.getId(), a.getName(), a.getAddress(), a.getCity(), a.getGstOrAadhaar(), a.getType().name()));
    }

    @Transactional
    public Optional<AccountResponseDTO> getTransactions(Long id) {
        return repo.findById(id)
                .map(a -> new AccountResponseDTO(a.getId(), a.getName(), a.getAddress(), a.getCity(), a.getGstOrAadhaar(), a.getType().name()));
    }

}