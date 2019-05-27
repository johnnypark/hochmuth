var viewportWidth = $(window).width();
var viewportHeight = $(window).height();

let speed_x = (viewportWidth / 70);
let speed_y = (viewportHeight / 105);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video', {
        height: '100%',
        width: '100%',
        host: 'https://www.youtube-nocookie.com',
        videoId: 'slg_vxzfnus',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {
            'controls': 0,
            'rel' : 0,
            'fs' : 0,
            'modestbranding': true
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    frame();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        console.log("playing");
    }
    if (event.data === YT.PlayerState.PAUSED) {
        console.log("paused");
    }
}

let duration = 0;
function frame() {
    var state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.PAUSED) {
        if (duration === 0) {
            duration = player.getDuration();
        }

        if(player.getCurrentTime() > 5 && player.getCurrentTime() < 40) {
            moveCablecar(player.getCurrentTime() - 5);
        }
        //console.log(player.getCurrentTime() + " of " + duration);
    }
    window.requestAnimationFrame(frame);
}

function moveCablecar(time) {
    $("#cablecar")
        .css("background-position",
            "bottom " + (-475 + speed_y * time) + "px " +
            "left " + (-2000 + speed_x * time) + "px");
}