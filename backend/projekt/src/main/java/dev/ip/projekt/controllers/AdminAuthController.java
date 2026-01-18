package dev.ip.projekt.controllers;

import dev.ip.projekt.model.dto.AdminJwtResponse;
import dev.ip.projekt.model.dto.AdminLoginDTO;
import dev.ip.projekt.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for admin authentication endpoints.
 * Separate from customer authentication for security isolation.
 */
@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    /**
     * Admin login endpoint
     * POST /api/admin/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AdminJwtResponse> login(@Valid @RequestBody AdminLoginDTO loginDTO) {
        AdminJwtResponse response = adminAuthService.login(loginDTO);
        
        if (response.getStatus() == AdminJwtResponse.Status.ERROR) {
            return ResponseEntity.status(401).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get current admin info (requires authentication)
     * GET /api/admin/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<AdminJwtResponse> getCurrentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(AdminJwtResponse.error("Not authenticated"));
        }

        String email = authentication.getName();
        AdminJwtResponse response = adminAuthService.getAdminInfo(email);
        
        if (response.getStatus() == AdminJwtResponse.Status.ERROR) {
            return ResponseEntity.status(404).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Validate admin token and return role info
     * GET /api/admin/auth/validate
     */
    @GetMapping("/validate")
    public ResponseEntity<AdminJwtResponse> validateToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(AdminJwtResponse.error("Invalid or expired token"));
        }

        String email = authentication.getName();
        AdminJwtResponse response = adminAuthService.getAdminInfo(email);
        
        if (response.getStatus() == AdminJwtResponse.Status.ERROR) {
            return ResponseEntity.status(401).body(response);
        }
        
        return ResponseEntity.ok(response);
    }
}
