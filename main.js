window.onload = function() {
    // Inicializar la Deezer SDK
    DZ.init({
        appId  : '585144',
        player : {
            onload : function(){
                const clientId = '585144'; // Reemplaza esto con tu ID de cliente de Deezer
                const clientSecret = '71663a1a0216165c1d3e0ccbcc33c893'; // Reemplaza esto con tu secreto de cliente de Deezer
            }
        }
    });
};

function searchTrack(search) {
    const clientId = '585144'; // Reemplaza esto con tu ID de cliente de Deezer
    
    // Realiza una solicitud GET a la API de Deezer para buscar canciones
    fetch(`https://api.deezer.com/search?q=${search}&limit=5&app_id=${clientId}`)
    .then(response => response.json())
    .then(data => {
        // Crea un array para almacenar los resultados
        const results = [];

        // Recorre los resultados de búsqueda y agrega la información necesaria al array
        data.data.forEach(song => {
        results.push({
            id: song.id,
            cover: song.album.cover_medium,
            title: song.title,
            artist: song.artist.name,
            duration: song.duration
        });
        });
        
        coverContainer = document.createElement('img')
        coverContainer.src = results['cover']

        titleContainer = document.createElement('h2')
        titleContainer.textContent = results['title']

        artistContainer = document.createElement('span')
        artistContainer.textContent = results['artist']

        durationContainer = document.createElement('span')
        durationContainer.textContent = results['duration']

        // Hacer algo con el array de resultados aquí
        console.log(results);
        resultsContainer = document.querySelector('search-results')
        resultsContainer.appendChild(coverContainer)
        resultsContainer.appendChild(titleContainer)
        resultsContainer.appendChild(artistContainer)
        resultsContainer.appendChild(durationContainer)
    })
    .catch(error => console.error(error));
}


document.querySelector('.search-container').addEventListener('mouseover', ()=>{
    document.querySelector('#search-input').removeAttribute('hidden');
});

document.querySelector('.search-container').addEventListener('mouseout', ()=>{
    document.querySelector('#search-input').setAttribute('hidden', true);
});

document.querySelector('.more').addEventListener('mouseover', ()=>{
    let bio = document.querySelector('.bio')
    bio.classList.add('expandirBio')
});

document.querySelector('.more').addEventListener('mouseout', ()=>{
    let bio = document.querySelector('.bio')
    
    if(bio.addEventListener('mouseout', ()=>{
        bio.classList.remove('expandirBio')
    }));
});


// Obtener elementos del DOM
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const audio = document.querySelector('audio')

audio.addEventListener("timeupdate", function() {
    let progressBar = document.querySelector('.progress')
    let currentTime = audio.currentTime;
    let duration = audio.duration;
    let progress = (currentTime / duration) * 100;

    progressBar.style.width = progress + "%";
});

console.log(audio)

// Función para reproducir el audio
function playAudio() {
    audio.play();
}

// Función para pausar el audio
function pauseAudio() {
    audio.pause();
}

// Función para detener el audio y reiniciar su tiempo
function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
}

// Agregar event listeners a los botones
playBtn.addEventListener('click', playAudio);
pauseBtn.addEventListener('click', pauseAudio);
stopBtn.addEventListener('click', stopAudio);

const lyricsFile = './cancion/tiroteo.lrc'; // Cambiar por el nombre de tu archivo de letra de canción

// Logica Chat

function cargarMensajes() {
    fetch('chat.json')
        .then(response => response.json())
        .then(data => {
        console.log(data)
        // Lee los mensajes del archivo JSON
        console.log(data.mensajes);
        })
        .catch(error => {
        // Maneja errores
        console.error(error);
    });
}

function guardarMensaje(mensaje) {
    fetch('chat.json')
        .then(response => response.json())
        .then(data => {
            // Añade el mensaje al final del array
            data.mensajes.push(mensaje);

            // Si el número de mensajes es mayor a 100, elimina los primeros 50 mensajes
            if (data.mensajes.length > 100) {
                data.mensajes.splice(0, 50);
            }

            // Guarda los cambios en el archivo JSON
            fetch('chat.json', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        })
        .catch(error => {
        // Maneja errores
        console.error(error);
        });
}

function enviarMensaje() {
    const mensaje = {
        usuario: 'Juan',
        mensaje: document.getElementById('mensaje').value,
        fecha: new Date().toISOString()
    };

    guardarMensaje(mensaje);

    // Limpia el campo de entrada del mensaje
    document.getElementById('mensaje').value = '';
}

function mostrarMensajes() {
    cargarMensajes();

    // Muestra los últimos 100 mensajes del chat
    setTimeout(() => {
        fetch('chat.json')
            .then(response => response.json())
            .then(data => {
            const mensajes = data.mensajes.slice(-100);
    
            const listaMensajes = document.getElementById('lista-mensajes');
    
            for (const mensaje of mensajes) {
                const itemMensaje = document.createElement('li');
                itemMensaje.textContent = `${mensaje.usuario}: ${mensaje.mensaje} (${mensaje.fecha})`;
                listaMensajes.appendChild(itemMensaje);
            }
            })
            .catch(error => {
            // Maneja errores
            console.error(error);
            });
        }, 0);
    }
    
    window.onload = () => {
        mostrarMensajes();
    };
    
