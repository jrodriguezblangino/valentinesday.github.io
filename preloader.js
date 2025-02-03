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
            const explosionSound = new Audio('./assets/sounds/cinematic-boom-171285.mp3');
            explosionSound.volume = 0.3; // Ajustar volumen
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
            // Solo redirigir al homepage
            window.location.href = 'homepage.html';
        }
    });
});