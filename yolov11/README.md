# 🍔 Food Recognition API - YOLO Food Recognition Service

A food recognition API service based on YOLOv11 and FastAPI. It supports food recognition, calorie calculation, and weight estimation.

## 📋 Features

- ✅ Supports recognition of various foods (hamburgers, french fries, pizza, salad, etc.)
- ✅ Automatically calculates calories and weight
- ✅ Saves annotated images after recognition
- ✅ RESTful API endpoints (FastAPI)
- ✅ Supports multipart/form-data uploads
- ✅ Automatically generated interactive API documentation
- ✅ High-performance asynchronous processing

## 🚀 Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the service

**Option 1: Run directly**

```bash
python app.py
```

**Option 2: Use uvicorn**

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The service will be available at `http://localhost:8000`

### 3. Access API docs

FastAPI automatically generates interactive documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test the API directly from the documentation pages!

### 4. Test the API

#### Method 1: Use the interactive docs (recommended)

1. Open your browser and go to http://localhost:8000/docs
2. Find the `/ai/agent/upload` endpoint
3. Click "Try it out"
4. Upload an image and fill in the parameters
5. Click "Execute"

#### Method 2: Use curl

```bash
curl -X POST http://localhost:8000/ai/agent/upload -F "file=@food1.png" -F "userId=1" -F "notes=Salad for lunch"
```

#### Method 3: Use the Python script

```powershell
python test_api.py
```

#### Method 4: Use Postman

1. Select POST
2. URL: `http://localhost:8000/ai/agent/upload`
3. Set Body to `form-data`
4. Add fields:
   - `file`: select the image file
   - `userId`: 1
   - `notes`: Salad for lunch

## 📡 API Reference

### Upload and recognize food

```http
POST /ai/agent/upload
Content-Type: multipart/form-data
```

**Request parameters:**

- `file` (required): image file (supports png, jpg, jpeg)
- `userId` (optional): user ID
- `notes` (optional): notes

**Example response:**

```json
{
  "status": "SUCCESS",
  "logId": 1699999999,
  "userId": "1",
  "notes": "Salad for lunch",
  "uploadedImage": "20231114_123456_food1.png",
  "resultImage": "predict_20231114_123456/food1.png",
  "totalKcal": 1970,
  "totalWeight": 1040.0,
  "detectedCount": 11,
  "ingredients": [
    {
      "id": 1,
      "logId": 1699999999,
      "ingredientName": "Chicken Nuggets",
      "kcal": 300,
      "weight": 150.0,
      "confidence": 0.95,
      "ratio": 0.12
    },
    {
      "id": 2,
      "logId": 1699999999,
      "ingredientName": "French Fries",
      "kcal": 365,
      "weight": 150.0,
      "confidence": 0.92,
      "ratio": 0.15
    }
  ]
}
```

## 📂 Project Structure

```
yolo/
├── app.py                    # Flask API main file
├── test.py                   # Original test file
├── requirements.txt          # Python dependencies
├── api_test.http             # API test file
├── yolov11-x-weights-v6.pt   # YOLO model file
├── uploads/                  # Directory to save uploaded images
├── results/                  # Directory to save recognition result images
└── runs/                     # YOLO run output directory
```

## 🍕 Supported Food Types

The following foods are currently supported for calorie calculation (can be extended in the `FOOD_CALORIES` in `app.py`):

- 🍗 Chicken Nuggets
- 🍟 French Fries
- 🍕 Pizza
- 🍔 Hamburger
- 🍞 Bread
- 🥗 Salad
- 🍩 Donut
- 🍫 Chocolate
- 🥤 Soda
- 🥔 Chips
- 🧀 Cheese
- More...

## ⚙️ Configuration

You can modify the following settings in `app.py`:

```python
# Upload folder
UPLOAD_FOLDER = 'uploads'

# Result save folder
RESULT_FOLDER = 'results'

# Allowed file types
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Model path
MODEL_PATH = "yolov11-x-weights-v6.pt"

# Confidence threshold (used in the predict function)
conf=0.5

# Server port (used in uvicorn.run)
port=8000
```

## 🎯 Advantages of FastAPI

Compared with Flask, FastAPI provides:

1. **Auto-generated documentation**: Swagger UI and ReDoc
2. **Type checking**: parameter validation using Python type hints
3. **Higher performance**: built on Starlette and Pydantic
4. **Async support**: native async/await
5. **Data validation**: automatic request/response validation

## 🔧 Custom Food Database

Add new foods to the `FOOD_CALORIES` dictionary in `app.py`:

```python
FOOD_CALORIES = {
    "New Food Name": {
        "kcal_per_100g": 200,  # calories per 100g
        "density": 0.6         # density factor (affects weight estimation)
    },
    # ... other foods
}
```

## 📝 Notes

1. **Weight estimation**: The current method uses a simplified algorithm based on bounding box area to estimate weight. For production use, consider a depth model or a more precise algorithm.
2. **Calorie data**: Values come from standard food databases; actual values may vary depending on preparation.
3. **Model accuracy**: Recognition accuracy depends on the quality of the trained model and dataset.
4. **Image saving**: Recognized images are automatically saved in the `results` folder.

## 🐛 Troubleshooting

### Issue: Model file not found

```
Make sure `yolov11-x-weights-v6.pt` is in the project root directory
```

### Issue: Port is already in use

```bash
# Option 1: Change the port number in the last line of app.py
uvicorn.run(app, host="0.0.0.0", port=8001)

# Option 2: Use the command line argument
uvicorn app:app --port 8001
```

### Issue: Image upload fails

```
Check that the `uploads` and `results` folders have write permissions
```
