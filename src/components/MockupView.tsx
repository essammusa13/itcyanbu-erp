const mockupHtml = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>China Uni Search - Mockup</title>
  <style>
    :root {
      --primary: #4F46E5;
      --primary-hover: #4338CA;
      --bg-color: #F9FAFB;
      --surface: #FFFFFF;
      --text-main: #111827;
      --text-muted: #6B7280;
      --border: #E5E7EB;
      --radius: 12px;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      display: flex;
      justify-content: center;
    }

    .device {
      width: 100%;
      height: 100vh;
      background: var(--surface);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    header {
      padding: 20px;
      padding-top: 40px;
      background: var(--primary);
      color: white;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .lang-switcher {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
    }

    .search-bar {
      width: 100%;
      padding: 12px 16px;
      border-radius: var(--radius);
      border: none;
      font-size: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .filters {
      display: flex;
      gap: 10px;
      padding: 16px 20px;
      overflow-x: auto;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }

    .filters::-webkit-scrollbar { display: none; }

    .filter-chip {
      padding: 8px 16px;
      background: var(--bg-color);
      border: 1px solid var(--border);
      border-radius: 20px;
      font-size: 14px;
      white-space: nowrap;
      color: var(--text-muted);
      cursor: pointer;
    }

    .filter-chip.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: var(--bg-color);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .uni-card {
      background: var(--surface);
      border-radius: var(--radius);
      overflow: hidden;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s;
      cursor: pointer;
    }

    .uni-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }

    .uni-image {
      height: 140px;
      background-color: #D1D5DB;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    
    .uni-image.tsinghua { background-image: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800'); }
    .uni-image.fudan { background-image: url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'); }

    .uni-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .uni-info {
      padding: 16px;
    }

    .uni-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .uni-location {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .uni-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .uni-tag {
      font-size: 12px;
      padding: 4px 8px;
      background: #EEF2FF;
      color: var(--primary);
      border-radius: 4px;
      font-weight: 500;
    }

    .uni-action {
      width: 100%;
      padding: 10px;
      background: white;
      border: 1px solid var(--primary);
      color: var(--primary);
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
    }

    .uni-action:hover {
      background: #F5F3FF;
    }

    .bottom-nav {
      display: flex;
      justify-content: space-around;
      padding: 16px;
      background: var(--surface);
      border-top: 1px solid var(--border);
      padding-bottom: 30px;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: var(--text-muted);
      font-size: 12px;
      cursor: pointer;
    }

    .nav-item.active {
      color: var(--primary);
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
  </style>
</head>
<body>

  <div class="device">
    
    <header>
      <div class="header-top">
        <h2>UniSearch</h2>
        <button class="lang-switcher" onclick="toggleLang()">EN / 中文 / ع</button>
      </div>
      <input type="text" class="search-bar" placeholder="Search universities, cities, majors...">
    </header>

    <div class="filters">
      <div class="filter-chip active">All</div>
      <div class="filter-chip">Medical (طب)</div>
      <div class="filter-chip">Engineering (هندسة)</div>
      <div class="filter-chip">Language (لغة)</div>
      <div class="filter-chip">Business (أعمال)</div>
    </div>

    <div class="content">
      <h3 class="section-title">Featured Universities</h3>
      
      <!-- Card 1 -->
      <div class="uni-card">
        <div class="uni-image tsinghua">
          <span class="uni-badge">#1 Ranked</span>
        </div>
        <div class="uni-info">
          <h4 class="uni-name">Tsinghua University</h4>
          <p class="uni-location">📍 Beijing, China (بكين، الصين)</p>
          <div class="uni-tags">
            <span class="uni-tag">Comprehensive</span>
            <span class="uni-tag">Bilingual Prog.</span>
          </div>
          <button class="uni-action">View Details / عرض التفاصيل</button>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="uni-card">
        <div class="uni-image fudan">
          <span class="uni-badge">Top Medical</span>
        </div>
        <div class="uni-info">
          <h4 class="uni-name">Fudan University</h4>
          <p class="uni-location">📍 Shanghai, China (شنغهاي، الصين)</p>
          <div class="uni-tags">
            <span class="uni-tag">Medical</span>
            <span class="uni-tag">Business</span>
          </div>
          <button class="uni-action">View Details / عرض التفاصيل</button>
        </div>
      </div>

    </div>

    <div class="bottom-nav">
      <div class="nav-item active">
        <svg class="nav-icon" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Home</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <span>Saved</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        <span>Inquiries</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span>Profile</span>
      </div>
    </div>

  </div>

  <script>
    function toggleLang() {
      const html = document.documentElement;
      if (html.getAttribute('dir') === 'ltr') {
        html.setAttribute('dir', 'rtl');
        document.body.style.fontFamily = "'Cairo', 'Segoe UI', sans-serif";
        alert("Language switched to Arabic (RTL Layout Activated)");
      } else {
        html.setAttribute('dir', 'ltr');
        document.body.style.fontFamily = "-apple-system, sans-serif";
        alert("Language switched to English/Chinese (LTR Layout Activated)");
      }
    }
  </script>
</body>
</html>
`;

export default function MockupView() {
    return (
        <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student App Mockup</h2>
            <div className="w-full max-w-sm h-[800px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 overflow-hidden relative">
                <iframe
                    title="Mockup"
                    className="w-full h-full border-none"
                    srcDoc={mockupHtml}
                />
            </div>
        </div>
    );
}
