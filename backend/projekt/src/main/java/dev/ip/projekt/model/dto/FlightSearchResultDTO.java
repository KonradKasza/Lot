package dev.ip.projekt.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FlightSearchResultDTO {
    private Long flightId;
    private String flightNumber;
    private String airline;
    private LocalDate departureDate;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private Integer distance;
    private String aircraft;
    private BigDecimal basePrice;
    private Integer seatsAvailable;
    
    // Departure airport info
    private String departureAirportId;
    private String departureAirportName;
    private String departureCity;
    private String departureState;
    private String departureCountry;
    
    // Arrival airport info
    private String arrivalAirportId;
    private String arrivalAirportName;
    private String arrivalCity;
    private String arrivalState;
    private String arrivalCountry;

    public FlightSearchResultDTO() {}

    // Getters and setters
    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }

    public LocalDate getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDate departureDate) { this.departureDate = departureDate; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Integer getDistance() { return distance; }
    public void setDistance(Integer distance) { this.distance = distance; }

    public String getAircraft() { return aircraft; }
    public void setAircraft(String aircraft) { this.aircraft = aircraft; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public Integer getSeatsAvailable() { return seatsAvailable; }
    public void setSeatsAvailable(Integer seatsAvailable) { this.seatsAvailable = seatsAvailable; }

    public String getDepartureAirportId() { return departureAirportId; }
    public void setDepartureAirportId(String departureAirportId) { this.departureAirportId = departureAirportId; }

    public String getDepartureAirportName() { return departureAirportName; }
    public void setDepartureAirportName(String departureAirportName) { this.departureAirportName = departureAirportName; }

    public String getDepartureCity() { return departureCity; }
    public void setDepartureCity(String departureCity) { this.departureCity = departureCity; }

    public String getDepartureCountry() { return departureCountry; }
    public void setDepartureCountry(String departureCountry) { this.departureCountry = departureCountry; }

    public String getDepartureState() { return departureState; }
    public void setDepartureState(String departureState) { this.departureState = departureState; }

    public String getArrivalAirportId() { return arrivalAirportId; }
    public void setArrivalAirportId(String arrivalAirportId) { this.arrivalAirportId = arrivalAirportId; }

    public String getArrivalAirportName() { return arrivalAirportName; }
    public void setArrivalAirportName(String arrivalAirportName) { this.arrivalAirportName = arrivalAirportName; }

    public String getArrivalCity() { return arrivalCity; }
    public void setArrivalCity(String arrivalCity) { this.arrivalCity = arrivalCity; }

    public String getArrivalCountry() { return arrivalCountry; }
    public void setArrivalCountry(String arrivalCountry) { this.arrivalCountry = arrivalCountry; }

    public String getArrivalState() { return arrivalState; }
    public void setArrivalState(String arrivalState) { this.arrivalState = arrivalState; }
}
