from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
from paddleocr import PaddleOCR
from ultralytics import YOLO
from io import BytesIO
import math
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

car_model = YOLO("car_detector.pt")
ev_model = YOLO("ev_detector.pt")


class PredictionResponse(BaseModel):
    EV: str
    confidence: int
    ocr_text: str


def load_model(model_path):
    try:
        return YOLO(model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")


def predict_objects(model, image):
    try:
        results = model.predict(image)
        return [
            {
                "class": results[0].names[int(box.cls)],
                "confidence": box.conf.item(),
                "coordinates": box.xyxy.tolist(),
            }
            for box in results[0].boxes
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during object prediction: {str(e)}",
        )


def perform_ocr(reader, predictions, image):
    try:
        ocr_results = []
        for prediction in predictions:
            coords = prediction["coordinates"][0]
            cropped_image = image.crop((coords[0], coords[1], coords[2], coords[3]))
            ocr_result = reader.ocr(np.array(cropped_image), cls=True)
            ocr_text = " ".join([line[1][0] for line in ocr_result[0]])

            ocr_text = re.sub(r"[^A-Za-z0-9 ]", "", ocr_text)

            if not ocr_text.strip():
                ocr_text = "Could Not Be Recognized"

            ocr_results.append({**prediction, "ocr_text": ocr_text})
        return ocr_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during OCR: {str(e)}")


def classify_vehicle(image):
    try:
        model = car_model
        model.eval()
        results = model(image)
        for result in results:
            return int(result.probs.top1)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error classifying vehicle: {str(e)}",
        )


@app.post("/detect-ev/")
async def detect_ev(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        image = Image.open(BytesIO(file_bytes))

        classification = classify_vehicle(image)
        if classification == 1:
            return {"status": "error", "message": "Not a 4-wheeler"}

        model = ev_model
        results = predict_objects(model, image)
        if not results or int(results[0]["class"]) == 1:
            return {"status": "error", "message": "Not an EV vehicle"}
        reader = PaddleOCR(use_angle_cls=True, lang='en')
        ocr_results = perform_ocr(reader, results, image)

        response_data = [
            PredictionResponse(
                EV="Yes",
                confidence=int(math.ceil(result["confidence"] * 100)),
                ocr_text=result["ocr_text"],
            )
            for result in ocr_results
        ]

        return {"status": "success", "message": response_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@app.get("/")
async def read_root():
    return {"status": "success", "message": "API is running successfully"}