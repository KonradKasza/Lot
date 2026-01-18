"""
Random data generator for LOT database using Faker.
Generates realistic test data for all tables respecting foreign key constraints.
"""

import random
import string
from datetime import datetime, timedelta
from decimal import Decimal
import psycopg2
from faker import Faker
import bcrypt

# Initialize Faker with multiple locales for variety
fake = Faker(['en_US', 'pl_PL', 'de_DE', 'fr_FR', 'es_ES'])

# Database connection configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': 5433,
    'database': 'lotdb',
    'user': 'admin',
    'password': 'ip2026'
}

# Configuration for number of records to generate
CONFIG = {
    'airplanes': 50,
    'airports': 52,  # We have 52 real US airports
    'crews': 30,
    'crew_members_per_crew': (3, 8),  # min, max
    'customers': 500,
    'fares': 5,
    'flights': 1000,
    'complaints': 100,
    'reservations': 2000,
    'payments_per_reservation': (0, 2),  # min, max
}


def generate_ulid():
    """Generate a ULID-like identifier (26 characters)."""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=26))


def generate_customer_id():
    """Generate a customer ID (29 characters)."""
    return 'CUS' + generate_ulid()


def generate_complaint_id():
    """Generate a complaint ID (26 characters)."""
    return generate_ulid()


def get_connection():
    """Create and return a database connection."""
    return psycopg2.connect(**DB_CONFIG)


def clear_tables(cursor):
    """Clear all tables in correct order (respecting foreign keys)."""
    tables = [
        'payment',
        'reservation',
        'passenger',
        'complaint',
        'flight',
        'crew_member',
        'crew',
        'customer_account',
        'customer',
        'fare',
        'airplane',
        'airport',
        'admin_account'
    ]
    for table in tables:
        try:
            cursor.execute(f'TRUNCATE TABLE {table} CASCADE')
        except Exception as e:
            print(f"  Note: Table {table} may not exist yet: {e}")
    print("All tables cleared.")


