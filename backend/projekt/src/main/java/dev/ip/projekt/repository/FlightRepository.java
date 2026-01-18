package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    
    List<Flight> findByStartAirportAndEndAirportAndFlightDateAndCancellationStatus(
            String startAirport, 
            String endAirport, 
            LocalDate flightDate,
            Integer cancellationStatus
    );
    
    @Query("SELECT DISTINCT f.flightDate FROM Flight f WHERE f.startAirport = :startAirport AND f.cancellationStatus = 0 AND f.flightDate >= :fromDate ORDER BY f.flightDate")
    List<LocalDate> findAvailableDatesByStartAirport(@Param("startAirport") String startAirport, @Param("fromDate") LocalDate fromDate);
    
    @Query("SELECT DISTINCT f.flightDate FROM Flight f WHERE f.startAirport = :startAirport AND f.endAirport = :endAirport AND f.cancellationStatus = 0 AND f.flightDate >= :fromDate ORDER BY f.flightDate")
    List<LocalDate> findAvailableDatesByRoute(@Param("startAirport") String startAirport, @Param("endAirport") String endAirport, @Param("fromDate") LocalDate fromDate);
    
    @Query("SELECT DISTINCT f.startAirport FROM Flight f WHERE f.cancellationStatus = 0 AND f.flightDate >= :fromDate")
    List<String> findAirportsWithDepartures(@Param("fromDate") LocalDate fromDate);
    
    @Query("SELECT DISTINCT f.endAirport FROM Flight f WHERE f.startAirport = :startAirport AND f.cancellationStatus = 0 AND f.flightDate >= :fromDate")
    List<String> findDestinationAirports(@Param("startAirport") String startAirport, @Param("fromDate") LocalDate fromDate);
}
