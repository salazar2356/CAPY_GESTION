# Code Conduct Proyecto Web

> Developers guide for greatness
> 

Esta es la guía de desarrolladores para <nombreDeLaApp>, que usa React para construir la interfaz y Typecript para lenguaje. El proyecto usa React con Typescript + SWC. El proyecto usa ECMAScript e import y export para los modulos.

# Project Structure

El proyecto usa vite React con Typescript + SWC para desarrollar la aplicación.

### App.tsx

Es el archivo principal de la aplicación donde se renderiza React.

### Components

En esta carpeta se almacenan todos los componentes de la aplicación. Cada componente tiene su archivo tsx

### Screens

En esta carpeta están todos los macrocomponentes que se comportan como pantallas. La estructura de creación de las pantallas es como si fuera un componente, con un contenedor que es una <section> con una class llamada page. Dentro de esta section se colocan todos los componentes de la pantalla.

### Assets

En esta carpeta se guardan todos los recursos que usa nuestra aplicación. Esta misma se separa en tipo de assets:

- jpg: Imagenes de tipo jpg
- svg: Archivos vectoriales como iconos o gráficos.
- png: Imágenes de tipo png.
- fonts: Es la carpeta donde guardamos todas las fuentes locales.

### Utils

En esta carpeta se guardan los módulos y funciones que use la aplicacion. El tipo de los archivos debe de ser Typescript y que las funciones sigan el principo de responsabilidad unica. El nombramiento de los archivos debe ser muy descriptivo usando `cammelCase` y las funciones que se usen tienen que ser variables constantes que almacenen funciones de flecha.

Recordar que los módulos retornan algo.

Ejemplo:

```tsx
//Nombre del archivo: sumaNum.ts

const sumaNum = (a: number, b: number) => {
	return a + b
}
```

### Services

En esta carpeta se guardan los modulos y funciones que use la aplicacion pero que esten conectados con funcionalidades externas, por ejemplo, librerias o apis del internet. Asi mismo, el tipo de los archivos debe de ser Typescript y que las funciones sigan el principo de responsabilidad unica. El nombramiento de los archivos debe ser muy descriptivo usando cammelCase y las funciones que se usen tienen que ser variables constantes que almacenen funciones de flecha.

Ejemplo:

```tsx
//Nombre del archivo: fetchUsers.ts

const fetchUsers = async (apiKey: string) => {
	const res = await fetch(apiKey)
	const json = await res.json()
	console.log(json)
}
```

# Variables

El nombramiento de variables se hace en cammel case y siendo lo más descriptivas posibles. Normalmente se usan constantes y si se necesitan actualizar se usan let. Por ningún motivo se usa var.

Ejemplo:

```tsx
const variableDescriptiva = ""

let otroNombreDeVariableDescriptiva = ""
```

# Css and Fonts

Para el manejo de los estilos cada componente tiene su propio archivo de css propio. Para gestionar la versión responsive vamos usar las media quieres, usaremos una para versión de desktop y una para versión de mobile:

## Versión Desktop

El tamaño máximo para la versión desktop es 1700px de ancho y el mínimo es 1200px de ancho.

```css
@media only screen and (min-width: 1200px) and (max-width: 1600px) {
	//Estilos de la versión desktop
}
```

## Versión Mobile

El tamaño máximo para la versión desktop es 480px de ancho y el mínimo es 320px de ancho.

```css
@media only screen and (min-width: 320px) and (max-width: 480px) {
	//Estilos de la versión mobile
}
```

## Identificación de componentes y clases

Los identificadores y las clases de los elementos HTML deben de escribirse en ingles con `cammelCase` y siendo descriptivos.

Asi mismo, y como por ahora los estilos de los componentes se filtran hacia los demás, hay que encerrar a cada componente con un contenedor y a este contenedor se le añade una id para identificarlo, y dentro de los estilos se hace referencia a esa id para ponerle los estilos a todos los elementos interiores de ese componente.

Ejemplo:

```tsx
import './commponentStyle'

export const ExampleCommponent = (props) => {
	return <>
		<div id="commponentContainer">
			//Inner Commponents
		</div>
	</>
}
```

## Fonts

Usaremos fuentes locales (descargadas) para gestionar las fuentes en los estilos. Asi que dentro de la carpeta fonts de assests hay un archivo llamado fonts.css donde se declaran todas las @font-face de las fuentes y que se importan en los componentes o en el html.

Ejemplo:

```tsx
@font-face {
  font-family: 'MyCustomFont';
  src: url('/src/assets/fonts/MyCustomFont-Regular.woff2') format('woff2'),
       url('/src/assets/fonts/MyCustomFont-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'MyCustomFont';
  src: url('/src/assets/fonts/MyCustomFont-Bold.woff2') format('woff2'),
       url('/src/assets/fonts/MyCustomFont-Bold.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}

```

Y dentro de los componentes:

```tsx
import './componentStyle'
import '../../assets/fonts/fonts.css' //Importa las fuentes aqui

import jpg from './'

interface ExampleComponentProps {
	atributte1: string,
	atributte2: number
}

export const ExampleComponent = ({atributte1, atributte2}: ExampleComponentProps) => {
	return <>
		<div id="componentContainer">
			//Inner Components
		</div>
	</>
}
```

Y usa las fuentes dentro de los archivos css asi:

```tsx
<element> {
  font-family: 'MyCustomFont', sans-serif;
}
```

# Components Estructures

