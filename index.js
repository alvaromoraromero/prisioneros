let cambiarTonoModal, numPrInput, prisioneros;
const tonosPrisioneros = ['amarillo', 'claro', 'medio-claro', 'medio', 'medio-oscuro', 'oscuro'];

window.onload= () => {
    cambiarTonoModal = document.getElementById('cambiarTonoModal')
    cambiarTonoModal.addEventListener('close', () => {
       if (!cambiarTonoModal.returnValue) abrirModalCambioTono();
       else cambiarTonoPrisionero(cambiarTonoModal.returnValue);
    });

    numPrInput = document.getElementById('numPrisioneros');
    numPrInput.addEventListener('input', function() { cargarPrisioneros(this.value) });
    numPrInput.value = localStorage.getItem('numPrisioneros') ?? 4;
    numPrInput.dispatchEvent(new Event('input'));
    
    const tonoPrisionero = localStorage.getItem('tonoPrisionero');
    if (tonoPrisionero) cambiarTonoPrisionero(tonoPrisionero);
    else abrirModalCambioTono();
}

function cargarPrisioneros(num) {
    document.getElementById('totalPrisioneros').textContent = num;
    localStorage.setItem('numPrisioneros', num);

    prisioneros = [];
    let divPrisioneros = document.querySelector('div#prisioneros');
    if (!divPrisioneros) {
        divPrisioneros = document.createElement('div');
        divPrisioneros.id = 'prisioneros';
        document.body.appendChild(divPrisioneros);
    }
    else divPrisioneros.innerHTML = '';

    for (let i = 1; i <= num; i++) {
        const prisionero = {id: i, sombrero: Math.random() < 0.5 ? 'azul' : 'rojo', ocultarSombrero: true};
        divPrisioneros.appendChild(crearPrisionero(prisionero));
        prisioneros.push(prisionero);
    }

    let divMsgPrisioneros = document.querySelector('div#msgPrisioneros');
    if (!divMsgPrisioneros) {
        divMsgPrisioneros = document.createElement('div');
        divMsgPrisioneros.id = 'msgPrisioneros';
        document.body.appendChild(divMsgPrisioneros);
    }
    else divMsgPrisioneros.innerHTML = '';
    for (const prisionero of prisioneros) {
        const msgPrisionero = document.createElement('div');
        msgPrisionero.id = `msgPrisionero${prisionero.id}`;
        msgPrisionero.textContent = prisionero.id === 1 ? '***' : prisionero.sombrero;
        console.log(prisionero.id);
        if (prisionero.id > 2) msgPrisionero.style.opacity = '0';
        divMsgPrisioneros.appendChild(msgPrisionero);
    }
}

function crearPrisionero(config = {sombrero: 'gris', ocultarSombrero: false}) {
    const prisionero = document.createElement('div');
    prisionero.className = 'prisionero';

    if (config.id) prisionero.id = `prisionero${config.id}`;

    if (config.sombrero) {
        const sombrero = document.createElement('img');
        sombrero.src = 'svg/sombrero.svg';
        sombrero.className = config.sombrero;
        if (config.ocultarSombrero) sombrero.classList.add('gris');
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