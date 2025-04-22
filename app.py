from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import cv2
from deepface import DeepFace
import os
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    try:
        # Get the base64 image from the request
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Get the base64 string and remove the header
        base64_image = data['image']
        if ',' in base64_image:
            base64_image = base64_image.split(',')[1]
        
        # Decode the base64 string to image
        image_data = base64.b64decode(base64_image)
        
        # Create a temporary file to save the image
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_filename = temp_file.name
            temp_file.write(image_data)
        
        try:
            # Analyze the image with DeepFace
            result = DeepFace.analyze(
                img_path=temp_filename,
                actions=['emotion'],
                enforce_detection=False  # Don't throw error if no face is detected
            )
            
            # Extract the dominant emotion
            if isinstance(result, list):
                result = result[0]  # Get the first face if multiple faces are detected
                
            emotion = result['dominant_emotion']
            
            # Map DeepFace emotions to our playlist emotions
            emotion_mapping = {
                'happy': 'happy',
                'sad': 'sad',
                'angry': 'angry',
                'fear': 'anxious',
                'disgust': 'angry',
                'surprise': 'energetic',
                'neutral': 'chill'
            }
            
            mapped_emotion = emotion_mapping.get(emotion, 'chill')
            
            return jsonify({
                'emotion': mapped_emotion,
                'original_emotion': emotion,
                'all_emotions': result['emotion']
            })
            
        except Exception as e:
            print(f"DeepFace error: {str(e)}")
            # If face detection fails, return a random emotion
            import random
            emotions = ['happy', 'sad', 'chill', 'energetic', 'angry', 'anxious']
            random_emotion = random.choice(emotions)
            return jsonify({
                'emotion': random_emotion,
                'original_emotion': 'unknown',
                'error': str(e)
            })
        
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_filename):
                os.unlink(temp_filename)
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
