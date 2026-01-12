package dev.ip.projekt.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bilet")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bilet_id")
    private Long id;

    @Column(name = "numer_biletu")
    private String ticketNumber;

    @Column(name = "status_biletu")
    private String status;

    @Column(name = "miejsce")
    private String seatNumber;

    @ManyToOne
    @JoinColumn(name = "rezerwacja_id")
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "taryfa_id")
    private Tariff tariff;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public Tariff getTariff() {
        return tariff;
    }

    public void setTariff(Tariff tariff) {
        this.tariff = tariff;
    }
}