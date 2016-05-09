# Fili Santillán Blog 2.1.4
##Ghost 0.7.6

❤ HTML • CSS • JS ❤ | Web Developer | Blogger | Geek | YouTube | Platzi Student Ambassador

![Logo Fili Santillán](https://s-media-cache-ak0.pinimg.com/originals/4b/2a/8a/4b2a8aedb10dc94db8b720acfecf703a.png)

Mini guía para el uso de Fili Santillán.

## Tamaño para las imágenes 

Tamaño para las imágenes de los artículos (también artículos estáticos)

| Imagen        | Pixel Ratio 1 | Pixel Ratio 2 |
| ------------- |:-------------:| :------------:|
| Ancho         | 412px         | 824px         |
| Alto          | 240px         | 480px         |

## Código para artículos estáticos

Código para usar en artículos estáticos especiales: Agenda - Demos - Videos - Otros Artículos

### Agenda
```
<article class="special">

    <figure class="special-cover">
        <img src="" alt="">
    </figure>

    <footer class="special-footer">
        <h2 class="special-title">Título</h2>

        <span class="special-icon"><i class="fa fa-globe"></i> Lugar</span>
        <span class="special-icon"><i class="fa fa-calendar-o"></i> Fecha</span>

        <p class="special-description">
            Descripción ...
        </p>
    </footer>
</article>
```

### Demos
```
<article class="special">

    <figure class="special-cover">
        <img src="" alt="">
    </figure>

    <footer class="special-footer">
        <h2 class="special-title">Título</h2>

        <p class="special-description">
            Descripción ...
        </p>

        <div class="special-button">
            <a href="#" target="blank">Ver demo</a>
        </div>
    </footer>
</article>

```

### Videos
```
<article class="special">

    <figure class="special-cover">
        <img src="" alt="">
    </figure>

    <footer class="special-footer">
        <h2 class="special-title">Título</h2>

        <p class="special-description">
            Descripción ... 
        </p>

        <span class="special-icon"><i class="fa fa-clock-o"></i> Tiempo</span>

        <div class="special-button">
            <a href="#" target="blank">Ver video</a>
        </div>
    </footer>
</article>
```

### Más Artículos
```
<article class="special">

    <figure class="special-cover">
        <img src="" alt="">
    </figure>

    <footer class="special-footer">

        <h2 class="special-title">Título</h2>

        <p class="special-description">
            Descripción ...
        </p>

        <div class="special-button">
            <a href="#" target="blank">Ver Artículo</a>
        </div>
    </footer>
</article>
```

## Dependencias Gulp

En el caso de Agregar nuevos archivos CSS o JS, hay que tener cuidado al concatenar ya que se puede duplicar el código.

## (Stylus)

### 1.- Watch
```
gulp watch
```

### 2.- Agrupar media-queries
```
gulp group-mq
```

## 3.- Minificar archivo CSS
```
gulp minify-stylus
```

## (Vendor)

### 1.- Minificar archivos JS
```
gulp minify-js
```

### 2.- Minificar archivos CSS
```
gulp minify-css
```

### 3.- Concatenar archivos JS
```
gulp concat-js
```

### 4.- Concatenar archivos CSS
```
gulp concat-css
```

## Contacto

* [Facebook](https://www.facebook.com/FiliSantillanMX)
* [Twitter](https://twitter.com/FiliMX)

## Licencia

© Fili Santillán