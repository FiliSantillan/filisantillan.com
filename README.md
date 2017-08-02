# Fili Santillán 3.0.4
Ghost 0.11.3

<a href="https://filisantillan.com"><img src="https://s-media-cache-ak0.pinimg.com/originals/b8/66/46/b86646fcffb185b5b56009475794684c.jpg" alt="Fili Santillán" /></a>

## Español - Spanish
Pequeña guía para el uso del tema **"FiliSantillan"** en **Ghost**, esto con el objetivo de que tenga un correcto funcionamiento y la experiencia sea mucho mejor más placentera para el usuario.

* [Imágenes](#im%C3%A1genes)
* [Posts](#posts)
* [Dependencias](#dependencias)

### Imágenes
Resolución recomendada para las imágenes en el blog.

Tamaño para las imágenes en los posts, incluyendo las portadas de los artículos estáticos:

| Imagen        | Resolución    |
| ------------- | ------------- |
| Ancho         | 1920px        |
| Alto          | 945px         |

Tamaño para las imágenes en los artículos estáticos (Agenda, Cursos, Videos):

| Imagen        | Resolución    |
| ------------- | ------------- |
| Ancho         | 560px         |
| Alto          | 400px         |

Tamaño para las imágenes del autor:

| Imagen        | Resolución    |
| ------------- | ------------- |
| Ancho         | 300px         |
| Alto          | 300px         |

### Posts
En algunos posts (incluyendo los estáticos) se llega a usar código HTML en algunas situaciones, este código por default tiene un comportamiento con los estilos CSS, gracias a esto se pueden ver templates distintos.

Código para agenda, videos y cursos:
```
<section class="flex jus--start wrap--yes">
    <article class="page-static">
        <figure class="page-static__image">
            <img src="imagen.jpg">
        </figure>
        <header class="page-static__info">
            <strong class="page-static__title">Título</strong>
            <span class="page-static__place">Texto</span>
            <time class="page-static__date">
                <span class="page-static__text">Texto</span>
            </time>
            <p class="page-static__description">Descripción...</p>
        </header>
        <a href="pagina.com" target='_blank' class="page-static__button">
            <span class="page-static__link">Botón</span>
        </a>
    </article>
</section>
```

![Template default](https://s-media-cache-ak0.pinimg.com/originals/5a/13/d8/5a13d80e88dc7abe720529522c4e3adf.png)
Código para un el botón "Codepen":
```
<a href='#' target='_blank' class='btn-codepen'>Ver en codepen</a>
```

![Botón Codepen](https://s-media-cache-ak0.pinimg.com/originals/84/85/5f/84855f410b82280f3d3256fcfc5d357d.png)

Código para los mensajes de tip en un post:
```
<blockquote class='tip'>
 <p><strong>Tip:</strong> Texto</p>
</blockquote>
```

![Tip](https://s-media-cache-ak0.pinimg.com/originals/30/2a/f1/302af1274d68e41fcd549e4538f78ecf.png)

Código para los mensajes de advertencia en un post:
```
<blockquote class='warning'>
 <p><strong>Advertencia:</strong> Texto</p>
</blockquote>
```

![Advertencia](https://s-media-cache-ak0.pinimg.com/originals/ba/54/df/ba54dfb4e1c57fa17830150d90de112b.png)

### Dependencias
Filisantillan cuenta con un archivo `gulpfile.js` que sirve para automatizar el trabajo en desarrollo y que el código de producción sea mucho mejor.

Antes de empezar, se necesita instalar lo siguiente:
* [Node.js](https://nodejs.org/es/)
* [Gulp](http://gulpjs.com/)

Una vez instalado, podemos empezar a descargar todas las dependencias:

**NPM**
```
$ npm install --save
```

**Yarn**
```
$ Yarn
```

De no funcionar, se puede usar `sudo` antes del comando y así ejecutar como administrador.

Para que todo el código de desarrollo pase a producción es necesario ejecutar:
```
$ gulp
```

Con este comando, todo el código que tenemos en desarrollo va a estar optimizado, comprimido y mucho más en la zona de producción.

Para comprimir imágenes:
```
$ gulp c-images
```

Con este comando las imágenes de producción van a estar comprimidas.

Para comprimir las fuentes:
```
$ gulp c-fonts
```

Con este comando las fuentes de producción van a estar comprimidas.

### Contacto

* [Facebook](https://www.facebook.com/FiliSantillanMX)
* [Twitter](https://twitter.com/FiliMX)

## Licencia
© Fili Santillán
