/*var viewportWidth = $(window).width();
var viewportHeight = $(window).height();

let speed_x = (viewportWidth / 70);
let speed_y = (viewportHeight / 105);*/

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
            'modestbranding': true,
            'showinfo': 0
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

        /*if(player.getCurrentTime() > 5 && player.getCurrentTime() < 40) {
            moveCablecar(player.getCurrentTime() - 5);
        }
        if(player.getCurrentTime() > 40 && player.getCurrentTime() < duration - 40) {
            moveLayer1(player.getCurrentTime() - 40);
        }*/

        //console.log(player.getCurrentTime() + " of " + duration);
    }
    window.requestAnimationFrame(frame);
}

function setPlayerPosition(mark)
{
    player.seekTo(mark);
}

var map;
$("document").ready(function() {
    var map = L.map('map').setView([51.505, -0.09], 13);
    //https://api.mapbox.com/styles/v1/jonas-tum/cjwg8opkd01rl1cqqd685odt4/wmts?access_token=pk.eyJ1Ijoiam9uYXMtdHVtIiwiYSI6ImNqbm4yNGt2dzIyNHUzd29zaXdnZ2tnMzgifQ.dp77LW08dWvM3FD2olnfDg
    L.tileLayer('https://api.mapbox.com/styles/v1/{user}/{id}/wmts?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        user: 'jonas-tum',
        id: 'cjwg8opkd01rl1cqqd685odt4',
        accessToken: 'pk.eyJ1Ijoiam9uYXMtdHVtIiwiYSI6ImNqbm4yNGt2dzIyNHUzd29zaXdnZ2tnMzgifQ.dp77LW08dWvM3FD2olnfDg'
    }).addTo(map);
});


/*function moveCablecar(time)
{
   ("#cablecar")
       .css("background-position",
           "bottom " + (-475 + speed_y * time) + "px " +
           "left " + (-2000 + speed_x * time) + "px");
}

function moveLayer1(time)
{
    $("#layer1")
        .css("background-position",
            "bottom " + (-speed_y * time) + "px " +
            "left " + (-20 - speed_x * time) + "px");
}*/