#!/usr/bin/env python3
from PIL import Image
import os

# 원본 로고 경로
source_logo = "/home/qwg18/work/dduksangLAB/public/images/떡상연구소_로고/누끼_떡상연구소.png"

# 파비콘 디렉토리 경로
favicon_dir = "/home/qwg18/work/dduksangLAB/public/images/떡상연구소_로고/Favicon"
public_dir = "/home/qwg18/work/dduksangLAB/public"

# 원본 이미지 열기
img = Image.open(source_logo)

# RGBA를 RGB로 변환 (ico 파일용)
img_rgb = Image.new("RGB", img.size, (255, 255, 255))
img_rgb.paste(img, mask=img.split()[3] if len(img.split()) > 3 else None)

# 파비콘 사이즈 정의
favicon_sizes = {
    # Android icons
    "android-icon-36x36.png": (36, 36),
    "android-icon-48x48.png": (48, 48),
    "android-icon-72x72.png": (72, 72),
    "android-icon-96x96.png": (96, 96),
    "android-icon-144x144.png": (144, 144),
    "android-icon-192x192.png": (192, 192),
    
    # Apple icons
    "apple-icon-57x57.png": (57, 57),
    "apple-icon-60x60.png": (60, 60),
    "apple-icon-72x72.png": (72, 72),
    "apple-icon-76x76.png": (76, 76),
    "apple-icon-114x114.png": (114, 114),
    "apple-icon-120x120.png": (120, 120),
    "apple-icon-144x144.png": (144, 144),
    "apple-icon-152x152.png": (152, 152),
    "apple-icon-180x180.png": (180, 180),
    "apple-icon.png": (180, 180),
    "apple-icon-precomposed.png": (180, 180),
    
    # MS icons
    "ms-icon-70x70.png": (70, 70),
    "ms-icon-144x144.png": (144, 144),
    "ms-icon-150x150.png": (150, 150),
    "ms-icon-310x310.png": (310, 310),
    
    # Standard favicons
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "favicon-96x96.png": (96, 96),
}

# public 디렉토리에 필요한 파일들
public_files = {
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "apple-touch-icon.png": (180, 180),
    "android-chrome-192x192.png": (192, 192),
    "android-chrome-512x512.png": (512, 512),
}

print("파비콘 생성 시작...")

# Favicon 디렉토리 파일 생성
for filename, size in favicon_sizes.items():
    output_path = os.path.join(favicon_dir, filename)
    resized_img = img.resize(size, Image.Resampling.LANCZOS)
    resized_img.save(output_path, "PNG")
    print(f"생성: {filename}")

# public 디렉토리 파일 생성
for filename, size in public_files.items():
    output_path = os.path.join(public_dir, filename)
    resized_img = img.resize(size, Image.Resampling.LANCZOS)
    resized_img.save(output_path, "PNG")
    print(f"생성: {filename}")

# ICO 파일 생성 (여러 크기 포함)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_images = []
for size in ico_sizes:
    resized_img = img_rgb.resize(size, Image.Resampling.LANCZOS)
    ico_images.append(resized_img)

# Favicon 디렉토리에 ico 파일 저장
ico_images[0].save(
    os.path.join(favicon_dir, "favicon.ico"),
    format="ICO",
    sizes=ico_sizes
)
print("생성: favicon.ico (Favicon 디렉토리)")

# public 디렉토리에 ico 파일 저장
ico_images[0].save(
    os.path.join(public_dir, "favicon.ico"),
    format="ICO",
    sizes=ico_sizes
)
print("생성: favicon.ico (public 디렉토리)")

print("\n✅ 모든 파비콘 파일이 생성되었습니다!")