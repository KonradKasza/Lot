package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "airport", schema = "public")
public class Airport {

    @Id
    @Column(name = "airport_id", length = 5, nullable = false)
    public String airportId;

    @Column(name = "airport_name", length = 150)
    public String airportName;

    @Column(name = "city", length = 100)
    public String city;

    @Column(name = "state", length = 100)
    public String state;

    @Column(name = "country", length = 100)
    public String country;

    @Column(name = "latitude")
    public BigDecimal latitude;

    @Column(name = "longitude")
    public BigDecimal longitude;

    public String getAirportId() {
        return airportId;
    }

    public void setAirportId(String airportId) {
        this.airportId = airportId;
    }

    public String getAirportName() {
        return airportName;
    }

    public void setAirportName(String airportName) {
        this.airportName = airportName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return "Airport{" +
                "airportId='" + airportId + '\'' +
                ", airportName='" + airportName + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", country='" + country + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}

