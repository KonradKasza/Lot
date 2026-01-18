package dev.ip.projekt.controllers;

import dev.ip.projekt.model.dto.BookingRequestDTO;
import dev.ip.projekt.model.dto.BookingResponseDTO;
import dev.ip.projekt.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO request) {
        try {
            String userEmail = getCurrentUserEmail();
            System.out.println("Creating booking for user: " + userEmail + ", flightId: " + request.getFlightId());
            BookingResponseDTO response = bookingService.createBooking(request, userEmail);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Booking error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings() {
        try {
            String userEmail = getCurrentUserEmail();
            List<BookingResponseDTO> bookings = bookingService.getMyBookings(userEmail);
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable("id") Long reservationId) {
        try {
            String userEmail = getCurrentUserEmail();
            BookingResponseDTO response = bookingService.cancelBooking(reservationId, userEmail);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return authentication.getName();
    }
}
