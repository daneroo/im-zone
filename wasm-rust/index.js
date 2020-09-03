import('./pkg')
    .then(wasm => {
        const canvas = document.getElementById('drawing');
        const ctx = canvas.getContext('2d');

        const realInput = document.getElementById('real');
        const imaginaryInput = document.getElementById('imaginary');
        const renderBtn = document.getElementById('render');

        renderBtn.addEventListener('click', () => {
            const real = parseFloat(realInput.value) || 0;
            const imaginary = parseFloat(imaginaryInput.value) || 0;
            const start=+new Date()
            wasm.draw(ctx, 600, 600, real, imaginary);
            console.log(`Draw in ${+new Date()-start}ms`)
        });

        wasm.draw(ctx, 600, 600, -0.14, 0.65);
    })
    .catch(console.error);
