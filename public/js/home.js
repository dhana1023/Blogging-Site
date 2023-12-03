const scrollDownButton = document.getElementById('scrollDownButton');
let isButtonVisible = true;


checkScrollPosition();

document.querySelector('.scroll-down-button').addEventListener('click', () => {
    isButtonVisible = false;
    scrollDownButton.style.display = 'none';
    window.scroll({ top: window.innerHeight, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    checkScrollPosition();
});

function checkScrollPosition() {
    const scrollPosition = window.scrollY;

    if (scrollPosition === 0 && !isButtonVisible) {
       
        isButtonVisible = true;
        scrollDownButton.style.display = 'block';
    } else if (scrollPosition > 0 && isButtonVisible) {
        isButtonVisible = false;
        scrollDownButton.style.display = 'none';
    }
}
