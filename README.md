# Planificador de Dietas y Almuerzos (ComidasApp)

Aplicación web para **planificar almuerzos y comidas semanales**, pensada para familias o personas que quieren organizar mejor qué van a comer, reducir la la carga mental de “¿qué hay para hoy?” y a futuro apoyarse en **IA** para recibir sugerencias inteligentes de menús.

Este proyecto nace a partir del repositorio `comidasapp` y evoluciona hacia un **dashboard profesional en Angular** con buenas prácticas de ingeniería de software, arquitectura limpia y un diseño escalable apto para contextos reales (banca, empresas, etc.).

---

## Tabla de contenidos

- [Visión general](#visión-general)
- [Objetivos del proyecto](#objetivos-del-proyecto)
  - [Objetivos funcionales](#objetivos-funcionales)
  - [Objetivos no funcionales](#objetivos-no-funcionales)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura y organización](#arquitectura-y-organización)
  - [Capas lógicas](#capas-lógicas)
  - [Estructura de carpetas](#estructura-de-carpetas)
- [Estado actual del proyecto](#estado-actual-del-proyecto)
- [Guía rápida de uso](#guía-rápida-de-uso)
  - [Requisitos previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Ejecución en desarrollo](#ejecución-en-desarrollo)
  - [Build para producción](#build-para-producción)
  - [Testing](#testing)
- [Metodología de trabajo](#metodología-de-trabajo)
  - [Flujo de Git](#flujo-de-git)
- [Roadmap / Fases](#roadmap--fases)
- [Convenciones y buenas prácticas](#convenciones-y-buenas-prácticas)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Visión general

**Planificador de Dietas y Almuerzos** es una aplicación web que busca resolver un problema cotidiano:

> Planificar de forma simple, visual y reutilizable qué se va a comer durante la semana (especialmente almuerzos), evitando la improvisación diaria y facilitando las compras.

A nivel funcional, el objetivo es:

- Tener un **catálogo de platos** (“dishes”) reutilizable.
- Definir un **menú semanal de almuerzos** de forma visual.
- Generar **listas de compras** automáticas a partir del menú.
- A futuro, ofrecer **sugerencias inteligentes** de menús integrando IA (por ejemplo, OpenAI u otros LLMs), considerando:
  - Preferencias personales y de la familia.
  - Tiempo disponible para cocinar.
  - Presupuesto.
  - Restricciones alimentarias (ej. sin mariscos, sin gluten, etc.).

A nivel técnico, el proyecto está diseñado como un frontend profesional en Angular, aplicando:

- Principios de **ingeniería de software** y **SOLID**.
- **Clean Architecture** y **DDD ligero** en frontend.
- Separación clara por dominios y features.
- Enfoque modular y escalable, apto para crecer en funcionalidades sin perder mantenibilidad.

---

## Objetivos del proyecto

### Objetivos funcionales

1. **Catálogo de platos (Dishes)**
   - Crear, editar, eliminar y listar platos.
   - Cada plato incluye, al menos:
     - Nombre.
     - Categoría (carne, pasta, vegetariano, etc.).
     - Ingredientes.
     - Tiempo de preparación.
     - Número de porciones.
     - Tags útiles (rápido, económico, niños, etc.).

2. **Planificador semanal de almuerzos**
   - Asignar platos del catálogo a cada día de la semana.
   - Ver de un vistazo el **menú semanal**.
   - Reutilizar semanas anteriores o copiar planes.

3. **Lista de compras**
   - Generar automáticamente una lista de compras a partir del menú semanal.
   - Agrupar ingredientes por categoría (verduras, carnes, despensa, etc.).
   - Permitir copiar o descargar fácilmente la lista.

4. **Gestión de usuarios y preferencias**
   - Autenticación de usuarios.
   - Guardar preferencias de la familia:
     - Número de personas.
     - Restricciones alimentarias.
     - Rango de presupuesto.

5. **Panel de progreso y métricas**
   - Mostrar:
     - % de días planificados.
     - Estadísticas simples sobre variedad de platos, repetición, etc.
   - Usar gráficas básicas para visualizar la información.

6. **Sugerencias asistidas por IA (futuro)**
   - Sugerir menús completos según:
     - Platos existentes.
     - Historial de uso.
     - Preferencias/restricciones.
   - Permitir aceptar, ajustar o descartar platos sugeridos.

### Objetivos no funcionales

- **Escalabilidad:** estructura modular para poder crecer sin “spaghetti code”.
- **Mantenibilidad:** código legible, tipado estricto, separación de responsabilidades.
- **Testabilidad:** servicios y lógica de dominio testeables de forma aislada.
- **Seguridad básica:** rutas protegidas, validaciones de formularios, manejo de sesión.
- **Performance:** uso de lazy loading por defecto en features grandes y revisión con Lighthouse a medida que evoluciona.

---

## Stack tecnológico

### Frontend

- **Framework:** Angular (CLI, versión estable >= 15; el repo original fue creado con Angular CLI 14).
- **Lenguaje:** TypeScript.
- **UI / Diseño:**
  - [Angular Material](https://material.angular.io/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Bootstrap / Bootstrap Icons](https://getbootstrap.com/) (heredados del prototipo actual, se irán ajustando).
- **Gestión de estado:**
  - Signals de Angular (en versiones recientes) y/o RxJS.
  - Patrón smart/dumb components; posibilidad de facades por dominio.
- **Testing (por definir en el proyecto):**
  - Unit tests con Karma/Jasmine o Jest.
  - Futuros tests de integración/E2E (Cypress, Playwright, etc.).

### Backend / BaaS (planificado)

- **Firebase** (config pendiente de integración en este repo):
  - Autenticación (Firebase Auth).
  - Firestore para platos, planes, listas de compras, preferencias.
  - Hosting (opcional).
- Futuro: opción de migrar a backend propio (Node.js + NestJS) si el dominio crece.

### Infraestructura

- **Repositorio:** GitHub (`TheMaff/comidasapp` como base).
- **Deploy:** Netlify, Vercel o Firebase Hosting (a definir).
- **CI/CD (futuro):** GitHub Actions para:
  - Ejecutar tests.
  - Verificar build.
  - Desplegar automáticamente en ciertos branches (ej. `main`).

---

## Arquitectura y organización

El proyecto apunta a una combinación de **Clean Architecture** y **DDD práctico** en frontend, separando:
- **Dominio** (reglas de negocio, entidades).
- **Aplicación / Casos de uso** (orquestación).
- **Infraestructura** (Firebase / HTTP, mapeos, adaptadores).
- **Presentación** (Angular: componentes, módulos, routing).

### Capas lógicas

1. **Dominio**
   - Entidades principales:
     - `Dish` (Plato).
     - `MealPlan` (Plan de comidas semanal).
     - `DayMenu` (menú de un día).
     - `ShoppingList` (lista de compras).
     - `UserPreferences` (preferencias de usuario/familia).
   - Value Objects (ejemplos):
     - `MealType` (almuerzo, cena, etc. — aunque el foco inicial es almuerzo).
     - `Portion` (cantidad de porciones).
   - Reglas simples:
     - Un plan semanal siempre tiene 7 días.
     - No se permiten platos sin campos obligatorios.

2. **Aplicación / Casos de uso**
   - Ejemplos de casos de uso:
     - `CreateDishUseCase`
     - `UpdateDishUseCase`
     - `GenerateWeeklyPlanUseCase`
     - `GenerateShoppingListUseCase`
     - `SuggestMenuWithAIUseCase` (futuro).
   - Dependen de interfaces/repositories, no de Firebase directamente.

3. **Infraestructura**
   - Implementaciones concretas de repositorios:
     - `DishFirestoreRepository`
     - `MealPlanFirestoreRepository`
   - Integración con Firebase SDK u otros servicios externos.
   - Mapeo de DTOs ↔ entidades de dominio.

4. **Presentación (Angular)**
   - Módulos y componentes organizados por features:
     - `auth` → login/registro.
     - `pages/dashboard` → vista general (resumen semanal).
     - `pages/dishes` → gestión de platos.
     - `pages/planner` → planificador semanal.
     - `pages/shopping-list` → lista de compras.
     - `pages/progress` → progreso y métricas.
     - `pages/settings` → configuración de cuenta/app.
   - Componentes compartidos:
     - Header, sidebar, breadcrumbs, tarjetas de plato, etc.
   - Servicios/facades específicos por dominio para hablar con casos de uso.

### Estructura de carpetas

> Nota: Esta estructura es el objetivo a medio plazo; el repo actual está en transición desde un layout Angular estándar a esta organización más orientada al dominio.

Ejemplo de estructura deseada:

```txt
src/app/
  core/
    domain/
      dishes/
      meal-plans/
      shopping-list/
      shared/
    application/
      dishes/
      meal-plans/
      shopping-list/
    infrastructure/
      firebase/
        dishes/
        meal-plans/
  features/
    auth/
    dashboard/
    dishes/
    planner/
    shopping-list/
    progress/
    settings/
  shared/
    ui/
    components/
    services/
```

---

## Estado actual del proyecto

A partir del repositorio original `comidasapp`, actualmente existe:

- Un **esqueleto de dashboard** con:
  - Header (`HeaderComponent`) con la frase “¿Qué hay para hoy?”.
  - Sidebar (`SidebarComponent`) con entradas a:
    - Dashboard.
    - Dishes.
    - Progress.
    - Gráficas.
    - Settings, etc.
  - Breadcrumbs (`BreadcrumbsComponent`) placeholder.
- Módulos principales:
  - `AuthModule` (login/registro; login navega al dashboard, sin auth real aún).
  - `PagesModule` (dashboard principal y páginas internas).
  - `SharedModule` (header, sidebar, breadcrumbs).
  - `ComponentsModule` (`DishComponent` y otros componentes reutilizables).
- Páginas iniciales:
  - `DashboardComponent`: placeholder para el resumen general.
  - `FoodDishesComponent`: muestra varias tarjetas `<app-dish>`, inicio del catálogo de platos.
  - `ProgressComponent`: usa un valor numérico de progreso, pensado como demo de métricas.
  - `Grafica1Component`, `AccountSettingComponent`: stubs para futuras vistas.

En otras palabras: la parte de **layout, routing y estructura base ya está creada**, y el siguiente paso es inyectar el **dominio real de planificación de almuerzos** sobre esta base.

---

## Guía rápida de uso

### Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS recomendada).
- [Angular CLI](https://angular.io/cli) instalado globalmente:

```bash
npm install -g @angular/cli
```

- Cuenta y proyecto configurado en **Firebase** (si se va a conectar a Firestore/Auth en local).

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TheMaff/comidasapp.git
cd comidasapp

# Instalar dependencias
npm install
```

### Ejecución en desarrollo

```bash
npm start
# o
ng serve
```

Luego abre en el navegador:

```text
http://localhost:4200/
```

### Build para producción

```bash
npm run build
# o
ng build --configuration production
```

El resultado quedará en la carpeta `dist/`.

### Testing

> Aún en construcción. La idea es tener:

- Tests unitarios para:
  - Entidades y casos de uso (cuando estén implementados).
  - Componentes clave (dishes, planner, etc.).
- Comando estándar:

```bash
npm test
```

(Dependiendo de si se usa Karma/Jasmine o Jest, este punto se actualizará).

---

## Metodología de trabajo

El proyecto se gestiona con una aproximación **Scrumban**:

- Uso de tablero (GitHub Projects / similar) con columnas:
  - `Backlog` → `Ready` → `In Progress` → `Code Review` → `Testing` → `Done`.
- Iteraciones cortas (1–2 semanas) con foco en añadir valor visible al usuario.
- Métricas a considerar:
  - **Cycle Time:** cuánto tarda una tarea desde In Progress hasta Done.
  - **Throughput:** cuántas tareas se completan por semana.
  - **Lead Time:** desde que se crea una idea hasta que llega a producción.

### Flujo de Git

- Rama principal: `main` (siempre desplegable).
- Ramas de feature:

```text
feature/<nombre-corto>
```

Ejemplos:

- `feature/dishes-crud`
- `feature/weekly-planner`
- `feature/shopping-list`

- Pull Requests:
  - 1+ reviewers idealmente.
  - Build + tests deben pasar antes de merge.

---

## Roadmap / Fases

Resumen de fases planificadas:

1. **Fase 0 – Base técnica (DONE / EN PROGRESO)**
   - Crear proyecto Angular base.
   - Definir layout de dashboard (header, sidebar, contenido).

2. **Fase 1 – Dominio básico de platos**
   - Definir entidad `Dish` y casos de uso básicos.
   - Crear UI de listado + CRUD de platos.
   - Persistir en Firebase (o mock temporal).

3. **Fase 2 – Planificador semanal**
   - Definir `MealPlan` y `DayMenu`.
   - Crear UI para organizar el menú semanal.
   - Mostrar resumen en `DashboardComponent`.

4. **Fase 3 – Lista de compras + métricas**
   - Generar `ShoppingList` a partir del plan semanal.
   - UI para la lista (agrupada por categoría).
   - Integrar métricas / progreso (ej. % de días planificados).

5. **Fase 4 – Integración de IA**
   - Conectar con servicio de IA (OpenAI u otro).
   - Sugerir menús semanales completos según preferencias.
   - Ajustar y guardar las propuestas.

6. **Fase 5 – Pulido y performance**
   - Afinar UI/UX.
   - Mejorar performance, accesibilidad y SEO.
   - Documentar API internas y flujos clave.

---

## Convenciones y buenas prácticas

- Uso de **TypeScript estricto** siempre que sea posible.
- Aplicación de principios SOLID en servicios y lógica.
- Componentes con responsabilidades claras:
  - Contenedores (smart) vs. presentacionales (dumb).
- Inyección de dependencias bien gestionada (`providedIn` adecuado).
- Formularios reactivos para la mayoría de los formularios de la app.
- Nombres de carpetas y archivos en inglés (dominio) para consistencia en código.

---

## Contribuir

Las contribuciones son bienvenidas. Proceso sugerido:

1. Crear un fork del repositorio.
2. Crear una rama de feature desde `main`:
   ```bash
   git checkout -b feature/<nombre-feature>
   ```
3. Implementar cambios y agregar tests si aplica.
4. Hacer commit siguiendo un mensaje descriptivo.
5. Abrir un Pull Request contra `main` explicando claramente:
   - Qué problema resuelve.
   - Qué cambios se hicieron.
   - Cómo probarlos.
