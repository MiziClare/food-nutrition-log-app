# 导入所需库
import os
import cv2
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from ultralytics import YOLO
from PIL import Image
from datetime import datetime
from typing import Optional
import shutil

app = FastAPI(
    title="Food Recognition API",
    description="A food recognition API service based on YOLOv11",
    version="1.0.0"
)

# 配置
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = "yolov11-x-weights-v6.pt"

# 确保文件夹存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# 加载YOLO模型
model = YOLO(MODEL_PATH)

# 食物卡路里数据库 (每100克的卡路里)
FOOD_CALORIES = {
    "chicken nuggets": {"kcal_per_100g": 200, "density": 0.6},
    "french fries": {"kcal_per_100g": 312, "density": 0.4},
    "pizza": {"kcal_per_100g": 266, "density": 0.8},
    "hamburger": {"kcal_per_100g": 250, "density": 0.7},
    "hamburger buns": {"kcal_per_100g": 265, "density": 0.3},
    "lettuce": {"kcal_per_100g": 15, "density": 0.2},
    "tomato": {"kcal_per_100g": 18, "density": 0.6},
    "cheese": {"kcal_per_100g": 402, "density": 0.9},
    "cheddar cheese": {"kcal_per_100g": 403, "density": 0.9},
    "donut": {"kcal_per_100g": 452, "density": 0.5},
    "chocolate": {"kcal_per_100g": 546, "density": 0.9},
    "chocolate balls": {"kcal_per_100g": 500, "density": 0.85},
    "soda": {"kcal_per_100g": 42, "density": 1.0},
    "chips": {"kcal_per_100g": 536, "density": 0.2},
    "salad": {"kcal_per_100g": 20, "density": 0.3},
    "bread": {"kcal_per_100g": 265, "density": 0.3},
    "apple": {"kcal_per_100g": 52, "density": 0.6},
    "banana": {"kcal_per_100g": 89, "density": 0.6},
    "orange": {"kcal_per_100g": 47, "density": 0.6},
    "rice": {"kcal_per_100g": 130, "density": 0.8},
    "pasta": {"kcal_per_100g": 131, "density": 0.7},
    "beef": {"kcal_per_100g": 250, "density": 0.9},
    "chicken": {"kcal_per_100g": 165, "density": 0.8},
    "fish": {"kcal_per_100g": 206, "density": 0.8},
    "egg": {"kcal_per_100g": 155, "density": 0.85},
    "milk": {"kcal_per_100g": 61, "density": 1.03},
}

def allowed_file(filename: str) -> bool:
    """Check whether the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def estimate_weight_from_area(food_name: str, area_ratio: float, image_area_pixels: float) -> float:
    """
    Estimate food weight from bounding box area.

    This is a simplified heuristic. For production use, a more
    sophisticated method (e.g. depth estimation) is recommended.
    """
    # 假设一个标准参考：整个图片约等于500克食物的投影
    # 这个值可以根据实际情况调整
    reference_weight = 500  # 克
    
    # 获取食物密度系数
    food_info = FOOD_CALORIES.get(food_name.lower(), {"density": 0.5})
    density_factor = food_info.get("density", 0.5)
    
    # 根据面积比例和密度估算重量
    estimated_weight = reference_weight * area_ratio * density_factor
    
    # 限制重量范围（10克到1000克）
    estimated_weight = max(10, min(1000, estimated_weight))
    
    return round(estimated_weight, 2)

def calculate_calories(food_name: str, weight_grams: float) -> int:
    """Calculate calories based on food name and weight (grams)."""
    food_info = FOOD_CALORIES.get(food_name.lower())
    
    if food_info:
        kcal_per_100g = food_info["kcal_per_100g"]
        total_kcal = (kcal_per_100g * weight_grams) / 100
        return round(total_kcal)
    else:
        # 如果数据库中没有该食物，使用默认值
        return round(100 * weight_grams / 100)

def format_ingredient_name(name: str) -> str:
    """Format ingredient name (capitalize words)."""
    return ' '.join(word.capitalize() for word in name.split())

@app.post('/ai/agent/upload')
async def upload_and_analyze(
    file: UploadFile = File(..., description="Image file (PNG, JPG, JPEG)"),
    userId: Optional[str] = Form(default="0", description="User ID"),
    notes: Optional[str] = Form(default="", description="Notes")
):
    """
    Handle image upload and perform food recognition.

    - **file**: Image file (supports PNG, JPG, JPEG)
    - **userId**: User ID (optional)
    - **notes**: Notes (optional)
    """
    try:
        # 检查文件类型
        if not allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="File type not allowed. Please upload PNG, JPG, or JPEG"
            )
        
        # 保存上传的文件
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{file.filename}"
        upload_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        # 使用 shutil 保存文件
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 使用YOLO模型进行预测
        im = Image.open(upload_path)
        
        # 生成唯一的保存路径
        save_dir = os.path.join(RESULT_FOLDER, f"predict_{timestamp}")
        os.makedirs(save_dir, exist_ok=True)
        
        results = model.predict(
            source=im,
            save=True,
            project=RESULT_FOLDER,
            name=f"predict_{timestamp}",
            conf=0.5,
            exist_ok=True
        )
        
        # 处理检测结果
        ingredients = []
        log_id = int(datetime.now().timestamp())  # 使用时间戳作为logId
        
        ingredient_id = 1
        for r in results:
            boxes = r.boxes
            names = r.names
            img_h, img_w = r.orig_shape
            image_area = img_h * img_w
            
            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i])
                conf = float(boxes.conf[i])
                name = names[cls_id]
                
                # 计算面积和占比
                x1, y1, x2, y2 = boxes.xyxy[i]
                width = float(x2 - x1)
                height = float(y2 - y1)
                area = width * height
                ratio = area / image_area
                
                # 估算重量
                weight = estimate_weight_from_area(name, ratio, image_area)
                
                # 计算卡路里
                kcal = calculate_calories(name, weight)
                
                # 格式化食物名称
                formatted_name = format_ingredient_name(name)
                
                ingredients.append({
                    "id": ingredient_id,
                    "logId": log_id,
                    "ingredientName": formatted_name,
                    "kcal": kcal,
                    "weight": weight,
                    "confidence": round(conf, 3),
                    "ratio": round(ratio, 4)
                })
                
                ingredient_id += 1
        
        # 构建响应
        response_data = {
            "status": "SUCCESS",
            "logId": log_id,
            "userId": userId,
            "notes": notes,
            "uploadedImage": unique_filename,
            "resultImage": f"predict_{timestamp}/{file.filename}",
            "ingredients": ingredients,
            "totalKcal": sum(item["kcal"] for item in ingredients),
            "totalWeight": round(sum(item["weight"] for item in ingredients), 2),
            "detectedCount": len(ingredients)
        }
        
        return JSONResponse(content=response_data, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    
    print("🚀 Starting Food Recognition API Server with FastAPI...")
    print(f"📦 Model: {MODEL_PATH}")
    print(f"📁 Upload folder: {UPLOAD_FOLDER}")
    print(f"📁 Result folder: {RESULT_FOLDER}")
    print("=" * 50)
    print("📖 API Documentation: http://localhost:8000/docs")
    print("📖 Alternative Docs: http://localhost:8000/redoc")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
