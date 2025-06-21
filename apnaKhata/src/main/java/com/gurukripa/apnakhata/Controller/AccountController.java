package com.gurukripa.apnakhata.Controller;

import com.gurukripa.apnakhata.DTO.AccountRequestDTO;
import com.gurukripa.apnakhata.DTO.AccountResponseDTO;
import com.gurukripa.apnakhata.DTO.TransactionDTO;
import com.gurukripa.apnakhata.Entity.Transactions;
import com.gurukripa.apnakhata.Repository.TransactionRepository;
import com.gurukripa.apnakhata.Service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/accounts")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AccountController {
    private final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM d, yyyy, hh:mm a");

    @Autowired
    AccountService service;

    @Autowired
    TransactionRepository transactionRepository;

    @PostMapping("/create")
    public ResponseEntity<AccountResponseDTO> create(@RequestBody AccountRequestDTO req) {
        return ResponseEntity.ok(service.createAccount(req));
    }

    @GetMapping("/list")
    public ResponseEntity<List<AccountResponseDTO>> list() {
        return ResponseEntity.ok(service.listAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<AccountResponseDTO>> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAccount(id));
    }

    @GetMapping("/transactions/{id}")
    public List<TransactionDTO> getAccountTransactions(@PathVariable("id") Long accountId) {
        List<Transactions> txns = transactionRepository.findByAccountIdOrderByTimestampDesc(accountId);
        return txns.stream().map(tx -> new TransactionDTO(
                tx.getId(),
                tx.getTitle(),
                tx.getTimestamp().format(fmt),
                tx.getAmount()
        )).collect(Collectors.toList());
    }
}
