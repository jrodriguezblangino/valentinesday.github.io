document.addEventListener('DOMContentLoaded', () => {
    const heart = document.getElementById('heart');
    const fire = document.getElementById('fire');
    const textContainer = document.getElementById('textContainer');
    const fadeText = document.querySelector('.fade-text');
    
    let currentPhase = 1;
    
    // Initial heart fade-in
    setTimeout(() => {
        heart.style.opacity = '1';
    }, 500);

    heart.addEventListener('click', async () => {
        if (currentPhase === 1) {
            currentPhase = 1.5;
            
            // Hide heart and show fire
            heart.style.opacity = '0';
            fire.style.display = 'block';
            
            // Agregar efecto de sonido
            const explosionSound = new Audio('/assets/sounds/cinematic-boom-171285.mp3');
            explosionSound.volume = 0.8; // Ajustar volumen
            explosionSound.play();

            await new Promise(resolve => setTimeout(resolve, 1500));
            fire.style.display = 'none';
            
            // Show first text
            fadeText.textContent = 'This is how you set my heart on fire when we first met.';
            textContainer.style.opacity = '1';
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            textContainer.style.opacity = '0';
            
            // Reduced from 1000 to 500 ms
            await new Promise(resolve => setTimeout(resolve, 1000));
            currentPhase = 2;
            
            // Show heart with new text
            heart.style.opacity = '1';
            fadeText.textContent = 'Touch my heart again, like you did that time.';
            textContainer.style.opacity = '1';
        } else if (currentPhase === 2) {
            // 1. Ocultar elementos primero
            document.querySelectorAll('.heart-container, .text-container').forEach(element => {
                element.style.display = 'none';
            });

            // Crear nuevo elemento video dinámicamente
            const newVideo = document.createElement('video');
            newVideo.src = '/assets/sounds/Corazon.mp4';
            newVideo.className = 'final-heart';
            newVideo.style.width = '80%'; // Tamaño visible
            newVideo.style.maxWidth = '400px'; // Límite máximo
            newVideo.muted = true;
            newVideo.autoplay = true;
            newVideo.playsInline = true; // Necesario para iOS
            document.body.appendChild(newVideo);

            // Forzar layout y reproducción
            newVideo.style.display = 'block';
            newVideo.style.opacity = '1';

            newVideo.play().then(() => {
                console.log('Reproducción iniciada');
                setTimeout(() => {
                    newVideo.remove();
                    window.location.href = '/pages/homepage.html';
                }, 18000);
            }).catch(error => {
                console.error('Error reproducción:', error);
                // Fallback
                setTimeout(() => window.location.href = 'homepage.html', 21000);
            });
        }
    });
});