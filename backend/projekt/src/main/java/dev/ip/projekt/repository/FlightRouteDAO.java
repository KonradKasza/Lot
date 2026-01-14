package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity.FlightRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlightRouteDAO extends JpaRepository<FlightRoute, Long> {
    List<FlightRoute> findByDepartureAirport_AirportId(Integer airportId);
}
