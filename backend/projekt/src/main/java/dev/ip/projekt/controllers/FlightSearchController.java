package dev.ip.projekt.controllers;

import dev.ip.projekt.model.dto.AirportSimpleDTO;
import dev.ip.projekt.model.dto.FlightResultDTO;
import dev.ip.projekt.model.entity_new.Airport;
import dev.ip.projekt.model.entity_new.Flight;
//import dev.ip.projekt.model.entity_new.FlightRoute;
import dev.ip.projekt.repository.AirportDAO;
import dev.ip.projekt.repository.FlightDAO;
//import dev.ip.projekt.repository.FlightRouteDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.sql.Timestamp;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightSearchController {

    private final AirportDAO airportDAO;
    private final FlightDAO flightDAO;


    public FlightSearchController(AirportDAO airportDAO, FlightDAO flightDAO) {
        this.airportDAO = airportDAO;
        this.flightDAO = flightDAO;
        //this.flightRouteDAO = flightRouteDAO;
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
                .map(a -> new AirportSimpleDTO(a.getAirportId(), a.getAirportName(), a.getCity()))
                .collect(Collectors.toList());
    }

    public static LocalTime intToLocalTime(int hhmm) {
        int hours = hhmm / 100;
        int minutes = hhmm % 100;

        return LocalTime.of(hours, minutes);
    }

    // GET /api/search/dates?startAirportId={id}
    @GetMapping("/dates")
    public List<LocalDate> getAvailableDates(@RequestParam String startAirportId) {
        Optional<Airport> opt = airportDAO.findById(startAirportId);
        System.out.println("airport found " + (opt.isPresent()));

        if (opt.isEmpty()) return Collections.emptyList();

        String iata = opt.get().getAirportId();
        System.out.println(iata);


        List<Flight> flights = flightDAO.findByStartAirport(iata);
        System.out.println(flights.size());



        return flights.stream()
                .map(Flight::getFlightDate)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // GET /api/search/results?startAirportId={id}&date=YYYY-MM-DD
    @GetMapping("/results")
    public ResponseEntity<List<FlightResultDTO>> getResults(@RequestParam String startAirportId, @RequestParam String date) {
        Optional<Airport> opt = airportDAO.findById(startAirportId);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body(Collections.emptyList());
        Airport startAirport = opt.get();
        String AirportId = startAirport.getAirportId();
        LocalDate requestedDate;
        try {
            requestedDate = LocalDate.parse(date);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        List<Flight> flights = flightDAO.findByStartAirport(AirportId);

        // prefetch routes for departure airport //todo
        List<Flight> routesFromDeparture = flightDAO.findByStartAirport(startAirport.getAirportId());

        List<FlightResultDTO> results = new ArrayList<>();

        for (Flight f : flights) {
            LocalDate depDate = f.getFlightDate();
            if (!depDate.equals(requestedDate)) continue;

            FlightResultDTO dto = new FlightResultDTO();
            dto.setFlightId(f.getFlightId());
            dto.setDeparture(Timestamp.valueOf( LocalDateTime.of(f.getFlightDate(), intToLocalTime(f.getScheduledDeparture()))));
            dto.setArrival(Timestamp.valueOf( LocalDateTime.of(f.getFlightDate(), intToLocalTime(f.getScheduledArrival()))));
            dto.setStartAirportId(startAirport.getAirportId());
            dto.setStartAirportName(startAirport.getAirportName());

            // find end airport entity if exists
            // search route matching arrival iata
            Optional<Flight> maybeRoute = routesFromDeparture.stream()
                    .filter(r -> r.getEndAirport() != null && Objects.equals(r.getEndAirport(), f.getEndAirport()))
                    .findFirst();

            if (maybeRoute.isPresent()) {
                Flight r = maybeRoute.get();
                dto.setRouteId(r.getFlightId());
                dto.setRouteDescription(r.getStartAirport() + " - " + r.getEndAirport());
                dto.setRouteDistance(r.getDystans());
                dto.setRouteDuration(r.getScheduledFlightTime() + " minutes");
                if (r.getEndAirport() != null) {
                    dto.setEndAirportId(r.getEndAirport());
                    dto.setEndAirportName(airportDAO.findById(r.getEndAirport()).get().getAirportName());
                }
            } else {
                // fallback: only set end airport info using flight endAirport (iata)
                //dto.setEndAirportName(f.getEndAirport());
            }

            results.add(dto);
        }

        return ResponseEntity.ok(results);
    }
}
