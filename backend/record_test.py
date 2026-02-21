import sounddevice as sd
import soundfile as sf
import numpy as np
import requests
import json
import threading

SAMPLE_RATE = 16000
OUTPUT_FILE = "test.wav"

def record_until_enter():
    print("\n🎙️  Press ENTER to start recording...")
    input()
    
    print("🔴 RECORDING... Press ENTER to stop")
    
    frames = []
    stop_event = threading.Event()

    def callback(indata, frame_count, time_info, status):
        if not stop_event.is_set():
            frames.append(indata.copy())

    stream = sd.InputStream(samplerate=SAMPLE_RATE, channels=1, callback=callback)
    stream.start()

    input()  # wait for second ENTER
    stop_event.set()
    stream.stop()
    stream.close()

    print("⏹️  Stopped. Processing...")

    audio_data = np.concatenate(frames, axis=0)
    sf.write(OUTPUT_FILE, audio_data, SAMPLE_RATE)
    return OUTPUT_FILE

def send_to_api(file_path):
    print("📤 Sending to backend...")
    with open(file_path, "rb") as f:
        response = requests.post(
            "http://localhost:8000/api/logs/create",
            files={"audio": ("test.wav", f, "audio/wav")},
            data={
                "patient_id": "a0000000-0000-0000-0000-000000000001",
                "nurse_id": "b0000000-0000-0000-0000-000000000001",
                "shift_id": "2e2c87c4-6984-4086-b9ca-d6a87a59bb34",
                "prescription_context": "none"
            }
        )
    print(f"Status code: {response.status_code}")
    print(f"Raw response: {response.text}")
    return response.json()

if __name__ == "__main__":
    while True:
        file = record_until_enter()
        result = send_to_api(file)
        
        print("\n✅ TRANSCRIPT:")
        print(f"   {result.get('transcript', 'N/A')}")
        print(f"\n📊 CONFIDENCE: {result.get('confidence', 'N/A')}")
        print(f"🚨 NEEDS REVIEW: {result.get('needs_review', False)}")
        print(f"\n💊 STRUCTURED LOG:")
        print(json.dumps(result.get('structured_log', {}), indent=2))
        print(f"\n🔊 AUDIO CONFIRMATION: http://localhost:8000{result.get('audio_confirmation_url', '')}")
        
        print("\n" + "="*50)
        again = input("Record another? (y/n): ")
        if again.lower() != "y":
            break