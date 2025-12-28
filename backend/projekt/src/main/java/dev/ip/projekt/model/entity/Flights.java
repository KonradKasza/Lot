package dev.ip.projekt.model.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class Flights {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private Timestamp dateOfArrival;

    @Column(nullable = false)
    private Timestamp dateOfDeparture;

    @Column(nullable = false)
    private String startAirport;

    @Column(nullable = false)
    private String endAirport;

    public Flights() {}

    public Flights(Timestamp departure, Timestamp arrival, String start, String end) {
        dateOfArrival = arrival;
        dateOfDeparture = departure;
        startAirport = start;
        endAirport = end;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Timestamp getDateOfArrival() {
        return dateOfArrival;
    }

    public void setDateOfArrival(Timestamp dateOfArrival) {
        this.dateOfArrival = dateOfArrival;
    }

    public Timestamp getDateOfDeparture() {
        return dateOfDeparture;
    }

    public void setDateOfDeparture(Timestamp dateOfDeparture) {
        this.dateOfDeparture = dateOfDeparture;
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

    @Override
    public String toString() {
        return "Flights{" +
                "id=" + id +
                ", dateOfArrival=" + dateOfArrival +
                ", dateOfDeparture=" + dateOfDeparture +
                ", startAirport='" + startAirport + '\'' +
                ", endAirport='" + endAirport + '\'' +
                '}';
    }
}
