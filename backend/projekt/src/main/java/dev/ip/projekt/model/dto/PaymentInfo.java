package dev.ip.projekt.model.dto;

import java.sql.Timestamp;

public class PaymentInfo {
    private String reservationId;
    private String userName;
    private String userSurname;
    private long value;
    private String currency; // USD, PLN, etc
    private Timestamp date;
    private String cardNumber;

    public PaymentInfo() {
    }

    public PaymentInfo(String reservationId, String userName, String userSurname, long value, String currency, Timestamp date, String cardNumber) {
        this.reservationId = reservationId;
        this.userName = userName;
        this.userSurname = userSurname;
        this.value = value;
        this.currency = currency;
        this.date = date;
        this.cardNumber = cardNumber;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserSurname() {
        return userSurname;
    }

    public void setUserSurname(String userSurname) {
        this.userSurname = userSurname;
    }

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public String getReservationId() {
        return reservationId;
    }

    public void setReservationId(String reservationId) {
        reservationId = reservationId;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public String toString() {
        return "PaymentInfo{" +
                "reservationId='" + reservationId + '\'' +
                ", userName='" + userName + '\'' +
                ", userSurname='" + userSurname + '\'' +
                ", value=" + value +
                ", currency='" + currency + '\'' +
                ", date=" + date +
                '}';
    }
}
