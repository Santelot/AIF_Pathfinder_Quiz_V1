/* CÓDIGO JAVASCRIPT (con script de partículas y opacidad ajustable) */
document.addEventListener('DOMContentLoaded', () => {

    // --- SCRIPT DE PARTÍCULAS ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    /* --- MODIFICAR AQUÍ: Opacidad del Fondo --- */
    // Cambia este valor entre 0.0 (invisible) y 1.0 (totalmente opaco)
    const PARTICLE_OPACITY = 0.1;
    /* ------------------------------------------- */
    
    let particlesArray;
    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });

    class Particle {
        constructor(x, y, dirX, dirY, size, color) { this.x = x; this.y = y; this.dirX = dirX; this.dirY = dirY; this.size = size; this.color = color; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
        update() {
            if (this.x > canvas.width || this.x < 0) { this.dirX = -this.dirX; }
            if (this.y > canvas.height || this.y < 0) { this.dirY = -this.dirY; }
            this.x += this.dirX; this.y += this.dirY; this.draw();
        }
    }
    function initParticles() {
        particlesArray = [];
        let num = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < num; i++) {
            let size = (Math.random() * 2) + 1; let x = (Math.random() * innerWidth); let y = (Math.random() * innerHeight);
            let dirX = (Math.random() * .4) - .2; let dirY = (Math.random() * .4) - .2;
            let color = `rgba(0, 255, 255, ${PARTICLE_OPACITY * 0.7})`;
            particlesArray.push(new Particle(x, y, dirX, dirY, size, color));
        }
    }
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dist = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                if (dist < (canvas.width / 7) * (canvas.height / 7)) {
                    let opacity = 1 - (dist / 20000);
                    let color1 = `rgba(0, 255, 255, ${opacity * PARTICLE_OPACITY})`;
                    let color2 = `rgba(var(--accent-neon-rgb), ${opacity * PARTICLE_OPACITY})`;
                    let dx = mouse.x - particlesArray[a].x; let dy = mouse.y - particlesArray[a].y;
                    let mouseDist = Math.sqrt(dx*dx + dy*dy);
                    ctx.strokeStyle = (mouseDist < 100) ? color2 : color1;
                    ctx.lineWidth = 1; ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                }
            }
        }
    }
    function animateParticles() { requestAnimationFrame(animateParticles); ctx.clearRect(0, 0, innerWidth, innerHeight); particlesArray.forEach(p => p.update()); connectParticles(); }
    window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; initParticles(); });
    initParticles(); animateParticles();

    // --- DATOS Y LÓGICA DEL QUIZ ---
    const questions = [
        { question: "Estás construyendo un modelo de nave espacial. ¿Cuál es la MEJOR parte?", answers: [ { text: "Seguir las instrucciones para que quede perfecto.", scores: { Scientist: 3, Engineer: 1 } }, { text: "¡Hacerla volar! Probarla y ver qué tan alto llega.", scores: { Pilot: 3, Engineer: 1 } }, { text: "Decorarla con colores y diseños únicos.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Inventarle un nombre y una misión a la nave.", scores: { Communicator: 3, Pilot: 1 } } ] },
        { question: "Descubres un nuevo planeta. ¿Qué es lo PRIMERO que quieres hacer?", answers: [ { text: "Tomar fotos y dibujar un mapa detallado.", scores: { Engineer: 3, Naturalist: 1 } }, { text: "Recoger muestras de rocas para analizarlas.", scores: { Scientist: 3, Naturalist: 1 } }, { text: "¡Explorarlo! Correr, escalar y ver qué hay.", scores: { Pilot: 3, Naturalist: 1 } }, { text: "Intentar comunicarte con cualquier alien que encuentres.", scores: { Communicator: 3 } } ] },
        { question: "Tu nave espacial se daña un poco. ¿Qué haces?", answers: [ { text: "Leer el manual de reparaciones antes de tocar nada.", scores: { Scientist: 3, Engineer: 1 } }, { text: "Empezar a desarmar cosas para ver cómo funcionan.", scores: { Pilot: 3, Engineer: 1 } }, { text: "Pedirle ayuda a un ingeniero y observar cómo lo arregla.", scores: { Communicator: 2, Engineer: 1, Pilot: 1 } }, { text: "Diseñar una nueva nave espacial que sea aún mejor.", scores: { Engineer: 3, Pilot: 1 } } ] },
        { question: "Encuentras un extraño artefacto alienígena. ¿Cómo descubres qué es?", answers: [ { text: "Compararlo con fotos de otros artefactos en la base de datos.", scores: { Scientist: 3, Engineer: 1 } }, { text: "Tocarlo, girarlo y ver si puedes hacer que haga algo.", scores: { Pilot: 3, Engineer: 1 } }, { text: "Preguntar a tus compañeros de equipo qué creen que es.", scores: { Communicator: 3, Pilot: 1 } }, { text: "Escribir un reporte describiendo su tamaño, forma y color.", scores: { Scientist: 2, Communicator: 1, Engineer: 1 } } ] },
        { question: "¡Estás perdido en el espacio! ¿Cómo encuentras el camino de regreso?", answers: [ { text: "Usar las cartas estelares para calcular tu posición.", scores: { Scientist: 3, Engineer: 1 } }, { text: "Probar diferentes rutas y ver si algo te parece familiar.", scores: { Pilot: 3, Engineer: 1 } }, { text: "Enviar una señal de auxilio y pedir ayuda.", scores: { Communicator: 3 } }, { text: "Pensar en el camino que tomaste e intentar recordar puntos de referencia.", scores: { Scientist: 2, Naturalist: 1, Pilot: 1 } } ] },
        { question: "Tu profesor te da una tarea difícil. ¿Qué es lo primero que haces?", answers: [ { text: "Leer las instrucciones con cuidado y hacer lo que se te pide.", scores: { Scientist: 3, Engineer: 1 } }, { text: "Pedirle a un amigo que te explique el trabajo.", scores: { Communicator: 3 } }, { text: "Buscar un video en YouTube que lo explique.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Intentar hacerlo por tu cuenta, podrías sorprenderte.", scores: { Pilot: 3, Engineer: 1 } } ] },
        { question: "Necesitas aprender sobre los agujeros negros. ¿Cómo lo haces?", answers: [ { text: "Pedirle al profesor un libro con muchas imágenes.", scores: { Engineer: 3, Communicator: 1 } }, { text: "Leer un artículo científico sobre agujeros negros.", scores: { Scientist: 3 } }, { text: "Ver un video de YouTube con muchas animaciones.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Construir un mini agujero negro (de forma segura).", scores: { Pilot: 3, Engineer: 1 } } ] },
        { question: "Hay un proyecto escolar para presentar algo que te interese. ¿Qué eliges?", answers: [ { text: "Presentar sobre animales.", scores: { Naturalist: 3 } }, { text: "Presentar sobre agujeros negros y el espacio.", scores: { Scientist: 3, Engineer: 1 } }, { text: "Construir una máquina y presentarla en clase.", scores: { Pilot: 3, Engineer: 1 } }, { text: "Hacer una obra de teatro sobre el tema con tus amigos.", scores: { Communicator: 3, Pilot: 1 } } ] },
        { question: "El profesor está explicando un nuevo concepto. ¿Qué es más probable que hagas?", answers: [ { text: "Tomar notas de lo que el profesor está diciendo.", scores: { Scientist: 3, Communicator: 1 } }, { text: "Escuchar atentamente al profesor.", scores: { Communicator: 3, Navigator: 1 } }, { text: "Hacer garabatos en tu cuaderno mientras explican.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Pedir permiso para ir al baño.", scores: { Pilot: 3 } } ] },
        { question: "En un proyecto grupal, ¿qué es lo más importante?", answers: [ { text: "Que el profesor ponga una buena nota.", scores: { Scientist: 3 } }, { text: "Que todos se diviertan y estén emocionados con el proyecto.", scores: { Communicator: 3, Pilot: 1 } }, { text: "Que todos aprendamos mientras lo hacemos.", scores: { Naturalist: 3, Scientist: 1 } }, { text: "Encontrar una solución innovadora, aunque sea un poco arriesgada.", scores: { Pilot: 2, Engineer: 2 } } ] },
        { question: "Tu amigo construyó una máquina genial. ¿Qué vas a hacer?", answers: [ { text: "Pedirle que te construya una igual.", scores: { Pilot: 3, Engineer: 1 } }, { text: "Pedirle jugar con la máquina.", scores: { Pilot: 3 } }, { text: "Preguntarle cómo la construyó.", scores: { Engineer: 2, Communicator: 2 } }, { text: "Pedirle que te explique qué hace la máquina.", scores: { Scientist: 2, Communicator: 2 } } ] },
        { question: "La profesora pidió dibujar su animal favorito. ¿Qué es más probable que hagas?", answers: [ { text: "Un dibujo detallado del animal, lo más realista posible.", scores: { Engineer: 3, Naturalist: 1 } }, { text: "Dibujar al animal haciendo algo, como correr.", scores: { Pilot: 3, Naturalist: 1 } }, { text: "Inventar un animal fantástico y dibujarlo.", scores: { Communicator: 3, Engineer: 1 } }, { text: "Dibujar al animal con cuidado, usando técnicas de dibujo científico.", scores: { Scientist: 3, Naturalist: 1 } } ] },
        { question: "¿Cuál es tu parte favorita de la clase de ciencias?", answers: [ { text: "Los experimentos.", scores: { Pilot: 3, Engineer: 1 } }, { text: "Leer sobre nuevos descubrimientos.", scores: { Scientist: 3 } }, { text: "Ver videos sobre ciencia.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Discutir sobre ciencia con mis compañeros.", scores: { Communicator: 3 } } ] },
        { question: "Vas de excursión a un museo. ¿Qué es lo más emocionante?", answers: [ { text: "La tienda de regalos.", scores: { Pilot: 3 } }, { text: "Ver todas las exhibiciones.", scores: { Engineer: 3, Naturalist: 1 } }, { text: "Escuchar al guía turístico.", scores: { Communicator: 3, Navigator: 1 } }, { text: "Hacer las actividades prácticas en el taller del museo.", scores: { Pilot: 3, Engineer: 1 } } ] },
        { question: "Tienes que escribir una historia. ¿Qué tipo de historia escribes?", answers: [ { text: "Un recuento detallado y paso a paso de un evento real.", scores: { Scientist: 3, Naturalist: 1 } }, { text: "Una historia divertida con muchos chistes y personajes tontos.", scores: { Communicator: 3 } }, { text: "Una historia sobre construir algo asombroso, como un robot.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Una historia de aventuras donde los personajes exploran un lugar nuevo.", scores: { Pilot: 2, Communicator: 1, Naturalist: 1 } } ] },
        { question: "Tu grupo está decidiendo qué hacer para un proyecto. ¿Cuál es tu papel?", answers: [ { text: "Asegurarme de que todos sigan las reglas y se mantengan en la tarea.", scores: { Scientist: 3 } }, { text: "Proponer muchas ideas creativas.", scores: { Communicator: 2, Engineer: 1, Pilot: 1 } }, { text: "Construir el proyecto en sí.", scores: { Pilot: 3, Engineer: 1 } }, { text: "Asegurarme de que las ideas de todos sean escuchadas.", scores: { Communicator: 3 } } ] },
        { question: "Tu profesor pregunta algo que aprendiste la semana pasada. ¿Qué haces?", answers: [ { text: "Intentar recordar las palabras exactas que usó el profesor.", scores: { Communicator: 3, Navigator: 1 } }, { text: "Intentar visualizar los diagramas o ejemplos que mostró el profesor.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Pensar en cómo se relaciona con otras cosas que sabes.", scores: { Scientist: 3, Naturalist: 1 } }, { text: "Pensar en el momento en que usaste ese concepto.", scores: { Pilot: 2, Naturalist: 1, Scientist: 1 } } ] },
        { question: "Es tiempo libre en clase. ¿Qué haces?", answers: [ { text: "Leer un libro.", scores: { Scientist: 2, Communicator: 2 } }, { text: "Dibujar o hacer garabatos.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Hablar con tus amigos.", scores: { Communicator: 3 } }, { text: "Construir algo con bloques u otros materiales.", scores: { Pilot: 3, Engineer: 1 } } ] },
        { question: "¿Cómo prefieres tomar notas?", answers: [ { text: "Escribiendo todo palabra por palabra.", scores: { Scientist: 3, Communicator: 1 } }, { text: "Haciendo mapas mentales.", scores: { Engineer: 3, Scientist: 1 } }, { text: "No tomo notas.", scores: { Pilot: 3 } }, { text: "Anotando solo las palabras clave.", scores: { Communicator: 2, Scientist: 2 } } ] },
        { question: "Estás aprendiendo sobre un nuevo animal. ¿Qué quieres saber?", answers: [ { text: "Qué come y dónde vive.", scores: { Naturalist: 3, Scientist: 1 } }, { text: "Cómo se mueve y qué sonidos hace.", scores: { Pilot: 2, Naturalist: 1, Navigator: 1 } }, { text: "Si está relacionado con otros animales.", scores: { Scientist: 3, Naturalist: 1 } }, { text: "Qué significa su nombre y cómo fue descubierto.", scores: { Communicator: 3, Naturalist: 1 } } ] },
        { question: "Estás trabajando en un proyecto grupal. ¿Cuál es tu parte favorita?", answers: [ { text: "Aportar ideas con tus compañeros de equipo.", scores: { Communicator: 3, Pilot: 1 } }, { text: "Escuchar las ideas de todos y ayudar a que encajen.", scores: { Communicator: 3 } }, { text: "Asegurarte de que todos tengan la oportunidad de hablar.", scores: { Communicator: 3 } }, { text: "Presentar el proyecto final a la clase.", scores: { Communicator: 3 } } ] },
        { question: "No estás de acuerdo con un amigo. ¿Qué haces?", answers: [ { text: "Explicar tu punto de vista de forma clara y lógica.", scores: { Scientist: 3, Communicator: 1 } }, { text: "Intentar entender su punto de vista haciendo preguntas.", scores: { Communicator: 3, Naturalist: 1 } }, { text: "Encontrar un punto medio en el que ambos puedan estar de acuerdo.", scores: { Communicator: 3 } }, { text: "Cambiar de tema y hablar de otra cosa.", scores: { Pilot: 2 } } ] },
        { question: "Estás contando una historia a un grupo de amigos. ¿Qué es lo importante para ti?", answers: [ { text: "Hacerla emocionante y entretenida.", scores: { Communicator: 3 } }, { text: "Asegurarte de que todos entiendan lo que está pasando.", scores: { Communicator: 3 } }, { text: "Usar voces graciosas y efectos de sonido.", scores: { Communicator: 2, Navigator: 2 } }, { text: "Acertar en todos los detalles.", scores: { Scientist: 3, Communicator: 1 } } ] },
        { question: "Estás aprendiendo una nueva canción. ¿Qué te ayuda a recordar la letra?", answers: [ { text: "Cantarla una y otra vez.", scores: { Navigator: 3, Communicator: 1 } }, { text: "Leer la letra mientras escuchas la música.", scores: { Communicator: 2, Navigator: 1, Scientist: 1 } }, { text: "Inventar un baile que vaya con la canción.", scores: { Pilot: 2, Navigator: 2 } }, { text: "Pensar en lo que trata la canción.", scores: { Communicator: 3, Scientist: 1 } } ] },
        { question: "Escuchas una palabra nueva que no conoces. ¿Qué haces?", answers: [ { text: "Preguntar a alguien qué significa.", scores: { Communicator: 3 } }, { text: "Buscarla en un diccionario.", scores: { Scientist: 3, Communicator: 1 } }, { text: "Intentar descifrarla por el contexto.", scores: { Communicator: 2, Scientist: 2 } }, { text: "Ignorarla y seguir escuchando.", scores: { Pilot: 1 } } ] },
        { question: "Si pudieras tener un superpoder, ¿cuál sería?", answers: [ { text: "Supervelocidad.", scores: { Pilot: 3 } }, { text: "Invisibilidad.", scores: { Scientist: 2, Pilot: 1 } }, { text: "Telepatía (leer mentes).", scores: { Communicator: 3 } }, { text: "Superfuerza.", scores: { Pilot: 3 } } ] },
        { question: "Estás dando indicaciones a alguien. ¿Cómo lo haces?", answers: [ { text: "Usas un lenguaje claro y preciso, como 'Gira a la izquierda en la tercera calle'.", scores: { Scientist: 3, Communicator: 1 } }, { text: "Dibujas un mapa.", scores: { Engineer: 3 } }, { text: "Lo actúas, pretendiendo caminar la ruta.", scores: { Pilot: 3, Communicator: 1 } }, { text: "Usas puntos de referencia, como 'Gira a la derecha en la gran casa roja'.", scores: { Naturalist: 2, Communicator: 1, Engineer: 1 } } ] },
        { question: "Tu amigo está triste. ¿Qué haces?", answers: [ { text: "Le das un abrazo.", scores: { Pilot: 3 } }, { text: "Le preguntas qué le pasa y escuchas sus problemas.", scores: { Communicator: 3 } }, { text: "Intentas animarlo contando chistes o haciéndolo reír.", scores: { Communicator: 3 } }, { text: "Lo dejas solo, le das su espacio.", scores: { Scientist: 1 } } ] },
        { question: "¿Cuál es tu tipo de música favorito?", answers: [ { text: "Música con un ritmo fuerte que se puede bailar.", scores: { Pilot: 2, Navigator: 2 } }, { text: "Música con melodías hermosas.", scores: { Navigator: 3 } }, { text: "Música con letras significativas.", scores: { Communicator: 3 } }, { text: "No tengo un tipo de música favorito.", scores: {} } ] },
        { question: "Estás aprendiendo un nuevo baile. ¿Qué es lo que más te ayuda?", answers: [ { text: "Ver a otra persona hacer el baile.", scores: { Engineer: 3, Pilot: 1 } }, { text: "Escuchar la música y sentir el ritmo.", scores: { Navigator: 3, Pilot: 1 } }, { text: "Practicar los pasos una y otra vez.", scores: { Pilot: 3 } }, { text: "Desglosar el baile en partes más pequeñas.", scores: { Scientist: 3, Pilot: 1 } } ] },
        { question: "¿Cuál de los siguientes juegos te gusta más?", answers: [ { text: "Charadas.", scores: { Communicator: 3, Pilot: 1 } }, { text: "Pictionary.", scores: { Engineer: 3, Communicator: 1 } }, { text: "20 preguntas.", scores: { Scientist: 3, Communicator: 1 } }, { text: "Scrabble.", scores: { Scientist: 2, Communicator: 2 } } ] },
        { question: "Estás en una fiesta. ¿Qué es lo más probable que hagas?", answers: [ { text: "Hablar con la gente que ya conoces.", scores: { Communicator: 3 } }, { text: "Conocer gente nueva.", scores: { Communicator: 3 } }, { text: "Bailar.", scores: { Pilot: 3, Navigator: 1 } }, { text: "Quedarte cerca de la comida.", scores: { Naturalist: 1 } } ] },
        { question: "Estás viendo una película. ¿A qué le prestas más atención?", answers: [ { text: "Al diálogo.", scores: { Communicator: 3 } }, { text: "A la música.", scores: { Navigator: 3 } }, { text: "A los efectos especiales.", scores: { Engineer: 3 } }, { text: "Al paisaje y la escenografía.", scores: { Naturalist: 3, Engineer: 1 } } ] },
        { question: "Tu amigo te cuenta un secreto. ¿Qué haces?", answers: [ { text: "Te lo guardas para ti.", scores: { Communicator: 3 } }, { text: "Le preguntas más sobre ello.", scores: { Communicator: 3 } }, { text: "Intentas darle un consejo.", scores: { Scientist: 2, Communicator: 1 } }, { text: "Te olvidas de ello.", scores: { Pilot: 1 } } ] },
        { question: "¿Cuál es tu forma favorita de pasar el tiempo al aire libre?", answers: [ { text: "Practicando deportes.", scores: { Pilot: 3 } }, { text: "Ir a caminar o de excursión.", scores: { Naturalist: 3, Pilot: 1 } }, { text: "Leer un libro bajo un árbol.", scores: { Scientist: 2, Communicator: 1, Naturalist: 1 } }, { text: "Observar la naturaleza y la vida silvestre.", scores: { Naturalist: 3 } } ] },
        { question: "¿Cómo te sientes cuando estás en la naturaleza?", answers: [ { text: "Calmado y relajado.", scores: { Naturalist: 3 } }, { text: "Con energía y emocionado.", scores: { Pilot: 3, Naturalist: 1 } }, { text: "Curioso y observador.", scores: { Scientist: 2, Naturalist: 2 } }, { text: "Inspirado y creativo.", scores: { Communicator: 2, Naturalist: 1, Engineer: 1 } } ] },
        { question: "¿Cuál es la mejor manera de describir a tu mascota soñada?", answers: [ { text: "Suave y mimosa.", scores: { Pilot: 3 } }, { text: "Exótica y rara.", scores: { Naturalist: 3 } }, { text: "Inteligente y entrenable.", scores: { Scientist: 2, Naturalist: 1, Communicator: 1 } }, { text: "Una mascota con la que pueda comunicarme.", scores: { Communicator: 3 } } ] },
        { question: "¿Qué sonidos te atraen más?", answers: [ { text: "Las olas rompiendo en la orilla.", scores: { Naturalist: 3, Navigator: 1 } }, { text: "El canto de los pájaros.", scores: { Naturalist: 2, Navigator: 2 } }, { text: "El viento soplando entre los árboles.", scores: { Naturalist: 3, Navigator: 1 } }, { text: "La música.", scores: { Navigator: 3 } } ] },
        { question: "¿Qué materia te parece más atractiva?", answers: [ { text: "Biología.", scores: { Naturalist: 3, Scientist: 1 } }, { text: "Lenguaje.", scores: { Communicator: 3 } }, { text: "Educación Física.", scores: { Pilot: 3 } }, { text: "Música.", scores: { Navigator: 3 } } ] },
        { question: "¿Qué es lo más importante para ti?", answers: [ { text: "Ayudar a los demás.", scores: { Communicator: 3 } }, { text: "Aprender cosas nuevas.", scores: { Scientist: 3 } }, { text: "Ser creativo.", scores: { Engineer: 2, Communicator: 1, Pilot: 1 } }, { text: "Vivir nuevas aventuras.", scores: { Pilot: 3, Naturalist: 1 } } ] }
    ];

    let currentQuestionIndex = 0, userScores = {}, chartInstance = null;
    const profileColors = { Pilot: 'var(--color-pilot)', Engineer: 'var(--color-engineer)', Scientist: 'var(--color-scientist)', Communicator: 'var(--color-communicator)', Naturalist: 'var(--color-naturalist)', Navigator: 'var(--color-navigator)' };
    const startScreen = document.getElementById('start-screen'), quizScreen = document.getElementById('quiz-screen'), resultsScreen = document.getElementById('results-screen');
    const startBtn = document.getElementById('start-btn'), restartBtn = document.getElementById('restart-btn');
    const questionText = document.getElementById('question-text'), answerCardsContainer = document.getElementById('answer-cards-container'), progressBar = document.getElementById('progress-bar');
    const resultsChartCtx = document.getElementById('results-chart').getContext('2d'), profileSummaryContainer = document.getElementById('profile-summary-container');
    function initializeScores() { userScores = { Pilot: 0, Engineer: 0, Scientist: 0, Communicator: 0, Naturalist: 0, Navigator: 0 }; }
    function startQuiz() { initializeScores(); currentQuestionIndex = 0; startScreen.classList.remove('active'); resultsScreen.classList.remove('active'); quizScreen.classList.add('active'); showQuestion(); }
    function showQuestion() { answerCardsContainer.innerHTML = ''; const q = questions[currentQuestionIndex]; questionText.innerText = q.question; q.answers.forEach(a => { const c = document.createElement('div'); c.className = 'answer-card'; c.innerText = a.text; c.onclick = () => selectAnswer(a.scores, c); answerCardsContainer.appendChild(c); }); updateProgressBar(); }
    function selectAnswer(scores, card) { for (const p in scores) { if (userScores.hasOwnProperty(p)) userScores[p] += scores[p]; } document.querySelectorAll('.answer-card').forEach(c => c.classList.add('disabled')); card.classList.remove('disabled'); card.classList.add('selected'); setTimeout(() => { currentQuestionIndex++; if (currentQuestionIndex < questions.length) showQuestion(); else showResults(); }, 800); }
    function updateProgressBar() { progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`; }
    function showResults() { progressBar.style.width = `100%`; quizScreen.classList.remove('active'); resultsScreen.classList.add('active'); const sorted = Object.entries(userScores).sort(([, a], [, b]) => b - a); displayChart(); displayProfileSummary(sorted); }
function displayChart() {
    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = Object.keys(userScores);
    const data = labels.map(l => userScores[l]);

    chartInstance = new Chart(resultsChartCtx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mapeo de Afinidad',
                data: data,
                backgroundColor: 'rgba(0, 255, 255, 0.2)', // Color del área interior
                borderColor: 'var(--primary-neon)',      // Color de la línea de datos principal
                borderWidth: 2,
                pointBackgroundColor: 'var(--primary-neon)', // Color de los puntos de datos
                pointBorderColor: '#fff',                    // Borde de los puntos de datos
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'var(--primary-neon)'
            }]
        },
        // --- INICIO DE LA CORRECCIÓN DEFINITIVA ---
        options: {
            responsive: true,
            maintainAspectRatio: false,
            // La clave es definir los colores explícitamente DENTRO de la configuración de la escala 'r'
            scales: {
                r: {
                    // Estilo para las líneas que van del centro a las etiquetas (los "radios")
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.3)' 
                    },
                    // Estilo para las líneas de la cuadrícula (los polígonos concéntricos)
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    // Estilo para las etiquetas de texto (Pilot, Engineer, etc.)
                    pointLabels: {
                        color: 'var(--text-color)', // Usar el color de texto definido en CSS
                        font: {
                            family: "'Roboto Mono', monospace",
                            size: 12
                        }
                    },
                    // Estilo para las etiquetas numéricas de la escala (que están ocultas)
                    ticks: {
                        display: false, // Las mantenemos ocultas
                        // Se define el color igualmente para evitar cualquier problema
                        color: 'rgba(255, 255, 255, 0.7)',
                        backdropColor: 'transparent'
                    }
                }
            },
            plugins: {
                // Se deshabilita la leyenda
                legend: {
                    display: false
                },
                // Se deshabilitan los tooltips al pasar el cursor
                tooltip: {
                    enabled: false
                }
            }
        }
        // --- FIN DE LA CORRECCIÓN DEFINITIVA ---
    });
}
    function displayProfileSummary(sorted) { profileSummaryContainer.innerHTML = ''; if (sorted[0] && sorted[0][1] > 0) { const [p, s] = sorted[0]; const c = document.createElement('div'); c.className = 'profile-card profile-card--primary'; const color = profileColors[p]; c.style.borderColor = color; c.innerHTML = `<h3>Afinidad Primaria: ${p}</h3><p>${getProfileDescription(p)}</p>`; c.querySelector('h3').style.color = color; c.querySelector('h3').style.textShadow = `0 0 8px ${color}`; profileSummaryContainer.appendChild(c); } if (sorted[1] && sorted[1][1] > 0) { const [p, s] = sorted[1]; const c = document.createElement('div'); c.className = 'profile-card profile-card--secondary'; const color = profileColors[p]; c.style.borderColor = color; c.innerHTML = `<h3>Afinidad Secundaria: ${p}</h3><p>${getProfileDescription(p)}</p>`; c.querySelector('h3').style.color = color; c.querySelector('h3').style.textShadow = `0 0 8px ${color}`; profileSummaryContainer.appendChild(c); } }
    function getProfileDescription(profile) { const d = { Pilot: "Disfrutas de la acción, la experimentación y el aprendizaje práctico. Eres kinestésico y te gusta tomar la iniciativa.", Engineer: "Eres un constructor y solucionador de problemas. Te atrae el diseño, la tecnología y entender cómo funcionan las cosas.", Scientist: "Eres analítico, lógico y metódico. Disfrutas investigando, siguiendo procedimientos y basándote en datos.", Communicator: "Eres social, expresivo e imaginativo. Se te da bien conectar con otros, contar historias y colaborar.", Naturalist: "Te sientes conectado con el entorno y los seres vivos. Eres observador y disfrutas clasificando y entendiendo el mundo natural.", Navigator: "Tienes una gran percepción espacial y auditiva. Te orientas bien, reconoces patrones y aprendes con la repetición." }; return d[profile] || "Tienes una mezcla única de talentos."; }
    startBtn.addEventListener('click', startQuiz); restartBtn.addEventListener('click', startQuiz);
});
