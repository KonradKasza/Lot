package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity.Flights;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface FlightDAO extends JpaRepository<Flights, Long> {
}
