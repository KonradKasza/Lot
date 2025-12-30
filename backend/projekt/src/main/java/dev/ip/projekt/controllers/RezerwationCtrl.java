package dev.ip.projekt.controllers;

import dev.ip.projekt.model.dto.*;
import dev.ip.projekt.model.entity.Flights;
import dev.ip.projekt.model.entity.Reservation;
import dev.ip.projekt.repository.FlightDAO;
import dev.ip.projekt.service.FlightService;
import dev.ip.projekt.service.PaymentService;
import dev.ip.projekt.service.ReservationService;
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
    private final ReservationService reservationService;

    public RezerwationCtrl(
            FlightService flightService,
            PaymentService paymentService,
            ReservationService reservationService
            ) {
        this.flightService = flightService;
        this.paymentService = paymentService;
        this.reservationService = reservationService;
    }

    @PutMapping("/reserve_sit") // ok
    public ResponseEntity<?> reserve_sit(@RequestBody ReservationRequestDTO dto) {
        return reservationService.reserveSit(dto.getReservationDTO(), dto.getPaymentInfo());
    }

    // just print/return all available flights // ok
    @GetMapping("/get_all_flights")
    public List<Flights> getAllFlights() {
        List<Flights> l = flightService.findAll();
        return l;
    }

    // returns list of flights that connect two selected airports
    @GetMapping("/plan_journey") // note : no time to implement this one
    public ResponseEntity<ApiResponce> plan_journey(@RequestBody JourneyDTO dto) {
        return ResponseEntity.ok(ApiResponce.makeDefaultFailure());
    }

    // get all my rezerwations
    @GetMapping("/get_my_reservations") // todo
    public ResponseEntity<List<Reservation>> get_my_reservations() {
        return ResponseEntity.ok(reservationService.getUserReservations(1L));
    }

    // ok
    // shouldn't expose payment as separate api for client to call using frontend because it can cause
    // probllems in case user disconnect before paying, better just call process payment inside the reserve sit
//    @PostMapping("/process_payment")
//    public ResponseEntity<?> process_payment(@RequestBody PaymentInfo paymentInfo) {
//        boolean payment_res = paymentService.processPayment(paymentInfo);
//        System.out.println(paymentInfo);
//        if (payment_res) {
//
//            return ResponseEntity.ok("ok");
//        } else {
//            return ResponseEntity.ok("payment error");
//        }
//    }
}

