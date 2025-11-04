let cambiarTonoModal, numPrInput, prisioneros, restantes;
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
    const restantesP = document.getElementById('restantes');
    restantesP.style.marginLeft = '90px';

    prisioneros = [];
    const divPrisioneros = document.getElementById('prisioneros');
    divPrisioneros.innerHTML = '';

    prisioneros.push({id: 0, sombrero: 'gris'});
    for (let i = 1; i < num; i++) {
        const prisionero = {id: i, sombrero: Math.random() < 0.5 ? 'azul' : 'rojo', ocultarSombrero: true};
        prisioneros.push(prisionero);
    }

    // Comprobar si todos tienen el mismo color
    if (prisioneros.every(p => p.sombrero === prisioneros[1].sombrero)) {
        // Forzamos que uno tenga el color contrario
        const indiceAleatorio = Math.floor(Math.random() * num);
        prisioneros[indiceAleatorio].sombrero = prisioneros[1].sombrero === 'azul' ? 'rojo' : 'azul';
    }

    const divMsgPrisioneros = document.getElementById('msgPrisioneros');
    divMsgPrisioneros.innerHTML = '';

    restantes = new Proxy({ rojo: 0, azul: 0}, {
        set(target, prop, value) {
            target[prop] = value;
            const totalRestantes = Object.values(target).reduce((acc, val) => acc + val, 0);
            restantesP.innerHTML = totalRestantes === 0 ? 'No tienes mas prisioneros por delante' : `Tienes <span style="color: red;">${target['rojo']}</span> prisioneros con sombrero <span style="color: red;">rojo</span> y <span style="color: blue;">${target['azul']}</span> prisioneros con sombrero <span style="color: blue;">azul</span> por delante`;
        }
    });
    for (const prisionero of prisioneros) {
        const divPrisionero = crearPrisionero(prisionero);
        divPrisioneros.appendChild(divPrisionero);

        if (prisionero.id === 0) {
            const msgPrisionero = document.createElement('div');
            msgPrisionero.id = `msgPrisionero${prisionero.id}`;
            msgPrisionero.textContent = prisioneros.filter(p => p.sombrero === "rojo").length % 2 === 0 ? '🔴' : '🔵';
            divMsgPrisioneros.appendChild(msgPrisionero);
        }
        else {
            if (prisionero.id > 1) restantes[prisionero.sombrero]++;
            const selectColor = document.createElement('div');
            selectColor.id = `selectColor${prisionero.id}`;
            const azul = document.createElement('div');
            azul.title = 'azul';
            azul.textContent = '🔵';
            const rojo = document.createElement('div');
            rojo.title = 'rojo';
            rojo.textContent = '🔴';
            selectColor.appendChild(azul);
            selectColor.appendChild(rojo);
            selectColor.childNodes.forEach((color) => {
                color.addEventListener('click', () => {
                    color.style.backgroundColor = color.title === prisionero.sombrero ? 'lime' : 'orange';
                    selectColor.style.pointerEvents = 'none';
                    divPrisionero.querySelector('img').classList.remove('gris');
                    const nextSelectColor = document.getElementById(`selectColor${prisionero.id+1}`);
                    if (nextSelectColor) {
                        restantesP.style.marginLeft = `${64*(prisionero.id)+80*(prisionero.id+1)}px`;
                        restantes[prisioneros[prisionero.id+1].sombrero]--;
                        nextSelectColor.classList.remove('disabled');
                    }
                    else restantesP.innerHTML = '<span style="color: green">Partida finalizada</span>'
                })
            })
            if (prisionero.id !== 1) selectColor.className = 'disabled';
            divMsgPrisioneros.appendChild(selectColor);
        }
    }
}

function finalizarPartida() {

}

function crearPrisionero(config = {sombrero: 'gris', ocultarSombrero: false}) {
    const prisionero = document.createElement('div');
    prisionero.className = 'prisionero';

    if ('id' in config) prisionero.id = `prisionero${config.id}`;

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