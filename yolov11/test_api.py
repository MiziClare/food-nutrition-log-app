"""
测试 Food Recognition API 的 Python 脚本 (FastAPI 版本)
"""
import requests
import json

# API 基础 URL
BASE_URL = "http://localhost:8000"

def test_upload_image(image_path, user_id="1", notes="Test upload"):
    """测试图片上传和识别接口"""
    print("=" * 50)
    print("测试图片上传和识别...")
    print("=" * 50)
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': (image_path.split('\\')[-1], f, 'image/png')}
            data = {
                'userId': user_id,
                'notes': notes
            }
            
            response = requests.post(f"{BASE_URL}/ai/agent/upload", files=files, data=data)
            
            print(f"状态码: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"\n✅ 识别成功!")
                print(f"📝 Log ID: {result['logId']}")
                print(f"👤 User ID: {result['userId']}")
                print(f"📄 备注: {result['notes']}")
                print(f"📊 检测到 {result['detectedCount']} 种食物")
                print(f"🔥 总卡路里: {result['totalKcal']} kcal")
                print(f"⚖️  总重量: {result['totalWeight']} g")
                print(f"🖼️  结果图片: {result['resultImage']}")
                
                print("\n🍔 识别的食物详情:")
                print("-" * 80)
                for ingredient in result['ingredients']:
                    print(f"  • {ingredient['ingredientName']}")
                    print(f"    - 卡路里: {ingredient['kcal']} kcal")
                    print(f"    - 重量: {ingredient['weight']} g")
                    print(f"    - 置信度: {ingredient['confidence']}")
                    print(f"    - 面积占比: {ingredient['ratio']}")
                    print()
            else:
                print(f"❌ 请求失败: {response.text}")
                
    except FileNotFoundError:
        print(f"❌ 错误: 找不到图片文件 {image_path}")
    except Exception as e:
        print(f"❌ 错误: {str(e)}")

if __name__ == "__main__":
    print("\n🚀 开始测试 Food Recognition API\n")
    
    # 测试图片上传（请修改为你的图片路径）
    # test_upload_image("food.png", user_id="1", notes="午餐沙拉")
    
    print("=" * 50)
    print("测试完成!")
    print("=" * 50)
    print("\n💡 提示:")
    print("1. 请确保 API 服务已启动: python app.py")
    print("2. 取消注释 test_upload_image 行并提供正确的图片路径")
    print("3. 运行此脚本: python test_api.py")
