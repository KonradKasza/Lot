package dev.ip.projekt.controllers;

import dev.ip.projekt.model.dto.AirportDTO;
import dev.ip.projekt.model.dto.AirportsResponseDTO;
import dev.ip.projekt.model.dto.FlightSearchResponseDTO;
import dev.ip.projekt.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public/flights")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FlightController {

    @Autowired
    private FlightService flightService;

    /**
     * Get all airports with available departures
     * GET /api/public/flights/airports/departures
     */
    @GetMapping("/airports/departures")
    public ResponseEntity<AirportsResponseDTO> getDepartureAirports() {
        AirportsResponseDTO response = flightService.getDepartureAirports();
        return ResponseEntity.ok(response);
    }

    /**
     * Get destination airports for a given departure airport
     * GET /api/public/flights/airports/destinations?from=WAW
     */
    @GetMapping("/airports/destinations")
    public ResponseEntity<AirportsResponseDTO> getDestinationAirports(
            @RequestParam("from") String departureAirportId) {
        AirportsResponseDTO response = flightService.getDestinationAirports(departureAirportId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all airports
     * GET /api/public/flights/airports
     */
    @GetMapping("/airports")
    public ResponseEntity<AirportsResponseDTO> getAllAirports() {
        AirportsResponseDTO response = flightService.getAllAirportsWithCountries();
        return ResponseEntity.ok(response);
    }

    /**
     * Get available dates for flights from a departure airport
     * GET /api/public/flights/dates?from=WAW
     */
    @GetMapping("/dates")
    public ResponseEntity<List<LocalDate>> getAvailableDates(
            @RequestParam("from") String departureAirportId,
            @RequestParam(value = "to", required = false) String arrivalAirportId) {
        List<LocalDate> dates;
        if (arrivalAirportId != null && !arrivalAirportId.isEmpty()) {
            // Get dates for specific route
            dates = flightService.getAvailableDatesForRoute(departureAirportId, arrivalAirportId);
        } else {
            // Get all dates from departure airport
            dates = flightService.getAvailableDates(departureAirportId);
        }
        return ResponseEntity.ok(dates);
    }

    /**
     * Search for flights
     * GET /api/public/flights/search?from=WAW&to=JFK&date=2026-01-20
     */
    @GetMapping("/search")
    public ResponseEntity<FlightSearchResponseDTO> searchFlights(
            @RequestParam("from") String departureAirportId,
            @RequestParam("to") String arrivalAirportId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate) {
        FlightSearchResponseDTO response = flightService.searchFlights(departureAirportId, arrivalAirportId, departureDate);
        return ResponseEntity.ok(response);
    }
}
