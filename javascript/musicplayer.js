document.addEventListener('DOMContentLoaded', () => {
    const MIN_PLAYER_PADDING = 0;
    const MAX_HORIZONTAL_PADDING = 30;
    const MAX_TOP_PADDING = 10;
    const SENSITIVITY = 0.35;
    const FFT_SIZE_VALUE = 256;
    const EXPONENT_FACTOR = 4;

    const playPauseBtn = document.querySelector('.bi-play-circle-fill');
    const repeatBtn = document.querySelector('.bi-repeat');
    const shuffleBtn = document.querySelector('.bi-shuffle');
    const prevBtn = document.querySelector('.bi-skip-backward-fill');
    const nextBtn = document.querySelector('.bi-skip-forward-fill');
    const progressBar = document.querySelector('.musicplayer-progressbar');
    const progressBarPercentage = document.querySelector('.musicplayer-progressbar .percentage');
    const musicTitle = document.querySelector('.musicplayer-info h1');
    const musicArtist = document.querySelector('.musicplayer-info p');
    const musicPlayerDiv = document.querySelector('.musicplayer-base');
    const musicPlayerButton = document.querySelector('.musicplayer > button, #musicplayer');
    const closeButton = document.querySelector('.musicplayer-info > button');
    const musicPlayerEffect = document.querySelector('.musicplayer-base > div.musicplayer-effect');

    let isPlaying = false;
    let isRepeating = false;
    let isShuffling = false;

    let isPlayerMinimized = true;

    const playlist = [
		{
            artist: "I SEE STARS",
            title: "Flood Light",
            audioSrc: "songs/I SEE STARS - Flood Light.mp3"
        },
		{
            artist: "Dayseeker",
            title: "Pale Moonlight",
            audioSrc: "songs/Dayseeker - Pale Moonlight.mp3"
        },
        {
            artist: "Sleep Theory",
            title: "Stuck In My Head",
            audioSrc: "songs/Sleep Theory - Stuck In My Head.mp3"
        },
        {
            artist: "East Capri",
            title: "Undone",
            audioSrc: "songs/East Capri - Undone.mp3"
        },
        {
            artist: "Sleep Token",
            title: "Caramel",
            audioSrc: "songs/Sleep Token - Caramel.mp3"
        },
        {
            artist: "Nevertel & Sleep Theory",
            title: "Break The Silence",
            audioSrc: "songs/Nevertel & Sleep Theory - Break The Silence.mp3"
        },
        {
            artist: "Nevertel",
            title: "Some Things",
            audioSrc: "songs/Nevertel - Some Things.mp3"
        },
        {
            artist: "I Prevail",
            title: "Rain",
            audioSrc: "songs/I Prevail - Rain.mp3"
        }
    ];

    let currentTrackIndex = 0;
    const audio = new Audio();

    let audioContext;
    let analyser;
    let source;
    let dataArray;
    let bufferLength;

    function setupAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            source = audioContext.createMediaElementSource(audio);
            analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            analyser.fftSize = FFT_SIZE_VALUE;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
    }

    function animateHorizontalPadding() {
        if (isPlaying && analyser && parseFloat(musicPlayerDiv.style.opacity) > 0) {
            analyser.getByteTimeDomainData(dataArray);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                let value = Math.abs(dataArray[i] - 128);
                sum += value * value;
            }
            let average = Math.sqrt(sum / bufferLength);

            let normalizedAverage = average / (128 * SENSITIVITY);
            normalizedAverage = Math.pow(normalizedAverage, EXPONENT_FACTOR);
            normalizedAverage = Math.min(normalizedAverage, 1.0);

            const dynamicPadding = MIN_PLAYER_PADDING + (MAX_HORIZONTAL_PADDING - MIN_PLAYER_PADDING) * normalizedAverage;

            musicPlayerDiv.style.paddingLeft = `${dynamicPadding.toFixed(1)}px`;
            musicPlayerDiv.style.paddingRight = `${dynamicPadding.toFixed(1)}px`;

            requestAnimationFrame(animateHorizontalPadding);
        } else {
            musicPlayerDiv.style.paddingLeft = `${MIN_PLAYER_PADDING}px`;
            musicPlayerDiv.style.paddingRight = `${MIN_PLAYER_PADDING}px`;
        }
    }

    function updatePlayerVisibility() {
        if (!isPlayerMinimized) {
            musicPlayerDiv.style.transform = 'translateY(0)';
            musicPlayerDiv.style.bottom = '15px';
            musicPlayerDiv.style.opacity = '1';
            musicPlayerDiv.style.paddingTop = `${MIN_PLAYER_PADDING}px`;
            musicPlayerButton.style.display = 'none';
            musicPlayerDiv.classList.remove('minimized');
        } else {
            musicPlayerButton.style.display = 'flex';

            if (isPlaying) {
                musicPlayerDiv.style.transform = `translateY(calc(100% - ${MAX_TOP_PADDING}px))`;
                musicPlayerDiv.style.bottom = '0px';
                musicPlayerDiv.style.opacity = '1';
                musicPlayerDiv.style.paddingTop = `${MAX_TOP_PADDING}px`;
            } else {
                musicPlayerDiv.style.transform = 'translateY(100%)';
                musicPlayerDiv.style.bottom = '0px';
                musicPlayerDiv.style.opacity = '0';
                musicPlayerDiv.style.paddingTop = `${MIN_PLAYER_PADDING}px`;
            }

            musicPlayerDiv.classList.add('minimized');
        }

        animateHorizontalPadding();
    }

    function startPlayingAndAnimate() {
        audio.play().then(() => {
            isPlaying = true;
            playPauseBtn.classList.remove('bi-play-circle-fill');
            playPauseBtn.classList.add('bi-pause-circle-fill');
            playPauseBtn.classList.add('active');
            musicPlayerEffect.classList.add('active');


            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            updatePlayerVisibility();
        }).catch(error => {
            console.error("Erro ao tentar reproduzir áudio:", error);
            isPlaying = false;
            playPauseBtn.classList.remove('bi-pause-circle-fill');
            playPauseBtn.classList.add('bi-play-circle-fill');
            playPauseBtn.classList.remove('active');
            musicPlayerEffect.classList.remove('active');
            updatePlayerVisibility();
        });
    }

    function loadTrack(index) {
        const track = playlist[index];
        if (track) {
            audio.src = track.audioSrc;
            musicTitle.textContent = track.title;
            musicArtist.textContent = track.artist;
            progressBarPercentage.style.width = '0%';
            audio.currentTime = 0;
            console.log(`Loading: ${track.title} by ${track.artist}`);

            setupAudioContext();

            if (isPlaying) {
                startPlayingAndAnimate();
            } else {
                playPauseBtn.classList.remove('bi-pause-circle-fill');
                playPauseBtn.classList.add('bi-play-circle-fill');
                playPauseBtn.classList.remove('active');
                musicPlayerEffect.classList.remove('active');
                updatePlayerVisibility();
            }
        }
    }

    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playPauseBtn.classList.remove('bi-pause-circle-fill');
            playPauseBtn.classList.add('bi-play-circle-fill');
            playPauseBtn.classList.remove('active');
            musicPlayerEffect.classList.remove('active');
            updatePlayerVisibility();
        } else {
            startPlayingAndAnimate();
        }
    }

    function toggleRepeat() {
        isRepeating = !isRepeating;
        repeatBtn.classList.toggle('active', isRepeating);
        audio.loop = isRepeating;
    }

    function toggleShuffle() {
        isShuffling = !isShuffling;
        shuffleBtn.classList.toggle('active', isShuffling);
    }

    function playPrevious() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
    }

    function playNext() {
        if (isShuffling) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentTrackIndex && playlist.length > 1);
            currentTrackIndex = newIndex;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        }
        loadTrack(currentTrackIndex);
    }

    function seekProgressBar(event) {
        const progressBarRect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - progressBarRect.left;
        const progressBarWidth = progressBarRect.width;

        const seekPercentage = (clickX / progressBarWidth);
        audio.currentTime = audio.duration * seekPercentage;
    }

    playPauseBtn.addEventListener('click', togglePlayPause);
    repeatBtn.addEventListener('click', toggleRepeat);
    shuffleBtn.addEventListener('click', toggleShuffle);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    progressBar.addEventListener('click', seekProgressBar);

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBarPercentage.style.width = `${progress}%`;
        }
    });

    audio.addEventListener('ended', () => {
        if (isRepeating) {
            audio.currentTime = 0;
            audio.play().catch(error => console.error("Error replaying song:", error));
        } else {
            playNext();
        }
        if (!isRepeating) {
            musicPlayerEffect.classList.remove('active');
            isPlaying = false;
            playPauseBtn.classList.remove('bi-pause-circle-fill');
            playPauseBtn.classList.add('bi-play-circle-fill');
            playPauseBtn.classList.remove('active');
            updatePlayerVisibility();
        }
    });

    audio.addEventListener('canplaythrough', () => {
        console.log("Audio is ready to play!");
    });

    audio.addEventListener('error', (e) => {
        console.error("Audio Error:", e);
        alert(`Failed to load audio: ${audio.src}. Check file path and format.`);
        console.error(`Falha ao carregar áudio: ${audio.src}. Verifique o caminho do arquivo e o formato.`);
        isPlaying = false;
        playPauseBtn.classList.remove('bi-pause-circle-fill');
        playPauseBtn.classList.add('bi-play-circle-fill');
        playPauseBtn.classList.remove('active');
        musicPlayerEffect.classList.remove('active');
        updatePlayerVisibility();
    });

    currentTrackIndex = 0;
    loadTrack(currentTrackIndex);

    musicPlayerDiv.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out, padding-top 0.3s ease-out, padding-left 0.1s linear, padding-right 0.1s linear, bottom 0.3s ease-out';

    isPlayerMinimized = true;
    updatePlayerVisibility();
    
    musicPlayerButton.addEventListener('click', () => {
        isPlayerMinimized = false;
        updatePlayerVisibility();
    });

    closeButton.addEventListener('click', () => {
        isPlayerMinimized = true;
        updatePlayerVisibility();
    });
});