package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.AdminAccount;
import dev.ip.projekt.model.entity_new.AdminRole;
import dev.ip.projekt.repository.AdminAccountRepository;
import dev.ip.projekt.security.AdminRoleAnnotations.AdminAccess;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller for managing admin accounts.
 * Only accessible by ADMIN role.
 */
@RestController
@RequestMapping("/api/admin/admins")
public class AdminAccountController {

    @Autowired
    private AdminAccountRepository adminAccountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * List all admin accounts with pagination
     * Access: ADMIN only
     */
    @GetMapping
    @AdminAccess
    public ResponseEntity<Map<String, Object>> listAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "adminId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<AdminAccount> adminsPage = adminAccountRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("adminAccounts", adminsPage.getContent());
        response.put("currentPage", adminsPage.getNumber());
        response.put("totalItems", adminsPage.getTotalElements());
        response.put("totalPages", adminsPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get single admin account details
     * Access: ADMIN only
     */
    @GetMapping("/{id}")
    @AdminAccess
    public ResponseEntity<?> getAdmin(@PathVariable Long id) {
        Optional<AdminAccount> admin = adminAccountRepository.findById(id);
        if (admin.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(admin.get());
    }

    /**
     * Create new admin account
     * Access: ADMIN only
     */
    @PostMapping("/add")
    @AdminAccess
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, Object> data) {
        String email = (String) data.get("email");
        String password = (String) data.get("password");
        String firstName = (String) data.get("firstName");
        String lastName = (String) data.get("lastName");
        String roleStr = (String) data.get("role");

        // Validate required fields
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        // Check if email already exists
        if (adminAccountRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        AdminAccount admin = new AdminAccount();
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setUsername(email.split("@")[0]); // Generate username from email
        admin.setIsActive(true);
        admin.setCreatedAt(LocalDateTime.now());

        // Set role
        try {
            AdminRole role = roleStr != null 
                ? AdminRole.valueOf(roleStr.toUpperCase()) 
                : AdminRole.WORKER;
            admin.setRole(role);
        } catch (IllegalArgumentException e) {
            admin.setRole(AdminRole.WORKER);
        }

        AdminAccount savedAdmin = adminAccountRepository.save(admin);
        return ResponseEntity.ok(Map.of(
            "message", "Admin account created successfully",
            "admin", savedAdmin
        ));
    }

    /**
     * Edit admin account
     * Access: ADMIN only
     */
    @PutMapping("/edit/{id}")
    @AdminAccess
    public ResponseEntity<?> editAdmin(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Optional<AdminAccount> existingAdmin = adminAccountRepository.findById(id);
        if (existingAdmin.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AdminAccount admin = existingAdmin.get();

        // Update fields if provided
        if (data.containsKey("firstName")) admin.setFirstName((String) data.get("firstName"));
        if (data.containsKey("lastName")) admin.setLastName((String) data.get("lastName"));
        if (data.containsKey("isActive")) admin.setIsActive((Boolean) data.get("isActive"));
        
        // Update role if provided
        if (data.containsKey("role")) {
            try {
                AdminRole role = AdminRole.valueOf(((String) data.get("role")).toUpperCase());
                admin.setRole(role);
            } catch (IllegalArgumentException ignored) {}
        }

        // Update password if provided
        if (data.containsKey("password") && data.get("password") != null) {
            String newPassword = (String) data.get("password");
            if (!newPassword.isBlank()) {
                admin.setPasswordHash(passwordEncoder.encode(newPassword));
            }
        }

        AdminAccount savedAdmin = adminAccountRepository.save(admin);
        return ResponseEntity.ok(Map.of(
            "message", "Admin account updated successfully",
            "admin", savedAdmin
        ));
    }

    /**
     * Deactivate admin account
     * Access: ADMIN only
     */
    @PutMapping("/deactivate/{id}")
    @AdminAccess
    public ResponseEntity<?> deactivateAdmin(@PathVariable Long id) {
        Optional<AdminAccount> existingAdmin = adminAccountRepository.findById(id);
        if (existingAdmin.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AdminAccount admin = existingAdmin.get();
        admin.setIsActive(false);
        
        AdminAccount savedAdmin = adminAccountRepository.save(admin);
        return ResponseEntity.ok(Map.of(
            "message", "Admin account deactivated successfully",
            "admin", savedAdmin
        ));
    }

    /**
     * Delete admin account permanently
     * Access: ADMIN only
     */
    @DeleteMapping("/delete/{id}")
    @AdminAccess
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        if (!adminAccountRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        adminAccountRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Admin account deleted successfully",
            "deletedId", id
        ));
    }
}
