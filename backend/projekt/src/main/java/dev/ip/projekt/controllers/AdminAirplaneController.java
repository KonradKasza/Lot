package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.Airplane;
import dev.ip.projekt.repository.AirplaneRepository;
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

@RestController
@RequestMapping("/api/admin/airplanes")
public class AdminAirplaneController {

    @Autowired
    private AirplaneRepository airplaneRepository;

    /**
     * List all airplanes with pagination
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> listAirplanes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "model") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Airplane> airplanesPage = airplaneRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("airplanes", airplanesPage.getContent());
        response.put("currentPage", airplanesPage.getNumber());
        response.put("totalItems", airplanesPage.getTotalElements());
        response.put("totalPages", airplanesPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get single airplane details
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/{id}")
    @WorkerAccess
    public ResponseEntity<?> getAirplane(@PathVariable String id) {
        Optional<Airplane> airplane = airplaneRepository.findById(id);
        if (airplane.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(Map.of("airplane", airplane.get()));
    }

    /**
     * Add new airplane
     * Access: MANAGER, ADMIN
     */
    @PostMapping("/add")
    @ManagerAccess
    public ResponseEntity<?> addAirplane(@RequestBody Airplane airplane) {
        // Validate required fields
        if (airplane.getSamolotId() == null || airplane.getSamolotId().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Missing required field: samolotId"
            ));
        }
        
        // Check if airplane ID already exists
        if (airplaneRepository.existsById(airplane.getSamolotId())) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Airplane with ID " + airplane.getSamolotId() + " already exists"
            ));
        }
        
        Airplane savedAirplane = airplaneRepository.save(airplane);
        return ResponseEntity.ok(Map.of(
            "message", "Airplane created successfully",
            "airplane", savedAirplane
        ));
    }

    /**
     * Edit existing airplane
     * Access: MANAGER, ADMIN
     */
    @PutMapping("/edit/{id}")
    @ManagerAccess
    public ResponseEntity<?> editAirplane(@PathVariable String id, @RequestBody Airplane airplaneData) {
        Optional<Airplane> existingAirplane = airplaneRepository.findById(id);
        if (existingAirplane.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Airplane airplane = existingAirplane.get();
        
        // Update fields if provided
        if (airplaneData.getNumerSamolotu() != null) airplane.setNumerSamolotu(airplaneData.getNumerSamolotu());
        if (airplaneData.getModel() != null) airplane.setModel(airplaneData.getModel());
        if (airplaneData.getProducent() != null) airplane.setProducent(airplaneData.getProducent());
        if (airplaneData.getLiczbaMiejsc() != null) airplane.setLiczbaMiejsc(airplaneData.getLiczbaMiejsc());
        if (airplaneData.getRokProdukcji() != null) airplane.setRokProdukcji(airplaneData.getRokProdukcji());
        if (airplaneData.getStatusTechniczny() != null) airplane.setStatusTechniczny(airplaneData.getStatusTechniczny());
        
        Airplane savedAirplane = airplaneRepository.save(airplane);
        return ResponseEntity.ok(Map.of(
            "message", "Airplane updated successfully",
            "airplane", savedAirplane
        ));
    }

    /**
     * Update airplane technical status
     * Access: MANAGER, ADMIN
     */
    @PatchMapping("/status/{id}")
    @ManagerAccess
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestParam String status
    ) {
        Optional<Airplane> existingAirplane = airplaneRepository.findById(id);
        if (existingAirplane.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Airplane airplane = existingAirplane.get();
        airplane.setStatusTechniczny(status);
        
        Airplane savedAirplane = airplaneRepository.save(airplane);
        return ResponseEntity.ok(Map.of(
            "message", "Airplane status updated successfully",
            "airplane", savedAirplane
        ));
    }

    /**
     * Delete airplane permanently
     * Access: ADMIN only
     */
    @DeleteMapping("/delete/{id}")
    @AdminAccess
    public ResponseEntity<?> deleteAirplane(@PathVariable String id) {
        if (!airplaneRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        airplaneRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Airplane deleted successfully",
            "deletedId", id
        ));
    }

    /**
     * Get airplane statistics
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/stats")
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> getAirplaneStats() {
        long totalAirplanes = airplaneRepository.count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAirplanes", totalAirplanes);
        
        return ResponseEntity.ok(stats);
    }
}
