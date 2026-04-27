# 🎮 Flappy Kiro

Un juego de navegador estilo Flappy Bird construido con JavaScript vanilla, HTML5 Canvas y CSS.

## 🚀 Demo en Vivo

[Jugar Flappy Kiro](https://tu-proyecto.vercel.app)

## 🎯 Características

- ✨ Física realista con gravedad y saltos
- 🎨 Estética retro con fuente pixel art
- 🎵 Efectos de sonido
- 📱 Diseño responsive
- 🏆 Sistema de puntuación
- 🎮 Controles simples (clic o barra espaciadora)

## 🛠️ Tecnologías

- HTML5 Canvas
- JavaScript ES6+ (Módulos)
- CSS3
- Arquitectura modular

## 🎮 Cómo Jugar

1. Haz clic en el canvas o presiona la barra espaciadora para comenzar
2. Haz clic o presiona espacio para hacer que Ghosty salte
3. Evita las paredes y los bordes de la pantalla
4. ¡Intenta obtener la puntuación más alta!

## 🏗️ Arquitectura del Juego

El juego está construido con una arquitectura modular:

- **GameState**: Gestión de estados del juego (START, PLAYING, GAME_OVER)
- **Physics**: Motor de física con gravedad y velocidad
- **Ghosty**: Entidad del jugador
- **WallManager**: Generación y gestión de obstáculos
- **CollisionDetector**: Detección de colisiones AABB
- **Renderer**: Sistema de renderizado en canvas
- **InputHandler**: Gestión de entrada de teclado y mouse
- **AudioManager**: Reproducción de efectos de sonido
- **ScoreTracker**: Sistema de puntuación

## 📦 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/Tati1016/aleteo-kiro.git

# Navegar al directorio
cd aleteo-kiro

# Iniciar un servidor local (requiere Python)
python -m http.server 8000

# O con Node.js
npx http-server
```

Luego abre `http://localhost:8000` en tu navegador.

## 🚀 Despliegue

Este proyecto está configurado para desplegarse en Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Tati1016/aleteo-kiro)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🎨 Créditos

- Fuente: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) de Google Fonts
- Concepto del juego inspirado en Flappy Bird

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en GitHub.

---

Hecho con ❤️ por Tati1016
