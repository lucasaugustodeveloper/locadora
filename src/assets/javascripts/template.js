const template = (title, image, trailer) => {
  return `
    <div class="film col-lg-3">
      <div class="film_title">
        ${title}
      </div>
      <div class="film_img">
        <img src="${image}" alt="${title}">
      </div>
      <div class="film_trailer">
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${trailer}" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
  `
}

template('title', 'image', 'video')
