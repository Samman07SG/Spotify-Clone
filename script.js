// Sample playlist data
const playlists = [
    {
        id: '1',
        name: "Bollywood Hits",
        description: "The best of Bollywood music",
        image: "cover img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg",
        tracks: [
            {
                id: '1',
                name: "Sapne Bade",
                artists: ["Bollywood Artist"],
                albumImage: "cover img/ilyuza-mingazova-CxYnS2qSaZg-unsplash.jpg",
                duration: 180,
                previewUrl: "songs/sapne-bade-305719.mp3"
            },
            {
                id: '2',
                name: "Indian Bollywood",
                artists: ["Bollywood Artist"],
                albumImage: "cover img/eric-nopanen-8e0EHPUx3Mo-unsplash.jpg",
                duration: 240,
                previewUrl: "songs/indian-bollywood-hindi-song-background-music-293028.mp3"
            },
            {
                id: '3',
                name: "Bollywood Song",
                artists: ["Bollywood Artist"],
                albumImage: "cover img/ilyuza-mingazova-NLKmU8oycNs-unsplash.jpg",
                duration: 210,
                previewUrl: "songs/bollywood-song-313044.mp3"
            }
        ]
    },
    {
        id: '2',
        name: "Hip Hop Mix",
        description: "Fresh hip hop beats and tracks",
        image: "cover img/c-d-x-PDX_a_82obo-unsplash.jpg",
        tracks: [
            {
                id: '4',
                name: "Soul Sweeper",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/ilyuza-mingazova-SLx3U_r2ack-unsplash.jpg",
                duration: 195,
                previewUrl: "songs/soulsweeper-252499.mp3"
            },
            {
                id: '5',
                name: "Vlog Music",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg",
                duration: 165,
                previewUrl: "songs/vlog-music-beat-trailer-showreel-promo-background-intro-theme-274290.mp3"
            },
            {
                id: '6',
                name: "Don't Talk",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/ilyuza-mingazova-CxYnS2qSaZg-unsplash.jpg",
                duration: 210,
                previewUrl: "songs/dont-talk-315229.mp3"
            },
            {
                id: '7',
                name: "Experimental Hip Hop",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/eric-nopanen-8e0EHPUx3Mo-unsplash.jpg",
                duration: 180,
                previewUrl: "songs/experimental-cinematic-hip-hop-315904.mp3"
            },
            {
                id: '8',
                name: "Gorila",
                artists: ["Hip Hop Artist"],
                albumImage: "cover img/ilyuza-mingazova-NLKmU8oycNs-unsplash.jpg",
                duration: 195,
                previewUrl: "songs/gorila-315977.mp3"
            }
        ]
    }
];

// Loved songs playlist
let lovedSongsPlaylist = {
    id: 'loved',
    name: "Liked Songs",
    description: "Your favorite tracks",
    image: "cover img/ilyuza-mingazova-GUx0VBmMgQk-unsplash.jpg",
    tracks: []
};

// Audio player setup
const audio = new Audio();
let currentTrack = null;
let isPlaying = false;
let currentPlaylist = null;

// DOM elements
const playlistContainer = document.querySelector('.grid');
const nowPlaying = document.querySelector('.now-playing');
const playerControls = document.querySelector('.player-controls');
const progressBar = document.querySelector('.progress-fill');
const volumeSlider = document.querySelector('.volume-fill');
const volumeIcon = document.getElementById('volumeIcon');
const playButton = document.getElementById('playButton');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const shuffleButton = document.getElementById('shuffleButton');
const repeatButton = document.getElementById('repeatButton');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const heartIcon = document.querySelector('.now-playing .fa-heart');

// Initialize the app
function init() {
    displayPlaylists();
    setupEventListeners();
    // Add loved songs playlist to the list
    playlists.push(lovedSongsPlaylist);
}

// Display playlists
function displayPlaylists() {
    playlistContainer.innerHTML = playlists.map(playlist => `
        <div class="playlist-card" onclick="selectPlaylist('${playlist.id}')">
            <img src="${playlist.image}" alt="${playlist.name}">
            <h3>${playlist.name}</h3>
            <p>${playlist.description}</p>
        </div>
    `).join('');
}

// Select playlist and display tracks
function selectPlaylist(playlistId) {
    currentPlaylist = playlists.find(p => p.id === playlistId);
    displayTracks(currentPlaylist.tracks);
}

