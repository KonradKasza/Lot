package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.Airport;
import dev.ip.projekt.repository.AirportRepository;
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
 * Controller for managing airports.
 * Only accessible by ADMIN role.
 */
@RestController
@RequestMapping("/api/admin/airports")
public class AdminAirportController {

    @Autowired
    private AirportRepository airportRepository;

    /**
     * List all airports with pagination
     * Access: ADMIN only
     */
    @GetMapping
    @AdminAccess
    public ResponseEntity<Map<String, Object>> listAirports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "airportId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Airport> airportsPage = airportRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("airports", airportsPage.getContent());
        response.put("currentPage", airportsPage.getNumber());
        response.put("totalItems", airportsPage.getTotalElements());
        response.put("totalPages", airportsPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get single airport details
     * Access: ADMIN only
     */
    @GetMapping("/{airportId}")
    @AdminAccess
    public ResponseEntity<?> getAirport(@PathVariable String airportId) {
        Optional<Airport> airport = airportRepository.findById(airportId);
        if (airport.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(airport.get());
    }

    /**
     * Create new airport
     * Access: ADMIN only
     */
    @PostMapping("/add")
    @AdminAccess
    public ResponseEntity<?> createAirport(@RequestBody Airport airportData) {
        // Validate airport ID
        if (airportData.getAirportId() == null || airportData.getAirportId().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Airport ID (IATA code) is required"));
        }

        // Check if airport ID already exists
        if (airportRepository.existsById(airportData.getAirportId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Airport with this ID already exists"));
        }

        Airport savedAirport = airportRepository.save(airportData);
        return ResponseEntity.ok(Map.of(
            "message", "Airport created successfully",
            "airport", savedAirport
        ));
    }

    /**
     * Edit airport
     * Access: ADMIN only
     */
    @PutMapping("/edit/{airportId}")
    @AdminAccess
    public ResponseEntity<?> editAirport(@PathVariable String airportId, @RequestBody Airport airportData) {
        Optional<Airport> existingAirport = airportRepository.findById(airportId);
        if (existingAirport.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Airport airport = existingAirport.get();

        // Update fields if provided
        if (airportData.getAirportName() != null) airport.setAirportName(airportData.getAirportName());
        if (airportData.getCity() != null) airport.setCity(airportData.getCity());
        if (airportData.getCountry() != null) airport.setCountry(airportData.getCountry());
        if (airportData.getState() != null) airport.setState(airportData.getState());
        if (airportData.getLatitude() != null) airport.setLatitude(airportData.getLatitude());
        if (airportData.getLongitude() != null) airport.setLongitude(airportData.getLongitude());

        Airport savedAirport = airportRepository.save(airport);
        return ResponseEntity.ok(Map.of(
            "message", "Airport updated successfully",
            "airport", savedAirport
        ));
    }

    /**
     * Delete airport
     * Access: ADMIN only
     */
    @DeleteMapping("/delete/{airportId}")
    @AdminAccess
    public ResponseEntity<?> deleteAirport(@PathVariable String airportId) {
        if (!airportRepository.existsById(airportId)) {
            return ResponseEntity.notFound().build();
        }

        airportRepository.deleteById(airportId);
        return ResponseEntity.ok(Map.of(
            "message", "Airport deleted successfully",
            "deletedAirportId", airportId
        ));
    }
}
