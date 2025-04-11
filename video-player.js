// Video player module for TNYN PHONE
class VideoPlayer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: false,
            controls: true,
            title: '',
            ...options
        };
        
        this.isPlaying = false;
        this.isMuted = false;
        this.progress = 0;
        
        this.init();
    }
    
    init() {
        this.createPlayerUI();
        this.setupEventListeners();
        
        if (this.options.autoplay) {
            this.play();
        }
    }
    
    createPlayerUI() {
        this.playerElement = document.createElement('div');
        this.playerElement.className = 'tnyn-video-player';
        
        this.playerElement.innerHTML = `
            <div class="player-header">
                <h3>${this.options.title}</h3>
                <button class="close-player">&times;</button>
            </div>
            <div class="player-screen">
                <svg viewBox="0 0 640 360" width="100%" height="auto">
                    <rect width="640" height="360" fill="#000" />
                    <text x="320" y="180" font-size="20" text-anchor="middle" fill="white">
                        ${this.options.title}
                    </text>
                    <circle cx="320" cy="180" r="30" fill="none" stroke="#e50914" stroke-width="4">
                        <animate attributeName="r" from="30" to="40" dur="1s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
                    </circle>
                </svg>
                <div class="player-overlay">
                    <button class="big-play-btn"><i class="fas fa-play"></i></button>
                </div>
            </div>
            <div class="player-controls">
                <button class="control-btn play-pause"><i class="fas fa-play"></i></button>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-filled"></div>
                    </div>
                    <div class="time-display">00:00 / 02:30</div>
                </div>
                <div class="right-controls">
                    <button class="control-btn volume"><i class="fas fa-volume-up"></i></button>
                    <button class="control-btn settings"><i class="fas fa-cog"></i></button>
                    <button class="control-btn fullscreen"><i class="fas fa-expand"></i></button>
                </div>
            </div>
        `;
        
        this.container.appendChild(this.playerElement);
        
        // Store references to UI elements
        this.playPauseBtn = this.playerElement.querySelector('.play-pause');
        this.bigPlayBtn = this.playerElement.querySelector('.big-play-btn');
        this.progressFilled = this.playerElement.querySelector('.progress-filled');
        this.progressBar = this.playerElement.querySelector('.progress-bar');
        this.volumeBtn = this.playerElement.querySelector('.volume');
        this.fullscreenBtn = this.playerElement.querySelector('.fullscreen');
        this.closeBtn = this.playerElement.querySelector('.close-player');
        this.timeDisplay = this.playerElement.querySelector('.time-display');
    }
    
    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.bigPlayBtn.addEventListener('click', () => this.play());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.closeBtn.addEventListener('click', () => this.close());
        
        this.progressBar.addEventListener('click', (e) => {
            const rect = this.progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.seek(pos);
        });
    }
    
    play() {
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.bigPlayBtn.style.display = 'none';
        this.startProgressSimulation();
    }
    
    pause() {
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.bigPlayBtn.style.display = 'flex';
        this.stopProgressSimulation();
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.volumeBtn.innerHTML = this.isMuted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    }
    
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        } else {
            this.playerElement.requestFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        }
    }
    
    seek(position) {
        this.progress = Math.max(0, Math.min(1, position));
        this.updateProgressBar();
        this.updateTimeDisplay();
    }
    
    startProgressSimulation() {
        this.progressInterval = setInterval(() => {
            if (this.progress < 1) {
                this.progress += 0.005;
                this.updateProgressBar();
                this.updateTimeDisplay();
            } else {
                this.pause();
                this.progress = 0;
                this.updateProgressBar();
                this.updateTimeDisplay();
            }
        }, 100);
    }
    
    stopProgressSimulation() {
        clearInterval(this.progressInterval);
    }
    
    updateProgressBar() {
        this.progressFilled.style.width = `${this.progress * 100}%`;
    }
    
    updateTimeDisplay() {
        const currentTime = this.formatTime(this.progress * 150);
        this.timeDisplay.textContent = `${currentTime} / 02:30`;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    close() {
        this.pause();
        if (typeof this.options.onClose === 'function') {
            this.options.onClose();
        }
    }
}

export default VideoPlayer;

