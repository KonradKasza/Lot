package dev.ip.projekt.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reklamacja")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reklamacja_id")
    private Long id;

    @Column(name = "kategoria_reklamacji")
    private String category;

    @Column(name = "opis_reklamacji")
    private String description;

    @Column(name = "status_reklamacji")
    private String status;

    @Column(name = "data_zgloszenia")
    private LocalDateTime submissionDate;

    @Column(name = "data_rozwiazania")
    private LocalDateTime resolutionDate;

    @ManyToOne
    @JoinColumn(name = "rezerwacja_id")
    private Reservation reservation;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public LocalDateTime getResolutionDate() {
        return resolutionDate;
    }

    public void setResolutionDate(LocalDateTime resolutionDate) {
        this.resolutionDate = resolutionDate;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }
}