// Sélectionne l'élément header
const header = document.querySelector('header');

// Ajoute un événement lors du défilement
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled'); // Ajoute la classe quand on scrolle
    } else {
        header.classList.remove('scrolled'); // Retire la classe au sommet
    }
});

document.getElementById('burger-icon').addEventListener('click', function() {
    const burgerMenu = document.getElementById('burger-menu');
    burgerMenu.classList.toggle('active'); // Active ou désactive le menu burger
});

document.getElementById('close-menu').addEventListener('click', function() {
    const burgerMenu = document.getElementById('burger-menu');
    burgerMenu.classList.remove('active'); // Ferme le menu burger
});

// Fermer le menu si l'on clique en dehors du menu
window.addEventListener('click', function(e) {
    const burgerMenu = document.getElementById('burger-menu');
    if (!burgerMenu.contains(e.target) && !document.getElementById('burger-icon').contains(e.target)) {
        burgerMenu.classList.remove('active'); // Ferme le menu si on clique en dehors
    }
});