def generate_airports(cursor, count):
    """Generate airport data - US airports only."""
    airports = []
    
    # Real US airport codes and data
    real_airports = [
        # California
        ('LAX', 'Los Angeles International Airport', 'Los Angeles', 'California', 'United States', 33.9416, -118.4085),
        ('SFO', 'San Francisco International Airport', 'San Francisco', 'California', 'United States', 37.6213, -122.3790),
        ('SAN', 'San Diego International Airport', 'San Diego', 'California', 'United States', 32.7336, -117.1897),
        ('SJC', 'San Jose International Airport', 'San Jose', 'California', 'United States', 37.3639, -121.9289),
        ('OAK', 'Oakland International Airport', 'Oakland', 'California', 'United States', 37.7213, -122.2208),
        # Texas
        ('DFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'Texas', 'United States', 32.8998, -97.0403),
        ('IAH', 'George Bush Intercontinental Airport', 'Houston', 'Texas', 'United States', 29.9902, -95.3368),
        ('AUS', 'Austin-Bergstrom International Airport', 'Austin', 'Texas', 'United States', 30.1975, -97.6664),
        ('SAT', 'San Antonio International Airport', 'San Antonio', 'Texas', 'United States', 29.5337, -98.4698),
        ('HOU', 'William P. Hobby Airport', 'Houston', 'Texas', 'United States', 29.6454, -95.2789),
        # Florida
        ('MIA', 'Miami International Airport', 'Miami', 'Florida', 'United States', 25.7959, -80.2870),
        ('MCO', 'Orlando International Airport', 'Orlando', 'Florida', 'United States', 28.4312, -81.3081),
        ('FLL', 'Fort Lauderdale-Hollywood International', 'Fort Lauderdale', 'Florida', 'United States', 26.0742, -80.1506),
        ('TPA', 'Tampa International Airport', 'Tampa', 'Florida', 'United States', 27.9755, -82.5332),
        ('JAX', 'Jacksonville International Airport', 'Jacksonville', 'Florida', 'United States', 30.4941, -81.6879),
        # New York
        ('JFK', 'John F. Kennedy International Airport', 'New York', 'New York', 'United States', 40.6413, -73.7781),
        ('LGA', 'LaGuardia Airport', 'New York', 'New York', 'United States', 40.7769, -73.8740),
        ('EWR', 'Newark Liberty International Airport', 'Newark', 'New Jersey', 'United States', 40.6895, -74.1745),
        ('BUF', 'Buffalo Niagara International Airport', 'Buffalo', 'New York', 'United States', 42.9405, -78.7322),
        # Illinois
        ('ORD', "O'Hare International Airport", 'Chicago', 'Illinois', 'United States', 41.9742, -87.9073),
        ('MDW', 'Chicago Midway International Airport', 'Chicago', 'Illinois', 'United States', 41.7868, -87.7522),
        # Georgia
        ('ATL', 'Hartsfield-Jackson Atlanta International', 'Atlanta', 'Georgia', 'United States', 33.6407, -84.4277),
        # Nevada
        ('LAS', 'Harry Reid International Airport', 'Las Vegas', 'Nevada', 'United States', 36.0840, -115.1537),
        # Arizona
        ('PHX', 'Phoenix Sky Harbor International Airport', 'Phoenix', 'Arizona', 'United States', 33.4373, -112.0078),
        # Washington
        ('SEA', 'Seattle-Tacoma International Airport', 'Seattle', 'Washington', 'United States', 47.4502, -122.3088),
        # Colorado
        ('DEN', 'Denver International Airport', 'Denver', 'Colorado', 'United States', 39.8561, -104.6737),
        # Massachusetts
        ('BOS', 'Boston Logan International Airport', 'Boston', 'Massachusetts', 'United States', 42.3656, -71.0096),
        # Michigan
        ('DTW', 'Detroit Metropolitan Airport', 'Detroit', 'Michigan', 'United States', 42.2124, -83.3534),
        # Minnesota
        ('MSP', 'Minneapolis-Saint Paul International', 'Minneapolis', 'Minnesota', 'United States', 44.8820, -93.2218),
        # North Carolina
        ('CLT', 'Charlotte Douglas International Airport', 'Charlotte', 'North Carolina', 'United States', 35.2140, -80.9431),
        ('RDU', 'Raleigh-Durham International Airport', 'Raleigh', 'North Carolina', 'United States', 35.8776, -78.7875),
        # Pennsylvania
        ('PHL', 'Philadelphia International Airport', 'Philadelphia', 'Pennsylvania', 'United States', 39.8729, -75.2437),
        ('PIT', 'Pittsburgh International Airport', 'Pittsburgh', 'Pennsylvania', 'United States', 40.4915, -80.2329),
        # Ohio
        ('CLE', 'Cleveland Hopkins International Airport', 'Cleveland', 'Ohio', 'United States', 41.4117, -81.8498),
        ('CMH', 'John Glenn Columbus International', 'Columbus', 'Ohio', 'United States', 39.9980, -82.8919),
        # Oregon
        ('PDX', 'Portland International Airport', 'Portland', 'Oregon', 'United States', 45.5898, -122.5951),
        # Tennessee
        ('BNA', 'Nashville International Airport', 'Nashville', 'Tennessee', 'United States', 36.1263, -86.6774),
        ('MEM', 'Memphis International Airport', 'Memphis', 'Tennessee', 'United States', 35.0424, -89.9767),
        # Missouri
        ('STL', 'St. Louis Lambert International Airport', 'St. Louis', 'Missouri', 'United States', 38.7487, -90.3700),
        ('MCI', 'Kansas City International Airport', 'Kansas City', 'Missouri', 'United States', 39.2976, -94.7139),
        # Louisiana
        ('MSY', 'Louis Armstrong New Orleans International', 'New Orleans', 'Louisiana', 'United States', 29.9934, -90.2580),
        # Maryland
        ('BWI', 'Baltimore/Washington International', 'Baltimore', 'Maryland', 'United States', 39.1754, -76.6683),
        # Utah
        ('SLC', 'Salt Lake City International Airport', 'Salt Lake City', 'Utah', 'United States', 40.7899, -111.9791),
        # Hawaii
        ('HNL', 'Daniel K. Inouye International Airport', 'Honolulu', 'Hawaii', 'United States', 21.3187, -157.9225),
        # Indiana
        ('IND', 'Indianapolis International Airport', 'Indianapolis', 'Indiana', 'United States', 39.7173, -86.2944),
        # Wisconsin
        ('MKE', 'Milwaukee Mitchell International Airport', 'Milwaukee', 'Wisconsin', 'United States', 42.9472, -87.8966),
        # Kentucky
        ('SDF', 'Louisville Muhammad Ali International', 'Louisville', 'Kentucky', 'United States', 38.1744, -85.7360),
        # Oklahoma
        ('OKC', 'Will Rogers World Airport', 'Oklahoma City', 'Oklahoma', 'United States', 35.3931, -97.6007),
        # Connecticut
        ('BDL', 'Bradley International Airport', 'Hartford', 'Connecticut', 'United States', 41.9389, -72.6832),
        # South Carolina
        ('CHS', 'Charleston International Airport', 'Charleston', 'South Carolina', 'United States', 32.8986, -80.0405),
        # Alabama
        ('BHM', 'Birmingham-Shuttlesworth International', 'Birmingham', 'Alabama', 'United States', 33.5629, -86.7535),
        # New Mexico
        ('ABQ', 'Albuquerque International Sunport', 'Albuquerque', 'New Mexico', 'United States', 35.0402, -106.6094),
    ]
    
    # Use all real airports (limited to count)
    for airport in real_airports[:min(count, len(real_airports))]:
        airports.append(airport)
    
    # If we need more airports, we won't generate random ones - just use what we have
    # This ensures all airports are valid US airports with proper states
    
    insert_query = """
        INSERT INTO airport (airport_id, airport_name, city, state, country, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, airports)
    print(f"Generated {len(airports)} airports.")
    return [a[0] for a in airports]  # Return airport IDs


def generate_airplanes(cursor, count):
    """Generate airplane data."""
    airplanes = []
    
    models = [
        ('Boeing', '737-800', 189),
        ('Boeing', '787-9 Dreamliner', 296),
        ('Boeing', '777-300ER', 396),
        ('Airbus', 'A320neo', 194),
        ('Airbus', 'A321neo', 244),
        ('Airbus', 'A330-300', 277),
        ('Airbus', 'A350-900', 325),
        ('Embraer', 'E195-E2', 146),
        ('Embraer', 'E190', 114),
        ('Bombardier', 'CRJ900', 90),
    ]
    
    statuses = ['operational', 'maintenance', 'standby', 'retired']
    
    for i in range(count):
        samolot_id = generate_ulid()
        manufacturer, model, seats = random.choice(models)
        airplanes.append((
            samolot_id,
            f'SP-L{fake.bothify(text="??").upper()}{random.randint(1, 9)}',  # Polish registration
            model,
            manufacturer,
            seats + random.randint(-10, 10),  # Slight variation in seats
            random.randint(2010, 2024),
            random.choices(statuses, weights=[0.7, 0.15, 0.1, 0.05])[0]
        ))
    
    insert_query = """
        INSERT INTO airplane (samolot_id, numer_samolotu, model, producent, liczba_miejsc, rok_produkcji, status_techniczny)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, airplanes)
    print(f"Generated {len(airplanes)} airplanes.")
    return [a[0] for a in airplanes]  # Return airplane IDs


