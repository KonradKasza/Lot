package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationDAO extends JpaRepository<Reservation, Long> {
    List<Reservation> findByAccountId(String accountId);
}
