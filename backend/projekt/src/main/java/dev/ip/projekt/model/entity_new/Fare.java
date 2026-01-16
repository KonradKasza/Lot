package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "fare", schema = "public")
public class Fare {

    @Id
    @Column(name = "fare_id", nullable = false)
    public Integer fareId;

    @Column(name = "fare_name", length = 50)
    public String fareName;

    @Column(name = "opis")
    public String opis;

    @Column(name = "refundable")
    public Boolean refundable;

    @Column(name = "changeable")
    public Boolean changeable;

    @Column(name = "base_price", precision = 10, scale = 2)
    public BigDecimal basePrice;

    public Integer getFareId() {
        return fareId;
    }

    public void setFareId(Integer fareId) {
        this.fareId = fareId;
    }

    public String getFareName() {
        return fareName;
    }

    public void setFareName(String fareName) {
        this.fareName = fareName;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public Boolean getRefundable() {
        return refundable;
    }

    public void setRefundable(Boolean refundable) {
        this.refundable = refundable;
    }

    public Boolean getChangeable() {
        return changeable;
    }

    public void setChangeable(Boolean changeable) {
        this.changeable = changeable;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    @Override
    public String toString() {
        return "Fare{" +
                "fareId=" + fareId +
                ", fareName='" + fareName + '\'' +
                ", opis='" + opis + '\'' +
                ", refundable=" + refundable +
                ", changeable=" + changeable +
                ", basePrice=" + basePrice +
                '}';
    }
}