def generate_crews(cursor, count):
    """Generate crew data."""
    crews = []
    crew_types = ['cockpit', 'cabin', 'mixed']
    
    for i in range(count):
        crews.append((
            i + 1,  # crew_id
            f'Crew-{fake.bothify(text="??##").upper()}',
            random.choice(crew_types)
        ))
    
    insert_query = """
        INSERT INTO crew (crew_id, crew_name, crew_type)
        VALUES (%s, %s, %s)
    """
    cursor.executemany(insert_query, crews)
    
    print(f"Generated {len(crews)} crews.")
    return [c[0] for c in crews]  # Return crew IDs


def generate_crew_members(cursor, crew_ids, members_range):
    """Generate crew member data."""
    crew_members = []
    
    roles = {
        'cockpit': ['Captain', 'First Officer', 'Second Officer'],
        'cabin': ['Purser', 'Senior Flight Attendant', 'Flight Attendant'],
        'mixed': ['Captain', 'First Officer', 'Purser', 'Flight Attendant']
    }
    
    statuses = ['active', 'on_leave', 'training', 'inactive']
    
    member_id = 1
    for crew_id in crew_ids:
        num_members = random.randint(*members_range)
        for _ in range(num_members):
            role = random.choice(roles.get('mixed', roles['cabin']))
            crew_members.append((
                member_id,  # crew_member_id
                crew_id,
                fake.first_name(),
                fake.last_name(),
                role,
                fake.bothify(text='LIC-######'),
                fake.date_between(start_date='-15y', end_date='-1y'),
                random.choices(statuses, weights=[0.8, 0.1, 0.05, 0.05])[0]
            ))
            member_id += 1
    
    insert_query = """
        INSERT INTO crew_member (crew_member_id, crew_id, first_name, last_name, role, license_number, employment_date, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, crew_members)
    print(f"Generated {len(crew_members)} crew members.")


def generate_customers(cursor, count):
    """Generate customer data."""
    customers = []
    
    genders = ['Male', 'Female', 'Other', 'Prefer not to say']
    loyalty_statuses = ['Bronze', 'Silver', 'Gold', 'Platinum', None]
    nationalities = ['Polish', 'German', 'French', 'British', 'American', 'Spanish', 'Italian', 'Dutch']
    
    for i in range(count):
        customer_id = generate_customer_id()
        birth_date = fake.date_of_birth(minimum_age=18, maximum_age=85)
        age = (datetime.now().date() - birth_date).days // 365
        
        customers.append((
            customer_id,
            fake.first_name(),
            fake.last_name(),
            random.choice(genders),
            age,
            random.choice(nationalities),
            fake.phone_number()[:20],
            birth_date,
            fake.bothify(text='??#######').upper(),
            fake.date_between(start_date='-5y', end_date='today'),
            random.choices(loyalty_statuses, weights=[0.4, 0.25, 0.2, 0.1, 0.05])[0]
        ))
    
    insert_query = """
        INSERT INTO customer (customer_id, first_name, last_name, gender, age, nationality, phone, birth_date, document_number, registration_date, loyalty_status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, customers)
    print(f"Generated {len(customers)} customers.")
    return [c[0] for c in customers]  # Return customer IDs


