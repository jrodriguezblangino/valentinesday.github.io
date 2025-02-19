const typeSound = document.getElementById('type-sound');
typeSound.volume = 0.8; // Ajustar volumen al 80%
const enterSound = document.getElementById('enter-sound');
enterSound.volume = 0.8; // Ajustar volumen al 80%
const music = document.getElementById('background-music');


async function typeWriter(element, text, speed = 100) {
    return new Promise(resolve => {
        element.textContent = '';
        element.style.display = 'block';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                if (!typeSound.paused) {
                    typeSound.currentTime = 0;
                }
                typeSound.play();
                i++;
                setTimeout(type, speed);
            } else {
                typeSound.pause();
                typeSound.currentTime = 0;
                resolve();
            }
        }
        
        type();
    });
}

async function animatePage() {
    const firstText = document.getElementById('typewriter-text');
    const photosContainer = document.getElementById('photos');
    const secondText = document.getElementById('typewriter-text-2');
    
    // Type first phrase
    firstText.classList.add('active');
    await typeWriter(firstText, "Happy Valentine's Day, my love!");
    
    // Remove cursor from first text and play enter sound
    firstText.style.borderRight = 'none';
    enterSound.play();
    firstText.style.transform = 'translate(-50%, -500%)';
    await new Promise(r => setTimeout(r, 1000));
    
    // Show photos container
    photosContainer.classList.add('visible');
    await new Promise(r => setTimeout(r, 500));
    
    // Animate photos
    const polaroids = document.querySelectorAll('.polaroid');
    for (let i = 0; i < polaroids.length; i++) {
        await new Promise(r => setTimeout(r, 300));
        polaroids[i].classList.add('visible');
    }
    
    // Type second phrase
    secondText.style.display = 'block';
    secondText.classList.add('active');
    await typeWriter(secondText, "Thank you for so many moments together.");
    
    // Remove cursor from second text
    secondText.style.borderRight = 'none';
    
    // Solo reproducir el sonido Enter
    enterSound.play();
    await new Promise(r => setTimeout(r, enterSound.duration * 1000));
    
    // Iniciar música
    const musicPlayer = document.getElementById('music-player');
    if (musicPlayer) {
        musicPlayer.contentWindow.postMessage('play', '*');
    }
    
    // Add continuous subtle animation to polaroids
    setInterval(() => {
        polaroids.forEach(polaroid => {
            polaroid.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 5}px) 
                                      rotate(${parseFloat(polaroid.style.getPropertyValue('--rotation'))}deg)`;
        });
    }, 50);
}

// Start animation when page loads
window.addEventListener('load', animatePage);

// Después de que terminen todas las animaciones
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
  }, 1000); // Ajusta este tiempo según la duración de tus animaciones
});