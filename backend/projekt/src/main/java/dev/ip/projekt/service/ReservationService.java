package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.ApiResponce;
import dev.ip.projekt.model.dto.PaymentInfo;
import dev.ip.projekt.model.dto.ReservationDTO;
import dev.ip.projekt.model.entity.Reservation;
import dev.ip.projekt.model.entity.ReservationStatus;
import dev.ip.projekt.repository.ReservationDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {
    private final PaymentService paymentService;
    private final ReservationDAO reservationDAO;

    public ReservationService(PaymentService paymentService, ReservationDAO reservationDAO) {
        this.paymentService = paymentService;
        this.reservationDAO = reservationDAO;
    }

    public ResponseEntity<ApiResponce> reserveSit(ReservationDTO reservationDTO, PaymentInfo paymentInfo) {


        Reservation res = new Reservation();
        res.setUserId(reservationDTO.getUserId());
        res.setSit(reservationDTO.getSit());
        res.setReservationCode(111111L); // no idea what this is supposed to be so pla
        res.setReservationStatus(ReservationStatus.UNPAYED);
        res.setTotalCost(1000L); // fix later
        res.setFlightId(reservationDTO.getFlightId());
        res.setDateOfCreation(Timestamp.valueOf(LocalDateTime.now()));
        res.setDateOfModification(Timestamp.valueOf(LocalDateTime.now()));

        boolean pay_res = paymentService.processPayment(paymentInfo);
        if (pay_res) res.setReservationStatus(ReservationStatus.PAYED);

        reservationDAO.save(res);

        if (pay_res) {
            return ResponseEntity.ok(ApiResponce.makeSuccess("reservation successful"));
        } else {
            return ResponseEntity.ok(ApiResponce.makeFailure("payment failed"));
        }
    }

    public List<Reservation> getUserReservations(Long userId) {
        return reservationDAO.findByUserId(userId);
    }
}
