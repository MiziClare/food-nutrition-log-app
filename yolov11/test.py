# 导入所需库
import cv2
from ultralytics import YOLO
from PIL import Image

# 1️⃣ 加载模型（可以是 yolov8.pt 或 yolov11.pt 等）
model = YOLO("yolov11-x-weights-v6.pt")  # 替换为你下载的模型路径，如 "runs/train/exp/weights/best.pt"

# 2️⃣ 读取本地图片
image_path = "food.png"  # 你要检测的图片路径
im = Image.open(image_path)  # 用PIL读取（也可以用cv2）

# 3️⃣ 使用模型进行预测
results = model.predict(
    source=im,      # 也可以直接传入路径：source=image_path
    save=True,      # 保存预测结果（会在runs/predict下生成图片）
    show=True,      # 在窗口中显示结果（需本地有GUI环境）
    conf=0.5        # 置信度阈值，可根据需要调整
)

# 4️⃣ 计算每个检测框的面积及其占比
output = []

for r in results:
    boxes = r.boxes
    names = r.names
    img_h, img_w = r.orig_shape
    image_area = img_h * img_w

    for i in range(len(boxes)):
        cls_id = int(boxes.cls[i])
        conf = float(boxes.conf[i])
        name = names[cls_id]

        # 坐标
        x1, y1, x2, y2 = boxes.xyxy[i]
        width = float(x2 - x1)
        height = float(y2 - y1)
        area = width * height
        ratio = area / image_area  # 占比（0~1）

        # 输出 JSON 结构
        output.append({
            "name": name,
            "confidence": round(conf, 3),
            "ratio": round(ratio, 4)  # 保留4位小数
        })

print(output)