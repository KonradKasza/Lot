package dev.ip.projekt.service;

import dev.ip.projekt.model.dto.PaymentInfo;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

// this is a dummy payment logic, for real deployment use 3 party service
@Service
public class PaymentService {

    public boolean processPayment(PaymentInfo info) {
        if (info.getValue() > 0) {
            return true;
        } else {
            return false;
        }
    }
}