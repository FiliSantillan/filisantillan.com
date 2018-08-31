document.addEventListener("DOMContentLoaded", function() {
  let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  let active = false;

  function returnNamePath(originalUrl) {
    return originalUrl.split("/").slice(4).toString().replace(/,/g, "/");
  }

  for (let i=0; i < lazyImages.length; i++) {

    var url = lazyImages[i].dataset.src;
    var state = url.search("s3-us-west-1");

    if (state !== -1) {
      let namePath = returnNamePath(lazyImages[i].dataset.src),
          imageAbsolute = `https://filisantillan.imgix.net/${namePath}`;
      
      lazyImages[i].src = `${imageAbsolute}?w=100&h=100&blur=100`;
      lazyImages[i].dataset.src = `${imageAbsolute}?w=425&h=225`;
      lazyImages[i].dataset.srcset = `${imageAbsolute}?w=425&h=225&dpr=2 2x, ${imageAbsolute}?w=425&h=225&dpr=3 3x`;
    }

  }

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(
      entries,
      observer
    ) {
      entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            if (state !== -1) {
              lazyImage.srcset = lazyImage.dataset.srcset;
            }
            lazyImage.classList.remove("lazy");
            lazyImageObserver.unobserve(lazyImage);
          }

      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    const lazyLoad = function() {
      if (active === false) {
        active = true;

        setTimeout(function() {
          lazyImages.forEach(function(lazyImage) {
            if (
              lazyImage.getBoundingClientRect().top <= window.innerHeight &&
              lazyImage.getBoundingClientRect().bottom >= 0 &&
              getComputedStyle(lazyImage).display !== "none"
            ) {
              lazyImage.src = lazyImage.dataset.src;
              // lazyImage.srcset = lazyImage.dataset.srcset;
              lazyImage.classList.remove("lazy");
              lazyImages = lazyImages.filter(function(image) {
                return image !== lazyImage;
              });

              if (lazyImages.length === 0) {
                document.removeEventListener("scroll", lazyLoad);
                window.removeEventListener("resize", lazyLoad);
                window.removeEventListener("orientationchange", lazyLoad);
              }
            }
          });

          active = false;
        }, 200);
      }
    };

    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
  }
});
