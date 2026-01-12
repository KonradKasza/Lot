package dev.ip.projekt.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lot")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lot_id")
    private Long id;

    @Column(name = "numer_lotu")
    private String flightNumber;

    @Column(name = "data_wylotu")
    private LocalDateTime departureDate;

    @Column(name = "data_przylotu")
    private LocalDateTime arrivalDate;

    private Integer dystans;

    @Column(name = "nr_bramki")
    private String gateNumber;

    @Column(name = "typ_operacji")
    private String operationType;

    @Column(name = "status_lotu")
    private String status;

    @Column(name = "powod_opoznienia")
    private String delayReason;

    @Column(name = "data_aktualizacji")
    private LocalDateTime updateDate;

    @ManyToOne
    @JoinColumn(name = "trasa_id")
    private FlightRoute route;

    @ManyToOne
    @JoinColumn(name = "samolot_id")
    private Airplane airplane;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public LocalDateTime getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDateTime departureDate) {
        this.departureDate = departureDate;
    }

    public LocalDateTime getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(LocalDateTime arrivalDate) {
        this.arrivalDate = arrivalDate;
    }

    public Integer getDystans() {
        return dystans;
    }

    public void setDystans(Integer dystans) {
        this.dystans = dystans;
    }

    public String getGateNumber() {
        return gateNumber;
    }

    public void setGateNumber(String gateNumber) {
        this.gateNumber = gateNumber;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public FlightRoute getRoute() {
        return route;
    }

    public void setRoute(FlightRoute route) {
        this.route = route;
    }

    public Airplane getAirplane() {
        return airplane;
    }

    public void setAirplane(Airplane airplane) {
        this.airplane = airplane;
    }
}