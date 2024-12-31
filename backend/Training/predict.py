# File to test only the backend.
# Run the server using the command: python predict.py.
# Make sure you have your image and model files in the same directory as this file and dependencies installed.

from PIL import Image
import numpy as np
from paddleocr import PaddleOCR
from ultralytics import YOLO


def load_model(model_path):
    return YOLO(model_path)


def predict_objects(model, image_path):
    results = model.predict(image_path)
    return [
        {
            "class": results[0].names[int(box.cls)],
            "confidence": box.conf.item(),
            "coordinates": box.xyxy.tolist(),
        }
        for box in results[0].boxes
    ]


def perform_ocr(reader, predictions, image_path):
    result_image = Image.open(image_path)
    ocr_results = []
    for prediction in predictions:
        coords = prediction["coordinates"][0]
        cropped_image = result_image.crop((coords[0], coords[1], coords[2], coords[3]))
        ocr_result = reader.ocr(np.array(cropped_image), cls=True)
        ocr_text = " ".join([line[1][0] for line in ocr_result[0]])
        ocr_results.append({**prediction, "ocr_text": ocr_text})
    return ocr_results


def classify_vehicle(image_path):
    model = YOLO("car_detector.pt")
    model.eval()
    results = model(image_path)
    for result in results:
        return int(result.probs.top1)


def detect_ev(image_path, model_path):
    model = load_model(model_path)
    predictions = predict_objects(model, image_path)
    reader = PaddleOCR(use_angle_cls=True, lang='en')
    return {"predictions": perform_ocr(reader, predictions, image_path)}



def main(image_path):
    if classify_vehicle(image_path) == 1:
        print("Not a 4 wheeler")
    else:
        print("Predicted class is car")
        result_data = detect_ev(image_path, "ev_detector.pt")
        if result_data["predictions"][0]["class"] == "1":
            print("Not an EV vehicle")
        else:
            for prediction in result_data["predictions"]:
                print(f"OCR Text: {prediction['ocr_text']}")
                print(f"Confidence: {prediction['confidence']}")
                print(f"Coordinates: {prediction['coordinates'][0]}")


if __name__ == "__main__":
    image_path = "./20220725_11_43_56_412_000_hxH0nNGamnPRFROZtlLa0JHSbvD3_F_3264_2448.jpg"
    main(image_path)
