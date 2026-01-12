package dev.ip.projekt.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "taryfa")
public class Tariff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "taryfa_id")
    private Long id;

    @Column(name = "nazwa_taryfy")
    private String name;

    private String opis;

    @Column(name = "mozliwosc_zwrotu")
    private Boolean isRefundable;

    @Column(name = "mozliwosc_zmiany_rez")
    private Boolean isChangeable;

    @Column(name = "cena_bazowa")
    private BigDecimal basePrice;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public Boolean getIsRefundable() {
        return isRefundable;
    }

    public void setIsRefundable(Boolean isRefundable) {
        this.isRefundable = isRefundable;
    }

    public Boolean getIsChangeable() {
        return isChangeable;
    }

    public void setIsChangeable(Boolean isChangeable) {
        this.isChangeable = isChangeable;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }
}