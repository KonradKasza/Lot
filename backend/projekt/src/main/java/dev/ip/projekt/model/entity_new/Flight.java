package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "flight", schema = "public")
public class Flight {

    @Id
    @Column(name = "flight_id", nullable = false)
    public Long flightId;

    @Column(name = "flight_number")
    public Integer flightNumber;

    @Column(name = "flight_date")
    public LocalDate flightDate;

    @Column(name = "start_airport", length = 5)
    public String startAirport;

    @Column(name = "end_airport", length = 5)
    public String endAirport;

    @Column(name = "scheduled_departure")
    public Integer scheduledDeparture;

    @Column(name = "actual_departure")
    public Integer actualDeparture;

    @Column(name = "scheduled_arrival")
    public Integer scheduledArrival;

    @Column(name = "actual_arrival")
    public Integer actualArrival;

    @Column(name = "cancellation_status")
    public Integer cancellationStatus;

    @Column(name = "cancellation_code", length = 1)
    public String cancellationCode;

    @Column(name = "scheduled_flight_time")
    public Integer scheduledFlightTime;

    @Column(name = "actual_flight_time")
    public Integer actualFlightTime;

    @Column(name = "dystans")
    public Integer dystans;

    @Column(name = "samolot_id", length = 26)
    public String samolotId;

    @Column(name = "zaloga_id")
    public Integer zalogaId;

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public Integer getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(Integer flightNumber) {
        this.flightNumber = flightNumber;
    }

    public LocalDate getFlightDate() {
        return flightDate;
    }

    public void setFlightDate(LocalDate flightDate) {
        this.flightDate = flightDate;
    }

    public String getStartAirport() {
        return startAirport;
    }

    public void setStartAirport(String startAirport) {
        this.startAirport = startAirport;
    }

    public String getEndAirport() {
        return endAirport;
    }

    public void setEndAirport(String endAirport) {
        this.endAirport = endAirport;
    }

    public Integer getScheduledDeparture() {
        return scheduledDeparture;
    }

    public void setScheduledDeparture(Integer scheduledDeparture) {
        this.scheduledDeparture = scheduledDeparture;
    }

    public Integer getActualDeparture() {
        return actualDeparture;
    }

    public void setActualDeparture(Integer actualDeparture) {
        this.actualDeparture = actualDeparture;
    }

    public Integer getScheduledArrival() {
        return scheduledArrival;
    }

    public void setScheduledArrival(Integer scheduledArrival) {
        this.scheduledArrival = scheduledArrival;
    }

    public Integer getActualArrival() {
        return actualArrival;
    }

    public void setActualArrival(Integer actualArrival) {
        this.actualArrival = actualArrival;
    }

    public Integer getCancellationStatus() {
        return cancellationStatus;
    }

    public void setCancellationStatus(Integer cancellationStatus) {
        this.cancellationStatus = cancellationStatus;
    }

    public String getCancellationCode() {
        return cancellationCode;
    }

    public void setCancellationCode(String cancellationCode) {
        this.cancellationCode = cancellationCode;
    }

    public Integer getScheduledFlightTime() {
        return scheduledFlightTime;
    }

    public void setScheduledFlightTime(Integer scheduledFlightTime) {
        this.scheduledFlightTime = scheduledFlightTime;
    }

    public Integer getActualFlightTime() {
        return actualFlightTime;
    }

    public void setActualFlightTime(Integer actualFlightTime) {
        this.actualFlightTime = actualFlightTime;
    }

    public Integer getDystans() {
        return dystans;
    }

    public void setDystans(Integer dystans) {
        this.dystans = dystans;
    }

    public String getSamolotId() {
        return samolotId;
    }

    public void setSamolotId(String samolotId) {
        this.samolotId = samolotId;
    }

    public Integer getZalogaId() {
        return zalogaId;
    }

    public void setZalogaId(Integer zalogaId) {
        this.zalogaId = zalogaId;
    }

    @Override
    public String toString() {
        return "Flight{" +
                "flightId=" + flightId +
                ", flightNumber=" + flightNumber +
                ", flightDate=" + flightDate +
                ", startAirport='" + startAirport + '\'' +
                ", endAirport='" + endAirport + '\'' +
                ", scheduledDeparture=" + scheduledDeparture +
                ", actualDeparture=" + actualDeparture +
                ", scheduledArrival=" + scheduledArrival +
                ", actualArrival=" + actualArrival +
                ", cancellationStatus=" + cancellationStatus +
                ", cancellationCode='" + cancellationCode + '\'' +
                ", scheduledFlightTime=" + scheduledFlightTime +
                ", actualFlightTime=" + actualFlightTime +
                ", dystans=" + dystans +
                ", samolotId='" + samolotId + '\'' +
                ", zalogaId=" + zalogaId +
                '}';
    }
}

