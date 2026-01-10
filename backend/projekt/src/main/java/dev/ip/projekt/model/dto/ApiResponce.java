package dev.ip.projekt.model.dto;

public class ApiResponce {
    private Boolean success;
    private String message;
    private String status;

    public ApiResponce() {
        this(true, "ok");
    }

    public ApiResponce(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    static public ApiResponce makeSuccess(String msg) {
        return new ApiResponce(true, msg);
    }

    static public ApiResponce makeFailure(String msg) {
        return new ApiResponce(false, msg);
    }

    static public ApiResponce makeDefaultSuccess() {
        return new ApiResponce(true, "success");
    }

    static public ApiResponce makeDefaultFailure() {
        return new ApiResponce(false, "failure");
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setStatus(String status) { this.status = status; }


    public static ApiResponce makeUnauthorized() {
        ApiResponce res = new ApiResponce();
        res.setStatus("ERROR");
        res.setMessage("Nieautoryzowany dostęp");
        return res;
    }


    @Override
    public String toString() {
        return "ApiResponce{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}
