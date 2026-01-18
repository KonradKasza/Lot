package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.AdminJwtResponse;
import dev.ip.projekt.model.dto.AdminLoginDTO;
import dev.ip.projekt.model.entity_new.AdminAccount;
import dev.ip.projekt.repository.AdminAccountRepository;
import dev.ip.projekt.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for admin authentication operations.
 */
@Service
public class AdminAuthService {

    @Autowired
    private AdminAccountRepository adminAccountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Authenticate admin user and generate JWT token
     */
    @Transactional
    public AdminJwtResponse login(AdminLoginDTO loginDTO) {
        String identifier = loginDTO.getEmailOrUsername();
        
        // Find admin by email or username
        Optional<AdminAccount> adminOpt = adminAccountRepository.findByEmail(identifier)
                .or(() -> adminAccountRepository.findByUsername(identifier));

        if (adminOpt.isEmpty()) {
            return AdminJwtResponse.error("Invalid credentials");
        }

        AdminAccount admin = adminOpt.get();

        // Check if account is active
        if (!admin.getIsActive()) {
            return AdminJwtResponse.error("Account is deactivated. Please contact administrator.");
        }

        // Verify password
        if (!passwordEncoder.matches(loginDTO.getPassword(), admin.getPasswordHash())) {
            return AdminJwtResponse.error("Invalid credentials");
        }

        // Update last login timestamp
        admin.setLastLogin(LocalDateTime.now());
        adminAccountRepository.save(admin);

        // Generate JWT token with admin info
        String jwt = jwtUtils.generateAdminJwtToken(
                admin.getEmail(),
                admin.getAdminId(),
                admin.getRole().name()
        );

        return new AdminJwtResponse(
                jwt,
                admin.getAdminId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole()
        );
    }

    /**
     * Get current admin information from email
     */
    public AdminJwtResponse getAdminInfo(String email) {
        Optional<AdminAccount> adminOpt = adminAccountRepository.findByEmail(email);

        if (adminOpt.isEmpty()) {
            return AdminJwtResponse.error("Admin not found");
        }

        AdminAccount admin = adminOpt.get();

        return new AdminJwtResponse(
                null, // No new JWT, just info
                admin.getAdminId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole()
        );
    }

    /**
     * Validate if an admin has a specific role or higher
     */
    public boolean hasRole(String email, String requiredRole) {
        Optional<AdminAccount> adminOpt = adminAccountRepository.findByEmail(email);
        
        if (adminOpt.isEmpty()) {
            return false;
        }

        AdminAccount admin = adminOpt.get();
        
        return switch (requiredRole) {
            case "WORKER" -> true; // Any admin has at least WORKER role
            case "MANAGER" -> admin.getRole().ordinal() >= 1; // MANAGER or ADMIN
            case "ADMIN" -> admin.getRole().ordinal() >= 2; // Only ADMIN
            default -> false;
        };
    }
}
