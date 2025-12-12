<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Creastilo AI Xperience

**Transformamos Tráfico en Leads Calificados con IA**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

[Demo en Vivo](https://creastilo.com) • [Documentación](./CLAUDE.md) • [Guía de Implementación](./IMPLEMENTATION_GUIDE.md)

</div>

---

## 🚀 Características Principales

### 🎡 Ruleta Gamificada de Leads
- Captura de leads mediante mecánica de juego
- Validación anti-fraude por Device-ID
- Probabilidades ponderadas por stock en tiempo real
- Generación automática de cupones únicos

### 📊 CRM Dashboard Inteligente
- Analytics en tiempo real
- Gestión de premios y stock
- Filtrado y búsqueda avanzada (optimizado con `useMemo`)
- Exportación de datos

### 💎 Prisma Lab - Suite Creativa con IA
- **Community AI**: Generación de campañas para redes sociales
- **Editor Inteligente**: Corrección y expansión de textos
- **Sintetizador Visual**: Imágenes con Gemini 3 Pro Image
- **Clonación de Voz**: Text-to-Speech con voces personalizadas

### 💬 GEN-IA - Agente Conversacional
- Chat con contexto persistente
- Integración con n8n webhooks para automatización
- Modo voz en tiempo real (Live Audio API)
- Function calling para acciones externas

### ⚡ Neural Architect
- Visualización de arquitectura de sistemas
- Diseño de soluciones enterprise a medida

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | React 18.3, TypeScript 5.8 |
| **Build Tool** | Vite 6.2 |
| **Styling** | Tailwind CSS, Glass-morphism |
| **AI Engine** | Google Gemini (Flash, Pro, Image, TTS, Live) |
| **Database** | Supabase (PostgreSQL) |
| **Animations** | GSAP, Recharts (D3.js) |
| **State** | React Hooks, Custom Events |
| **Deployment** | Vercel |

---

## 📦 Instalación y Uso

### Prerequisites
- Node.js 18+
- npm o yarn
- Gemini API Key ([Obtener aquí](https://ai.google.dev/))
- Supabase Account (opcional)

### Setup

```bash
# 1. Clonar el repositorio
git clone https://github.com/tuusuario/creastilooficial.git
cd creastilooficial

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# Editar .env y agregar:
# GEMINI_API_KEY=tu_api_key_aqui
# VITE_SUPABASE_URL=tu_url_supabase (opcional)
# VITE_SUPABASE_ANON_KEY=tu_key_supabase (opcional)

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:3000
```

### Build para Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [CLAUDE.md](./CLAUDE.md) | Arquitectura completa y áreas de oportunidad |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Guía de uso de componentes nuevos |
| [QUICK_WINS_SUMMARY.md](./QUICK_WINS_SUMMARY.md) | Resumen de mejoras implementadas |

---

## ✨ Mejoras Recientes (Quick Wins)

✅ **Seguridad**: `.env` protegido en `.gitignore`
✅ **UX**: Sistema de Toast Notifications
✅ **Performance**: Lazy loading + Memoización de filtros
✅ **Developer Experience**: Tailwind config + VS Code snippets
✅ **SEO**: Meta tags completos para redes sociales
✅ **Error Handling**: Error Boundary global
✅ **Loading States**: Skeleton screens

Ver [QUICK_WINS_SUMMARY.md](./QUICK_WINS_SUMMARY.md) para detalles.

---

## 🎯 Uso Rápido

### Toast Notifications

```tsx
import { useToast } from './components/ui/Toast';

function MyComponent() {
  const toast = useToast();

  const handleSave = () => {
    toast.success('Lead guardado exitosamente!');
  };

  return <button onClick={handleSave}>Guardar</button>;
}
```

### Loading States

```tsx
import { SkeletonTable } from './components/ui/Skeleton';

function DataTable() {
  const [loading, setLoading] = useState(true);

  if (loading) return <SkeletonTable rows={10} />;

  return <Table data={data} />;
}
```

---

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Las API keys están expuestas client-side via Vite's define config.

**Para producción**, implementa un backend proxy:

```
Cliente → Backend Proxy → Gemini API
        (sin key)      (key segura)
```

Ver [CLAUDE.md - Security](./CLAUDE.md#security--environment) para más detalles.

---

## 🚧 Roadmap

### En Progreso
- [ ] Backend proxy para Gemini API
- [ ] Integración completa con Supabase
- [ ] Implementación de Device-ID anti-fraude

### Planeado
- [ ] Testing suite (Vitest + RTL)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] A/B Testing en ruleta

---

## 📄 Licencia

Este proyecto es propiedad de **Creastilo**. Todos los derechos reservados.

---

## 🤝 Contribuir

Este es un proyecto privado. Para contribuir:

1. Fork del repositorio
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📞 Contacto

**Creastilo AI Xperience**
Web: [creastilo.com](https://creastilo.com)
Email: contacto@creastilo.com

---

## 🙏 Agradecimientos

- [Google Gemini AI](https://ai.google.dev/) - Potencia de IA
- [Vercel](https://vercel.com) - Hosting y deployment
- [Supabase](https://supabase.com) - Backend as a Service
- [Recharts](https://recharts.org) - Gráficas interactivas
- [Lucide Icons](https://lucide.dev) - Iconografía

---

<div align="center">

**Hecho con ❤️ por el equipo de Creastilo**

[⬆ Volver arriba](#creastilo-ai-xperience)

</div>
