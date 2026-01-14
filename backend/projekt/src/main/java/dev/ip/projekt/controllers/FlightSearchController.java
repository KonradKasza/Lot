package dev.ip.projekt.controllers;

import dev.ip.projekt.model.dto.AirportSimpleDTO;
import dev.ip.projekt.model.dto.FlightResultDTO;
import dev.ip.projekt.model.entity.Airport;
import dev.ip.projekt.model.entity.FlightRoute;
import dev.ip.projekt.model.entity.Flights;
import dev.ip.projekt.repository.AirportDAO;
import dev.ip.projekt.repository.FlightDAO;
import dev.ip.projekt.repository.FlightRouteDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightSearchController {

    private final AirportDAO airportDAO;
    private final FlightDAO flightDAO;
    private final FlightRouteDAO flightRouteDAO;

    public FlightSearchController(AirportDAO airportDAO, FlightDAO flightDAO, FlightRouteDAO flightRouteDAO) {
        this.airportDAO = airportDAO;
        this.flightDAO = flightDAO;
        this.flightRouteDAO = flightRouteDAO;
    }

    // GET /api/search/countries
    @GetMapping("/countries")
    public List<String> getCountries() {
        return airportDAO.findDistinctCountries();
    }

    // GET /api/search/airports?country={country}
    @GetMapping("/airports")
    public List<AirportSimpleDTO> getAirportsByCountry(@RequestParam String country) {
        List<Airport> airports = airportDAO.findByCountry(country);
        return airports.stream()
                .map(a -> new AirportSimpleDTO(a.getAirportId(), a.getName(), a.getCity()))
                .collect(Collectors.toList());
    }

    // GET /api/search/dates?startAirportId={id}
    @GetMapping("/dates")
    public List<LocalDate> getAvailableDates(@RequestParam Integer startAirportId) {
        Optional<Airport> opt = airportDAO.findById(startAirportId);
        if (opt.isEmpty()) return Collections.emptyList();
        String iata = opt.get().getIata();
        List<Flights> flights = flightDAO.findByStartAirport(iata);
        return flights.stream()
                .map(f -> Instant.ofEpochMilli(f.getDateOfDeparture().getTime()).atZone(ZoneId.systemDefault()).toLocalDate())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // GET /api/search/results?startAirportId={id}&date=YYYY-MM-DD
    @GetMapping("/results")
    public ResponseEntity<List<FlightResultDTO>> getResults(@RequestParam Integer startAirportId, @RequestParam String date) {
        Optional<Airport> opt = airportDAO.findById(startAirportId);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body(Collections.emptyList());
        Airport startAirport = opt.get();
        String startIata = startAirport.getIata();
        LocalDate requestedDate;
        try {
            requestedDate = LocalDate.parse(date);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        List<Flights> flights = flightDAO.findByStartAirport(startIata);

        // prefetch routes for departure airport
        List<FlightRoute> routesFromDeparture = flightRouteDAO.findByDepartureAirport_AirportId(startAirport.getAirportId());

        List<FlightResultDTO> results = new ArrayList<>();

        for (Flights f : flights) {
            LocalDate depDate = Instant.ofEpochMilli(f.getDateOfDeparture().getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
            if (!depDate.equals(requestedDate)) continue;

            FlightResultDTO dto = new FlightResultDTO();
            dto.setFlightId(f.getId());
            dto.setDeparture(f.getDateOfDeparture());
            dto.setArrival(f.getDateOfArrival());
            dto.setStartAirportId(startAirport.getAirportId());
            dto.setStartAirportName(startAirport.getName());

            // find end airport entity if exists
            // search route matching arrival iata
            Optional<FlightRoute> maybeRoute = routesFromDeparture.stream()
                    .filter(r -> r.getArrivalAirport() != null && Objects.equals(r.getArrivalAirport().getIata(), f.getEndAirport()))
                    .findFirst();

            if (maybeRoute.isPresent()) {
                FlightRoute r = maybeRoute.get();
                dto.setRouteId(r.getId());
                dto.setRouteDescription(r.getDescription());
                dto.setRouteDistance(r.getDystans());
                dto.setRouteDuration(r.getFlightDuration());
                if (r.getArrivalAirport() != null) {
                    dto.setEndAirportId(r.getArrivalAirport().getAirportId());
                    dto.setEndAirportName(r.getArrivalAirport().getName());
                }
            } else {
                // fallback: only set end airport info using flight endAirport (iata)
                dto.setEndAirportName(f.getEndAirport());
            }

            results.add(dto);
        }

        return ResponseEntity.ok(results);
    }
}
