package dev.ip.projekt.model.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long flightId;

    @Enumerated(EnumType.STRING)
    private ReservationStatus reservationStatus;

    private Timestamp dateOfCreation;

    private Timestamp dateOfModification;

    private Long totalCost;

    private Long reservationCode;

    private String sit;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ReservationStatus getReservationStatus() {
        return reservationStatus;
    }

    public void setReservationStatus(ReservationStatus reservationStatus) {
        this.reservationStatus = reservationStatus;
    }

    public Timestamp getDateOfCreation() {
        return dateOfCreation;
    }

    public void setDateOfCreation(Timestamp dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
    }

    public Timestamp getDateOfModification() {
        return dateOfModification;
    }

    public void setDateOfModification(Timestamp dateOfModification) {
        this.dateOfModification = dateOfModification;
    }

    public Long getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Long totalCost) {
        this.totalCost = totalCost;
    }

    public Long getReservationCode() {
        return reservationCode;
    }

    public void setReservationCode(Long reservationCode) {
        this.reservationCode = reservationCode;
    }

    public String getSit() {
        return sit;
    }

    public void setSit(String sit) {
        this.sit = sit;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    @Override
    public String toString() {
        return "Reservation{" +
                "id=" + id +
                ", userId=" + userId +
                ", reservationStatus=" + reservationStatus +
                ", dateOfCreation=" + dateOfCreation +
                ", dateOfModification=" + dateOfModification +
                ", totalCost=" + totalCost +
                ", reservationCode=" + reservationCode +
                ", sit='" + sit + '\'' +
                '}';
    }
}
