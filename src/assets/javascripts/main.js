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

const listItems = (items, pageActual, limitItens) => {
  const result = []
  let totalPage = Math.ceil( items.length / limitItens )
  let count = ( pageActual * limitItens ) - limitItens
  let delimiter = count + limitItens

  if (pageActual <= totalPage) {
    for (let i = count; i < delimiter; i++) {
      if (items[i] !== null) {
        result.push(items[i])
      }
      count++
    }
  }

  return result
}

const $films = document.querySelector('.films')
// const $btnPrev = document.querySelector('#btnPrev')
// const $btnNext = document.querySelector('#btnNext')

const films = () => {
  const url = 'catalogo.json'
  const request = fetch(url)

  request
    .then(data => data.json())
    .then(data => {
      const films = listItems(data.films, 1, 8)
      films.forEach(element => {
        $films.innerHTML += template(element.title, element.photo, element.video)

      })
    })
    .catch(error => $films.innerHTML = error)
}

films()