def hash_password(password):
    """Hash password using bcrypt (compatible with Spring Security)."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def generate_customer_accounts(cursor, customer_ids):
    """Generate customer account data."""
    accounts = []
    
    consents = ['all', 'marketing', 'essential', 'none']
    preferences = ['email', 'sms', 'push', 'none']
    
    # Pre-hash a common password for all test users (for easier testing)
    test_password_hash = hash_password('testtest')
    
    # Create a test account with known credentials
    test_customer_id = customer_ids[0]
    accounts.append((
        test_customer_id,
        'testuser',
        'test@test.com',
        test_password_hash,
        fake.date_between(start_date='-3y', end_date='today'),
        'all',
        'email'
    ))
    
    # Create admin test account
    admin_customer_id = customer_ids[1]
    admin_password_hash = hash_password('adminadmin')
    accounts.append((
        admin_customer_id,
        'admin',
        'admin@admin.com',
        admin_password_hash,
        fake.date_between(start_date='-3y', end_date='today'),
        'all',
        'email'
    ))
    
    # Generate remaining accounts with random passwords
    for customer_id in customer_ids[2:]:
        accounts.append((
            customer_id,  # account_id is same as customer_id (FK constraint)
            fake.user_name(),
            fake.email(),
            test_password_hash,  # Use same hash for easier testing
            fake.date_between(start_date='-3y', end_date='today'),
            random.choice(consents),
            random.choice(preferences)
        ))
    
    insert_query = """
        INSERT INTO customer_account (account_id, login, email, password_hash, login_date, consents, preferences)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, accounts)
    print(f"Generated {len(accounts)} customer accounts.")
    print("  - Test account: test@test.com / testtest")
    print("  - Admin account: admin@admin.com / adminadmin")
    return [a[0] for a in accounts]  # Return account IDs


