from machine import Pin, ADC
import time
import network
import urequests
import ujson

# =========================
# Wi-Fi Config
# =========================
WIFI_SSID = "Wokwi-GUEST"
WIFI_PASSWORD = ""

BASE_URL = "https://trashcan-backend-demo.onrender.com"
SCAN_URL = BASE_URL + "/admin/devices/scan"
CONFIRM_URL = BASE_URL + "/admin/devices/confirm"

# =========================
# Hardware Setup
# =========================
buttons = {
    "user1": Pin(2, Pin.IN, Pin.PULL_UP),
    "user2": Pin(0, Pin.IN, Pin.PULL_UP),
    "user3": Pin(17, Pin.IN, Pin.PULL_UP),
    "user4": Pin(5, Pin.IN, Pin.PULL_UP),
}

actions = {
    "user1": "UID_111",
    "user2": "UID_222",
    "user3": "UID_333",
    "user4": "UID_444",
}

pot = ADC(Pin(33))
PIR = Pin(18, Pin.IN)

used = False


# =========================
# Wi-Fi
# =========================
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if wlan.isconnected():
        print("Wi-Fi already connected:", wlan.ifconfig())
        return True

    print("Connecting to Wi-Fi...")
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)

    for _ in range(20):
        if wlan.isconnected():
            print("Wi-Fi connected:", wlan.ifconfig())
            return True
        print(".", end="")
        time.sleep(0.5)

    print("\nWi-Fi connection failed")
    return False


def ensure_wifi():
    wlan = network.WLAN(network.STA_IF)
    if not wlan.isconnected():
        print("Wi-Fi lost, reconnecting...")
        ok = connect_wifi()
        time.sleep(0.5)
        return ok
    return True


