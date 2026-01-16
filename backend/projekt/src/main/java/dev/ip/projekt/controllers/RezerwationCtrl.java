package dev.ip.projekt.controllers;
import dev.ip.projekt.model.dto.*;
import dev.ip.projekt.model.entity_new.Flight;
import dev.ip.projekt.model.entity_new.Reservation;
import dev.ip.projekt.service.FlightService;
import dev.ip.projekt.service.PaymentService;
import dev.ip.projekt.service.ReservationService;
import dev.ip.projekt.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // allow React dev server
public class RezerwationCtrl {
    private final FlightService flightService;
    private final PaymentService paymentService;
    private final ReservationService reservationService;
    private final UserService userService;

    public RezerwationCtrl(
            FlightService flightService,
            PaymentService paymentService,
            ReservationService reservationService,
            UserService userService
            ) {
        this.flightService = flightService;
        this.paymentService = paymentService;
        this.reservationService = reservationService;
        this.userService = userService;
    }

    @PutMapping("/reserve_sit")
    public ResponseEntity<?> reserve_sit(@RequestBody ReservationRequestDTO dto, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body("Nie jesteś zalogowany");
        }

        String email = auth.getName();
        String userId = userService.findUserIdByEmail(email);

        dto.getReservationDTO().setUserId(userId);

        return reservationService.reserveSit(dto.getReservationDTO(), dto.getPaymentInfo());
    }
    // just print/return all available flights // ok
    @GetMapping("/get_all_flights")
    public List<Flight> getAllFlights() {
        System.out.println("getting all flights");
        List<Flight> l = flightService.findAll();
        return l;
    }

    // returns list of flights that connect two selected airports
    @GetMapping("/plan_journey")
    public ResponseEntity<ApiResponce> plan_journey(@RequestBody JourneyDTO dto, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body(ApiResponce.makeUnauthorized());
        }
        return ResponseEntity.ok(ApiResponce.makeDefaultFailure());
    }

    // get all my rezerwations
    @GetMapping("/get_my_reservations")
    public ResponseEntity<List<Reservation>> get_my_reservations(Authentication auth) {
        System.out.println("getting reservations");
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName();
        System.out.println("from : " + email);
        String userId = userService.findUserIdByEmail(email);

        List<Reservation> reservations = reservationService.getUserReservations(userId);
        return ResponseEntity.ok(reservations);
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

