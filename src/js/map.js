var L = require("leaflet");
var moment = require("moment");
var _ = require("lodash");

var myMap,
    worldcenter = [20, 0];

var section, username = "",
    activeSessions = [],
    ipaddresses = [],
    requests = [],
    markers = [];

function makeReqs(arr) {
    var count = 0;
    $("#title p").append(" [" + arr.length + "]");
    for (i = 0; i < arr.length; i++) {
        var url = 'http://freegeoip.net/json/' + arr[i].ip;
        requests.push($.getJSON(url).done(function(location, textStatus, jqXHR) {
            var t = arr[count].timestamp == undefined ? "undefined" : moment.unix(arr[count].timestamp).format("YYYY-MM-DD h:mma"),
                name = arr[count].name == undefined ? "undefined" : arr[count].name;
            markers.push({
                ip: location.ip,
                timestamp: t,
                name: name,
                country: location.country_name,
                region: location.region_name,
                city: location.city,
                lat: location.latitude,
                long: location.longitude
            })
            console.log(t, location.ip, arr[count].name, location.country_name, location.region_name, location.city);
            count++;
        }));
    }

    $.when.apply(undefined, requests).then(function() {
        addMarkers();
    });
}

function extractIpDate(elems) {
    elems.filter(function() {
        return $(this).html().length > 0;
    }).each(function(i) {
        var listItem = $(this).html(),
            name = listItem.split("<p")[0],
            createdTimeAll = listItem.indexOf('Updated') > -1 ? listItem.match("Updated: (.*)IP Address")[1] : listItem.match("Created: (.*)IP Address")[1],
            createdTime = createdTimeAll.substring(createdTimeAll.indexOf(', ') + 1).replace(" at ", " ").replace("<br>", ""),
            createTimestamp = moment(createdTime, "MMMM D, YYYY h:ma").unix(),
            separateIP = section == "Administrative Records" ? "Cookie" : "Browser",
            ip = listItem.match("IP Address: (.*)" + separateIP)[1].replace("<br>", "");
        activeSessions.push({
            name: name,
            ip: ip,
            timestamp: createTimestamp
        });
        console.log(activeSessions.length, name, ip, createdTime);
    }).promise().done(function() {
        console.log("get location from ips");
        makeReqs(_.sortBy(activeSessions, ['timestamp']));
    });
}

function extractIp(elems) {
    console.log(elems);
    elems.each(function(i) {
        ipaddresses.push({
            ip: $(this).text()
        })
    }).promise().done(function() {
        console.log("get location from ips")
        makeReqs(ipaddresses);
    });
}

function parseActiveSessions(data, section) {
    var html = $(data);
    username = html.find("h1").first().text();
    $("#title p").html(username + " > Security > <span>" + section + "</span>");
    html.find("h2").each(function(i) {
        var el = $(this),
            elems = el.next("ul").find("li");
        if (el.text() == section) {
            if (section == "IP Addresses") {
                extractIp(elems);
            } else {
                extractIpDate(elems);
            }
        }
    });
}

function startMap() {
    myMap = L.map('map').setView(worldcenter, 2.8);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        // noWrap: true,
        maxZoom: 15,
        minZoon: 2,
        attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attribution">CARTO</a>'
    }).addTo(myMap);

}

function addMarkers() {
    var marker1;
    var addMarker = function(index) {
        var m = markers[index],
            iconclass = "green",
            icontext = "",
            icon = L.divIcon({
                className: 'map-marker ' + iconclass,
                iconSize: null,
                html: '<div class="icon">' + icontext + '</div><div class="arrow" />'
            }),
            popup = "Location: " + m.country,
            animDur = 2000,
            tempLat = worldcenter[0],
            tempLng = worldcenter[1];

        if (index > 0) {
            tempLat = marker1._latlng.lat;
            tempLng = marker1._latlng.lng;
            marker1.remove();
        }

        var dist = latlngdistance(tempLat, tempLng, m.lat, m.long, 'M');
        animDur = dist > 10 ? Math.min(animDur, Math.round(dist * 3)) : 300;

        popup += m.region == "" ? "" : ", " + m.region;
        popup += m.city == "" ? "" : ", " + m.city;
        // popup += '<br>IP: [hidden]'; // PRIVACY
        popup += '<br>IP: ' + m.ip;
        popup += m.name == "undefined" ? "" : "<br>Label: " + m.name;
        popup += m.timestamp == "undefined" ? "" : "<br>Time: " + m.timestamp;

        myMap.flyTo([m.lat, m.long], 4, {
            "animate": true,
            "noMoveStart": true,
            "easeLinearity": 1,
            "pan": {
                "duration": animDur / 1000
            }
        });

        marker1 = L.marker([m.lat, m.long], { icon: icon })
            .addTo(myMap)
            .bindPopup(popup, { maxWidth: 500 })
            .openPopup();

        if (index < markers.length - 1) {
            var delay = m.timestamp == "undefined" ? (animDur + 600) : (animDur + 1200);
            setTimeout(function() {
                addMarker(index + 1);
            }, delay);
        }
    };
    addMarker(0);
}

function latlngdistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);;
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 };
    if (unit == "N") { dist = dist * 0.8684 };
    return dist;
}

$(document).ready(function() {
    console.log(">>> Me And My Facebook Data <<<");
    startMap();
    var urlParams = new URLSearchParams(window.location.search);
    $.get('../../html/security.htm').done(function(data) { // from html file go 2 levels up
        switch (urlParams.get('section')) {
            case "1":
                section = "Active Sessions"
                break;
            case "2":
                section = "Recognized Machines"
                break;
            case "3":
                section = "IP Addresses"
                break;
            case "4":
                section = "Administrative Records"
                break;
            default:
                section = "Active Sessions"
        }
        parseActiveSessions(data, section);
    });

});

// Security content
// Active Sessions
// Account Activity
// Recognized Machines
// Logins and Logouts
// Login Protection Data
// IP Addresses
// Datr Authentication Cookie Info
// Administrative Records

// http://stackoverflow.com/questions/4819060/allow-google-chrome-to-use-xmlhttprequest-to-load-a-url-from-a-local-file
