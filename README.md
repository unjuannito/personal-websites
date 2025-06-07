# 📁 Repo para mis webs personales

Este repositorio se utiliza para el **despliegue** y **almacenamiento organizado** de mis páginas web personales desarrolladas con React.

---

## 🧪 Método de trabajo

- **`main`**: Rama de **producción**, contiene únicamente los archivos generados por `npm run build`, listos para ser desplegados (por ejemplo, en GitHub Pages).
- **`dev`**: Rama de **desarrollo**, donde se encuentra el código fuente de las aplicaciones React. Todo el desarrollo se hace aquí antes de compilar para producción.

---

## 🔄 Flujo de trabajo

1. Todo el desarrollo ocurre en la rama `dev`.
2. Cuando la app está lista para producción:
   - Se ejecuta `npm run build`.
   - El contenido de la carpeta `build/` se copia a la rama `main`.
3. La rama `main` se utiliza como fuente para el despliegue (por ejemplo, en GitHub Pages).
