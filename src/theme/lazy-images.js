document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy")),
      lazySources = [].slice.call(document.querySelectorAll("source.lazy"));

  let lazyImageObserver = new IntersectionObserver(function(
    entries,
    observer
  ) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        let lazyImage = entry.target;

        if (lazyImage.tagName === "IMG") {
          lazyImage.src = lazyImage.dataset.src;
        }

        lazyImage.srcset = lazyImage.dataset.srcset;
        lazyImage.classList.remove("lazy");
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach(function(lazyImage) {
    lazyImageObserver.observe(lazyImage);
  });

  lazySources.forEach(function(lazySource) {
    lazyImageObserver.observe(lazySource);
  });
});
