package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;

@Entity
@Table(name = "airplane", schema = "public")
public class Airplane {

    @Id
    @Column(name = "samolot_id", length = 26, nullable = false)
    public String samolotId;

    @Column(name = "numer_samolotu", length = 50)
    public String numerSamolotu;

    @Column(name = "model", length = 50)
    public String model;

    @Column(name = "producent", length = 50)
    public String producent;

    @Column(name = "liczba_miejsc")
    public Integer liczbaMiejsc;

    @Column(name = "rok_produkcji")
    public Integer rokProdukcji;

    @Column(name = "status_techniczny", length = 30)
    public String statusTechniczny;

    public String getSamolotId() {
        return samolotId;
    }

    public void setSamolotId(String samolotId) {
        this.samolotId = samolotId;
    }

    public String getNumerSamolotu() {
        return numerSamolotu;
    }

    public void setNumerSamolotu(String numerSamolotu) {
        this.numerSamolotu = numerSamolotu;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getProducent() {
        return producent;
    }

    public void setProducent(String producent) {
        this.producent = producent;
    }

    public Integer getLiczbaMiejsc() {
        return liczbaMiejsc;
    }

    public void setLiczbaMiejsc(Integer liczbaMiejsc) {
        this.liczbaMiejsc = liczbaMiejsc;
    }

    public Integer getRokProdukcji() {
        return rokProdukcji;
    }

    public void setRokProdukcji(Integer rokProdukcji) {
        this.rokProdukcji = rokProdukcji;
    }

    public String getStatusTechniczny() {
        return statusTechniczny;
    }

    public void setStatusTechniczny(String statusTechniczny) {
        this.statusTechniczny = statusTechniczny;
    }

    @Override
    public String toString() {
        return "Airplane{" +
                "samolotId='" + samolotId + '\'' +
                ", numerSamolotu='" + numerSamolotu + '\'' +
                ", model='" + model + '\'' +
                ", producent='" + producent + '\'' +
                ", liczbaMiejsc=" + liczbaMiejsc +
                ", rokProdukcji=" + rokProdukcji +
                ", statusTechniczny='" + statusTechniczny + '\'' +
                '}';
    }
}
