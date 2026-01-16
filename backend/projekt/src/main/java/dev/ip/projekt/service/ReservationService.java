package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.ApiResponce;
import dev.ip.projekt.model.dto.PaymentInfo;
import dev.ip.projekt.model.dto.ReservationDTO;
import dev.ip.projekt.model.entity_new.Reservation;
import dev.ip.projekt.model.entity_new.ReservationStatus;
import dev.ip.projekt.repository.ReservationDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
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
        res.setAccountId(reservationDTO.getUserId());
        res.setSeat(reservationDTO.getSit());
        res.setReservationCode("111111"); // no idea what this is supposed to be so pla
        res.setReservationStatus(ReservationStatus.UNPAYED.name());
        res.setTotalPrice(BigDecimal.valueOf(paymentInfo.getValue())); // fix later
        res.setFlightId(reservationDTO.getFlightId());
        res.setCreationDate(LocalDate.now());
        res.setModificationDate(LocalDate.now());

        boolean pay_res = paymentService.processPayment(paymentInfo);
        if (pay_res) res.setReservationStatus(ReservationStatus.PAYED.name());

        reservationDAO.save(res);

        if (pay_res) {
            return ResponseEntity.ok(ApiResponce.makeSuccess("reservation successful"));
        } else {
            return ResponseEntity.ok(ApiResponce.makeFailure("payment failed"));
        }
    }

    public List<Reservation> getUserReservations(String userId) {
        return reservationDAO.findByAccountId(userId);
    }
}
