package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "reservation", schema = "public")
public class Reservation {

    @Id
    @Column(name = "reservation_id", nullable = false)
    public Long reservationId;

    @Column(name = "reservation_status", length = 20)
    public String reservationStatus;

    @Column(name = "creation_date")
    public LocalDate creationDate;

    @Column(name = "modification_date")
    public LocalDate modificationDate;

    @Column(name = "total_price", precision = 10, scale = 2)
    public BigDecimal totalPrice;

    @Column(name = "reservation_code", length = 20)
    public String reservationCode;

    @Column(name = "luggage", length = 50)
    public String luggage;

    @Column(name = "account_id", length = 29, nullable = false)
    public String accountId;

    @Column(name = "flight_id", nullable = false)
    public Long flightId;

    @Column(name = "fare_id", nullable = false)
    public Integer fareId;

    @Column(name = "ticket_number", length = 30)
    public String ticketNumber;

    @Column(name = "ticket_status", length = 30)
    public String ticketStatus;

    @Column(name = "seat", length = 5)
    public String seat;

    @Column(name = "complaint_id", length = 26)
    public String complaintId;

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public String getReservationStatus() {
        return reservationStatus;
    }

    public void setReservationStatus(String reservationStatus) {
        this.reservationStatus = reservationStatus;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getModificationDate() {
        return modificationDate;
    }

    public void setModificationDate(LocalDate modificationDate) {
        this.modificationDate = modificationDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getReservationCode() {
        return reservationCode;
    }

    public void setReservationCode(String reservationCode) {
        this.reservationCode = reservationCode;
    }

    public String getLuggage() {
        return luggage;
    }

    public void setLuggage(String luggage) {
        this.luggage = luggage;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public Integer getFareId() {
        return fareId;
    }

    public void setFareId(Integer fareId) {
        this.fareId = fareId;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getTicketStatus() {
        return ticketStatus;
    }

    public void setTicketStatus(String ticketStatus) {
        this.ticketStatus = ticketStatus;
    }

    public String getSeat() {
        return seat;
    }

    public void setSeat(String seat) {
        this.seat = seat;
    }

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    @Override
    public String toString() {
        return "Reservation{" +
                "reservationId=" + reservationId +
                ", reservationStatus='" + reservationStatus + '\'' +
                ", creationDate=" + creationDate +
                ", modificationDate=" + modificationDate +
                ", totalPrice=" + totalPrice +
                ", reservationCode='" + reservationCode + '\'' +
                ", luggage='" + luggage + '\'' +
                ", accountId='" + accountId + '\'' +
                ", flightId=" + flightId +
                ", fareId=" + fareId +
                ", ticketNumber='" + ticketNumber + '\'' +
                ", ticketStatus='" + ticketStatus + '\'' +
                ", seat='" + seat + '\'' +
                ", complaintId='" + complaintId + '\'' +
                '}';
    }
}
