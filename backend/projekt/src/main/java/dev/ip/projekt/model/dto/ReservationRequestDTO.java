package dev.ip.projekt.model.dto;

public class ReservationRequestDTO {
    private ReservationDTO reservationDTO;
    private PaymentInfo paymentInfo;

    public ReservationRequestDTO() {
    }

    public ReservationRequestDTO(ReservationDTO reservationDTO, PaymentInfo paymentInfo) {
        this.reservationDTO = reservationDTO;
        this.paymentInfo = paymentInfo;
    }

    public ReservationDTO getReservationDTO() {
        return reservationDTO;
    }

    public void setReservationDTO(ReservationDTO reservationDTO) {
        this.reservationDTO = reservationDTO;
    }

    public PaymentInfo getPaymentInfo() {
        return paymentInfo;
    }

    public void setPaymentInfo(PaymentInfo paymentInfo) {
        this.paymentInfo = paymentInfo;
    }
}
