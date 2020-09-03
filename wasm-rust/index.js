import('./pkg')
  .then(wasm => {
    const canvas = document.getElementById('drawing')
    const ctx = canvas.getContext('2d')
    const renderBtn = document.getElementById('render')
    const renderSpan = document.getElementById('renderms')

    function draw () {
      const start = +new Date()
      wasm.draw(ctx, 600, 600)
      renderSpan.innerHTML = `Rendered in ${+new Date() - start} ms`
    }
    renderBtn.addEventListener('click', draw)
    draw()
  })
  .catch(console.error)
