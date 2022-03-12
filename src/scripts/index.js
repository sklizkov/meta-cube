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
  { name: 'black', path: 'assets/black.png' },
  { name: 'white', path: 'assets/white.png' },
  { name: 'red', path: 'assets/red.png' },
  { name: 'orange', path: 'assets/orange.png' },
  { name: 'yellow', path: 'assets/yellow.png' },
  { name: 'green', path: 'assets/green.png' },
  { name: 'blue', path: 'assets/blue.png' },
]

// Preloader
playground.assetsLoading = ({ loaded, total }) => {
  if (total < 1) return

  if (loaded === total) {
    $loader.innerText = 'Done 🎉'

    setTimeout(() => {
      $loader.classList.remove('_show')
    }, 500)
  } else {
    if (!$loader.classList.contains('_show')) $loader.classList.add('_show')
    $loader.innerText = loaded / total * 100 + '%'
  }
}

// Start
playground.render($container)
