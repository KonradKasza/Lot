package dev.ip.projekt.model.dto;

import java.math.BigDecimal;

public class AirportDTO {
    private String airportId;
    private String airportName;
    private String city;
    private String state;
    private String country;

    public AirportDTO() {}

    public AirportDTO(String airportId, String airportName, String city, String state, String country) {
        this.airportId = airportId;
        this.airportName = airportName;
        this.city = city;
        this.state = state;
        this.country = country;
    }

    public String getAirportId() { return airportId; }
    public void setAirportId(String airportId) { this.airportId = airportId; }

    public String getAirportName() { return airportName; }
    public void setAirportName(String airportName) { this.airportName = airportName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}
