package dev.ip.projekt.model.dto;

import java.sql.Timestamp;

public class FlightResultDTO {
    private long flightId;
    private Timestamp departure;
    private Timestamp arrival;
    private Integer startAirportId;
    private String startAirportName;
    private Integer endAirportId;
    private String endAirportName;

    private Long routeId;
    private String routeDescription;
    private Integer routeDistance;
    private String routeDuration;

    public FlightResultDTO() {}

    // getters and setters
    public long getFlightId() { return flightId; }
    public void setFlightId(long flightId) { this.flightId = flightId; }

    public Timestamp getDeparture() { return departure; }
    public void setDeparture(Timestamp departure) { this.departure = departure; }

    public Timestamp getArrival() { return arrival; }
    public void setArrival(Timestamp arrival) { this.arrival = arrival; }

    public Integer getStartAirportId() { return startAirportId; }
    public void setStartAirportId(Integer startAirportId) { this.startAirportId = startAirportId; }

    public String getStartAirportName() { return startAirportName; }
    public void setStartAirportName(String startAirportName) { this.startAirportName = startAirportName; }

    public Integer getEndAirportId() { return endAirportId; }
    public void setEndAirportId(Integer endAirportId) { this.endAirportId = endAirportId; }

    public String getEndAirportName() { return endAirportName; }
    public void setEndAirportName(String endAirportName) { this.endAirportName = endAirportName; }

    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }

    public String getRouteDescription() { return routeDescription; }
    public void setRouteDescription(String routeDescription) { this.routeDescription = routeDescription; }

    public Integer getRouteDistance() { return routeDistance; }
    public void setRouteDistance(Integer routeDistance) { this.routeDistance = routeDistance; }

    public String getRouteDuration() { return routeDuration; }
    public void setRouteDuration(String routeDuration) { this.routeDuration = routeDuration; }
}
