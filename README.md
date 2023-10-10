# Skate Park App

![Skate Park App Logo](/public/img/favicon.png)

**Versión:** 2.0.0

## Descripción

Skate Park App es una aplicación web diseñada para administrar deportistas de skate y gestionar la información de las personas involucradas en el mundo del skateboarding. Hemos utilizado tecnologías como Handlebars para las vistas, Express para el backend, Bootstrap para el frontend y PostgreSQL para la base de datos.

La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en los registros de deportistas de skate, lo que facilita el seguimiento de su progreso y logros. Además, proporciona una interfaz intuitiva y fácil de usar para gestionar los datos de las personas y su participación en el skate park.

## Autor

**Autor:** Cristóbal Manzano

## Tabla de Contenidos

- [Skate Park App](#skate-park-app)
  - [Descripción](#descripción)
  - [Autor](#autor)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Instrucciones de Uso](#instrucciones-de-uso)
    - [Prerrequisitos](#prerrequisitos)
    - [Clonar el Repositorio](#clonar-el-repositorio)
    - [Instalar Dependencias](#instalar-dependencias)
    - [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
    - [Iniciar la Aplicación](#iniciar-la-aplicación)
  - [Scripts](#scripts)
  - [Ejemplo de Implementación Actual](#ejemplo-de-implementación-actual)
  - [Contribuciones](#contribuciones)

## Instrucciones de Uso

### Prerrequisitos

Asegúrate de tener las siguientes herramientas instaladas en tu sistema:

- Node.js: Node.js es necesario para ejecutar los scripts del proyecto.
- PostgreSQL: Se utiliza PostgreSQL como base de datos.

### Clonar el Repositorio

Clona este repositorio utilizando Git. Abre tu terminal y ejecuta el siguiente comando:

```bash
git clone https://github.com/zanozano/skate-park-app.git
```

### Instalar Dependencias

Una vez que hayas clonado el repositorio, navega hasta la carpeta del proyecto y instala las dependencias utilizando npm:

```bash
cd skate-park-app
npm install
```

### Configuración de la Base de Datos

Antes de iniciar la aplicación, debes configurar la conexión a la base de datos PostgreSQL. Asegúrate de tener una base de datos creada y actualiza la información de conexión en el archivo de configuración correspondiente.

### Iniciar la Aplicación

Para ejecutar la aplicación, utiliza el siguiente script:

```bash
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts

Para obtener actualizaciones en tiempo real de SCSS a CSS, utiliza el siguiente script después de instalar las dependencias:

```json
"scripts": {
    "scss": "sass --watch public/scss/style.scss:public/css/style.css"
}
```

## Ejemplo de Implementación Actual

Puedes ver Skate Park App en acción visitando el siguiente enlace:

[Skate Park App](insertar-enlace-de-la-implementación)

## Contribuciones

Damos la bienvenida a contribuciones al proyecto Skate Park App. Para participar, sigue nuestras pautas para reportar problemas, solicitar características o enviar solicitudes de extracción en el repositorio.

Agradecemos tu interés en el proyecto Skate Park App. Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con nosotros
