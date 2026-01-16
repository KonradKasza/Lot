package dev.ip.projekt.repository;

import jakarta.persistence.Column;
import org.springframework.data.jpa.repository.JpaRepository;
import dev.ip.projekt.model.entity_new.Flight;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface FlightDAO extends JpaRepository<Flight, Long> {

	@Query(
			value = """
        SELECT l.*
        FROM flight l
        JOIN airport a ON t.start_airport = a.airport_id
        WHERE a.airport_id = :start_airport
    """,
			nativeQuery = true
	)
	List<Flight> findByStartAirport(@Param("start_airport") String startAirport);

}