def generate_admin_accounts(cursor):
    """Generate admin account data with different roles."""
    admins = []
    now = datetime.now()
    
    # Pre-hash passwords
    worker_password = hash_password('worker123')
    manager_password = hash_password('manager123')
    admin_password = hash_password('admin123')
    
    # Create admin accounts for each role
    admins.append((
        'worker',
        'worker@lot.com',
        worker_password,
        'Jan',
        'Kowalski',
        'WORKER',
        True,
        now,
        None,
        None
    ))
    
    admins.append((
        'manager',
        'manager@lot.com',
        manager_password,
        'Anna',
        'Nowak',
        'MANAGER',
        True,
        now,
        None,
        None
    ))
    
    admins.append((
        'superadmin',
        'superadmin@lot.com',
        admin_password,
        'Piotr',
        'Wiśniewski',
        'ADMIN',
        True,
        now,
        None,
        None
    ))
    
    # Additional test accounts
    admins.append((
        'worker2',
        'worker2@lot.com',
        worker_password,
        'Maria',
        'Zielińska',
        'WORKER',
        True,
        now,
        None,
        None
    ))
    
    admins.append((
        'manager2',
        'manager2@lot.com',
        manager_password,
        'Tomasz',
        'Lewandowski',
        'MANAGER',
        True,
        now,
        None,
        None
    ))
    
    insert_query = """
        INSERT INTO admin_account (username, email, password_hash, first_name, last_name, role, is_active, created_at, last_login, created_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, admins)
    print(f"Generated {len(admins)} admin accounts.")
    print("  - Worker: worker@lot.com / worker123")
    print("  - Manager: manager@lot.com / manager123")
    print("  - Admin: superadmin@lot.com / admin123")


def generate_fares(cursor):
    """Generate fare/tariff data."""
    fares = [
        (1, 'Economy Saver', 'Basic economy fare with no changes or refunds', False, False, Decimal('99.00')),
        (2, 'Economy Flex', 'Economy fare with free changes', False, True, Decimal('199.00')),
        (3, 'Economy Premium', 'Premium economy with full flexibility', True, True, Decimal('349.00')),
        (4, 'Business', 'Business class with all amenities', True, True, Decimal('799.00')),
        (5, 'First Class', 'First class luxury experience', True, True, Decimal('1499.00')),
    ]
    
    insert_query = """
        INSERT INTO fare (fare_id, fare_name, opis, refundable, changeable, base_price)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, fares)
    
    print(f"Generated {len(fares)} fares.")
    return [f[0] for f in fares]  # Return fare IDs


