package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.Reservation;
import dev.ip.projekt.model.entity_new.Flight;
import dev.ip.projekt.model.entity_new.CustomerAccount;
import dev.ip.projekt.model.entity_new.Passenger;
import dev.ip.projekt.repository.ReservationRepository;
import dev.ip.projekt.repository.FlightRepository;
import dev.ip.projekt.repository.CustomerAccountRepository;
import dev.ip.projekt.repository.PassengerRepository;
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
@RequestMapping("/api/admin/reservations")
public class AdminReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    /**
     * List all reservations with pagination
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> listReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String accountId,
            @RequestParam(required = false) Long flightId,
            @RequestParam(defaultValue = "creationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Reservation> reservationsPage = reservationRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("reservations", reservationsPage.getContent());
        response.put("currentPage", reservationsPage.getNumber());
        response.put("totalItems", reservationsPage.getTotalElements());
        response.put("totalPages", reservationsPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get single reservation details
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/{id}")
    @WorkerAccess
    public ResponseEntity<?> getReservation(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        if (reservation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("reservation", reservation.get());
        
        // Include related flight info
        flightRepository.findById(reservation.get().getFlightId())
            .ifPresent(flight -> response.put("flight", flight));
        
        // Include customer account info
        customerAccountRepository.findById(reservation.get().getAccountId())
            .ifPresent(account -> response.put("customerAccount", account));
        
        // Include passengers
        List<Passenger> passengers = passengerRepository.findByReservationId(id);
        response.put("passengers", passengers);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Search reservation by code
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/search")
    @WorkerAccess
    public ResponseEntity<?> searchByCode(@RequestParam String code) {
        Optional<Reservation> reservation = reservationRepository.findByReservationCode(code);
        if (reservation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("reservation", reservation.get());
        
        // Include related flight info
        flightRepository.findById(reservation.get().getFlightId())
            .ifPresent(flight -> response.put("flight", flight));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Edit reservation
     * Access: MANAGER, ADMIN
     */
    @PutMapping("/edit/{id}")
    @ManagerAccess
    public ResponseEntity<?> editReservation(@PathVariable Long id, @RequestBody Reservation reservationData) {
        Optional<Reservation> existingReservation = reservationRepository.findById(id);
        if (existingReservation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Reservation reservation = existingReservation.get();
        
        // Update fields if provided
        if (reservationData.getReservationStatus() != null) reservation.setReservationStatus(reservationData.getReservationStatus());
        if (reservationData.getSeat() != null) reservation.setSeat(reservationData.getSeat());
        if (reservationData.getLuggage() != null) reservation.setLuggage(reservationData.getLuggage());
        if (reservationData.getTotalPrice() != null) reservation.setTotalPrice(reservationData.getTotalPrice());
        if (reservationData.getTicketStatus() != null) reservation.setTicketStatus(reservationData.getTicketStatus());
        if (reservationData.getFlightId() != null) reservation.setFlightId(reservationData.getFlightId());
        if (reservationData.getFareId() != null) reservation.setFareId(reservationData.getFareId());
        
        // Always update modification date
        reservation.setModificationDate(LocalDate.now());
        
        Reservation savedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(Map.of(
            "message", "Reservation updated successfully",
            "reservation", savedReservation
        ));
    }

    /**
     * Cancel reservation
     * Access: MANAGER, ADMIN
     */
    @PatchMapping("/cancel/{id}")
    @ManagerAccess
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        Optional<Reservation> existingReservation = reservationRepository.findById(id);
        if (existingReservation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Reservation reservation = existingReservation.get();
        reservation.setReservationStatus("Cancelled");
        reservation.setTicketStatus("Cancelled");
        reservation.setModificationDate(LocalDate.now());
        
        Reservation savedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(Map.of(
            "message", "Reservation cancelled successfully",
            "reservation", savedReservation
        ));
    }

    /**
     * Update reservation status
     * Access: MANAGER, ADMIN
     */
    @PatchMapping("/status/{id}")
    @ManagerAccess
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Optional<Reservation> existingReservation = reservationRepository.findById(id);
        if (existingReservation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Reservation reservation = existingReservation.get();
        reservation.setReservationStatus(status);
        reservation.setModificationDate(LocalDate.now());
        
        Reservation savedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(Map.of(
            "message", "Reservation status updated successfully",
            "reservation", savedReservation
        ));
    }

    /**
     * Delete reservation permanently
     * Access: ADMIN only
     */
    @DeleteMapping("/delete/{id}")
    @AdminAccess
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        if (!reservationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Delete associated passengers first
        List<Passenger> passengers = passengerRepository.findByReservationId(id);
        passengerRepository.deleteAll(passengers);
        
        reservationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Reservation and associated passengers deleted successfully",
            "deletedId", id
        ));
    }

    /**
     * Get reservations by flight
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/by-flight/{flightId}")
    @WorkerAccess
    public ResponseEntity<?> getReservationsByFlight(@PathVariable Long flightId) {
        List<Reservation> reservations = reservationRepository.findByFlightId(flightId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("reservations", reservations);
        response.put("count", reservations.size());
        
        // Include flight info
        flightRepository.findById(flightId)
            .ifPresent(flight -> response.put("flight", flight));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get reservation statistics
     * Access: WORKER, MANAGER, ADMIN
     */
    @GetMapping("/stats")
    @WorkerAccess
    public ResponseEntity<Map<String, Object>> getReservationStats() {
        long totalReservations = reservationRepository.count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReservations", totalReservations);
        
        return ResponseEntity.ok(stats);
    }
}
