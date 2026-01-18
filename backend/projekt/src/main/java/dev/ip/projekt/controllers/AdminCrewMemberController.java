package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.CrewMember;
import dev.ip.projekt.repository.CrewMemberRepository;
import dev.ip.projekt.repository.CrewRepository;
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
import java.util.Map;
import java.util.Optional;

/**
 * Controller for managing crew members (workers).
 */
@RestController
@RequestMapping("/api/admin/crew-members")
public class AdminCrewMemberController {

    @Autowired
    private CrewMemberRepository crewMemberRepository;

    @Autowired
    private CrewRepository crewRepository;

    /**
     * List all crew members with pagination
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> listCrewMembers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "crewMemberId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<CrewMember> membersPage = crewMemberRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("crewMembers", membersPage.getContent());
        response.put("currentPage", membersPage.getNumber());
        response.put("totalItems", membersPage.getTotalElements());
        response.put("totalPages", membersPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get single crew member details
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/{id}")
    @WorkerAccess
    public ResponseEntity<?> getCrewMember(@PathVariable Integer id) {
        Optional<CrewMember> member = crewMemberRepository.findById(id);
        if (member.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("crewMember", member.get()));
    }

    /**
     * Add new crew member
     * Access: MANAGER, ADMIN
     */
    @PostMapping("/add")
    @ManagerAccess
    public ResponseEntity<?> addCrewMember(@RequestBody CrewMember member) {
        if (member.getCrewMemberId() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Missing required field: crewMemberId"
            ));
        }
        
        if (crewMemberRepository.existsById(member.getCrewMemberId())) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Crew member with ID " + member.getCrewMemberId() + " already exists"
            ));
        }
        
        // Validate crew exists
        if (member.getCrewId() != null && !crewRepository.existsById(member.getCrewId())) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Crew with ID " + member.getCrewId() + " does not exist"
            ));
        }
        
        CrewMember savedMember = crewMemberRepository.save(member);
        return ResponseEntity.ok(Map.of(
            "message", "Crew member created successfully",
            "crewMember", savedMember
        ));
    }

    /**
     * Edit existing crew member
     * Access: MANAGER, ADMIN
     */
    @PutMapping("/edit/{id}")
    @ManagerAccess
    public ResponseEntity<?> editCrewMember(@PathVariable Integer id, @RequestBody CrewMember memberData) {
        Optional<CrewMember> existingMember = crewMemberRepository.findById(id);
        if (existingMember.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        CrewMember member = existingMember.get();
        
        if (memberData.getCrewId() != null) {
            // Validate crew exists
            if (!crewRepository.existsById(memberData.getCrewId())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Crew with ID " + memberData.getCrewId() + " does not exist"
                ));
            }
            member.setCrewId(memberData.getCrewId());
        }
        if (memberData.getFirstName() != null) member.setFirstName(memberData.getFirstName());
        if (memberData.getLastName() != null) member.setLastName(memberData.getLastName());
        if (memberData.getRole() != null) member.setRole(memberData.getRole());
        if (memberData.getLicenseNumber() != null) member.setLicenseNumber(memberData.getLicenseNumber());
        if (memberData.getEmploymentDate() != null) member.setEmploymentDate(memberData.getEmploymentDate());
        if (memberData.getStatus() != null) member.setStatus(memberData.getStatus());
        
        CrewMember savedMember = crewMemberRepository.save(member);
        return ResponseEntity.ok(Map.of(
            "message", "Crew member updated successfully",
            "crewMember", savedMember
        ));
    }

    /**
     * Delete crew member
     * Access: ADMIN only
     */
    @DeleteMapping("/delete/{id}")
    @AdminAccess
    public ResponseEntity<?> deleteCrewMember(@PathVariable Integer id) {
        if (!crewMemberRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        crewMemberRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Crew member deleted successfully"
        ));
    }
}
