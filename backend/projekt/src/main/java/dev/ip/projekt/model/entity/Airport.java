package dev.ip.projekt.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "airports")
public class Airport {

    @Id
    @Column(name = "airport_id")
    private Integer airportId;

    private String name;
    private String city;
    private String country;
    private String iata;
    private String icao;
    private Double latitude;
    private Double longitude;
    private Integer altitude;
    private Float timezone;


    public Integer getAirportId() { return airportId; }
    public void setAirportId(Integer airportId) { this.airportId = airportId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getIata() { return iata; }
    public void setIata(String iata) { this.iata = iata; }

    public String getIcao() { return icao; }
    public void setIcao(String icao) { this.icao = icao; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getAltitude() { return altitude; }
    public void setAltitude(Integer altitude) { this.altitude = altitude; }

    public Float getTimezone() { return timezone; }
    public void setTimezone(Float timezone) { this.timezone = timezone; }
}