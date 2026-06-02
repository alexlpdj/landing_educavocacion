# EducaVocación - Sistema de Diseño & Componentes

Documentación técnica del sistema de estilos, componentes CSS y patrones implementados.

---

## Variables CSS

```css
:root {
  --navy:   #13103B;    /* Texto principal */
  --blue:   #2424BA;    /* Botones primarios */
  --sky:    #29ABE2;    /* Acentos cian */
  --light:  #DCF0F9;    /* Fondo claro */
  --cream:  #F0F6FF;    /* Fondo crema */
  --white:  #ffffff;    /* Blanco */
  --gray:   #6B7280;    /* Gris neutro */
  --radius: 14px;       /* Border radius */
}
```

---

## Tipografía

**Font:** Poppins (Google Fonts)
**Importación:**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap">
```

**Escala tipográfica:**
- `.h1`: clamp(2.4rem, 5vw, 3.8rem), weight 800
- `.h2`: clamp(1.8rem, 3.5vw, 2.6rem), weight 800
- `.h3`: 1.25rem, weight 700
- `.lead`: 1.1rem, weight 400, color gris
- Body: Poppins 400, var(--navy)

---

## Componentes

### Botones

**Base (.btn):**
- Padding: 14px 28px
- Border radius: 999px (pill shape)
- Transiciones: transform, shadow, opacity
- Hover: translateY(-2px)

**Variantes:**
- `.btn--primary`: Azul #2424BA con sombra
- `.btn--sky`: Azul cian #29ABE2 con sombra
- `.btn--outline`: Borde navy en claro
- `.btn--outline-white`: Borde blanco en oscuro
- `.btn--sm`: Versión pequeña (10px 22px)

### Secciones

```css
.section { padding: 96px 0; }
.section--cream { background: var(--cream); }
.section--navy { background: var(--navy); color: var(--white); }
.section--light { background: var(--light); }
```

### Contenedor
```css
.container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
```

### Etiquetas
- `.tag`: Fondo transparente sky, texto sky
- `.tag--navy`: Fondo transparente navy, texto navy

### Listas
- `.check-list`: Flex column con pseudo-elemento círculo sky

---

## Animaciones

- `@keyframes slideUp`: Entrada desde abajo
- `@keyframes pulse`: Pulso suave
- `.fade-in`: Entrada con fade
- `.fade-delay-1`: Retraso 100ms
- `.fade-delay-2`: Retraso 200ms

---

## Responsive

**Breakpoint principal:** 960px

```css
@media (max-width: 960px) {
  /* Estilos tablet y mobile */
}
```

---

## Patrón para Nuevas Páginas

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Página - EducaVocación</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css" />
  
  <style>
    :root {
      --navy:   #13103B;
      --blue:   #2424BA;
      --sky:    #29ABE2;
      --light:  #DCF0F9;
      --cream:  #F0F6FF;
      --white:  #ffffff;
      --gray:   #6B7280;
      --radius: 14px;
    }
    /* Copiar estilos base del index.html */
  </style>
</head>
<body>
  <main>
    <section class="section section--cream">
      <div class="container">
        <h1 class="h1">Título</h1>
        <p class="lead">Descripción</p>
      </div>
    </section>
  </main>
</body>
</html>
```

---

## Checklist

- [ ] Colores correctos (#13103B, #2424BA, #29ABE2)
- [ ] Poppins importada con weights 300-800
- [ ] Padding secciones: 96px
- [ ] Container: max-width 1180px
- [ ] Responsive en 960px
- [ ] Botones con transiciones suaves
- [ ] Animaciones fade-in/delay
- [ ] Espaciado múltiplo de 8px

---

*Base: index.html validado*
*Actualizado: 2026-04-28*
