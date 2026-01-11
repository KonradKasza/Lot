import psycopg2
from faker import Faker
import random
from datetime import datetime, timedelta

DB_CONFIG = {
    "dbname": "lotdb",
    "user": "admin",
    "password": "ip2026",
    "host": "localhost",
    "port": "5433"
}

fake = Faker(['pl_PL'])

def connect():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        return conn
    except Exception as e:
        print(f"Błąd połączenia z bazą: {e}")
        return None

def seed_data():
    conn = connect()
    if not conn:
        return
    cur = conn.cursor()

    print("--- Start generowania danych ---")

    # 1. Pobieranie Lotnisk (Tabela: airports)
    try:
        cur.execute("SELECT airport_id FROM airports;")
        airport_ids = [row[0] for row in cur.fetchall()]
    except Exception as e:
        print(f"Ostrzeżenie przy pobieraniu lotnisk: {e}")
        airport_ids = []

    if not airport_ids:
        print("Brak lotnisk w bazie! Używam losowych ID [1,2,3] jako atrapy.")
        airport_ids = [1, 2, 3]

    # 2. Samoloty (Tabela: samolot)
    airplane_ids = []
    print("Generowanie samolotów...")
    for _ in range(10):
        try:
            cur.execute("""
                INSERT INTO samolot (numer_samolotu, model, producent, liczba_miejsc, rok_produkcji, status_techniczny)
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING samolot_id;
            """, (
                f"SP-{random.randint(1000, 9999)}",
                random.choice(["Boeing 737", "Airbus A320", "Embraer 190"]),
                random.choice(["Boeing", "Airbus", "Embraer"]),
                random.randint(150, 250),
                random.randint(2010, 2024),
                "SPRAWNY"
            ))
            airplane_ids.append(cur.fetchone()[0])
        except Exception as e:
            print(f"Błąd przy samolocie: {e}")

    # 3. Trasy (Tabela: trasa_lotu)
    route_ids = []
    print("Generowanie tras...")
    for _ in range(20):
        try:
            start = random.choice(airport_ids)
            end = random.choice(airport_ids)
            while start == end:
                end = random.choice(airport_ids)
            
            cur.execute("""
                INSERT INTO trasa_lotu (lotnisko_start, lotnisko_end, dystans, czas_lotu, opis_trasy)
                VALUES (%s, %s, %s, %s, %s) RETURNING trasa_id;
            """, (start, end, random.randint(500, 5000), f"{random.randint(1, 10)}h", "Standardowa trasa"))
            route_ids.append(cur.fetchone()[0])
        except Exception as e:
            print(f"Błąd przy trasie: {e}")

    # 4. Klienci i Konta (Tabele: klient, user_account)
    user_account_ids = [] 
    print("Generowanie klientów i kont...")
    for _ in range(50):
        try:
            # A. Wstawiamy Klienta
            cur.execute("""
                INSERT INTO klient (imie, nazwisko, email, telefon, data_urodzenia, nr_dokumentu, data_rejestracji, status_lojalnosci)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING klient_id;
            """, (
                fake.first_name(), fake.last_name(), fake.unique.email(), 
                fake.phone_number(), fake.date_of_birth(minimum_age=18, maximum_age=80),
                fake.ssn(), datetime.now(), random.choice(["GOLD", "SILVER", "NONE"])
            ))
            client_id = cur.fetchone()[0]

            # B. Wstawiamy UserAccount (zgodnie z Twoją Javą)
            # Pola: username, email, password, klient_id
            cur.execute("""
                INSERT INTO user_account (username, email, password, klient_id)
                VALUES (%s, %s, %s, %s) RETURNING id;
            """, (
                fake.unique.user_name(), 
                fake.unique.email(), 
                "{bcrypt}$2a$10$wQ8...", 
                client_id
            ))
            user_account_ids.append(cur.fetchone()[0])
            
        except Exception as e:
            print(f"Pominięto użytkownika z powodu błędu (np. duplikat): {e}")

    # 5. Loty (Tabela: lot)
    flight_ids = []
    print("Generowanie lotów...")
    for _ in range(30):
        try:
            dept_date = fake.date_time_between(start_date="-1M", end_date="+1M")
            arr_date = dept_date + timedelta(hours=random.randint(1, 12))
            
            if route_ids and airplane_ids:
                cur.execute("""
                    INSERT INTO lot (numer_lotu, data_wylotu, data_przylotu, status_lotu, trasa_id, samolot_id)
                    VALUES (%s, %s, %s, %s, %s, %s) RETURNING lot_id;
                """, (
                    f"LOT{random.randint(100, 999)}", dept_date, arr_date, 
                    random.choice(["SCHEDULED", "LANDED", "DELAYED"]),
                    random.choice(route_ids), random.choice(airplane_ids)
                ))
                flight_ids.append(cur.fetchone()[0])
        except Exception as e:
            print(f"Błąd przy locie: {e}")

    # 6. Rezerwacje 
    print("Generowanie rezerwacji...")
    if user_account_ids and flight_ids:
        for _ in range(100):
            try:
                cur.execute("""
                    INSERT INTO reservation (user_id, flight_id, sit, reservation_code, reservation_status, total_cost, date_of_creation)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                """, (
                    random.choice(user_account_ids), # To ID z user_account
                    random.choice(flight_ids),
                    f"{random.randint(1, 30)}{random.choice(['A','B','C','D'])}",
                    random.randint(100000, 999999),
                    random.choice(["PAYED", "UNPAYED", "CANCELED"]),
                    random.randint(200, 2000),
                    datetime.now()
                ))
            except Exception as e:
                print(f"Błąd przy rezerwacji: {e}")
    else:
        print("Brak użytkowników lub lotów - pomijam rezerwacje.")

    cur.close()
    conn.close()
    print("--- SUKCES! Sprawdź bazę danych. ---")

if __name__ == "__main__":
    seed_data()