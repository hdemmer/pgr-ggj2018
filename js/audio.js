
var playlist = new Map()
var noGuysTrack = null
var sirenTrack = null
var spawnTrack = null

function initTracks(tracks, callBack) {

    // onFinished = callBack

    // for (track of tracks) {
    //     console.log("loading track", track)
    //     var audio = createAudio("audio/" + track, { volume: 0.0, loop: true, muted: true }, onAudioLoaded) 
    // }
}

function createAudio(src, options, callback) {
   // var audio = document.createElement('audio');
   // audio.addEventListener('canplay', callback, false);
   // audio.volume = options.volume
   // audio.loop   = options.loop;
   // audio.preload = 'auto'
   // audio.src    = src;
   // return audio;
}

function startBackgroundMusic(trackName) {
    // createAudio("audio/"+trackName, { volume: 0.01, loop: true, muted: false }, function(event) {
    //     event.target.play()
    // }) 
}

function playSirenLoopIfNeeded() {

    // if (sirenTrack == null) {
    //     createAudio("audio/siren_loop.wav", { volume: 0.5, loop: true, muted: false }, function(event) {
    //         sirenTrack = event.target
    //         sirenTrack.play()
    //     }) 
    // }
}

function playSpawnSound() {

    // createAudio("audio/attract1.wav", { volume: 0.5, loop: false, muted: false }, function(event) {
    //     event.target.play()
    // }) 
}


function transmitNoGuysMusic() {

    // if (noGuysTrack == null) {
    //     createAudio("audio/bg.wav", { volume: 0.01, loop: true, muted: true }, function(event) {
    //         noGuysTrack = event.target
    //         if (! noGuysTrack.muted) {

    //             noGuysTrack.muted = false
    //             noGuysTrack.play()
    //             console.log("start music background playing")
    //         }
    //     }) 

    // } else {
    //     noGuysTrack.muted = false
    //     noGuysTrack.play()
    //     console.log("start music background stopped")
    // }

}

function stopTransmitNoGuysMusic() {
   
    // if (noGuysTrack != nul) {
    //     noGuysTrack.muted = true
    //     noGuysTrack.pause()
    // }
}

function onAudioLoaded(event) {
    
    // let track = event.target
    // let trackName = track.src.substr(track.src.lastIndexOf('/') + 1)
    
    // if (playlist.get(trackName) == undefined) {
        
    //     playlist.set(trackName, event.target)
    //     console.log("added audio source", trackName) 
    //     console.log(playlist.size)
    // } 

    // if (playlist.size == 4) {

    //     console.log("all audio loaded.")

    //     for (track of playlist.values()) {
    //         track.play()
    //         console.log("track " + track.src + " : volue " + track.volume)
    //     }
    // }
}

function setVolumeForTrack(track, volume) {

    // if (volume == 0.0) {
    //     track.volume = 0.0
    //     track.muted = true
    //     console.log("Muted ", track.src)

    // }
    // else {
    //     console.log("Pumping volume of ", track.src, " to ", volume)
    //     track.muted = false
    //     track.volume = volume
    // }
}

function toggleGuyTrack(trackName, on) {
    // let track = playlist.get(trackName)
    // console.log("Toggling ", trackName)
    // setVolumeForTrack(track, on?1.0:0.0)
}

function toggleAllGuys(guys, on) {

    // console.log("Toggling ", guys, " guys")
    // for (i = 0; i < guys; i++){

    //     toggleGuyTrack("track-"+i+".wav", on)
    // }
}

function updateAudioTransmission(guys) {

    // console.log("HEAHSJGHASJGHASJHGASJHGAJHGJHJSHG")
    // console.log("no guys track is :", noGuysTrack.paused? "paused" : "not pause")

    // if (noGuysTrack.paused != true) {

    //     noGuysTrack.muted = true
    //     noGuysTrack.pause()
    // }

    // toggleAllGuys(guys, true)
}

