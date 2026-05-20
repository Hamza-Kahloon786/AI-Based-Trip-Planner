import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import json
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# Encoding maps (must match app.py)
TRANSPORT_MAP = {'bus': 0, 'train': 1, 'car': 2, 'jeep': 3, 'flight': 4, 'mixed': 2}
ACCOMMODATION_MAP = {'camping': 0, 'guest_house': 1, 'budget_hotel': 2, 'standard_hotel': 3, 'luxury_hotel': 4, 'resort': 5}
STYLE_MAP = {'budget': 0, 'standard': 1, 'luxury': 2}


def generate_trip_cost_data(n=3000):
    """Generate synthetic Pakistani trip cost dataset"""
    np.random.seed(42)

    distance_km        = np.random.uniform(100, 2000, n)
    group_size         = np.random.randint(1, 21, n)
    trip_days          = np.random.randint(1, 15, n)
    transport_mode     = np.random.randint(0, 5, n)   # 0=bus 1=train 2=car 3=jeep 4=flight
    accommodation_type = np.random.randint(0, 6, n)   # 0=camping → 5=resort
    travel_style       = np.random.randint(0, 3, n)   # 0=budget 1=standard 2=luxury

    # Realistic PKR rates
    transport_rate_per_km = np.array([5, 8, 15, 20, 50])        # per km per person (one-way)
    accommodation_per_night = np.array([500, 1500, 3000, 6000, 15000, 25000])
    food_per_day_per_person = np.array([500, 1000, 2000])
    activity_per_day_per_person = np.array([200, 800, 2500])

    transport_cost    = transport_rate_per_km[transport_mode] * distance_km * 2 * group_size
    accommodation_cost = accommodation_per_night[accommodation_type] * trip_days
    food_cost         = food_per_day_per_person[travel_style] * trip_days * group_size
    activity_cost     = activity_per_day_per_person[travel_style] * trip_days * group_size
    misc_cost         = (transport_cost + accommodation_cost + food_cost + activity_cost) * 0.10

    total_cost = transport_cost + accommodation_cost + food_cost + activity_cost + misc_cost

    # Add ±15% noise to simulate real-world variation
    noise = np.random.uniform(0.85, 1.15, n)
    total_cost = total_cost * noise

    return pd.DataFrame({
        'distance_km':        distance_km,
        'group_size':         group_size,
        'trip_days':          trip_days,
        'transport_mode':     transport_mode,
        'accommodation_type': accommodation_type,
        'travel_style':       travel_style,
        'total_cost_pkr':     total_cost,
    })


