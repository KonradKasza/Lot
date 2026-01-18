package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByAccountIdOrderByCreationDateDesc(String accountId);
    
    Optional<Reservation> findByReservationCode(String reservationCode);
    
    List<Reservation> findByFlightId(Long flightId);
    
    @Query("SELECT COALESCE(MAX(r.reservationId), 0) FROM Reservation r")
    Long findMaxReservationId();
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.flightId = :flightId AND r.reservationStatus NOT IN ('Cancelled', 'No-show')")
    Long countActiveReservationsByFlight(@Param("flightId") Long flightId);
}
