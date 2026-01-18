package dev.ip.projekt.model.dto;

import dev.ip.projekt.model.entity_new.AdminRole;

/**
 * Response DTO for admin authentication.
 * Includes role information for frontend authorization.
 */
public class AdminJwtResponse {

    private String jwt;
    private Status status;
    private String message;
    private Long adminId;
    private String username;
    private String email;
    private String fullName;
    private AdminRole role;

    public enum Status { SUCCESS, ERROR }

    public AdminJwtResponse() {
        this.status = Status.SUCCESS;
    }

    public AdminJwtResponse(String jwt, Long adminId, String username, String email, String fullName, AdminRole role) {
        this.jwt = jwt;
        this.status = Status.SUCCESS;
        this.adminId = adminId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public static AdminJwtResponse error(String message) {
        AdminJwtResponse response = new AdminJwtResponse();
        response.setStatus(Status.ERROR);
        response.setMessage(message);
        return response;
    }

    // Getters and Setters
    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public AdminRole getRole() {
        return role;
    }

    public void setRole(AdminRole role) {
        this.role = role;
    }
}
