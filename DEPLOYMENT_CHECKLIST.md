# 🚀 Deployment Checklist

Use esta checklist antes de deployar a producción.

## ✅ Pre-Deploy Checklist

### 🔒 Security

- [ ] **API Keys**: Verificar que `.env` NO está en Git
  ```bash
  git status  # .env NO debe aparecer
  ```

- [ ] **Environment Variables**: Configuradas en Vercel/hosting
  - [ ] `GEMINI_API_KEY`
  - [ ] `VITE_SUPABASE_URL` (si usas Supabase)
  - [ ] `VITE_SUPABASE_ANON_KEY` (si usas Supabase)

- [ ] **Backend Proxy**: Implementado para Gemini API (RECOMENDADO)
  - [ ] Crear Vercel Serverless Function
  - [ ] Actualizar `geminiService.ts` para usar proxy
  - [ ] Remover API key del frontend

### 🎨 Assets

- [ ] **Favicons**: Generados y en `/public/`
  - [ ] `favicon-32x32.png`
  - [ ] `favicon-16x16.png`
  - [ ] `apple-touch-icon.png`
  - Tool: https://realfavicongenerator.net/

- [ ] **Social Images**: Creadas y en `/public/`
  - [ ] `og-image.png` (1200x630px para Facebook/LinkedIn)
  - [ ] `twitter-image.png` (1200x675px para Twitter)

- [ ] **robots.txt**: Creado en `/public/robots.txt`
  ```
  User-agent: *
  Allow: /
  Sitemap: https://creastilo.com/sitemap.xml
  ```

- [ ] **sitemap.xml**: Creado en `/public/sitemap.xml`

### ⚙️ Configuration

- [ ] **Tailwind**: Migrado de CDN a CLI
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  # Remover <script src="https://cdn.tailwindcss.com"></script>
  ```

- [ ] **Environment**: NODE_ENV = production

### 🧪 Testing

- [ ] **Build Success**: Ejecutar sin errores
  ```bash
  npm run build
  ```

- [ ] **Build Size**: Verificar bundle size
  ```bash
  npm run build -- --stats
  # Revisar dist/ folder size
  ```

- [ ] **Preview**: Funcional en producción
  ```bash
  npm run preview
  # Test en http://localhost:4173
  ```

- [ ] **Lighthouse**: Score > 85 en todos
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Best Practices
  - [ ] SEO

### 🔍 Functionality Tests

- [ ] **Error Boundary**: Funciona correctamente
  - [ ] Forzar error en dev mode
  - [ ] Verificar UI de error amigable

- [ ] **Toast Notifications**: Funcionan en todos los casos
  - [ ] Success toast
  - [ ] Error toast
  - [ ] Info toast
  - [ ] Warning toast

- [ ] **Lazy Loading**: Componentes cargan correctamente
  - [ ] Network tab: ver chunks cargando bajo demanda
  - [ ] No errores de carga

- [ ] **CRM Filters**: Performance óptima
  - [ ] Escribir en search sin lag
  - [ ] Cambiar filtros instantáneamente

- [ ] **Ruleta**: Funcional end-to-end
  - [ ] Girar y ganar premio
  - [ ] Lead guardado en CRM
  - [ ] Toast de confirmación

- [ ] **Gemini AI**: APIs funcionando
  - [ ] Text generation
  - [ ] Image generation
  - [ ] Voice synthesis
  - [ ] Chat conversation

### 🌐 SEO & Meta

- [ ] **Meta Tags**: Verificados en View Source
  - [ ] Title correcto
  - [ ] Description atractiva
  - [ ] OG tags completos
  - [ ] Twitter cards

- [ ] **Links**: Sin enlaces rotos
  ```bash
  # Verificar manualmente o con herramienta
  ```

- [ ] **Sitemap**: Accesible
  - Visitar: https://creastilo.com/sitemap.xml

- [ ] **Google Search Console**: Configurado
  - [ ] Sitemap enviado
  - [ ] Propiedad verificada

### 📱 Responsive Design

- [ ] **Mobile**: Funcional en móvil (< 768px)
- [ ] **Tablet**: Funcional en tablet (768px - 1024px)
- [ ] **Desktop**: Funcional en desktop (> 1024px)
- [ ] **Touch Targets**: Mínimo 44x44px

### 🔧 Browser Compatibility

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🚀 Deployment Steps

### Option A: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Configure environment variables in Vercel dashboard
# vercel.com/your-project/settings/environment-variables

# 5. Deploy to production
vercel --prod
```

### Option B: Netlify

```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Build
npm run build

# 4. Deploy
netlify deploy --prod --dir=dist

# 5. Configure environment variables in Netlify dashboard
```

### Option C: Manual

```bash
# 1. Build
npm run build

# 2. Upload dist/ folder to hosting
# Via FTP, SSH, or hosting provider's interface
```

---

## ✅ Post-Deploy Checklist

### Immediate Verification

- [ ] **Site Loads**: Visitar URL de producción
- [ ] **No Errors**: Revisar browser console
- [ ] **Performance**: < 3s load time
- [ ] **Analytics**: Google Analytics tracking (si configurado)

### 24 Hours After

- [ ] **Error Tracking**: Revisar Sentry/LogRocket (si configurado)
- [ ] **Server Logs**: Verificar errores en Vercel/Netlify
- [ ] **API Usage**: Revisar cuota de Gemini API

### 1 Week After

- [ ] **User Feedback**: Revisar quejas/bugs
- [ ] **Conversion Rate**: Ruleta funcionando correctamente
- [ ] **SEO**: Verificar indexación en Google

---

## 🔴 Rollback Plan

Si algo sale mal en producción:

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# Manual
# Restaurar backup de dist/ anterior
```

---

## 📊 Monitoring Setup (Optional but Recommended)

### Analytics
- [ ] Google Analytics instalado
- [ ] Goals configurados (lead submission, ruleta spin)
- [ ] Eventos de conversión tracking

### Error Tracking
- [ ] Sentry configurado
  ```bash
  npm install @sentry/react
  # Configurar en index.tsx
  ```

### Performance Monitoring
- [ ] Vercel Analytics habilitado
- [ ] Web Vitals tracking
- [ ] Uptime monitoring (UptimeRobot)

---

## 🆘 Emergency Contacts

**Technical Issues:**
- Developer: [Tu email]
- Hosting Support: support@vercel.com

**API Issues:**
- Gemini API: https://ai.google.dev/support
- Supabase: support@supabase.com

---

## 📝 Notes

**Last Deployment:**
- Date: _____________
- Version: _____________
- Deployed by: _____________
- Issues found: _____________

---

**[✅ All checked? Deploy with confidence!]**
