package dev.ip.projekt.model.dto;

import java.util.List;

public class AirportsResponseDTO {
    private List<String> countries;
    private List<AirportDTO> airports;

    public AirportsResponseDTO() {}

    public AirportsResponseDTO(List<String> countries, List<AirportDTO> airports) {
        this.countries = countries;
        this.airports = airports;
    }

    public List<String> getCountries() { return countries; }
    public void setCountries(List<String> countries) { this.countries = countries; }

    public List<AirportDTO> getAirports() { return airports; }
    public void setAirports(List<AirportDTO> airports) { this.airports = airports; }
}
