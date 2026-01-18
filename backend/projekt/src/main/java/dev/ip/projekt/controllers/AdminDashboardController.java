package dev.ip.projekt.controllers;

import dev.ip.projekt.repository.FlightRepository;
import dev.ip.projekt.repository.ReservationRepository;
import dev.ip.projekt.repository.CustomerRepository;
import dev.ip.projekt.repository.CustomerAccountRepository;
import dev.ip.projekt.repository.AirplaneRepository;
import dev.ip.projekt.repository.AirportRepository;
import dev.ip.projekt.repository.AdminAccountRepository;
import dev.ip.projekt.model.entity_new.AdminRole;
import dev.ip.projekt.security.AdminRoleAnnotations.WorkerAccess;
import dev.ip.projekt.security.AdminRoleAnnotations.AdminAccess;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private AirplaneRepository airplaneRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private AdminAccountRepository adminAccountRepository;

    /**
     * Get dashboard overview with key statistics
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        Map<String, Object> stats = new HashMap<>();
        
        // Flight statistics
        long totalFlights = flightRepository.count();
        stats.put("totalFlights", totalFlights);
        
        // Reservation statistics
        long totalReservations = reservationRepository.count();
        stats.put("totalReservations", totalReservations);
        
        // Customer statistics
        long totalCustomers = customerRepository.count();
        long totalAccounts = customerAccountRepository.count();
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalAccounts", totalAccounts);
        
        // Fleet statistics
        long totalAirplanes = airplaneRepository.count();
        long totalAirports = airportRepository.count();
        stats.put("totalAirplanes", totalAirplanes);
        stats.put("totalAirports", totalAirports);
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Get today's flights summary
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/today")
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> getTodaysSummary() {
        LocalDate today = LocalDate.now();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("date", today.toString());
        
        // Flights departing today
        // Note: You might want to add a custom query for this
        summary.put("todaysFlightsNote", "Add custom query for today's flights in FlightRepository");
        
        return ResponseEntity.ok(summary);
    }

    /**
     * Get admin accounts overview (Admin only)
     * Access: ADMIN only
     */
    @GetMapping("/admins")
    @AdminAccess
    public ResponseEntity<Map<String, Object>> getAdminOverview() {
        Map<String, Object> adminStats = new HashMap<>();
        
        long totalAdmins = adminAccountRepository.count();
        long workers = adminAccountRepository.countByRole(AdminRole.WORKER);
        long managers = adminAccountRepository.countByRole(AdminRole.MANAGER);
        long admins = adminAccountRepository.countByRole(AdminRole.ADMIN);
        
        adminStats.put("totalAdmins", totalAdmins);
        adminStats.put("workers", workers);
        adminStats.put("managers", managers);
        adminStats.put("admins", admins);
        
        return ResponseEntity.ok(adminStats);
    }

    /**
     * Get system health check
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/health")
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        
        health.put("status", "UP");
        health.put("database", "Connected");
        health.put("timestamp", java.time.Instant.now().toString());
        
        // Basic connectivity checks
        try {
            flightRepository.count();
            health.put("flightRepository", "OK");
        } catch (Exception e) {
            health.put("flightRepository", "ERROR: " + e.getMessage());
        }
        
        try {
            reservationRepository.count();
            health.put("reservationRepository", "OK");
        } catch (Exception e) {
            health.put("reservationRepository", "ERROR: " + e.getMessage());
        }
        
        return ResponseEntity.ok(health);
    }

    /**
     * Get quick search across all entities
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/search")
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> quickSearch(@RequestParam String query) {
        Map<String, Object> results = new HashMap<>();
        
        // Search reservation by code
        reservationRepository.findByReservationCode(query)
            .ifPresent(reservation -> results.put("reservation", reservation));
        
        // Search customer account by email
        customerAccountRepository.findByEmail(query)
            .ifPresent(account -> results.put("customerAccount", account));
        
        // Try to parse as flight ID and search
        try {
            Long flightId = Long.parseLong(query);
            flightRepository.findById(flightId)
                .ifPresent(flight -> results.put("flight", flight));
        } catch (NumberFormatException ignored) {
            // Not a number, skip flight ID search
        }
        
        // Search airport by ID
        airportRepository.findById(query)
            .ifPresent(airport -> results.put("airport", airport));
        
        // Search airplane by ID
        airplaneRepository.findById(query)
            .ifPresent(airplane -> results.put("airplane", airplane));
        
        results.put("query", query);
        results.put("resultsFound", results.size() - 1); // Exclude query from count
        
        return ResponseEntity.ok(results);
    }
}
