package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.Customer;
import dev.ip.projekt.model.entity_new.CustomerAccount;
import dev.ip.projekt.model.entity_new.Reservation;
import dev.ip.projekt.repository.CustomerRepository;
import dev.ip.projekt.repository.CustomerAccountRepository;
import dev.ip.projekt.repository.ReservationRepository;
import dev.ip.projekt.security.AdminRoleAnnotations.WorkerAccess;
import dev.ip.projekt.security.AdminRoleAnnotations.ManagerAccess;
import dev.ip.projekt.security.AdminRoleAnnotations.AdminAccess;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    /**
     * List all customers with pagination
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> listCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "lastName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Customer> customersPage = customerRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("customers", customersPage.getContent());
        response.put("currentPage", customersPage.getNumber());
        response.put("totalItems", customersPage.getTotalElements());
        response.put("totalPages", customersPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get single customer details
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/{id}")
    @WorkerAccess
    public ResponseEntity<?> getCustomer(@PathVariable String id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("customer", customer.get());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Edit customer
     * Access: MANAGER, ADMIN
     */
    @PutMapping("/edit/{id}")
    @ManagerAccess
    public ResponseEntity<?> editCustomer(@PathVariable String id, @RequestBody Customer customerData) {
        Optional<Customer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Customer customer = existingCustomer.get();
        
        // Update fields if provided
        if (customerData.getFirstName() != null) customer.setFirstName(customerData.getFirstName());
        if (customerData.getLastName() != null) customer.setLastName(customerData.getLastName());
        if (customerData.getGender() != null) customer.setGender(customerData.getGender());
        if (customerData.getAge() != null) customer.setAge(customerData.getAge());
        if (customerData.getNationality() != null) customer.setNationality(customerData.getNationality());
        if (customerData.getPhone() != null) customer.setPhone(customerData.getPhone());
        if (customerData.getBirthDate() != null) customer.setBirthDate(customerData.getBirthDate());
        if (customerData.getDocumentNumber() != null) customer.setDocumentNumber(customerData.getDocumentNumber());
        if (customerData.getLoyaltyStatus() != null) customer.setLoyaltyStatus(customerData.getLoyaltyStatus());
        
        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.ok(Map.of(
            "message", "Customer updated successfully",
            "customer", savedCustomer
        ));
    }

    /**
     * Delete customer permanently
     * Access: ADMIN only
     */
    @DeleteMapping("/delete/{id}")
    @AdminAccess
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        customerRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Customer deleted successfully",
            "deletedId", id
        ));
    }

    // ============== Customer Accounts Management ==============

    /**
     * List all customer accounts with pagination
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/accounts")
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> listAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "email") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<CustomerAccount> accountsPage = customerAccountRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("accounts", accountsPage.getContent());
        response.put("currentPage", accountsPage.getNumber());
        response.put("totalItems", accountsPage.getTotalElements());
        response.put("totalPages", accountsPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get customer account by ID
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/accounts/{id}")
    @WorkerAccess
    public ResponseEntity<?> getAccount(@PathVariable String id) {
        Optional<CustomerAccount> account = customerAccountRepository.findById(id);
        if (account.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("account", account.get());
        
        // Get account's reservations
        List<Reservation> reservations = reservationRepository.findByAccountIdOrderByCreationDateDesc(id);
        response.put("reservations", reservations);
        response.put("reservationCount", reservations.size());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Search account by email
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/accounts/search")
    @WorkerAccess
    public ResponseEntity<?> searchAccountByEmail(@RequestParam String email) {
        Optional<CustomerAccount> account = customerAccountRepository.findByEmail(email);
        if (account.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("account", account.get());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Edit customer account
     * Access: MANAGER, ADMIN
     */
    @PutMapping("/accounts/edit/{id}")
    @ManagerAccess
    public ResponseEntity<?> editAccount(@PathVariable String id, @RequestBody CustomerAccount accountData) {
        Optional<CustomerAccount> existingAccount = customerAccountRepository.findById(id);
        if (existingAccount.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        CustomerAccount account = existingAccount.get();
        
        // Update fields if provided (don't update password hash directly)
        if (accountData.getEmail() != null) account.setEmail(accountData.getEmail());
        if (accountData.getLogin() != null) account.setLogin(accountData.getLogin());
        if (accountData.getConsents() != null) account.setConsents(accountData.getConsents());
        if (accountData.getPreferences() != null) account.setPreferences(accountData.getPreferences());
        
        CustomerAccount savedAccount = customerAccountRepository.save(account);
        return ResponseEntity.ok(Map.of(
            "message", "Customer account updated successfully",
            "account", savedAccount
        ));
    }

    /**
     * Delete customer account permanently
     * Access: ADMIN only
     */
    @DeleteMapping("/accounts/delete/{id}")
    @AdminAccess
    public ResponseEntity<?> deleteAccount(@PathVariable String id) {
        if (!customerAccountRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Note: This should cascade delete reservations in production
        // or check for existing reservations first
        customerAccountRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Customer account deleted successfully",
            "deletedId", id
        ));
    }

    /**
     * Get customer statistics
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/stats")
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> getCustomerStats() {
        long totalCustomers = customerRepository.count();
        long totalAccounts = customerAccountRepository.count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalAccounts", totalAccounts);
        
        return ResponseEntity.ok(stats);
    }
}
