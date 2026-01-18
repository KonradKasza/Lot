package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.*;
import dev.ip.projekt.model.entity_new.Airplane;
import dev.ip.projekt.model.entity_new.Airport;
import dev.ip.projekt.model.entity_new.Fare;
import dev.ip.projekt.model.entity_new.Flight;
import dev.ip.projekt.repository.AirplaneRepository;
import dev.ip.projekt.repository.AirportRepository;
import dev.ip.projekt.repository.FareRepository;
import dev.ip.projekt.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private AirplaneRepository airplaneRepository;

    @Autowired
    private FareRepository fareRepository;

    /**
     * Get all airports with departures available from today onwards
     */
    public AirportsResponseDTO getDepartureAirports() {
        LocalDate today = LocalDate.now();
        
        // Get airport IDs that have departures
        List<String> airportIdsWithDepartures = flightRepository.findAirportsWithDepartures(today);
        
        // Get full airport data for those IDs
        List<Airport> airports = airportRepository.findAllById(airportIdsWithDepartures);
        
        // Get distinct countries from those airports
        List<String> countries = airports.stream()
                .map(Airport::getCountry)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        
        // Convert to DTOs
        List<AirportDTO> airportDTOs = airports.stream()
                .map(this::toAirportDTO)
                .sorted((a, b) -> {
                    int countryCompare = a.getCountry().compareTo(b.getCountry());
                    return countryCompare != 0 ? countryCompare : a.getCity().compareTo(b.getCity());
                })
                .collect(Collectors.toList());
        
        return new AirportsResponseDTO(countries, airportDTOs);
    }

    /**
     * Get destination airports for a given departure airport
     */
    public AirportsResponseDTO getDestinationAirports(String departureAirportId) {
        LocalDate today = LocalDate.now();
        
        // Get destination airport IDs from flights
        List<String> destinationIds = flightRepository.findDestinationAirports(departureAirportId, today);
        
        // Get full airport data
        List<Airport> airports = airportRepository.findAllById(destinationIds);
        
        // Get distinct countries
        List<String> countries = airports.stream()
                .map(Airport::getCountry)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        
        // Convert to DTOs
        List<AirportDTO> airportDTOs = airports.stream()
                .map(this::toAirportDTO)
                .sorted((a, b) -> {
                    int countryCompare = a.getCountry().compareTo(b.getCountry());
                    return countryCompare != 0 ? countryCompare : a.getCity().compareTo(b.getCity());
                })
                .collect(Collectors.toList());
        
        return new AirportsResponseDTO(countries, airportDTOs);
    }

    /**
     * Get available dates for flights from a departure airport
     */
    public List<LocalDate> getAvailableDates(String departureAirportId) {
        LocalDate today = LocalDate.now();
        return flightRepository.findAvailableDatesByStartAirport(departureAirportId, today);
    }

    /**
     * Get available dates for a specific route (departure to arrival)
     */
    public List<LocalDate> getAvailableDatesForRoute(String departureAirportId, String arrivalAirportId) {
        LocalDate today = LocalDate.now();
        return flightRepository.findAvailableDatesByRoute(departureAirportId, arrivalAirportId, today);
    }

    /**
     * Search for flights
     */
    public FlightSearchResponseDTO searchFlights(String departureAirportId, String arrivalAirportId, LocalDate departureDate) {
        // Get non-cancelled flights (cancellationStatus = 0)
        List<Flight> flights = flightRepository.findByStartAirportAndEndAirportAndFlightDateAndCancellationStatus(
                departureAirportId,
                arrivalAirportId,
                departureDate,
                0  // Not cancelled
        );
        
        if (flights.isEmpty()) {
            FlightSearchResponseDTO response = new FlightSearchResponseDTO(new ArrayList<>(), departureDate);
            response.setMessage("No flights found for the selected route and date");
            return response;
        }
        
        // Get airport details
        Airport departureAirport = airportRepository.findById(departureAirportId).orElse(null);
        Airport arrivalAirport = airportRepository.findById(arrivalAirportId).orElse(null);
        
        // Get base fare price (cheapest)
        BigDecimal basePrice = fareRepository.findAllByOrderByBasePriceAsc()
                .stream()
                .findFirst()
                .map(Fare::getBasePrice)
                .orElse(BigDecimal.valueOf(99.00));
        
        // Convert to DTOs
        List<FlightSearchResultDTO> flightDTOs = flights.stream()
                .map(flight -> toFlightSearchResultDTO(flight, departureAirport, arrivalAirport, basePrice))
                .sorted((a, b) -> a.getBasePrice().compareTo(b.getBasePrice()))
                .collect(Collectors.toList());
        
        return new FlightSearchResponseDTO(flightDTOs, departureDate);
    }

    /**
     * Get all airports (for general listing)
     */
    public List<AirportDTO> getAllAirports() {
        return airportRepository.findAllByOrderByCountryAscCityAsc()
                .stream()
                .map(this::toAirportDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all airports with countries list (for dropdown filters)
     */
    public AirportsResponseDTO getAllAirportsWithCountries() {
        List<Airport> airports = airportRepository.findAllByOrderByCountryAscCityAsc();
        
        // Get distinct countries
        List<String> countries = airports.stream()
                .map(Airport::getCountry)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        
        // Convert to DTOs
        List<AirportDTO> airportDTOs = airports.stream()
                .map(this::toAirportDTO)
                .collect(Collectors.toList());
        
        return new AirportsResponseDTO(countries, airportDTOs);
    }

    // Helper methods
    
    private AirportDTO toAirportDTO(Airport airport) {
        return new AirportDTO(
                airport.getAirportId(),
                airport.getAirportName(),
                airport.getCity(),
                airport.getState(),
                airport.getCountry()
        );
    }

    private FlightSearchResultDTO toFlightSearchResultDTO(Flight flight, Airport departureAirport, Airport arrivalAirport, BigDecimal basePrice) {
        FlightSearchResultDTO dto = new FlightSearchResultDTO();
        
        dto.setFlightId(flight.getFlightId());
        dto.setFlightNumber("LO" + flight.getFlightNumber());
        dto.setAirline("LOT Polish Airlines");
        dto.setDepartureDate(flight.getFlightDate());
        dto.setDepartureTime(minutesToTime(flight.getScheduledDeparture()));
        dto.setArrivalTime(minutesToTime(flight.getScheduledArrival()));
        dto.setDuration(minutesToDuration(flight.getScheduledFlightTime()));
        dto.setDistance(flight.getDystans());
        
        // Get aircraft info
        if (flight.getSamolotId() != null) {
            airplaneRepository.findById(flight.getSamolotId()).ifPresent(airplane -> {
                dto.setAircraft(airplane.getProducent() + " " + airplane.getModel());
            });
        }
        if (dto.getAircraft() == null) {
            dto.setAircraft("Boeing 787");  // Default
        }
        
        // Calculate price based on distance and base fare
        BigDecimal distanceMultiplier = BigDecimal.valueOf(1 + (flight.getDystans() != null ? flight.getDystans() / 5000.0 : 0.5));
        dto.setBasePrice(basePrice.multiply(distanceMultiplier).setScale(2, BigDecimal.ROUND_HALF_UP));
        
        // Estimate seats available (random for now, could be calculated from reservations)
        dto.setSeatsAvailable(50 + (int)(Math.random() * 100));
        
        // Departure airport info
        if (departureAirport != null) {
            dto.setDepartureAirportId(departureAirport.getAirportId());
            dto.setDepartureAirportName(departureAirport.getAirportName());
            dto.setDepartureCity(departureAirport.getCity());
            dto.setDepartureState(departureAirport.getState());
            dto.setDepartureCountry(departureAirport.getCountry());
        }
        
        // Arrival airport info
        if (arrivalAirport != null) {
            dto.setArrivalAirportId(arrivalAirport.getAirportId());
            dto.setArrivalAirportName(arrivalAirport.getAirportName());
            dto.setArrivalCity(arrivalAirport.getCity());
            dto.setArrivalState(arrivalAirport.getState());
            dto.setArrivalCountry(arrivalAirport.getCountry());
        }
        
        return dto;
    }

    private String minutesToTime(Integer minutes) {
        if (minutes == null) return "00:00";
        int hours = minutes / 60;
        int mins = minutes % 60;
        return String.format("%02d:%02d", hours % 24, mins);
    }

    private String minutesToDuration(Integer minutes) {
        if (minutes == null) return "0h 0m";
        int hours = minutes / 60;
        int mins = minutes % 60;
        return String.format("%dh %dm", hours, mins);
    }
}
