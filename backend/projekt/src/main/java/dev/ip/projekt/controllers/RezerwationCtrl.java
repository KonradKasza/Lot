package dev.ip.projekt.controllers;

import dev.ip.projekt.model.dto.JourneyDTO;
import dev.ip.projekt.model.dto.PaymentInfo;
import dev.ip.projekt.model.dto.ReservationDTO;
import dev.ip.projekt.model.entity.Flights;
import dev.ip.projekt.repository.FlightDAO;
import dev.ip.projekt.service.FlightService;
import dev.ip.projekt.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // allow React dev server
public class RezerwationCtrl {
    private final FlightService flightService;
    private final PaymentService paymentService;

    public RezerwationCtrl(FlightService flightService, PaymentService paymentService) {
        this.flightService = flightService;
        this.paymentService = paymentService;
    }

    @PutMapping("/reserve_sit")
    public ResponseEntity<?> reserve_sit(@RequestBody ReservationDTO dto) {
        System.out.println("reserve sit is active");
        return ResponseEntity.ok("ok");
    }

    // just print/return all available flights // ok
    @GetMapping("/get_all_flights")
    public List<Flights> getAllFlights() {
        List<Flights> l = flightService.findAll();
        for (Flights f : l) {
            System.out.println(f.toString());
        }
        return l;
    }

    // returns list of flights
    @GetMapping("/plan_journey")
    public ResponseEntity<?> plan_journey(@RequestBody JourneyDTO dto) {
        return ResponseEntity.ok("");
    }

    // get all my rezerwations
    @GetMapping("/get_my_s")
    public ResponseEntity<?> get_my_s() {
        return ResponseEntity.ok("");
    }

    // ok
    @PostMapping("/process_payment")
    public ResponseEntity<?> process_payment(@RequestBody PaymentInfo paymentInfo) {
        boolean payment_res = paymentService.processPayment(paymentInfo);
        System.out.println(paymentInfo);
        if (payment_res) {

            return ResponseEntity.ok("ok");
        } else {
            return ResponseEntity.ok("payment error");
        }
    }
}
