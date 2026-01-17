# BTG Pactual - App de Gestión de Fondos (Prueba Técnica)

Este repositorio contiene la solución a la prueba técnica para Ingeniero de Desarrollo Front-End. Es una aplicación web interactiva desarrollada en **Angular 18** que permite a los clientes de BTG Pactual gestionar sus suscripciones a fondos de inversión (FPV/FIC).

## 📋 Descripción del Proyecto

El objetivo es simular una plataforma de inversión donde el usuario dispone de un saldo inicial de **$500.000 COP** y puede:
1.  Consultar fondos de inversión disponibles.
2.  Suscribirse a fondos (validando montos mínimos y saldo).
3.  Cancelar suscripciones (recibiendo reembolso).
4.  Visualizar el historial de movimientos.

## 🛠️ Stack Tecnológico

*   **Framework:** Angular 18 (Standalone Components, Signals, Typed Forms).
*   **Estilos:** TailwindCSS (Diseño Responsivo y Moderno).
*   **Gestión de Estado:** Angular Signals (Nativo).
*   **API Mock:** JSON Server (Simulación REST API).
*   **Control de Versiones:** Git.
*   **Contenedorización:** Docker & Docker Compose.

## 🚀 Instrucciones de Ejecución

Sigue estos pasos para desplegar el proyecto localmente:

### Prerrequisitos
*   Node.js (v18 o superior)
*   NPM

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd btg-funds-app
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el Servidor Mock (API):**
    En una terminal, ejecuta el simulador de backend (puerto 3000):
    ```bash
    npm run mock:api
    ```

4.  **Iniciar la Aplicación Frontend:**
    En **otra** terminal, ejecuta el servidor de desarrollo de Angular (puerto 4200):
    ```bash
    npm start
    ```

5.  **Abrir en el navegador:**
    Visita [http://localhost:4200](http://localhost:4200).

## 🐳 Despliegue en VPS / Servidor Linux (Docker)

Para desplegar la aplicación en un entorno de producción (AWS EC2, DigitalOcean, etc.) sigue estos pasos:

1.  **Conectarse al servidor VPS:**
    ```bash
    ssh usuario@tu-ip-servidor
    ```

2.  **Instalar Docker y Docker Compose (si no están instalados):**
    ```bash
    # Ejemplo para Amazon Linux 2023 / Fedora
    sudo dnf update
    sudo dnf install -y docker git
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    # (Reiniciar sesión para aplicar cambios de grupo)
    
    # Instalar Docker Compose
    sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

3.  **Clonar el proyecto:**
    ```bash
    git clone https://github.com/victordanielmun/prueba_tecnica_angular.git
    cd prueba_tecnica_angular/btg-funds-app
    ```

4.  **Construir y levantar contenedores:**
    ```bash
    docker-compose up --build -d
    ```

5.  **Verificar el despliegue:**
    Accede a la IP pública de tu servidor en el navegador:
    `http://TU_IP_PUBLICA` (Puerto 80).

    *Nota: Asegúrate de tener habilitado el puerto 80 en el Firewall / Security Group de tu VPS.*

    La arquitectura en Docker consta de:
    *   **Frontend:** Nginx sirviendo la app Angular compilada (puerto 80).
    *   **Backend:** JSON Server en contenedor dedicado (puerto 3000, accesible internamente).
    *   **Reverse Proxy:** Nginx redirige las peticiones `/api/*` al backend.

## 🏗️ Arquitectura y Diseño

El proyecto sigue una arquitectura modular y limpia, aplicando principios **SOLID**:

*   **`src/app/core`**: Contiene la lógica de negocio pura y singleton services.
    *   `services/`: `FundsService` (Datos) y `BalanceService` (Estado del usuario).
    *   `models/`: Interfaces TypeScript (`Fund`, `Transaction`).
*   **`src/app/features`**: Módulos funcionales divididos por dominio.
    *   `funds/`: Listado y lógica de suscripción.
    *   `history/`: Historial de transacciones.
*   **`src/app/shared`**: Componentes reutilizables (`Header`, `FundCard`, `Modal`).

### Decisiones Técnicas
*   **Standalone Components:** Se prescindió de `NgModules` para reducir boilerplate.
*   **Signals:** Se utilizó `signal()` y `computed()` para un manejo de estado reactivo y eficiente, reemplazando en gran medida a `BehaviorSubject`.
*   **Separation of Concerns (SoC):** La lógica de validación de saldo está desacoplada de la capa de presentación.

## ✅ Funcionalidades Implementadas

- [x] Visualización de lista de fondos (FPV/FIC).
- [x] Suscripción con validación de monto mínimo y saldo.
- [x] Selección de método de notificación (Email/SMS).
- [x] Feedback visual (Mensajes de éxito y error).
- [x] Historial de transacciones (Aperturas y Cancelaciones).
- [x] Cancelación de suscripción con actualización de saldo en tiempo real.
- [x] Saldo inicial persistente en memoria ($500.000).

## 🧪 Pruebas (Opcional)

El proyecto incluye la configuración base para pruebas unitarias con Karma/Jasmine.
```bash
npm test
```
