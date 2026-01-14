package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AirportDAO extends JpaRepository<Airport, Integer> {

    @Query("SELECT DISTINCT a.country FROM Airport a")
    List<String> findDistinctCountries();

    List<Airport> findByCountry(String country);
}
