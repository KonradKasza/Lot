package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.Flight;
import dev.ip.projekt.model.entity_new.Airplane;
import dev.ip.projekt.model.entity_new.Airport;
import dev.ip.projekt.repository.FlightRepository;
import dev.ip.projekt.repository.AirplaneRepository;
import dev.ip.projekt.repository.AirportRepository;
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

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/flights")
public class AdminFlightController {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AirplaneRepository airplaneRepository;

    @Autowired
    private AirportRepository airportRepository;

    /**
     * List all flights with pagination and filtering
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> listFlights(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String startAirport,
            @RequestParam(required = false) String endAirport,
            @RequestParam(required = false) LocalDate flightDate,
            @RequestParam(required = false) Integer cancellationStatus,
            @RequestParam(defaultValue = "flightDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Flight> flightsPage = flightRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("flights", flightsPage.getContent());
        response.put("currentPage", flightsPage.getNumber());
        response.put("totalItems", flightsPage.getTotalElements());
        response.put("totalPages", flightsPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get single flight details
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/{id}")
    @WorkerAccess
    public ResponseEntity<?> getFlight(@PathVariable Long id) {
        Optional<Flight> flight = flightRepository.findById(id);
        if (flight.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("flight", flight.get());
        
        // Include related airplane info if available
        if (flight.get().getSamolotId() != null) {
            airplaneRepository.findById(flight.get().getSamolotId())
                .ifPresent(airplane -> response.put("airplane", airplane));
        }
        
        // Include airport info
        airportRepository.findById(flight.get().getStartAirport())
            .ifPresent(airport -> response.put("startAirportInfo", airport));
        airportRepository.findById(flight.get().getEndAirport())
            .ifPresent(airport -> response.put("endAirportInfo", airport));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Add new flight
     * Access: MANAGER, ADMIN
     */
    @PostMapping("/add")
    @ManagerAccess
    public ResponseEntity<?> addFlight(@RequestBody Flight flight) {
        // Validate required fields
        if (flight.getFlightId() == null || flight.getFlightNumber() == null 
            || flight.getStartAirport() == null || flight.getEndAirport() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Missing required fields: flightId, flightNumber, startAirport, endAirport"
            ));
        }
        
        // Check if flight ID already exists
        if (flightRepository.existsById(flight.getFlightId())) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Flight with ID " + flight.getFlightId() + " already exists"
            ));
        }
        
        // Set defaults
        if (flight.getCancellationStatus() == null) {
            flight.setCancellationStatus(0);
        }
        
        Flight savedFlight = flightRepository.save(flight);
        return ResponseEntity.ok(Map.of(
            "message", "Flight created successfully",
            "flight", savedFlight
        ));
    }

    /**
     * Edit existing flight
     * Access: MANAGER, ADMIN
     */
    @PutMapping("/edit/{id}")
    @ManagerAccess
    public ResponseEntity<?> editFlight(@PathVariable Long id, @RequestBody Flight flightData) {
        Optional<Flight> existingFlight = flightRepository.findById(id);
        if (existingFlight.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Flight flight = existingFlight.get();
        
        // Update fields if provided
        if (flightData.getFlightNumber() != null) flight.setFlightNumber(flightData.getFlightNumber());
        if (flightData.getFlightDate() != null) flight.setFlightDate(flightData.getFlightDate());
        if (flightData.getStartAirport() != null) flight.setStartAirport(flightData.getStartAirport());
        if (flightData.getEndAirport() != null) flight.setEndAirport(flightData.getEndAirport());
        if (flightData.getScheduledDeparture() != null) flight.setScheduledDeparture(flightData.getScheduledDeparture());
        if (flightData.getActualDeparture() != null) flight.setActualDeparture(flightData.getActualDeparture());
        if (flightData.getScheduledArrival() != null) flight.setScheduledArrival(flightData.getScheduledArrival());
        if (flightData.getActualArrival() != null) flight.setActualArrival(flightData.getActualArrival());
        if (flightData.getCancellationStatus() != null) flight.setCancellationStatus(flightData.getCancellationStatus());
        if (flightData.getCancellationCode() != null) flight.setCancellationCode(flightData.getCancellationCode());
        if (flightData.getScheduledFlightTime() != null) flight.setScheduledFlightTime(flightData.getScheduledFlightTime());
        if (flightData.getActualFlightTime() != null) flight.setActualFlightTime(flightData.getActualFlightTime());
        if (flightData.getDystans() != null) flight.setDystans(flightData.getDystans());
        if (flightData.getSamolotId() != null) flight.setSamolotId(flightData.getSamolotId());
        if (flightData.getZalogaId() != null) flight.setZalogaId(flightData.getZalogaId());
        
        Flight savedFlight = flightRepository.save(flight);
        return ResponseEntity.ok(Map.of(
            "message", "Flight updated successfully",
            "flight", savedFlight
        ));
    }

    /**
     * Cancel flight (soft delete - sets cancellation status)
     * Access: MANAGER, ADMIN
     */
    @PatchMapping("/cancel/{id}")
    @ManagerAccess
    public ResponseEntity<?> cancelFlight(
            @PathVariable Long id,
            @RequestParam(defaultValue = "A") String cancellationCode
    ) {
        Optional<Flight> existingFlight = flightRepository.findById(id);
        if (existingFlight.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Flight flight = existingFlight.get();
        flight.setCancellationStatus(1);
        flight.setCancellationCode(cancellationCode);
        
        Flight savedFlight = flightRepository.save(flight);
        return ResponseEntity.ok(Map.of(
            "message", "Flight cancelled successfully",
            "flight", savedFlight
        ));
    }

    /**
     * Delete flight permanently
     * Access: ADMIN only
     */
    @DeleteMapping("/delete/{id}")
    @AdminAccess
    public ResponseEntity<?> deleteFlight(@PathVariable Long id) {
        if (!flightRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        flightRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Flight deleted successfully",
            "deletedId", id
        ));
    }

    /**
     * Get flight statistics
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/stats")
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> getFlightStats() {
        long totalFlights = flightRepository.count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFlights", totalFlights);
        
        return ResponseEntity.ok(stats);
    }
}
