package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    List<Passenger> findByReservationId(Long reservationId);
    
    Optional<Passenger> findFirstByReservationId(Long reservationId);
}
