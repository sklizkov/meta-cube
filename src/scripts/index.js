import 'Styles/main.styl'

import Playground from './Playground'


const $container = document.getElementById('playground-container')
const $loader = document.querySelector('.loader')

// Initialize
const playground = new Playground({
  debug: window.location.hash === '#debug',
})

// Assets
playground.assets = [
  { name: 'black', path: 'assets/matcaps/black.png' },
  { name: 'white', path: 'assets/matcaps/white.png' },
  { name: 'red', path: 'assets/matcaps/red.png' },
  { name: 'orange', path: 'assets/matcaps/orange.png' },
  { name: 'yellow', path: 'assets/matcaps/yellow.png' },
  { name: 'green', path: 'assets/matcaps/green.png' },
  { name: 'blue', path: 'assets/matcaps/blue.png' },
]

// Preloader
playground.assetsLoading = ({ loaded, total }) => {
  if (total < 1) return

  if (loaded === total) {
    $loader.innerText = 'Done'

    setTimeout(() => {
      $loader.classList.remove('_show')
    }, 500)
  } else {
    if (!$loader.classList.contains('_show')) $loader.classList.add('_show')
    $loader.innerText = Math.round(loaded / total * 100) + '%'
  }
}

// Start
playground.render($container)
