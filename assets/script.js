var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video', {
        height: '100%',
        width: '100%',
        host: 'https://www.youtube-nocookie.com',
        videoId: 'slg_vxzfnus',
        events: {
            'onReady': onPlayerReady
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

let duration = 0;
function frame() {
    var state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.PAUSED) {
        if (duration === 0) {
            duration = player.getDuration();
        }

        setMarkerPosition(player.getCurrentTime());
        setLinePosition(player.getCurrentTime());
        setValues(player.getCurrentTime());
        setMiniMapPosition(player.getCurrentTime());
    }
    window.requestAnimationFrame(frame);
}

function setPlayerPosition(mark)
{
    player.seekTo(mark);
}

let map, marker,
    start = [46.696327, 11.151976],
    end = [46.702413, 11.131737];

$("document").ready(function() {
    var map = L.map('map');
    L.tileLayer('https://api.mapbox.com/styles/v1/{user}/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        user: 'jonas-tum',
        id: 'cjwg8opkd01rl1cqqd685odt4',
        accessToken: 'pk.eyJ1Ijoiam9uYXMtdHVtIiwiYSI6ImNqbm4yNGt2dzIyNHUzd29zaXdnZ2tnMzgifQ.dp77LW08dWvM3FD2olnfDg'
    }).addTo(map);

    map.fitBounds([start, end], {padding: [25, 25]});

    var icon = L.icon({
        iconUrl: 'assets/cablecar.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    marker = L.marker(start, {
        icon: icon
    });
    marker.addTo(map);

    window.setTimeout(function() {
        if(player.getPlayerState() !== YT.PlayerState.PLAYING && typeof player.playVideo === "function")
            player.playVideo();
    }, 10000);
});

function setMarkerPosition(mark)
{
    let time = Math.max(0, ((mark-8) / (duration-8)));
    marker.setLatLng([start[0] + (end[0] - start[0]) * time, start[1] + (end[1] - start[1]) * time]);
}

function setMiniMapPosition(mark)
{
    let gend = [4200, -1135];
    let time = Math.max(0, ((mark-8) / (duration-8)));
    $("#gondel").attr("transform", "translate(" + gend[0] * time + " " + gend[1] * time + ")");
}

let graphData = [
    {
        pop: 14,
        height: 697,
        temp: 24,
        time: 0
    },
    {
        pop: 14,
        height: 697,
        temp: 24,
        time: 8
    },
    {
        pop: 14,
        height: 1370,
        temp: 12,
        time: 301
    }
];

const width = 500;
const height = 200;

const x = d3.scaleLinear().domain([0, 301]).range([0, width]);
const y0 = d3.scaleLinear().domain([0, 400]).range([height, 0]);
const y1 = d3.scaleLinear().domain([10, 28]).range([height, 0]);
const y2 = d3.scaleLinear().domain([600, 1500]).range([height, 0]);
const line1 = d3.line().x(d => x(d.time)).y(d => y0(d.time));
const line2 = d3.line().x(d => x(d.time)).y(d => y1(d.pop));
const line3 = d3.line().x(d => x(d.time)).y(d => y1(d.temp));
const line4 = d3.line().x(d => x(d.time)).y(d => y2(d.height));

let tipBox, curTime, tooltipLine;
$("document").ready(function() {
    const chart = d3.select('#svgChart').append('g');

    tooltipLine = chart.append('line');
    curTime = chart
        .append('line')
        .attr('stroke', 'grey')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', height);

    chart
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'magenta')
        .attr('stroke-width', 3)
        .datum(graphData)
        .attr('d', line1);

    chart
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 3)
        .datum(graphData)
        .attr('d', line2);

    chart
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .datum(graphData)
        .attr('d', line3);

    chart
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 3)
        .datum(graphData)
        .attr('d', line4);

    chart
        .append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', height);

    chart
        .append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', height)
        .attr('y2', height);

    tipBox = chart.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip)
        .on('click', jumpTo);
});

function removeTooltip() {
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
}

let ifunc1 = d3.interpolateObject(graphData[0], graphData[1]);
let ifunc2 = d3.interpolateObject(graphData[1], graphData[2]);
function drawTooltip()
{
    const year = x.invert(d3.mouse(tipBox.node())[0]);
    //setValues(year);

    tooltipLine.attr('stroke', 'black')
        .attr('x1', x(year))
        .attr('x2', x(year))
        .attr('y1', 0)
        .attr('y2', height);
}

function setLinePosition(time)
{
    curTime
        .attr('x1', x(time))
        .attr('x2', x(time))
        .attr('y1', 0)
        .attr('y2', height);
}

function setValues(year)
{
    year = Math.round(year);

    let set;
    if(year <= 8)
        set = ifunc1(year / 301);
    else
        set = ifunc2((year-8) / 301);

    d3.select('#time').html(fmtMSS(year));
    d3.select('#height').html(Math.round(set.height));
    d3.select('#pop').html(Math.round(set.pop));
    d3.select('#temp').html(Math.round(set.temp));
}

function jumpTo()
{
    const year = Math.floor((x.invert(d3.mouse(tipBox.node())[0])));
    setPlayerPosition(year);
}

// https://stackoverflow.com/a/37770048
function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+Math.floor(s)}