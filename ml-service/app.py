# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import json
import os

FEATURE_COLUMNS = ['distance_km', 'group_size', 'trip_days', 'transport_mode', 'accommodation_type', 'travel_style']

app = Flask(__name__)
CORS(app)

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

cost_model     = None
hotel_dataset  = None
climate_dataset = None

MONTHS = ['january', 'february', 'march', 'april', 'may', 'june',
          'july', 'august', 'september', 'october', 'november', 'december']

# Encoding maps (must match train_models.py)
TRANSPORT_MAP     = {'bus': 0, 'train': 1, 'car': 2, 'jeep': 3, 'flight': 4, 'mixed': 2, 'private driver': 2}
ACCOMMODATION_MAP = {'camping': 0, 'guest_house': 1, 'guest house': 1, 'budget_hotel': 2, 'budget hotel': 2,
                     'standard_hotel': 3, 'standard hotel': 3, 'luxury_hotel': 4, 'luxury hotel': 4, 'resort': 5}
STYLE_MAP         = {'budget': 0, 'standard': 1, 'luxury': 2}


def load_models():
    global cost_model, hotel_dataset, climate_dataset
    try:
        cost_path    = os.path.join(MODEL_DIR, 'cost_model.pkl')
        hotel_path   = os.path.join(MODEL_DIR, 'hotel_dataset.json')
        climate_path = os.path.join(MODEL_DIR, 'climate_dataset.json')

        if os.path.exists(cost_path):
            with open(cost_path, 'rb') as f:
                cost_model = pickle.load(f)
            print("Cost model loaded.")
        else:
            print("WARNING: cost_model.pkl not found. Run train_models.py first.")

        if os.path.exists(hotel_path):
            with open(hotel_path, 'r') as f:
                hotel_dataset = json.load(f)
            print(f"Hotel dataset loaded ({hotel_dataset.get('total', 0)} hotels).")
        else:
            print("WARNING: hotel_dataset.json not found. Run train_models.py first.")

        if os.path.exists(climate_path):
            with open(climate_path, 'r', encoding='utf-8') as f:
                climate_dataset = json.load(f)
            print(f"Climate dataset loaded ({climate_dataset.get('total', 0)} destinations).")
        else:
            print("WARNING: climate_dataset.json not found. Run train_models.py first.")

    except Exception as e:
        print(f"Error loading models: {e}")


def fallback_cost(distance_km, group_size, trip_days, transport_enc, accommodation_enc, style_enc):
    transport_rates     = [5, 8, 15, 20, 50]
    accommodation_rates = [500, 1500, 3000, 6000, 15000, 25000]
    food_rates          = [500, 1000, 2000]
    activity_rates      = [200, 800, 2500]

    t_enc = min(transport_enc, 4)
    a_enc = min(accommodation_enc, 5)
    s_enc = min(style_enc, 2)

    transport    = transport_rates[t_enc] * distance_km * 2 * group_size
    accommodation = accommodation_rates[a_enc] * trip_days
    food         = food_rates[s_enc] * trip_days * group_size
    activities   = activity_rates[s_enc] * trip_days * group_size
    misc         = (transport + accommodation + food + activities) * 0.10
    return transport + accommodation + food + activities + misc


def cost_breakdown(distance_km, group_size, trip_days, transport_enc, accommodation_enc, style_enc):
    transport_rates     = [5, 8, 15, 20, 50]
    accommodation_rates = [500, 1500, 3000, 6000, 15000, 25000]
    food_rates          = [500, 1000, 2000]
    activity_rates      = [200, 800, 2500]

    t_enc = min(transport_enc, 4)
    a_enc = min(accommodation_enc, 5)
    s_enc = min(style_enc, 2)

    transport    = round(transport_rates[t_enc] * distance_km * 2 * group_size)
    accommodation = round(accommodation_rates[a_enc] * trip_days)
    food         = round(food_rates[s_enc] * trip_days * group_size)
    activities   = round(activity_rates[s_enc] * trip_days * group_size)
    misc         = round((transport + accommodation + food + activities) * 0.10)

    return {
        'transport_pkr':     transport,
        'accommodation_pkr': accommodation,
        'food_pkr':          food,
        'activities_pkr':    activities,
        'miscellaneous_pkr': misc,
    }


