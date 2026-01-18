package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.Crew;
import dev.ip.projekt.model.entity_new.CrewMember;
import dev.ip.projekt.repository.CrewRepository;
import dev.ip.projekt.repository.CrewMemberRepository;
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

/**
 * Controller for managing crews.
 */
@RestController
@RequestMapping("/api/admin/crews")
public class AdminCrewController {

    @Autowired
    private CrewRepository crewRepository;

    @Autowired
    private CrewMemberRepository crewMemberRepository;

    /**
     * List all crews with pagination
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> listCrews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "crewId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Crew> crewsPage = crewRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("crews", crewsPage.getContent());
        response.put("currentPage", crewsPage.getNumber());
        response.put("totalItems", crewsPage.getTotalElements());
        response.put("totalPages", crewsPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get single crew with its members
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/{id}")
    @WorkerAccess
    public ResponseEntity<?> getCrew(@PathVariable Integer id) {
        Optional<Crew> crew = crewRepository.findById(id);
        if (crew.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<CrewMember> members = crewMemberRepository.findByCrewId(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("crew", crew.get());
        response.put("members", members);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Add new crew
     * Access: MANAGER, ADMIN
     */
    @PostMapping("/add")
    @ManagerAccess
    public ResponseEntity<?> addCrew(@RequestBody Crew crew) {
        if (crew.getCrewId() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Missing required field: crewId"
            ));
        }
        
        if (crewRepository.existsById(crew.getCrewId())) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Crew with ID " + crew.getCrewId() + " already exists"
            ));
        }
        
        Crew savedCrew = crewRepository.save(crew);
        return ResponseEntity.ok(Map.of(
            "message", "Crew created successfully",
            "crew", savedCrew
        ));
    }

    /**
     * Edit existing crew
     * Access: MANAGER, ADMIN
     */
    @PutMapping("/edit/{id}")
    @ManagerAccess
    public ResponseEntity<?> editCrew(@PathVariable Integer id, @RequestBody Crew crewData) {
        Optional<Crew> existingCrew = crewRepository.findById(id);
        if (existingCrew.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Crew crew = existingCrew.get();
        
        if (crewData.getCrewName() != null) crew.setCrewName(crewData.getCrewName());
        if (crewData.getCrewType() != null) crew.setCrewType(crewData.getCrewType());
        
        Crew savedCrew = crewRepository.save(crew);
        return ResponseEntity.ok(Map.of(
            "message", "Crew updated successfully",
            "crew", savedCrew
        ));
    }

    /**
     * Delete crew
     * Access: ADMIN only
     */
    @DeleteMapping("/delete/{id}")
    @AdminAccess
    public ResponseEntity<?> deleteCrew(@PathVariable Integer id) {
        if (!crewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Check if crew has members
        List<CrewMember> members = crewMemberRepository.findByCrewId(id);
        if (!members.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Cannot delete crew with " + members.size() + " members. Remove members first."
            ));
        }
        
        crewRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Crew deleted successfully"
        ));
    }
}
