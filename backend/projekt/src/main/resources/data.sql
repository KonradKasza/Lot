INSERT INTO Flights (
    date_of_departure, date_of_arrival, start_airport, end_airport
) VALUES (
    '2024-11-01 06:00:00', '2024-11-02 08:00:00', 'Weliczka', 'Drought'
);

INSERT INTO Flights (
    date_of_departure, date_of_arrival, start_airport, end_airport
) VALUES (
    '2024-11-03 12:00:00', '2024-11-04 19:00:00', 'Moskov', 'Paris'
);

INSERT INTO Flights (
    date_of_departure, date_of_arrival, start_airport, end_airport
) VALUES (
    '2024-11-03 12:00:00', '2024-11-04 19:00:00', 'Moskov', 'Paris'
);

INSERT INTO Reservation (
    user_id, flight_id, reservation_status, date_of_creation, date_of_modification,
       total_cost, reservation_code, sit
) VALUES (
    1, 0, 'PAYED', '2024-11-04 19:00:00', '2024-11-04 19:00:00',
    900, 111222, 'A2'
);

INSERT INTO Reservation (
     user_id, flight_id, reservation_status, date_of_creation, date_of_modification,
        total_cost, reservation_code, sit
) VALUES (
    1, 1, 'PAYED', '2024-11-04 19:00:00', '2024-11-04 19:00:00',
    90000, 111222, 'A1'
);

INSERT INTO Reservation (
     user_id, flight_id, reservation_status, date_of_creation, date_of_modification,
        total_cost, reservation_code, sit
) VALUES (
    1, 2, 'PAYED', '2024-11-04 19:00:00', '2024-11-04 19:00:00',
    1900, 111222, 'A3'
);