def generate_flights(cursor, count, airport_ids, airplane_ids, crew_ids):
    """Generate flight data."""
    flights = []
    
    for i in range(count):
        start_airport = random.choice(airport_ids)
        end_airport = random.choice([a for a in airport_ids if a != start_airport])
        
        # Generate mostly future flights for testing
        flight_date = fake.date_between(start_date='today', end_date='+6m')
        
        # Times in minutes from midnight
        scheduled_departure = random.randint(300, 1380)  # 5:00 - 23:00
        flight_duration = random.randint(60, 720)  # 1-12 hours
        scheduled_arrival = (scheduled_departure + flight_duration) % 1440
        
        # Actual times with some variance
        delay = random.randint(-10, 120) if random.random() > 0.3 else 0
        actual_departure = max(0, scheduled_departure + delay) if delay != 0 else None
        actual_arrival = (scheduled_arrival + delay) % 1440 if delay != 0 else None
        
        # Cancellation (5% chance)
        is_cancelled = random.random() < 0.05
        cancellation_status = 1 if is_cancelled else 0
        cancellation_code = random.choice(['A', 'B', 'C', 'D']) if is_cancelled else None
        
        flights.append((
            i + 1,  # flight_id
            random.randint(1000, 9999),  # flight_number
            flight_date,
            start_airport,
            end_airport,
            scheduled_departure,
            actual_departure,
            scheduled_arrival,
            actual_arrival,
            cancellation_status,
            cancellation_code,
            flight_duration,
            flight_duration + (delay if delay > 0 else 0) if not is_cancelled else None,
            random.randint(200, 8000),  # distance in km
            random.choice(airplane_ids),
            random.choice(crew_ids)
        ))
    
    insert_query = """
        INSERT INTO flight (flight_id, flight_number, flight_date, start_airport, end_airport, 
                          scheduled_departure, actual_departure, scheduled_arrival, actual_arrival,
                          cancellation_status, cancellation_code, scheduled_flight_time, actual_flight_time,
                          dystans, samolot_id, zaloga_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, flights)
    
    print(f"Generated {len(flights)} flights.")
    return [f[0] for f in flights]  # Return flight IDs


def generate_complaints(cursor, count, customer_ids):
    """Generate complaint data."""
    complaints = []
    
    categories = ['Delay', 'Lost Luggage', 'Service Quality', 'Booking Issue', 'Refund Request', 'Other']
    statuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'Rejected']
    
    complaint_descriptions = [
        "My flight was delayed by more than 3 hours without proper communication.",
        "My luggage was lost and I haven't received any update on its location.",
        "The cabin crew was unprofessional during the flight.",
        "I was unable to complete my booking online and lost my preferred seats.",
        "I am requesting a full refund for my cancelled flight.",
        "The food quality on the flight was below expectations.",
        "My seat was broken and uncomfortable throughout the flight.",
        "I was denied boarding despite having a valid ticket.",
        "The entertainment system was not working during my long-haul flight.",
        "I need compensation for expenses due to flight cancellation.",
    ]
    
    for i in range(count):
        complaint_id = generate_complaint_id()
        report_date = fake.date_between(start_date='-1y', end_date='today')
        status = random.choice(statuses)
        resolution_date = report_date + timedelta(days=random.randint(1, 30)) if status in ['Resolved', 'Closed'] else None
        
        complaints.append((
            complaint_id,
            random.choice(categories),
            random.choice(complaint_descriptions),
            status,
            report_date,
            resolution_date,
            random.choice(customer_ids)
        ))
    
    insert_query = """
        INSERT INTO complaint (complaint_id, complaint_category, complaint_description, complaint_status, report_date, resolution_date, customer_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, complaints)
    print(f"Generated {len(complaints)} complaints.")
    return [c[0] for c in complaints]  # Return complaint IDs


def generate_reservations(cursor, count, account_ids, flight_ids, fare_ids, complaint_ids):
    """Generate reservation data."""
    reservations = []
    
    statuses = ['Confirmed', 'Pending', 'Cancelled', 'Completed', 'No-show']
    ticket_statuses = ['Issued', 'Pending', 'Void', 'Refunded']
    luggage_options = ['None', 'Cabin only', '1x23kg', '2x23kg', '1x32kg']
    
    # Assign complaints to some reservations (not all)
    complaint_pool = complaint_ids.copy()
    random.shuffle(complaint_pool)
    
    for i in range(count):
        creation_date = fake.date_between(start_date='-1y', end_date='today')
        modification_date = creation_date + timedelta(days=random.randint(0, 30)) if random.random() > 0.5 else None
        
        fare_id = random.choice(fare_ids)
        base_multiplier = random.uniform(0.8, 2.5)
        total_price = Decimal(str(round(100 * base_multiplier, 2)))
        
        # Generate seat (e.g., 12A, 24F)
        row = random.randint(1, 40)
        seat_letter = random.choice('ABCDEF')
        seat = f"{row}{seat_letter}"
        
        # Assign complaint to ~10% of reservations
        complaint_id = None
        if random.random() < 0.1 and complaint_pool:
            complaint_id = complaint_pool.pop()
        
        reservations.append((
            i + 1,  # reservation_id
            random.choice(statuses),
            creation_date,
            modification_date,
            total_price,
            fake.bothify(text='??????').upper(),  # reservation_code
            random.choice(luggage_options),
            random.choice(account_ids),
            random.choice(flight_ids),
            fare_id,
            fake.bothify(text='###-#######'),  # ticket_number
            random.choice(ticket_statuses),
            seat,
            complaint_id
        ))
    
    insert_query = """
        INSERT INTO reservation (reservation_id, reservation_status, creation_date, modification_date, total_price, 
                                reservation_code, luggage, account_id, flight_id, fare_id,
                                ticket_number, ticket_status, seat, complaint_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, reservations)
    
    print(f"Generated {len(reservations)} reservations.")
    return [r[0] for r in reservations]  # Return reservation IDs


def generate_payments(cursor, reservation_ids, payments_range):
    """Generate payment data."""
    payments = []
    
    methods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal', 'Apple Pay', 'Google Pay']
    statuses = ['Completed', 'Pending', 'Failed', 'Refunded']
    currencies = ['PLN', 'EUR', 'USD', 'GBP']
    
    payment_id = 1
    for reservation_id in reservation_ids:
        num_payments = random.randint(*payments_range)
        for _ in range(num_payments):
            payment_date = fake.date_time_between(start_date='-1y', end_date='now')
            
            payments.append((
                payment_id,  # payment_id
                int(reservation_id),  # reservation_id as integer
                Decimal(str(round(random.uniform(50, 2000), 2))),
                random.choice(currencies),
                random.choice(methods),
                random.choices(statuses, weights=[0.85, 0.05, 0.05, 0.05])[0],
                payment_date,
                fake.uuid4()
            ))
            payment_id += 1
    
    insert_query = """
        INSERT INTO payment (payment_id, reservation_id, amount, currency, payment_method, payment_status, payment_date, transaction_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, payments)
    print(f"Generated {len(payments)} payments.")