// Display tracks
function displayTracks(tracks) {
    const trackList = document.createElement('div');
    trackList.className = 'track-list';
    trackList.innerHTML = tracks.map(track => `
        <div class="track-item" onclick="playTrack('${track.id}')">
            <img src="${track.albumImage}" alt="${track.name}">
            <div class="track-info">
                <h4>${track.name}</h4>
                <p>${track.artists.join(', ')}</p>
            </div>
            <span class="duration">${formatTime(track.duration)}</span>
            <i class="far fa-heart" onclick="addToLovedSongs('${track.id}')"></i>
        </div>
    `).join('');
    
    const content = document.querySelector('.content');
    content.appendChild(trackList);
}

// Add track to loved songs
function addToLovedSongs(trackId) {
    // Find the track in all playlists
    let track = null;
    for (const playlist of playlists) {
        if (playlist.id !== 'loved') {
            const foundTrack = playlist.tracks.find(t => t.id === trackId);
            if (foundTrack) {
                track = foundTrack;
                break;
            }
        }
    }

    if (track) {
        // Check if track is already in loved songs
        const isAlreadyLoved = lovedSongsPlaylist.tracks.some(t => t.id === trackId);
        
        if (!isAlreadyLoved) {
            // Add track to loved songs
            lovedSongsPlaylist.tracks.push(track);
            
            // Update heart icon in now playing if this is the current track
            if (currentTrack && currentTrack.id === trackId) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            }
            
            // Show notification
            showNotification('Added to Liked Songs');
        } else {
            // Remove track from loved songs
            lovedSongsPlaylist.tracks = lovedSongsPlaylist.tracks.filter(t => t.id !== trackId);
            
            // Update heart icon in now playing if this is the current track
            if (currentTrack && currentTrack.id === trackId) {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
            
            // Show notification
            showNotification('Removed from Liked Songs');
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Play track
function playTrack(trackId) {
    const track = currentPlaylist.tracks.find(t => t.id === trackId);
    if (!track) return;

    currentTrack = track;
    audio.src = track.previewUrl;
    audio.play();
    isPlaying = true;
    updateNowPlaying();
    updatePlayerControls();
    
    // Update heart icon based on whether track is in loved songs
    const isLoved = lovedSongsPlaylist.tracks.some(t => t.id === trackId);
    heartIcon.className = isLoved ? 'fas fa-heart' : 'far fa-heart';
}

// Update now playing display
function updateNowPlaying() {
    const songInfo = nowPlaying.querySelector('.song-info');
    songInfo.innerHTML = `
        <h4>${currentTrack.name}</h4>
        <p>${currentTrack.artists.join(', ')}</p>
    `;
    nowPlaying.querySelector('img').src = currentTrack.albumImage;
}

// Setup event listeners
function setupEventListeners() {
    // Audio events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNextTrack);
    
    // Player control events
    playButton.addEventListener('click', togglePlay);
    previousButton.addEventListener('click', playPreviousTrack);
    nextButton.addEventListener('click', playNextTrack);
    shuffleButton.addEventListener('click', toggleShuffle);
    repeatButton.addEventListener('click', toggleRepeat);
    
    // Heart icon click
    heartIcon.addEventListener('click', () => {
        if (currentTrack) {
            addToLovedSongs(currentTrack.id);
        }
    });
    
    // Volume control
    const volumeBar = document.querySelector('.volume-bar');
    volumeBar.addEventListener('click', (e) => {
        const rect = volumeBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const volume = x / rect.width;
        updateVolume(volume);
    });
}

// Update progress bar
function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    durationDisplay.textContent = formatTime(audio.duration);
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlayerControls();
}

// Play next track
function playNextTrack() {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[nextIndex].id);
}

// Play previous track
function playPreviousTrack() {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[prevIndex].id);
}

// Toggle shuffle
function toggleShuffle() {
    shuffleButton.classList.toggle('active');
}

// Toggle repeat
function toggleRepeat() {
    repeatButton.classList.toggle('active');
}

// Update volume
function updateVolume(volume) {
    audio.volume = volume;
    volumeSlider.style.width = `${volume * 100}%`;
    updateVolumeIcon(volume);
}

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update player controls
function updatePlayerControls() {
    playButton.innerHTML = isPlaying ? '<i class="fas fa-pause-circle"></i>' : '<i class="fas fa-play-circle"></i>';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
