package dev.ip.projekt.repository;

import dev.ip.projekt.model.entity_new.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AirportDAO extends JpaRepository<Airport, String> { // OK

    @Query("SELECT DISTINCT a.country FROM Airport a")
    List<String> findDistinctCountries();

    @Override
    Optional<Airport> findById(String s);

    List<Airport> findByCountry(String country);
}