def reset_sequences(cursor):
    """Reset all sequences to match the max IDs in their respective tables."""
    print("\nResetting database sequences...")
    
    # List of (table_name, column_name) tuples for tables with sequences
    sequence_tables = [
        ('reservation', 'reservation_id'),
        ('flight', 'flight_id'),
        ('payment', 'payment_id'),
        ('crew', 'crew_id'),
        ('crew_member', 'crew_member_id'),
        ('fare', 'fare_id'),
        ('admin_account', 'admin_id'),
        ('passenger', 'passenger_id'),
    ]
    
    for table, column in sequence_tables:
        try:
            # Get the sequence name
            cursor.execute(f"SELECT pg_get_serial_sequence('{table}', '{column}')")
            result = cursor.fetchone()
            if result and result[0]:
                seq_name = result[0]
                # Set sequence to max value + 1
                cursor.execute(f"""
                    SELECT setval('{seq_name}', COALESCE((SELECT MAX({column}) FROM {table}), 0) + 1, false)
                """)
                print(f"  Reset sequence for {table}.{column}")
        except Exception as e:
            print(f"  Warning: Could not reset sequence for {table}.{column}: {e}")
    
    print("Sequences reset completed.")


def main():
    """Main function to generate all test data."""
    print("Starting data generation...")
    print("=" * 50)
    
    conn = None
    cursor = None
    
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Clear existing data
        clear_tables(cursor)
        conn.commit()
        
        # Generate data in order respecting foreign keys
        print("\n1. Generating independent tables...")
        airport_ids = generate_airports(cursor, CONFIG['airports'])
        airplane_ids = generate_airplanes(cursor, CONFIG['airplanes'])
        crew_ids = generate_crews(cursor, CONFIG['crews'])
        generate_crew_members(cursor, crew_ids, CONFIG['crew_members_per_crew'])
        customer_ids = generate_customers(cursor, CONFIG['customers'])
        account_ids = generate_customer_accounts(cursor, customer_ids)
        fare_ids = generate_fares(cursor)
        generate_admin_accounts(cursor)  # Generate admin accounts
        conn.commit()
        
        print("\n2. Generating flights...")
        flight_ids = generate_flights(cursor, CONFIG['flights'], airport_ids, airplane_ids, crew_ids)
        conn.commit()
        
        print("\n3. Generating complaints...")
        complaint_ids = generate_complaints(cursor, CONFIG['complaints'], customer_ids)
        conn.commit()
        
        print("\n4. Generating reservations...")
        reservation_ids = generate_reservations(cursor, CONFIG['reservations'], account_ids, flight_ids, fare_ids, complaint_ids)
        conn.commit()
        
        print("\n5. Generating payments...")
        generate_payments(cursor, reservation_ids, CONFIG['payments_per_reservation'])
        conn.commit()
        
        # Reset sequences to match the data
        print("\n6. Resetting sequences...")
        reset_sequences(cursor)
        conn.commit()
        
        print("\n" + "=" * 50)
        print("Data generation completed successfully!")
        print("=" * 50)
        
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    main()
