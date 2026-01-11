package dev.ip.projekt.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "trasa_lotu")
public class FlightRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trasa_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lotnisko_start")
    private Airport departureAirport;

    @ManyToOne
    @JoinColumn(name = "lotnisko_end")
    private Airport arrivalAirport;

    private Integer dystans;

    @Column(name = "czas_lotu")
    private String flightDuration;

    @Column(name = "opis_trasy")
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Airport getDepartureAirport() {
        return departureAirport;
    }

    public void setDepartureAirport(Airport departureAirport) {
        this.departureAirport = departureAirport;
    }

    public Airport getArrivalAirport() {
        return arrivalAirport;
    }

    public void setArrivalAirport(Airport arrivalAirport) {
        this.arrivalAirport = arrivalAirport;
    }

    public Integer getDystans() {
        return dystans;
    }

    public void setDystans(Integer dystans) {
        this.dystans = dystans;
    }

    public String getFlightDuration() {
        return flightDuration;
    }

    public void setFlightDuration(String flightDuration) {
        this.flightDuration = flightDuration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}