# ─────────────────────── Routes ───────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'cost_model_loaded':    cost_model is not None,
        'hotel_dataset_loaded': hotel_dataset is not None,
        'climate_dataset_loaded': climate_dataset is not None,
    })


@app.route('/predict-cost', methods=['POST'])
def predict_cost():
    try:
        data = request.json or {}

        distance_km        = float(data.get('distance_km', 500))
        group_size         = int(data.get('group_size', 2))
        trip_days          = int(data.get('trip_days', 3))
        transport_mode     = str(data.get('transport_mode', 'car')).lower().strip()
        accommodation_type = str(data.get('accommodation_type', 'standard_hotel')).lower().strip()
        travel_style       = str(data.get('travel_style', 'standard')).lower().strip()

        transport_enc     = TRANSPORT_MAP.get(transport_mode, 2)
        accommodation_enc = ACCOMMODATION_MAP.get(accommodation_type, 3)
        style_enc         = STYLE_MAP.get(travel_style, 1)

        features = pd.DataFrame(
            [[distance_km, group_size, trip_days, transport_enc, accommodation_enc, style_enc]],
            columns=FEATURE_COLUMNS
        )

        if cost_model is not None:
            total_cost = float(cost_model.predict(features)[0])
        else:
            total_cost = fallback_cost(distance_km, group_size, trip_days, transport_enc, accommodation_enc, style_enc)

        per_person_cost = total_cost / max(group_size, 1)

        return jsonify({
            'total_cost_pkr':      round(total_cost),
            'per_person_cost_pkr': round(per_person_cost),
            'breakdown':           cost_breakdown(distance_km, group_size, trip_days, transport_enc, accommodation_enc, style_enc),
            'model_used':          'RandomForest' if cost_model else 'formula_fallback',
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/recommend-hotels', methods=['POST'])
def recommend_hotels():
    try:
        data = request.json or {}

        destination      = str(data.get('destination', '')).lower().strip()
        budget_per_night = float(data.get('budget_per_night', 5000))
        travel_style     = str(data.get('travel_style', 'standard')).lower().strip()
        group_size       = int(data.get('group_size', 2))

        origin = str(data.get('origin', '')).lower().strip()

        if not hotel_dataset:
            return jsonify({'error': 'Hotel dataset not loaded. Run train_models.py first.'}), 503

        hotels = hotel_dataset.get('hotels', [])

        # Words that Google Places appends but are not part of the city name
        STOP_WORDS = {'city', 'district', 'tehsil', 'division', 'area', 'town',
                      'village', 'road', 'rd', 'new', 'old', 'greater', 'metropolitan'}

        def extract_keywords(query):
            """Return meaningful words from a location string (strips suffixes like 'City')."""
            if not query:
                return []
            return [w for w in query.lower().split() if w not in STOP_WORDS and len(w) >= 3]

        def match_hotels(query):
            keywords = extract_keywords(query)
            if not keywords:
                return []
            return [
                h for h in hotels
                if any(kw in h['destination'].lower() for kw in keywords)
                or any(
                    any(kw in loc.lower() for kw in keywords)
                    for loc in h.get('nearby', [])
                )
            ]

        # 1. Try destination keywords (e.g. "Narang Mandi" → ["narang", "mandi"])
        destination_hotels = match_hotels(destination)
        location_used = destination

        # 2. Fallback: origin keywords (e.g. "Lahore City" → ["lahore"] → matches Lahore hotels)
        if not destination_hotels and origin:
            destination_hotels = match_hotels(origin)
            location_used = origin

        # 3. Last resort: all hotels
        if not destination_hotels:
            destination_hotels = hotels
            location_used = 'pakistan'

        # Score each hotel
        scored = []
        for hotel in destination_hotels:
            score = 0.0
            price = hotel['price_per_night']

            # Budget fit (higher score = closer to budget without being too expensive)
            if price <= budget_per_night:
                score += 3.0 * (price / budget_per_night)   # closer to budget = better use
            elif price <= budget_per_night * 1.25:
                score += 1.5                                  # slightly over — acceptable
            # else: too expensive, no budget score

            # Style match
            hotel_style_enc = STYLE_MAP.get(hotel.get('style', 'standard'), 1)
            user_style_enc  = STYLE_MAP.get(travel_style, 1)
            style_diff      = abs(hotel_style_enc - user_style_enc)
            if style_diff == 0:
                score += 4.0
            elif style_diff == 1:
                score += 2.0

            # Group suitability
            if group_size >= 4 and hotel.get('family_friendly', False):
                score += 1.5

            # Rating bonus
            score += hotel.get('rating', 3.0) * 0.3

            scored.append({**hotel, 'match_score': round(score, 2)})

        scored.sort(key=lambda x: x['match_score'], reverse=True)
        top5 = scored[:5]

        return jsonify({
            'destination':      destination,
            'location_used':    location_used,
            'recommendations':  top5,
            'total_found':      len(destination_hotels),
            'algorithm':        'content_based_filtering',
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/climate-suitability', methods=['POST'])
def climate_suitability():
    """Return seasonal climate suitability for a destination + travel month."""
    try:
        import datetime
        data = request.json or {}

        destination = str(data.get('destination', '')).lower().strip()
        raw_month   = str(data.get('month', '')).lower().strip()

        # ── Normalise month (name, number, or partial like "jul") → month name ──
        month_name = None
        if raw_month:
            if raw_month.isdigit():
                idx = int(raw_month) - 1
                if 0 <= idx < 12:
                    month_name = MONTHS[idx]
            else:
                for m in MONTHS:
                    if raw_month[:3] == m[:3]:
                        month_name = m
                        break
        if not month_name:
            month_name = MONTHS[datetime.date.today().month - 1]   # default: current month

        if not climate_dataset:
            return jsonify({'error': 'Climate dataset not loaded. Run train_models.py first.'}), 503

        destinations = climate_dataset.get('destinations', {})

        # ── Match destination (keyword-based, like hotel matching) ──
        STOP = {'city', 'district', 'tehsil', 'division', 'valley', 'area', 'town'}
        words = [w for w in destination.split() if w not in STOP and len(w) >= 3]

        matched_key = None
        if destination in destinations:
            matched_key = destination
        else:
            for key in destinations:
                if key in destination or destination in key:
                    matched_key = key
                    break
                if any(w in key for w in words) or any(kw in destination for kw in key.split()):
                    matched_key = key
                    break

        if not matched_key:
            # Unknown destination — return a neutral, honest response
            return jsonify({
                'destination':   destination,
                'month':         month_name.title(),
                'matched':       False,
                'suitability_score': 60,
                'verdict':       'Unknown',
                'recommendation': f"No climate profile for '{destination}'. Check the live forecast closer to travel.",
                'is_recommended': True,
                'best_months':   [],
            })

        dest_data = destinations[matched_key]
        m = dest_data['months'][month_name]

        return jsonify({
            'destination':       matched_key,
            'month':             month_name.title(),
            'matched':           True,
            'avg_high_c':        m['avg_high_c'],
            'avg_low_c':         m['avg_low_c'],
            'condition':         m['condition'],
            'rain_level':        m['rain_level'],
            'accessible':        m['accessible'],
            'suitability_score': m['suitability_score'],
            'verdict':           m['verdict'],
            'recommendation':    m['note'],
            'is_recommended':    m['suitability_score'] >= 45 and m['accessible'],
            'best_months':       dest_data['best_months'],
            'algorithm':         'seasonal_climate_dataset',
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    load_models()
    print("\nML Microservice running on http://localhost:5001")
    app.run(port=5001, debug=False)
