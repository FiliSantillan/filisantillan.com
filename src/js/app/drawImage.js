
export function drawImage(wrapper, image) {

    const $coverHome = document.getElementById(wrapper),
          $figure = document.createElement("figure"),
          $img = document.createElement("img");

    $figure.classList.add(image.figureClass);
    $img.classList.add(image.imgClass);

    $img.setAttribute("alt", image.alt);
    $img.setAttribute("src", image.src);
    $img.setAttribute("srcset", `${image.srcset2x} 2x, ${image.srcset3x} 3x`);

    $coverHome.prepend($img);
}