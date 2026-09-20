const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);
// Official 6-character Strong & Memorable Password (كلمة مرور قوية ومحصنة من 6 خانات)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sh@61K';

// In-memory Session Storage (Token -> Session Info)
// Valid for 24 hours
const SESSIONS = new Map();
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// In-memory Rate Limiting for Login (IP -> { count, lockedUntil, lastAttempt })
// Max 5 attempts per IP; 15 minutes lockout on 5th failure; resets on 15m inactivity
const LOGIN_ATTEMPTS = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const ATTEMPT_EXPIRY_MS = 15 * 60 * 1000;

function getLoginAttempt(ip) {
  const now = Date.now();
  let attempt = LOGIN_ATTEMPTS.get(ip);
  if (!attempt) {
    attempt = { count: 0, lockedUntil: 0, lastAttempt: now };
    LOGIN_ATTEMPTS.set(ip, attempt);
    return attempt;
  }
  // If lockout is currently active, return as-is
  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    return attempt;
  }
  // If lockout period has passed, reset count and lockout timestamp
  if (attempt.lockedUntil && now >= attempt.lockedUntil) {
    attempt.count = 0;
    attempt.lockedUntil = 0;
  }
  // If user was inactive for longer than ATTEMPT_EXPIRY_MS without being locked, reset count
  if (!attempt.lockedUntil && attempt.lastAttempt && (now - attempt.lastAttempt > ATTEMPT_EXPIRY_MS)) {
    attempt.count = 0;
  }
  return attempt;
}

// Periodic cleanup of expired sessions and old rate-limit entries
setInterval(() => {
  const now = Date.now();
  for (const [token, sess] of SESSIONS.entries()) {
    if (now > sess.expiresAt) {
      SESSIONS.delete(token);
    }
  }
  for (const [ip, data] of LOGIN_ATTEMPTS.entries()) {
    if (data.lockedUntil && now > data.lockedUntil && (now - data.lockedUntil > 60000)) {
      LOGIN_ATTEMPTS.delete(ip);
    } else if (!data.lockedUntil && data.lastAttempt && (now - data.lastAttempt > ATTEMPT_EXPIRY_MS)) {
      LOGIN_ATTEMPTS.delete(ip);
    }
  }
}, 15 * 60 * 1000);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8'
};

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ name, ip: net.address });
      }
    }
  }
  return addresses;
}

function getClientIp(req) {
  let ip = req.headers['x-forwarded-for'];
  if (ip) {
    ip = ip.split(',')[0].trim();
  } else {
    ip = req.socket.remoteAddress || '127.0.0.1';
  }
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }
  return ip;
}

function createSession(ip) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  SESSIONS.set(token, {
    token,
    ip,
    createdAt: Date.now(),
    expiresAt
  });
  return { token, expiresAt };
}

function validateSession(req) {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7).trim();
  if (!token || !SESSIONS.has(token)) return false;
  const session = SESSIONS.get(token);
  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    return false;
  }
  return true;
}

function parseBody(req, maxBytes = 10 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload too large'));
      }
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

function translateMyMemory(text, sl, tl) {
  return new Promise((resolve) => {
    if (!text || !text.trim()) return resolve('');
    const https = require('https');
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.trim()) + '&langpair=' + sl + '|' + tl;
    const req = https.get(url, { headers: { 'User-Agent': 'ShamsRestaurant/1.0' }, timeout: 8000 }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          let result = parsed.responseData?.translatedText || text;

          // Post-process food terms for Arabic
          if (tl === 'ar') {
            result = result
              .replace(/ماكينة\s*حلاقة/gi, 'شاورما')
              .replace(/ماكينة\s*الحلاقة/gi, 'الشاورما')
              .replace(/حلاقة/gi, 'شاورما');
          }
          // Post-process food terms for English
          if (tl === 'en') {
            result = result
              .replace(/\bshaverma\b/gi, 'Shawarma')
              .replace(/\bshaver\b/gi, 'Shawarma');
          }

          resolve(result);
        } catch (e) {
          resolve(text);
        }
      });
    });
    req.on('error', () => resolve(text));
    req.on('timeout', () => { req.destroy(); resolve(text); });
  });
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
}

