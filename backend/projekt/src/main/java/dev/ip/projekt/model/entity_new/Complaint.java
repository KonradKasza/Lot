package dev.ip.projekt.model.entity_new;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "complaint", schema = "public")
public class Complaint {

    @Id
    @Column(name = "complaint_id", length = 26, nullable = false)
    public String complaintId;

    @Column(name = "complaint_category", length = 50)
    public String complaintCategory;

    @Column(name = "complaint_description", length = 4000)
    public String complaintDescription;

    @Column(name = "complaint_status", length = 20)
    public String complaintStatus;

    @Column(name = "report_date")
    public LocalDate reportDate;

    @Column(name = "resolution_date")
    public LocalDate resolutionDate;

    @Column(name = "customer_id", length = 29)
    public String customerId;

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public String getComplaintCategory() {
        return complaintCategory;
    }

    public void setComplaintCategory(String complaintCategory) {
        this.complaintCategory = complaintCategory;
    }

    public String getComplaintDescription() {
        return complaintDescription;
    }

    public void setComplaintDescription(String complaintDescription) {
        this.complaintDescription = complaintDescription;
    }

    public String getComplaintStatus() {
        return complaintStatus;
    }

    public void setComplaintStatus(String complaintStatus) {
        this.complaintStatus = complaintStatus;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
    }

    public LocalDate getResolutionDate() {
        return resolutionDate;
    }

    public void setResolutionDate(LocalDate resolutionDate) {
        this.resolutionDate = resolutionDate;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    @Override
    public String toString() {
        return "Complaint{" +
                "complaintId='" + complaintId + '\'' +
                ", complaintCategory='" + complaintCategory + '\'' +
                ", complaintDescription='" + complaintDescription + '\'' +
                ", complaintStatus='" + complaintStatus + '\'' +
                ", reportDate=" + reportDate +
                ", resolutionDate=" + resolutionDate +
                ", customerId='" + customerId + '\'' +
                '}';
    }
}

