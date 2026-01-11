package dev.ip.projekt.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "platnosc")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "platnosc_id")
    private Long id;

    private BigDecimal kwota;

    private String waluta;

    @Column(name = "metoda_platnosci")
    private String paymentMethod;

    @Column(name = "status_platnosci")
    private String status;

    @Column(name = "data_platnosci")
    private LocalDateTime paymentDate;

    @Column(name = "identyfikator_transakcji")
    private String transactionId;

    @OneToOne
    @JoinColumn(name = "rezerwacja_id")
    private Reservation reservation;

    @OneToMany(mappedBy = "payment")
    private List<TransactionHistory> history;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getKwota() {
        return kwota;
    }

    public void setKwota(BigDecimal kwota) {
        this.kwota = kwota;
    }

    public String getWaluta() {
        return waluta;
    }

    public void setWaluta(String waluta) {
        this.waluta = waluta;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public List<TransactionHistory> getHistory() {
        return history;
    }

    public void setHistory(List<TransactionHistory> history) {
        this.history = history;
    }
}