Para crear un componente se tiene que crear dentro de la carpeta de commponents un una nueva con el nombre del componente, y dentro de esta carpeta dos archivos con el nombre del componente, un archivo `.tsx` y otro archivo `.css`.

Los componentes se tienen que crear con funciones flecha y su nombre tiene que ser `PascalCase` , es decir, que todas las iniciales tienen que empezar por mayúscula. Las propiedades tienen que ser declaradas previamente en una interface dentro del mismo archivo que va a tener el mismo nombre que el componente solamente que al final se le añade Props.

Se importa primero el css, usando un punto. Luego todos los recursos que se vayan a usar.

Ejemplo:

```tsx
import './componentStyle'

import jpg from './'

interface ExampleComponentProps {
	atributte1: string,
	atributte2: number
}

export const ExampleComponent = ({atributte1, atributte2}: ExampleComponentProps) => {
	return <>
		<div id="componentContainer">
			//Inner Components
		</div>
	</>
}
```

# Git and Repository

**Traer el Proyecto a su repositorio local**

Los pasos para traer el proyecto a su carpeta local en su computador son los siguientes:

1. git init
2. git remote add origin https://github.com/yabuJunn/CapyWeb.git
3. git pull main
4. git checkout -b
5. Ahora puedes pushear tu propia rama ya creada, si te da error, recuerda: has git add -A, git commit -m "nombre" y push. Si el push te da error de upStream, pon el comando que te indica la consola. **Recuerda nunca pushear algo directamente a la main**

En caso de error de pull, refusing to merge unrelated histories poner: `git pull origin <branch> --allow-unrelated-histories`

# Commits Convention

Se usa **Conventional Commits 1.0.0** y unos puntos extra propios ****para el nombramiento de los commits. Los commits deben estar estructurados como sigue:

```tsx
<type>([optional scope]): <description>
<BLANK LINE>
[optional body]
<BLANK LINE>
[optional footer(s)]
```

Es decir, que los commits van a tener un titulo, un cuerpo y unos pie de paginas. Lo mas importante es el titulo.

## Types

Se usan los siguientes tipos de commits:

- **fix:** Una corrección de errores
- **feat:** Una nueva funcionalidad.
- **build**: Cambios que afectan el sistema de compilación o dependencias externas (ejemplos de scopes: gulp, broccoli, npm).
- **docs**: Solamente cambio de documentación.
- **perf**: Un cambio en el codigo que mejora el rendimiento.
- **refactor**: Un cambio de código que no corrige un error ni agrega una característica.
- **style**: Cambios que no cambian el significado del código (espacios en blanco, formato, punto y comas faltanes, etc).
- **test**: Añadir un nuevo testo o corrigiendo test’s existentes.

## Scope

Es que tanto alcance tiene el commit.

- **hotfix:** Es un cambio pequeño.
- **feature:** Es un cambio grande.
- **userStory:** Es un cambio muy muy pequeño.

## Description

Tiene que empezar con uno de los siguientes verbos y el titulo del commit.

- **add:** Cuando se agrega codigo nuevo.
- **update:** Cuando se actualiza código ya creado.
- **delete:** Cuando se elimina código.

## Body

En el body se escribe una descripción detallada del commit. Se puede escribir en varias líneas separadas.

## Footers

Son los pie de paginas del commits. Los que mas vamos a usar son los madeBy: <persona>.

# Setup Instructions

Vamos a usar los siguientes 4 scripts de npm:

## dev

Se usa para correr la aplicacion en modo de desarrollo.

```tsx
npm run dev
```

## build

Se usa para crear la version optimizada y lista para desplegar de la aplicacion.

```tsx
npm run build
```

## preview

Se usa para lanzar un servidor de vista previa de la version construida de la aplicacion, antes de desplegarla.

```tsx
npm run preview
```

# Branching Model

Vamos a trabajar con las ramas main, develop y feature. Para hacer merge usaremos pullRequest y merge en VSCode. Recordar que para hacer merge, yo me paro en la rama a la que quiero llevar los cambios, y traigo los cambios que voy a combinar a la rama donde estoy parado.

## Main

En esta rama estarán los cambios y las versiones finales de la aplicacion para desplegarse. En la rama main nadie trabaja directamente y se llena haciendo pull request.

## Develop

En esta rama se trabajan los cambios grandes que se iran haciendo, es la rama de desarrollo. Todas las ramas features convergen en esta rama.

## Feature

Están serán las ramas donde se trabajen los cambios mas pequeños. Como se van a trabajar las ramas feature es que cada persona trabaja en una funcionalidad que se puede integrar en otras subramas feature, para que cuando las funcionalidades estén lo suficientemente grandes se puedan pasar a develop.

El nombramiento de las ramas features debe hacerse de la siguiente forma:

```tsx
feature <nombre> <tipo> <desc>
```

### Nombre

Es un nombre corto de una palabra

### Tipo

Es el tipo de feature que sea, a que pantalla o que funcionalidad mas grande pertenezca.

### Desc

La descripción de la ramas

<img src="./Branch Model App Web.jpg"></img>

Grafico del modelo de las ramas

# Technologies and Libraries

## LayoutIt grid

Se usa para manejar la grid interactiva de la dashboard.

## D3

Se usa para las diferentes graficas.

## **React Circular Progressbar**

Se usa para las graficas circulares.

## Firebase

Se como base de datos, para registrar los usuarios, y las frases de la mascota.

## Redux

Se usa para gestionar el global state de la aplicación.