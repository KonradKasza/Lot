package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationDAO extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
}
