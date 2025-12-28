package dev.ip.projekt.service;

import dev.ip.projekt.model.entity.Flights;
import dev.ip.projekt.repository.FlightDAO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {
    public FlightDAO flightDAO;

    public FlightService(FlightDAO flightDAO) {
        this.flightDAO = flightDAO;
    }

    public List<Flights> findAll() {
        return flightDAO.findAll();
    }
}