package dev.ip.projekt.controllers;

import dev.ip.projekt.model.entity_new.Flight;
import dev.ip.projekt.repository.FlightDAO;
import dev.ip.projekt.service.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // allow React dev server
public class TestCtrl {
    private final FlightService flightService;
    private final FlightDAO flightDAO;

    public TestCtrl(FlightService flightService, FlightDAO flightDAO) {
        this.flightService = flightService;
        this.flightDAO = flightDAO;
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        List<Flight> all_l = flightDAO.findByStartAirport("Zakynthos International Airport \"Dionysios Solomos\"");
        System.out.println(all_l.size());
        System.out.println("All flights");
        int i = 0;
        for (Flight f : all_l) {
            System.out.println("\t" + f.toString());
            i++;
            if (i > 100) break;
        }

        return ResponseEntity.ok("ok");
    }
}