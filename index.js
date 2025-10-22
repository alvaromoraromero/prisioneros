let cambiarTonoModal;
const tonosPrisioneros = ['amarillo', 'claro', 'medio-claro', 'medio', 'medio-oscuro', 'oscuro'];

window.onload= () => {
    cambiarTonoModal = document.getElementById('cambiarTonoModal')
    cambiarTonoModal.addEventListener('close', () => {
       if (!cambiarTonoModal.returnValue) abrirModalCambioTono();
       else cambiarTonoPrisionero(cambiarTonoModal.returnValue);
    });
    
    const tonoPrisionero = localStorage.getItem('tonoPrisionero');
    if (tonoPrisionero) cambiarTonoPrisionero(tonoPrisionero);
    else abrirModalCambioTono();
}

function crearPrisionero(config = {sombrero: 'gris'}) {
    const prisionero = document.createElement('div');
    prisionero.className = 'prisionero';

    if (config.sombrero) {
        const sombrero = document.createElement('img');
        sombrero.src = 'svg/sombrero.svg';
        sombrero.className = config.sombrero;
        prisionero.appendChild(sombrero);
    }

    return prisionero;
}

function abrirModalCambioTono() {
    cambiarTonoModal.innerHTML = '';
    const h1 = document.createElement('h1');
    h1.textContent = 'Selecciona el todo de piel para los prisioneros';
    h1.style.textAlign = 'center';
    cambiarTonoModal.appendChild(h1);
    const div = document.createElement('div');
    for (const tono of tonosPrisioneros) {
        const prisionero = crearPrisionero({sombrero: false});
        prisionero.style.backgroundImage = `url('svg/prisioneros/${tono}.svg')`;
        prisionero.title = tono;
        prisionero.addEventListener('click', () => cambiarTonoModal.close(tono));
        div.appendChild(prisionero);
    }
    cambiarTonoModal.append(div);
    cambiarTonoModal.showModal();

}

function cambiarTonoPrisionero(nuevoTono=tonosPrisioneros[0]) {
    if (!tonosPrisioneros.includes(nuevoTono)) return;
    document.documentElement.style.setProperty('--tono-prisionero', `url('svg/prisioneros/${nuevoTono}.svg')`);
    localStorage.setItem('tonoPrisionero', nuevoTono);
    cambiarTonoModal.close(nuevoTono);
}