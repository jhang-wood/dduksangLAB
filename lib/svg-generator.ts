/**
 * SVG 이미지 생성 유틸리티
 * 외부 이미지 서비스 의존성을 제거하고 안정적인 SVG 기반 이미지 생성
 */

interface CategoryTheme {
  primaryColor: string;
  secondaryColor: string;
  bgGradient: [string, string];
  icon: string;
  iconPath: string;
}

// 카테고리별 테마 설정
const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  'AI 부업정보': {
    primaryColor: '#00D9FF',
    secondaryColor: '#0099CC',
    bgGradient: ['#001529', '#003366'],
    icon: 'dollar',
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.81.45 1.61 1.67 1.61 1.16 0 1.6-.64 1.6-1.46 0-.84-.36-1.31-1.71-1.73-1.62-.48-3.36-1.16-3.36-3.31 0-1.66 1.28-2.79 2.86-3.12V4.73h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-1.52-1.87-1.15 0-1.58.58-1.58 1.3 0 .72.45 1.09 1.69 1.5 1.65.54 3.38 1.12 3.38 3.4.01 1.87-1.4 3.02-2.86 3.69z'
  },
  '바이브코딩 성공사례': {
    primaryColor: '#FF6B6B',
    secondaryColor: '#FF4444',
    bgGradient: ['#1A0F1F', '#2D1B33'],
    icon: 'trophy',
    iconPath: 'M5 3C3.9 3 3 3.9 3 5l0 2c0 2.21 1.79 4 4 4h1.18C8.6 12.16 9.71 13 11 13v6h2v-6c1.29 0 2.4-.84 2.82-2H17c2.21 0 4-1.79 4-4V5c0-1.1-.9-2-2-2H5zm0 2h2v2c0 1.11-.89 2-2 2V5zm14 0v4c-1.11 0-2-.89-2-2V5h2z'
  },
  'MCP 추천': {
    primaryColor: '#4ECDC4',
    secondaryColor: '#3ABAB2',
    bgGradient: ['#0F2027', '#203A43'],
    icon: 'server',
    iconPath: 'M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
  },
  '클로드코드 Level UP': {
    primaryColor: '#FFD93D',
    secondaryColor: '#FFCC00',
    bgGradient: ['#1A1A2E', '#16213E'],
    icon: 'zap',
    iconPath: 'M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z'
  }
};

/**
 * 카테고리와 제목을 기반으로 SVG 썸네일 생성
 */
export function generateSVGThumbnail(
  category: string,
  title: string,
  width: number = 1200,
  height: number = 630
): string {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES['MCP 추천'];
  
  // 제목 처리 (너무 길면 자르기)
  const displayTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // 제목을 여러 줄로 나누기
  const words = displayTitle.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > 25) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);
  
  // 최대 3줄로 제한
  const titleLines = lines.slice(0, 3);
  
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.bgGradient[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${theme.bgGradient[1]};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${theme.primaryColor};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${theme.secondaryColor};stop-opacity:0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      
      <!-- Pattern overlay -->
      <g opacity="0.1">
        ${Array.from({ length: 20 }, (_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${Math.random() * 3 + 1}" fill="${theme.primaryColor}"/>
        `).join('')}
      </g>
      
      <!-- Accent shapes -->
      <rect x="50" y="50" width="300" height="4" fill="url(#accentGradient)" opacity="0.6"/>
      <rect x="50" y="${height - 54}" width="200" height="4" fill="url(#accentGradient)" opacity="0.6"/>
      <rect x="${width - 250}" y="50" width="200" height="4" fill="url(#accentGradient)" opacity="0.6"/>
      
      <!-- Category badge -->
      <g transform="translate(60, 100)">
        <rect x="0" y="0" width="200" height="40" rx="20" fill="${theme.primaryColor}" opacity="0.2"/>
        <rect x="0" y="0" width="200" height="40" rx="20" fill="none" stroke="${theme.primaryColor}" stroke-width="2" opacity="0.8"/>
        <text x="100" y="26" font-family="'Pretendard', 'Noto Sans KR', sans-serif" font-size="18" font-weight="600" fill="${theme.primaryColor}" text-anchor="middle">
          ${category}
        </text>
      </g>
      
      <!-- Icon -->
      <g transform="translate(${width - 200}, ${height - 200})">
        <circle cx="80" cy="80" r="70" fill="${theme.primaryColor}" opacity="0.1"/>
        <path d="${theme.iconPath}" fill="${theme.primaryColor}" opacity="0.5" transform="translate(40, 40) scale(3.3)"/>
      </g>
      
      <!-- Title -->
      <g transform="translate(${width / 2}, ${height / 2 - (titleLines.length * 25)})">
        ${titleLines.map((line, index) => `
          <text x="0" y="${index * 60}" font-family="'Pretendard', 'Noto Sans KR', sans-serif" font-size="48" font-weight="700" fill="white" text-anchor="middle" filter="url(#glow)">
            ${escapeHtml(line)}
          </text>
        `).join('')}
      </g>
      
      <!-- Bottom branding -->
      <g transform="translate(${width / 2}, ${height - 80})">
        <text x="0" y="0" font-family="'Montserrat', sans-serif" font-size="20" font-weight="500" fill="${theme.primaryColor}" text-anchor="middle" opacity="0.8">
          dduksang.com
        </text>
      </g>
      
      <!-- Date badge -->
      <g transform="translate(${width - 180}, 100)">
        <rect x="0" y="0" width="120" height="32" rx="16" fill="${theme.secondaryColor}" opacity="0.2"/>
        <text x="60" y="22" font-family="'Montserrat', sans-serif" font-size="14" font-weight="500" fill="${theme.secondaryColor}" text-anchor="middle">
          ${new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
        </text>
      </g>
    </svg>
  `;
  
  // URL 인코딩 사용 (Base64보다 훨씬 짧음)
  const encoded = encodeURIComponent(svg.trim());
  return `data:image/svg+xml,${encoded}`;
}

/**
 * 인라인 SVG 아이콘 생성
 */
export function generateCategoryIcon(category: string, size: number = 24): string {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES['MCP 추천'];
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${theme.primaryColor}" xmlns="http://www.w3.org/2000/svg">
      <path d="${theme.iconPath}"/>
    </svg>
  `;
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 카테고리 색상 정보 가져오기
 */
export function getCategoryTheme(category: string): CategoryTheme {
  return CATEGORY_THEMES[category] || CATEGORY_THEMES['MCP 추천'];
}

/**
 * 모든 카테고리 목록
 */
export const CATEGORIES = Object.keys(CATEGORY_THEMES);