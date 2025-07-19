# ShareX + WSL 연동 가이드

## ShareX 설정 변경 (Windows에서)

### 1. ShareX 스크린샷 경로 단순화
1. ShareX 실행
2. Application settings → Paths
3. Screenshots folder를 다음으로 변경:
   ```
   C:\ShareX
   ```

### 2. ShareX 후처리 설정
1. Task settings → Advanced
2. After capture tasks → Add
3. Custom command 추가:
   ```
   Program: cmd.exe
   Arguments: /c echo /mnt/c/ShareX/%filename% | clip
   ```

## WSL에서 ShareX 스크린샷 사용

### 방법 1: 별칭 설정
```bash
# .bashrc에 추가
echo 'alias sx="ls -t /mnt/v/Computer_tool/ShareX-17.1.0-portable/ShareX/Screenshots/2025-*/*.png | head -1"' >> ~/.bashrc
source ~/.bashrc

# 사용법
sx  # 최신 스크린샷 경로 출력
```

### 방법 2: 함수로 만들기
```bash
# .bashrc에 추가
cat >> ~/.bashrc << 'EOF'
sharex() {
    # 가장 최근 ShareX 스크린샷 찾기
    local latest=$(ls -t /mnt/v/Computer_tool/ShareX-*/ShareX/Screenshots/*/*/*.png 2>/dev/null | head -1)
    if [ -n "$latest" ]; then
        echo "$latest"
    else
        echo "No ShareX screenshots found"
    fi
}
EOF
source ~/.bashrc
```

### 방법 3: Windows 경로 자동 변환
```bash
# .bashrc에 추가
cat >> ~/.bashrc << 'EOF'
winpath() {
    # Windows 경로를 WSL 경로로 변환
    echo "$1" | sed 's/\\/\//g' | sed 's/V:/\/mnt\/v/g' | sed 's/C:/\/mnt\/c/g'
}
EOF
source ~/.bashrc

# 사용법
winpath "V:\Computer_tool\ShareX-17.1.0-portable\ShareX\Screenshots\2025-07\firefox_5ZLy0tYYgG.png"
```

### 방법 4: 클립보드에서 ShareX 경로 자동 변환
```bash
# .bashrc에 추가
cat >> ~/.bashrc << 'EOF'
sxclip() {
    # Windows 클립보드의 경로를 WSL 경로로 변환
    local winpath=$(powershell.exe -c "Get-Clipboard" | tr -d '\r')
    if [[ "$winpath" == *"ShareX"* ]]; then
        echo "$winpath" | sed 's/\\/\//g' | sed 's/V:/\/mnt\/v/g'
    else
        echo "No ShareX path in clipboard"
    fi
}
EOF
source ~/.bashrc
```

## 가장 편한 통합 방법

```bash
# 한 번만 실행
cat >> ~/.bashrc << 'EOF'
# ShareX 최신 스크린샷 바로 가져오기
pic() {
    local latest=$(ls -t /mnt/v/Computer_tool/ShareX-*/ShareX/Screenshots/*/*/*.png 2>/dev/null | head -1)
    if [ -n "$latest" ]; then
        echo "$latest"
    else
        # ShareX 스크린샷이 없으면 클립보드 이미지 확인
        local temp="/tmp/clipboard_$(date +%s).png"
        if powershell.exe -c "(Get-Clipboard -Format Image).Save('$(wslpath -w $temp)')" 2>/dev/null; then
            echo "$temp"
        else
            echo "No image found"
        fi
    fi
}
EOF
source ~/.bashrc
```

이제 `pic` 명령만 입력하면:
1. ShareX 최신 스크린샷 경로 출력
2. ShareX가 없으면 클립보드 이미지 저장 후 경로 출력