// Logica reproductor

const audioPlayer = document.getElementById('audio-player');
const lyricsDiv = document.getElementById('lyrics');
const lyricsFile = 'tiroteo.lrc'; // Cambiar por el nombre de tu archivo de letra de canción

audioPlayer.addEventListener('timeupdate', function() {
    fetch(lyricsFile)
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2})\]/;
            const currentTime = Math.floor(audioPlayer.currentTime);
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const timeMatch = line.match(timeRegExp);
                
                if (timeMatch) {
                    const minutes = parseInt(timeMatch[1]);
                    const seconds = parseInt(timeMatch[2]);
                    const time = minutes * 60 + seconds;
                    
                    if (time === currentTime) {
                        const lyricsLine = line.replace(timeRegExp, '');
                        lyricsDiv.innerHTML = lyricsLine;
                        lyricsDiv.scrollTop = lyricsDiv.scrollHeight;
                    }
                }
            }
        });
});

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
            fetch('/guardar_mensaje', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log('Mensaje guardado exitosamente');
            })
            .catch(error => {
                console.error('Error al guardar el mensaje:', error);
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
    