package dev.ip.projekt.model.dto;

import java.time.LocalDate;
import java.util.List;

public class FlightSearchResponseDTO {
    private List<FlightSearchResultDTO> flights;
    private int total;
    private LocalDate date;
    private String message;

    public FlightSearchResponseDTO() {}

    public FlightSearchResponseDTO(List<FlightSearchResultDTO> flights, LocalDate date) {
        this.flights = flights;
        this.total = flights.size();
        this.date = date;
    }

    public List<FlightSearchResultDTO> getFlights() { return flights; }
    public void setFlights(List<FlightSearchResultDTO> flights) { 
        this.flights = flights; 
        this.total = flights != null ? flights.size() : 0;
    }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