def train_cost_model():
    print("=" * 50)
    print("Training Trip Cost Prediction Model...")
    print("=" * 50)

    df = generate_trip_cost_data(3000)
    print(f"Dataset size: {len(df)} samples")

    X = df[['distance_km', 'group_size', 'trip_days', 'transport_mode', 'accommodation_type', 'travel_style']]
    y = df['total_cost_pkr']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Train: {len(X_train)} | Test: {len(X_test)}")

    model = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1, max_depth=20)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2  = r2_score(y_test, y_pred)

    print(f"\nModel Evaluation:")
    print(f"  MAE (Mean Absolute Error): PKR {mae:,.0f}")
    print(f"  R² Score:                  {r2:.4f}")
    print(f"  Accuracy:                  ~{r2 * 100:.1f}%")

    print("\nFeature Importances:")
    features = ['distance_km', 'group_size', 'trip_days', 'transport_mode', 'accommodation_type', 'travel_style']
    for name, imp in sorted(zip(features, model.feature_importances_), key=lambda x: -x[1]):
        print(f"  {name:<22}: {imp:.4f}")

    model_path = os.path.join(MODEL_DIR, 'cost_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"\nModel saved → {model_path}")
    return model


def create_hotel_dataset():
    print("\n" + "=" * 50)
    print("Creating Hotel Recommendation Dataset...")
    print("=" * 50)

    hotels = [
        # ── Hunza ──────────────────────────────────────────
        {'name': 'Serena Hotel Hunza',        'destination': 'hunza',         'style': 'luxury',   'price_per_night': 25000, 'rating': 4.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View', 'Spa'],            'family_friendly': True,  'nearby': ['karimabad', 'altit fort', 'baltit fort']},
        {'name': 'Eagle Nest Hotel',           'destination': 'hunza',         'style': 'standard', 'price_per_night':  8000, 'rating': 4.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View'],                   'family_friendly': True,  'nearby': ['karimabad', 'duiker']},
        {'name': 'Hunza Serena Inn',           'destination': 'hunza',         'style': 'standard', 'price_per_night':  6500, 'rating': 4.3, 'type': 'Guest House','amenities': ['WiFi', 'Meals', 'Scenic View'],                          'family_friendly': True,  'nearby': ['karimabad']},
        {'name': 'Old Hunza Inn',              'destination': 'hunza',         'style': 'budget',   'price_per_night':  2500, 'rating': 3.8, 'type': 'Guest House','amenities': ['Meals', 'Basic Rooms'],                                  'family_friendly': False, 'nearby': ['karimabad']},
        {'name': 'Karimabad Guest House',      'destination': 'hunza',         'style': 'budget',   'price_per_night':  1800, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': False, 'nearby': ['altit fort']},

        # ── Skardu ─────────────────────────────────────────
        {'name': 'Shangrila Resort Skardu',    'destination': 'skardu',        'style': 'luxury',   'price_per_night': 22000, 'rating': 4.7, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Lake View', 'Boating'],            'family_friendly': True,  'nearby': ['upper kachura lake', 'shangrila lake']},
        {'name': 'K2 Motel Skardu',            'destination': 'skardu',        'style': 'standard', 'price_per_night':  7000, 'rating': 4.2, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View'],                   'family_friendly': True,  'nearby': ['skardu fort', 'kachura lake']},
        {'name': 'Indus Hotel Skardu',         'destination': 'skardu',        'style': 'standard', 'price_per_night':  5500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Garden'],                          'family_friendly': True,  'nearby': ['kachura lake', 'skardu bazaar']},
        {'name': 'Skardu View Hotel',          'destination': 'skardu',        'style': 'budget',   'price_per_night':  2800, 'rating': 3.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['skardu bazaar']},
        {'name': 'Concordia Hotel Skardu',     'destination': 'skardu',        'style': 'budget',   'price_per_night':  2000, 'rating': 3.4, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['skardu bazaar']},

        # ── Murree ─────────────────────────────────────────
        {'name': 'Pearl Continental Murree',   'destination': 'murree',        'style': 'luxury',   'price_per_night': 20000, 'rating': 4.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Spa', 'Forest View'],              'family_friendly': True,  'nearby': ['mall road', 'patriata']},
        {'name': 'Pine Hill Resort Bhurban',   'destination': 'murree',        'style': 'luxury',   'price_per_night': 18000, 'rating': 4.5, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Kids Area', 'Pine View', 'Pool'],  'family_friendly': True,  'nearby': ['bhurban', 'patriata']},
        {'name': 'Hotel One Murree',           'destination': 'murree',        'style': 'standard', 'price_per_night':  7500, 'rating': 4.3, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Hill View'],                        'family_friendly': True,  'nearby': ['mall road']},
        {'name': 'Murree Hills Hotel',         'destination': 'murree',        'style': 'budget',   'price_per_night':  3000, 'rating': 3.6, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['mall road']},
        {'name': 'Green Valley Guest House',   'destination': 'murree',        'style': 'budget',   'price_per_night':  1800, 'rating': 3.3, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': False, 'nearby': ['nathia gali']},

        # ── Swat ───────────────────────────────────────────
        {'name': 'Serena Hotel Swat',          'destination': 'swat',          'style': 'luxury',   'price_per_night': 18000, 'rating': 4.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Pool', 'River View'],              'family_friendly': True,  'nearby': ['mingora', 'malam jabba']},
        {'name': 'Swat Continental Hotel',     'destination': 'swat',          'style': 'standard', 'price_per_night':  6000, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Garden'],                          'family_friendly': True,  'nearby': ['mingora', 'kalam']},
        {'name': 'Green Valley Hotel Swat',    'destination': 'swat',          'style': 'budget',   'price_per_night':  2500, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': False, 'nearby': ['bahrain', 'kalam']},
        {'name': 'Kalam View Guest House',     'destination': 'swat',          'style': 'budget',   'price_per_night':  1500, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['kalam', 'ushu forest']},

        # ── Naran / Kaghan ─────────────────────────────────
        {'name': 'Naran Grand Hotel',          'destination': 'naran',         'style': 'standard', 'price_per_night':  6500, 'rating': 4.1, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'River View'],                      'family_friendly': True,  'nearby': ['saiful maluk lake', 'lulusar lake']},
        {'name': 'PTDC Motel Naran',           'destination': 'naran',         'style': 'standard', 'price_per_night':  5000, 'rating': 3.9, 'type': 'Motel',      'amenities': ['Restaurant', 'Mountain View', 'Basic Rooms'],            'family_friendly': True,  'nearby': ['saiful maluk lake']},
        {'name': 'Lalazar Hotel Naran',        'destination': 'naran',         'style': 'budget',   'price_per_night':  2200, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['babusar top']},
        {'name': 'Kaghan Valley Hotel',        'destination': 'naran',         'style': 'budget',   'price_per_night':  1800, 'rating': 3.3, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': False, 'nearby': ['kaghan']},

        # ── Neelum Valley ──────────────────────────────────
        {'name': 'Sharda Hill Resort',         'destination': 'neelum valley', 'style': 'standard', 'price_per_night':  5500, 'rating': 4.0, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'River View'],                      'family_friendly': True,  'nearby': ['sharda']},
        {'name': 'Kel Guest House',            'destination': 'neelum valley', 'style': 'budget',   'price_per_night':  2000, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['kel', 'arang kel']},
        {'name': 'Keran River Lodge',          'destination': 'neelum valley', 'style': 'standard', 'price_per_night':  4500, 'rating': 3.9, 'type': 'Guest House','amenities': ['WiFi', 'Meals', 'River View'],                           'family_friendly': True,  'nearby': ['keran']},

        # ── Fairy Meadows ──────────────────────────────────
        {'name': 'Fairy Meadows Camp',         'destination': 'fairy meadows', 'style': 'budget',   'price_per_night':  1500, 'rating': 4.2, 'type': 'Camping',    'amenities': ['Meals', 'Nanga Parbat View', 'Campfire'],                'family_friendly': False, 'nearby': ['nanga parbat base camp']},
        {'name': 'Raikot Serai',               'destination': 'fairy meadows', 'style': 'standard', 'price_per_night':  4000, 'rating': 4.0, 'type': 'Guest House','amenities': ['Meals', 'Mountain View'],                                'family_friendly': True,  'nearby': ['fairy meadows trek', 'nanga parbat']},

        # ── Islamabad ──────────────────────────────────────
        {'name': 'Marriott Islamabad',         'destination': 'islamabad',     'style': 'luxury',   'price_per_night': 30000, 'rating': 4.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Spa', 'Multiple Restaurants', 'Gym'],   'family_friendly': True,  'nearby': ['blue area', 'centaurus']},
        {'name': 'Serena Hotel Islamabad',     'destination': 'islamabad',     'style': 'luxury',   'price_per_night': 28000, 'rating': 4.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Spa', 'Restaurant'],                     'family_friendly': True,  'nearby': ['diplomatic enclave', 'f6']},
        {'name': 'Hotel One Islamabad',        'destination': 'islamabad',     'style': 'standard', 'price_per_night':  9000, 'rating': 4.2, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Gym'],                              'family_friendly': True,  'nearby': ['f6', 'centaurus']},
        {'name': 'Ramada Islamabad',           'destination': 'islamabad',     'style': 'standard', 'price_per_night':  7500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Pool'],                            'family_friendly': True,  'nearby': ['blue area']},

        # ── Lahore ─────────────────────────────────────────
        {'name': 'Pearl Continental Lahore',   'destination': 'lahore',        'style': 'luxury',   'price_per_night': 25000, 'rating': 4.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Spa', 'Multiple Restaurants'],           'family_friendly': True,  'nearby': ['liberty', 'gulberg']},
        {'name': 'Avari Hotel Lahore',         'destination': 'lahore',        'style': 'luxury',   'price_per_night': 22000, 'rating': 4.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Gym'],                     'family_friendly': True,  'nearby': ['mall road', 'gulberg']},
        {'name': 'Hotel One Lahore',           'destination': 'lahore',        'style': 'standard', 'price_per_night':  8000, 'rating': 4.3, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Gym'],                              'family_friendly': True,  'nearby': ['gulberg', 'mm alam road']},
        {'name': 'Grand Hotel Lahore',         'destination': 'lahore',        'style': 'budget',   'price_per_night':  3500, 'rating': 3.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['data darbar', 'anarkali']},

        # ── Gwadar ─────────────────────────────────────────
        {'name': 'PC Gwadar',                  'destination': 'gwadar',        'style': 'luxury',   'price_per_night': 18000, 'rating': 4.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Sea View', 'Pool'],                'family_friendly': True,  'nearby': ['hammerhead', 'ormara']},
        {'name': 'Gwadar Marriott',            'destination': 'gwadar',        'style': 'luxury',   'price_per_night': 20000, 'rating': 4.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Gym'],                     'family_friendly': True,  'nearby': ['gwadar port', 'hammerhead']},
        {'name': 'Beach View Hotel Gwadar',    'destination': 'gwadar',        'style': 'standard', 'price_per_night':  5000, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Sea View'],                        'family_friendly': True,  'nearby': ['hammerhead beach']},
    ]

    dataset = {'hotels': hotels, 'total': len(hotels)}
    path = os.path.join(MODEL_DIR, 'hotel_dataset.json')
    with open(path, 'w') as f:
        json.dump(dataset, f, indent=2)
    print(f"Hotel dataset saved → {path}")
    print(f"Total hotels: {len(hotels)}")
    return dataset


if __name__ == '__main__':
    train_cost_model()
    create_hotel_dataset()
    print("\nAll models trained and saved successfully!")