# =========================
# Sensors
# =========================
def map_range(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min


def read_weight(samples=5):
    total = 0
    for _ in range(samples):
        total += pot.read_u16()
        time.sleep(0.02)

    raw = total / samples
    kg = map_range(raw, 0, 65535, 0, 30)
    return round(max(kg, 0), 2)


def calculate_tokens(weight_kg):
    if weight_kg < 2:
        return 0
    return min(int(weight_kg // 2), 10)


def prepare_transaction_data():
    print("Reading weight...")
    weight_kg = read_weight()
    tokens_earned = calculate_tokens(weight_kg)

    print("Weight :", weight_kg, "kg")
    print("Tokens :", tokens_earned)

    if tokens_earned <= 0:
        print("Weight too low - no token awarded")
        return None, None

    return weight_kg, tokens_earned


def check_button_pressed():
    for name, btn in buttons.items():
        if btn.value() == 0:
            time.sleep(0.2)
            while btn.value() == 0:
                time.sleep(0.01)
            return actions[name]
    return None


# =========================
# Console input
# =========================
def ask_text(prompt=""):
    try:
        print(prompt, end="")
        value = input()
        if value is None:
            return None
        return value.strip()
    except Exception as e:
        print("Input error:", e)
        return None


def ask_yes_no(prompt):
    print("Type in Wokwi Serial Monitor, then press Enter.")
    ans = ask_text(prompt)
    if not ans:
        return False
    return ans.lower() == "y"


# =========================
# HTTP
# =========================
def post_json(url, payload, label="REQUEST"):
    if not ensure_wifi():
        print("[{}] No Wi-Fi".format(label))
        return None, None

    response = None
    started = time.ticks_ms()

    try:
        print("[{}] Sending...".format(label))
        headers = {"Content-Type": "application/json"}
        data = ujson.dumps(payload)

        response = urequests.post(url, data=data, headers=headers)

        elapsed = time.ticks_diff(time.ticks_ms(), started)
        status = response.status_code
        print("[{}] HTTP {} in {} ms".format(label, status, elapsed))

        body = None
        try:
            body = response.json()
        except Exception as e:
            print("[{}] JSON parse error: {}".format(label, e))

        return status, body

    except OSError as e:
        print("[{}] Network error: {}".format(label, e))
        return None, None
    except Exception as e:
        print("[{}] HTTP error: {}".format(label, e))
        return None, None
    finally:
        if response is not None:
            response.close()


# =========================
# API Calls
# =========================
def scan_user(uid):
    payload = {"rfid": uid}

    status, result = post_json(SCAN_URL, payload, "SCAN")
    if status is not None or result is not None:
        return status, result

    print("[SCAN] First attempt failed, retrying once...")
    time.sleep(1)
    return post_json(SCAN_URL, payload, "SCAN-RETRY")


def confirm_existing_user(uid, weight_kg, tokens_earned):
    payload = {
        "rfid": uid,
        "weight": weight_kg,
        "tokens_earned": tokens_earned,
    }
    return post_json(CONFIRM_URL, payload, "CONFIRM")


def confirm_new_user(uid, student_id, weight_kg, tokens_earned):
    payload = {
        "rfid": uid,
        "student_id": student_id,
        "weight": weight_kg,
        "tokens_earned": tokens_earned,
    }
    return post_json(CONFIRM_URL, payload, "CONFIRM")


# =========================
# User flows
# =========================
def handle_unregistered_user(uid):
    attempts = 0

    weight_kg, tokens_earned = prepare_transaction_data()
    if weight_kg is None:
        return False

    while attempts < 3:
        raw = ask_text("Enter Student ID: ")

        if raw is None or raw == "":
            attempts += 1
            print("No input - attempt {}/3".format(attempts))
            continue

        try:
            student_id = int(raw)
        except ValueError:
            attempts += 1
            print("Invalid input - attempt {}/3".format(attempts))
            continue

        print("Saving transaction...")
        status_code, result = confirm_new_user(uid, student_id, weight_kg, tokens_earned)

        if status_code is None:
            print("Network/API error during confirm")
            print("Transaction status is unknown - do not auto-retry confirm")
            return False

        if result is None:
            print("Backend returned no JSON body")
            return False

        status = result.get("status")

        if status == "SUCCESS":
            print("=== Registered + token added ===")
            print("Name   :", result.get("name"))
            print("Weight :", result.get("weight"), "kg")
            print("Earned :", result.get("tokens_earned"), "tokens")
            print("Total  :", result.get("tokens"), "tokens")
            return True

        if status == "INVALID_STUDENT_ID":
            attempts += 1
            print("Student ID not found - attempts left:", 3 - attempts)
            continue

        if status == "ALREADY_BOUND":
            print("Student ID already bound to another RFID")
            return False

        print("Unexpected response:", result)
        return False

    print("Failed after 3 attempts")
    return False


# =========================
# Main loop
# =========================
print("=== Trashcan ESP32 Ready ===")

if not connect_wifi():
    print("WARNING: Starting without Wi-Fi")

while True:
    if PIR.value() == 1 and not used:
        uid = check_button_pressed()

        if uid:
            print("\n--- New interaction ---")
            print("UID :", uid)
            print("Checking RFID...")

            status_code, scan_result = scan_user(uid)

            if status_code is None or scan_result is None:
                print("Scan request failed")
                used = True
                time.sleep(0.1)
                continue

            print("Scan response:", scan_result)
            status = scan_result.get("status")

            if status == "FOUND":
                name = scan_result.get("name", "Unknown")
                current_tokens = scan_result.get("tokens", 0)

                print("User found   :", name)
                print("Current token:", current_tokens)

                if ask_yes_no("Is this {} ? (y/n): ".format(name)):
                    weight_kg, tokens_earned = prepare_transaction_data()

                    if weight_kg is not None:
                        print("Saving transaction...")
                        sc, confirm_result = confirm_existing_user(uid, weight_kg, tokens_earned)

                        if sc is not None and confirm_result and confirm_result.get("status") == "SUCCESS":
                            print("=== Token added ===")
                            print("Name   :", confirm_result.get("name"))
                            print("Weight :", confirm_result.get("weight"), "kg")
                            print("Earned :", confirm_result.get("tokens_earned"))
                            print("Total  :", confirm_result.get("tokens"))
                        else:
                            print("Confirm failed:", confirm_result)
                            print("Do not auto-retry confirm until you check backend log")
                else:
                    print("Cancelled by user")

            elif status == "NOT_FOUND":
                print("RFID not registered")
                handle_unregistered_user(uid)

            else:
                print("Unexpected scan status:", scan_result)

            used = True

    if PIR.value() == 0:
        used = False

    time.sleep(0.05)
