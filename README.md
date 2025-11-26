# Planificador de Dietas y Almuerzos (ComidasApp)

![Angular](https://img.shields.io/badge/Angular-17.0%2B-dd0031.svg?style=flat&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg?style=flat&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.0%2B-ffca28.svg?style=flat&logo=firebase)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20%2B%20DDD-green)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> Una plataforma moderna de planificación nutricional diseñada para optimizar la gestión de menús semanales y la generación de listas de compras, construida sobre una arquitectura escalable y mantenible.

---

## Tabla de Contenidos

1. [Características del Sistema](#-características-del-sistema)
2. [Arquitectura y Diseño](#-arquitectura-y-diseño)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Requisitos Previos](#-requisitos-previos)
5. [Guía de Instalación y Configuración](#-guía-de-instalación-y-configuración)
6. [Scripts Disponibles](#-scripts-disponibles)
7. [Flujo de Trabajo (Git & Commits)](#-flujo-de-trabajo)
8. [Roadmap](#-roadmap)

---

## Características del Sistema

### Gestión de Platos (Domain: Dishes)
- **Catálogo Centralizado:** CRUD completo de platos con tiempos de preparación, porciones e ingredientes.
- **Modelo Rico:** Entidades inteligentes que encapsulan lógica (ej: cálculo de costos, validación vegetariana).
- **Persistencia:** Sincronización en tiempo real con Firestore.

### Planificador Inteligente (Domain: MealPlan)
- **Calendario Reactivo:** Interfaz visual basada en **Angular Signals** para una navegación instantánea sin `Zone.js` overhead.
- **Lógica de Asignación:** Prevención de duplicados y manejo de actualizaciones de menú optimizado.
- **Persistencia Automática:** Los cambios en el plan se guardan atómicamente.

### Lista de Compras (Domain: ShoppingList)
- **Motor de Agregación:** Algoritmo en el backend (frontend-side) que recorre el plan semanal, extrae los ingredientes de cada plato y suma las cantidades (ej: 200g Arroz + 300g Arroz = 500g Arroz).
- **Utilidades:** Copiado rápido al portapapeles y checklist interactivo.

---

## Arquitectura y Diseño

Este proyecto sigue estrictamente los principios de **Clean Architecture** y **Domain-Driven Design (DDD)** para asegurar que el código sea testeable, mantenible y desacoplado de frameworks externos.

### Decisiones Arquitectónicas Clave

1.  **Inversión de Dependencias (DIP):**
    - La capa de **Dominio** y **Aplicación** no conoce a Firebase ni a Angular.
    - Usamos `Tokens` (`DISH_REPOSITORY`, `MEAL_PLAN_REPOSITORY`) para inyectar las implementaciones concretas en tiempo de ejecución.

2.  **Componentes Standalone (Angular 17+):**
    - Se eliminaron los `NgModules` para reducir el boilerplate y mejorar el *Tree Shaking*.
    - Uso de `Lazy Loading` granular por rutas.

3.  **Gestión de Estado con Signals:**
    - Se abandonó el patrón imperativo (`subscribe` manual) en favor de un flujo reactivo declarativo (`toSignal`, `computed`).
    - Prepara la aplicación para el futuro "Zoneless" de Angular.

4.  **Patrón Repository & Mapper:**
    - Los datos de la BD (JSON puros) se transforman en **Clases de Dominio** mediante métodos estáticos `fromPrimitives` antes de entrar a la aplicación.

---

## Estructura del Proyecto

```
    src/app/
    ├── application/           # CAPA DE APLICACIÓN (Orquestación)
    │   └── services/          # Casos de Uso (ej: generate-shopping-list.usecase.ts)
    ├── core/                  # CAPA TRANSVERSAL
    │   ├── tokens.ts          # Injection Tokens para DIP
    │   └── services/          # Error Handling Global
    ├── domain/                # CAPA DE DOMINIO (Reglas de Negocio Puras)
    │   ├── entities/          # Clases Ricas (Dish, MealPlan, ShoppingList)
    │   └── repositories/      # Contratos (Interfaces)
    ├── infrastructure/        # CAPA DE INFRAESTRUCTURA (Implementación)
    │   └── firebase/          # Repositorios concretos que hablan con Firestore
    ├── features/              # CAPA DE PRESENTACIÓN (Vertical Slices)
    │   ├── dishes/            # Módulo de Platos (List & Create)
    │   ├── planner/           # Módulo del Planificador (Calendar & Detail)
    │   └── shopping-list/     # Módulo de Lista de Compras
    └── shared/                # UI Kit compartido (Cards, Validadores)
```
---

## Requisitos Previos

Asegúrate de tener instalado:

- **Node.js:** v18.13.0 o superior (Recomendado v20 LTS).
- **NPM:** v9 o superior.
- **Angular CLI:** v17 (instalar con `npm install -g @angular/cli`).

---

## Guía de Instalación y Configuración

### 1. Clonar el repositorio

    git clone [https://github.com/TheMaff/comidasapp.git](https://github.com/TheMaff/comidasapp.git)
    cd comidasapp

### 2. Instalar dependencias

    npm install

### 3. Configurar Variables de Entorno (Firebase)
El proyecto no incluye las credenciales de Firebase por seguridad. Debes crear el archivo `src/environments/environment.ts`:

    // src/environments/environment.ts
    export const environment = {
      production: false,
      firebaseConfig: {
        apiKey: "TU_API_KEY",
        authDomain: "tu-proyecto.firebaseapp.com",
        projectId: "tu-proyecto",
        storageBucket: "tu-proyecto.appspot.com",
        messagingSenderId: "...",
        appId: "..."
      }
    };

*(Repite el proceso para `environment.prod.ts` si vas a desplegar).*

### 4. Ejecutar en Desarrollo

    npm start

Abre tu navegador en `http://localhost:4200`.

---

## Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Levanta el servidor de desarrollo en puerto 4200. |
| `npm run build` | Compila la aplicación para producción en la carpeta `dist/`. |
| `npm test` | Ejecuta los tests unitarios (Karma/Jasmine). |
| `npm run lint` | Ejecuta el linter para verificar calidad de código. |

---

## Flujo de Trabajo

Utilizamos **Gitflow simplificado** o **Feature Branch Workflow**:

1.  **Ramas:**
    - `main`: Código de producción estable.
    - `feat/nombre-feature`: Nuevas funcionalidades.
    - `refactor/nombre-refactor`: Mejoras técnicas.
    - `fix/nombre-bug`: Corrección de errores.

2.  **Commit Message Convention:**
    - `feat(scope): description`
    - `fix(scope): description`
    - `refactor(scope): description`
    - `docs(scope): description`

---

## Roadmap

- [x] **Fase 1:** Migración a Angular 17 Standalone.
- [x] **Fase 2:** Implementación de Dominio Rico (DDD).
- [x] **Fase 3:** Planificador Reactivo con Signals.
- [x] **Fase 4:** Motor de Lista de Compras.
- [ ] **Fase 5:** UI Polish (Mejoras visuales en Calendario, CSS Grid).
- [ ] **Fase 6:** Autenticación Avanzada (Roles, Perfiles de Familia).
- [ ] **Fase 7:** Integración IA (Sugerencias de Menú).

---

## Troubleshooting

**Error: `FirebaseError: [code=permission-denied]`**
- **Causa:** Las reglas de Firestore no permiten escribir en la colección nueva (ej. `dishes`).
- **Solución:** Ir a la consola de Firebase -> Firestore -> Rules y permitir lectura/escritura en `match /dishes/{document=**}`.

**Error: `NG8002: Can't bind to 'ngModel'`**
- **Causa:** Falta importar `FormsModule` en el componente Standalone.
- **Solución:** Agregar `FormsModule` al array `imports: []` del componente.

---

Hecho con ❤️, **Angular 17** y mucho **Café**.