function sendJson(res, statusCode, data) {
  setSecurityHeaders(res);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    setSecurityHeaders(res);
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // ==================== REST API ROUTES ====================
  if (pathname.startsWith('/api/')) {
    try {
      const clientIp = getClientIp(req);

      // 0. POST /api/auth/reset-lockout (Emergency / Dev unblock)
      if (pathname === '/api/auth/reset-lockout' && req.method === 'POST') {
        LOGIN_ATTEMPTS.delete(clientIp);
        LOGIN_ATTEMPTS.delete('127.0.0.1');
        LOGIN_ATTEMPTS.delete('::1');
        return sendJson(res, 200, { success: true, message: 'Lockout reset' });
      }

      // 1. GET /api/auth/lockout (Check lockout status & countdown for IP)
      if (pathname === '/api/auth/lockout' && req.method === 'GET') {
        const attempt = getLoginAttempt(clientIp);
        const now = Date.now();
        if (attempt.lockedUntil && attempt.lockedUntil > now) {
          const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
          return sendJson(res, 200, {
            locked: true,
            remainingSeconds,
            lockedUntil: attempt.lockedUntil,
            maxAttempts: MAX_FAILED_ATTEMPTS
          });
        }
        const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - (attempt.count || 0));
        return sendJson(res, 200, {
          locked: false,
          remainingSeconds: 0,
          remainingAttempts,
          maxAttempts: MAX_FAILED_ATTEMPTS
        });
      }

      // 2. POST /api/auth (Login with Password + 5 Attempts + Live Countdown Support)
      if (pathname === '/api/auth' && req.method === 'POST') {
        const now = Date.now();
        const attempt = getLoginAttempt(clientIp);

        // Check if IP is currently locked out
        if (attempt.lockedUntil && attempt.lockedUntil > now) {
          const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
          const minutesRemaining = Math.ceil(remainingSeconds / 60);
          return sendJson(res, 429, {
            success: false,
            code: 'LOCKED',
            remainingSeconds,
            lockedUntil: attempt.lockedUntil,
            maxAttempts: MAX_FAILED_ATTEMPTS,
            message: `Слишком много попыток. Попробуйте через ${minutesRemaining} мин. (تم حظر المحاولات مؤقتاً لكثرة الأخطاء. يرجى الانتظار حتى انتهاء العداد)`
          });
        }

        const body = await parseBody(req, 1024 * 1024);
        const enteredPassword = String(body.password || body.pin || '').trim();

        // Check 6-character strong password (strictly removes 2026 fallback)
        const isMatch = (
          enteredPassword === ADMIN_PASSWORD || 
          enteredPassword.toLowerCase() === ADMIN_PASSWORD.toLowerCase()
        );

        if (isMatch) {
          // Reset failed attempts on success
          LOGIN_ATTEMPTS.delete(clientIp);
          const session = createSession(clientIp);
          console.log(`[AUTH] Admin successfully logged in from IP: ${clientIp}`);
          return sendJson(res, 200, {
            success: true,
            token: session.token,
            expiresAt: session.expiresAt,
            message: 'Успешная авторизация (تم تسجيل الدخول بنجاح)'
          });
        } else {
          // Increment failed attempts
          attempt.count = (attempt.count || 0) + 1;
          attempt.lastAttempt = now;

          if (attempt.count >= MAX_FAILED_ATTEMPTS) {
            attempt.lockedUntil = now + LOCKOUT_DURATION_MS;
            LOGIN_ATTEMPTS.set(clientIp, attempt);
            const remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
            console.warn(`[AUTH] IP ${clientIp} locked out after ${attempt.count} failed login attempts`);
            return sendJson(res, 429, {
              success: false,
              code: 'LOCKED',
              remainingSeconds,
              lockedUntil: attempt.lockedUntil,
              maxAttempts: MAX_FAILED_ATTEMPTS,
              message: 'Превышен лимит попыток. Доступ заблокирован на 15 минут. (تم استنفاد 5 محاولات خاطئة. تم حظر الدخول مؤقتاً لمدة 15 دقيقة)'
            });
          } else {
            LOGIN_ATTEMPTS.set(clientIp, attempt);
            const remaining = MAX_FAILED_ATTEMPTS - attempt.count;
            console.warn(`[AUTH] Failed login attempt from ${clientIp} (${attempt.count}/${MAX_FAILED_ATTEMPTS})`);
            return sendJson(res, 401, {
              success: false,
              code: 'INVALID_PASSWORD',
              remaining,
              maxAttempts: MAX_FAILED_ATTEMPTS,
              message: `Неверный пароль. Осталось попыток: ${remaining} из ${MAX_FAILED_ATTEMPTS} (كلمة المرور غير صحيحة. متبقي ${remaining} من أصل ${MAX_FAILED_ATTEMPTS} محاولات)`
            });
          }
        }
      }

      // 2. GET /api/auth/verify (Check if current token is still valid)
      if (pathname === '/api/auth/verify' && req.method === 'GET') {
        const isValid = validateSession(req);
        if (isValid) {
          return sendJson(res, 200, { success: true, authenticated: true });
        } else {
          return sendJson(res, 401, { success: false, authenticated: false });
        }
      }

      // 3. GET /api/dishes (Public read for menu dishes)
      if (pathname === '/api/dishes' && req.method === 'GET') {
        const jsonPath = path.join(ROOT_DIR, 'clean_dishes.json');
        if (fs.existsSync(jsonPath)) {
          try {
            const dishes = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            return sendJson(res, 200, { success: true, dishes });
          } catch (e) {
            console.error('[MENU READ ERROR]', e);
          }
        }
        // Fallback to dishes.js if needed (safe JSON extraction without eval)
        const dishesJsPath = path.join(ROOT_DIR, 'dishes.js');
        if (fs.existsSync(dishesJsPath)) {
          const code = fs.readFileSync(dishesJsPath, 'utf8');
          const jsonMatch = code.match(/window\.SHAMS_MENU\s*=\s*(\[[\s\S]*\]);?/);
          if (jsonMatch) {
            try {
              const dishes = JSON.parse(jsonMatch[1]);
              return sendJson(res, 200, { success: true, dishes });
            } catch (e) {}
          }
        }
        return sendJson(res, 200, { success: true, dishes: [] });
      }

      // ==================== PROTECTED MUTATING ENDPOINTS ====================
      // Require valid Bearer token for dishes save, image upload, and translate proxy
      if (!validateSession(req)) {
        return sendJson(res, 401, {
          success: false,
          code: 'UNAUTHORIZED',
          message: 'Доступ запрещен. Требуется авторизация (غير مصرح. يرجى تسجيل الدخول مجدداً)'
        });
      }

      // 4. POST /api/dishes (Save updated menu)
      if (pathname === '/api/dishes' && req.method === 'POST') {
        const body = await parseBody(req);
        if (!body.dishes || !Array.isArray(body.dishes)) {
          return sendJson(res, 400, { success: false, message: 'Invalid dishes array' });
        }

        const newMenu = body.dishes;

        // Backup dishes.js before write
        const dishesJsPath = path.join(ROOT_DIR, 'dishes.js');
        const backupPath = path.join(ROOT_DIR, 'dishes_backup.js');
        try {
          fs.copyFileSync(dishesJsPath, backupPath);
        } catch (e) {}

        // Write dishes.js
        const jsContent = 'window.SHAMS_MENU = ' + JSON.stringify(newMenu, null, 2) + ';\n';
        fs.writeFileSync(dishesJsPath, jsContent, 'utf8');

        // Write clean_dishes.json
        const jsonPath = path.join(ROOT_DIR, 'clean_dishes.json');
        fs.writeFileSync(jsonPath, JSON.stringify(newMenu, null, 2) + '\n', 'utf8');

        console.log(`[ADMIN] Menu successfully updated: ${newMenu.length} dishes saved by ${clientIp}`);
        return sendJson(res, 200, { success: true, count: newMenu.length, message: 'Меню успешно сохранено (تم حفظ المنيو بنجاح)' });
      }

      // 5. POST /api/upload (Upload dish image - hardened)
      if (pathname === '/api/upload' && req.method === 'POST') {
        const body = await parseBody(req, 7 * 1024 * 1024); // max ~5MB binary encoded as base64
        if (!body.imageBase64 || typeof body.imageBase64 !== 'string') {
          return sendJson(res, 400, { success: false, message: 'Missing imageBase64' });
        }

        const matches = body.imageBase64.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (!matches) {
          return sendJson(res, 400, { success: false, message: 'Invalid image format or encoding' });
        }

        let rawExt = matches[1].toLowerCase().replace('jpeg', 'jpg');
        const ALLOWED_EXTS = ['jpg', 'png', 'webp'];
        if (!ALLOWED_EXTS.includes(rawExt)) {
          return sendJson(res, 400, { success: false, message: 'Unsupported file type. Only JPG, PNG, and WEBP allowed.' });
        }

        const buffer = Buffer.from(matches[2], 'base64');
        if (buffer.length > 5 * 1024 * 1024) { // 5MB limit
          return sendJson(res, 400, { success: false, message: 'File exceeds 5MB limit.' });
        }

        const randSuffix = crypto.randomBytes(6).toString('hex');
        const fileName = `dish_custom_${Date.now()}_${randSuffix}.${rawExt}`;
        const targetDir = path.join(ROOT_DIR, 'real_photos', 'dishes');
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const filePath = path.join(targetDir, fileName);
        fs.writeFileSync(filePath, buffer);

        const relativePath = `real_photos/dishes/${fileName}`;
        console.log(`[ADMIN] Uploaded new dish photo: ${relativePath}`);
        return sendJson(res, 200, { success: true, photoPath: relativePath });
      }

      // 6. POST /api/translate (Auto-translation: RU <-> AR & EN)
      if (pathname === '/api/translate' && req.method === 'POST') {
        const body = await parseBody(req, 1024 * 1024);
        let titleRu = (body.titleRu || '').trim();
        let descRu = (body.descRu || '').trim();
        let titleAr = (body.titleAr || '').trim();
        let descAr = (body.descAr || '').trim();

        // If Russian is empty but Arabic is provided, translate Arabic to Russian
        if (!titleRu && titleAr) {
          titleRu = await translateMyMemory(titleAr, 'ar', 'ru');
        }
        if (!descRu && descAr) {
          descRu = await translateMyMemory(descAr, 'ar', 'ru');
        }

        const [finalTitleAr, finalTitleEn, finalDescAr, finalDescEn] = await Promise.all([
          titleAr ? Promise.resolve(titleAr) : (titleRu ? translateMyMemory(titleRu, 'ru', 'ar') : Promise.resolve('')),
          titleRu ? translateMyMemory(titleRu, 'ru', 'en') : (titleAr ? translateMyMemory(titleAr, 'ar', 'en') : Promise.resolve('')),
          descAr ? Promise.resolve(descAr) : (descRu ? translateMyMemory(descRu, 'ru', 'ar') : Promise.resolve('')),
          descRu ? translateMyMemory(descRu, 'ru', 'en') : (descAr ? translateMyMemory(descAr, 'ar', 'en') : Promise.resolve(''))
        ]);

        return sendJson(res, 200, {
          success: true,
          titleRu: titleRu || body.titleRu || '',
          descRu: descRu || body.descRu || '',
          titleAr: finalTitleAr,
          titleEn: finalTitleEn,
          descAr: finalDescAr,
          descEn: finalDescEn
        });
      }

      return sendJson(res, 404, { success: false, message: 'API endpoint not found' });
    } catch (err) {
      console.error('[API ERROR]', err);
      return sendJson(res, 500, { success: false, message: err.message });
    }
  }

  // ==================== STATIC FILE SERVING WITH SECURITY JAIL ====================
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin.html';
  }

  // Strict Path Traversal Prevention
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const resolvedPath = path.resolve(ROOT_DIR, '.' + path.sep + safePath);

  if (!resolvedPath.startsWith(ROOT_DIR)) {
    setSecurityHeaders(res);
    res.writeHead(403, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>403 Forbidden</h1><p>Access denied.</p>');
    return;
  }

  // Block sensitive server files and hidden files
  const baseName = path.basename(resolvedPath).toLowerCase();
  const isSensitive = 
    baseName === 'server.js' ||
    baseName === 'package.json' ||
    baseName === 'package-lock.json' ||
    baseName.includes('backup') ||
    baseName.startsWith('scratch') ||
    baseName.startsWith('.env') ||
    baseName.startsWith('.') ||
    baseName.endsWith('.log') ||
    baseName.endsWith('.bak') ||
    resolvedPath.includes('.git') ||
    resolvedPath.includes('.system_generated') ||
    resolvedPath.includes('scratch');

  if (isSensitive) {
    setSecurityHeaders(res);
    res.writeHead(403, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>403 Forbidden</h1><p>Access to sensitive file is prohibited.</p>');
    return;
  }

  let targetFilePath = resolvedPath;

  fs.stat(targetFilePath, (err, stats) => {
    if (err) {
      setSecurityHeaders(res);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`<h1>404 Not Found</h1><p>The file was not found.</p>`);
      return;
    }

    if (stats.isDirectory()) {
      targetFilePath = path.join(targetFilePath, 'index.html');
    }

    const ext = path.extname(targetFilePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    setSecurityHeaders(res);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const stream = fs.createReadStream(targetFilePath);
    stream.on('error', (streamErr) => {
      console.error('[STREAM ERROR]', streamErr);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      }
      res.end('Internal Server Error');
    });
    stream.pipe(res);
  });
});

// Process-level crash prevention
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL UNCAUGHT EXCEPTION]', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL UNHANDLED REJECTION]', reason);
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIpAddresses();
  console.log(`\n======================================================`);
  console.log(`🛡️ خادم شمس المحصن يعمل بنجاح (Shams Secure Server)`);
  console.log(`🔑 كلمة المرور الآمنة: ${ADMIN_PASSWORD}`);
  console.log(`======================================================`);
  console.log(`💻 متجر الزبائن (Store):`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`\n👑 لوحة إدارة المنتجات (Admin Panel):`);
  console.log(`   http://localhost:${PORT}/admin.html`);
  console.log(`\n📱 روابط الموبايل على نفس الشبكة:`);
  ips.forEach(item => {
    console.log(`   🔗 المتجر: http://${item.ip}:${PORT}/`);
    console.log(`   👑 الإدارة: http://${item.ip}:${PORT}/admin.html`);
  });
  console.log(`======================================================\n`);
});
