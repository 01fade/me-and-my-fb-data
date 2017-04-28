// OPTIMAL get rid of jquery
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import L from 'leaflet';
import $ from 'jquery';
import moment from 'moment';
import _ from 'lodash';
import '../style/leaflet.css';

class Security extends Component {
    constructor() {
        super();
        this.state = {
            section: "Active Sessions"
        };
        this.worldcenter = [20, 0];
        this.markers = [];
    }

    componentDidMount() {
        if ($("#map").length !== undefined) {
            this.startMap();
            this.upadateActiveOpt(this.state.section);
        }
    }

    componentWillUnmount() {
        $("#title li").off();
        $("#processingbar").text("");
        this.setState({section: ""})
    }

    changeSection(e) {
        console.log(e.target.innerHTML);
        this.setState({ section: e.target.innerHTML });
        this.upadateActiveOpt(e.target.innerHTML);
        this.parseActiveSessions(e.target.innerHTML);
    }

    upadateActiveOpt(sec) {
        const id = sec.replace(" ", "").toLowerCase();
        $("#title li").removeClass("active");
        $("#" + id).addClass("active");
    }

    getCurrentState() {
        return this.state.section;
    }

    addMarkers() {
        let marker1;
        const that = this;
        const sectionKey = this.state.section.replace(" ", "");
        const markersArray = this.state[sectionKey];
        const addMarker = function(index, sec) {
            let m = markersArray[index],
                iconclass = "green",
                icontext = "",
                icon = L.divIcon({
                    className: 'map-marker ' + iconclass,
                    iconSize: null,
                    html: '<div class="icon">' + icontext + '</div><div class="arrow" />'
                }),
                popup = "Location: " + m.country,
                animDur = 2000,
                tempLat = that.worldcenter[0],
                tempLng = that.worldcenter[1];

            if (index > 0) {
                tempLat = marker1._latlng.lat;
                tempLng = marker1._latlng.lng;
                marker1.remove();
            }

            let dist = that.latlngdistance(tempLat, tempLng, m.lat, m.long, 'M');
            animDur = dist > 10 ? Math.min(animDur, Math.round(dist * 3)) : 300;

            popup += m.region === "" ? "" : ", " + m.region;
            popup += m.city === "" ? "" : ", " + m.city;
            // popup += '<br>IP: [hidden]'; // PRIVACY
            popup += '<br>IP: ' + m.ip;
            popup += m.name === "undefined" ? "" : "<br>Label: " + m.name;
            popup += m.timestamp === "undefined" ? "" : "<br>Time: " + m.timestamp;

            that.myMap.flyTo([m.lat, m.long], 4, {
                "animate": true,
                "noMoveStart": true,
                "easeLinearity": 1,
                "pan": {
                    "duration": animDur / 1000
                }
            });

            marker1 = L.marker([m.lat, m.long], { icon: icon })
                .addTo(that.myMap)
                .bindPopup(popup, { maxWidth: 500 })
                .openPopup();

            if (index < markersArray.length - 1 && sec === that.getCurrentState()) {
                let delay = m.timestamp === "undefined" ? (animDur + 600) : (animDur + 1200);
                setTimeout(function() {
                    addMarker(index + 1, sec);
                }, delay);
            } else {
                marker1.remove();
                return;
            }
        };
        addMarker(0, this.state.section);
    }

    latlngdistance(lat1, lon1, lat2, lon2, unit) {
        let radlat1 = Math.PI * lat1 / 180;
        let radlat2 = Math.PI * lat2 / 180;
        let theta = lon1 - lon2;
        let radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);;
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") { dist *= 1.609344 };
        if (unit === "N") { dist *= 0.8684 };
        return dist;
    }


    makeReqs(arr, index) {
        const that = this;
        const url = 'http://freegeoip.net/json/' + arr[index].ip;
        $.getJSON(url).done(function(location, textStatus, jqXHR) {
            const t = arr[index].timestamp === undefined ? "undefined" : moment.unix(arr[index].timestamp).format("YYYY-MM-DD h:mma"),
                name = arr[index].name === undefined ? "undefined" : arr[index].name;
            that.markers.push({
                ip: location.ip,
                timestamp: t,
                name: name,
                country: location.country_name,
                region: location.region_name,
                city: location.city,
                lat: location.latitude,
                long: location.longitude
            });
            $("#processingbar").text(t + " " + location.ip + " " + arr[index].name + " " + location.country_name + " " + location.region_name + " " + location.city);
            $("#map").addClass("faded");
            index++;
            if (index < arr.length - 1) {
                setTimeout(() => that.makeReqs(arr, index), 10);
            } else {
                const name = that.state.section.replace(" ", "");
                const obj = {};
                obj[name] = that.markers;
                that.setState(obj);
                that.resetVars();
                that.addMarkers();
            }
            if (that.getCurrentState() === ""){
                return;
            }
        });
    }

    extractIpDate(elems) {
        const section = this.state.section;
        const activeSessions = [];
        const that = this;
        elems.filter(function() {
            return $(this).html().length > 0;
        }).each(function(i) {
            const listItem = $(this).html(),
                name = listItem.split("<p")[0],
                createdTimeAll = listItem.indexOf('Updated') > -1 ? listItem.match("Updated: (.*)IP Address")[1] : listItem.match("Created: (.*)IP Address")[1],
                createdTime = createdTimeAll.substring(createdTimeAll.indexOf(', ') + 1).replace(" at ", " ").replace("<br>", ""),
                createTimestamp = moment(createdTime, "MMMM D, YYYY h:ma").unix(),
                separateIP = section === "Administrative Records" ? "Cookie" : "Browser",
                ip = listItem.match("IP Address: (.*)" + separateIP)[1].replace("<br>", "");
            activeSessions.push({
                name: name,
                ip: ip,
                timestamp: createTimestamp
            });
        }).promise().done(function() {
            that.makeReqs(_.sortBy(activeSessions, ['timestamp']), 0);
        });
    }

    extractIp(elems) {
        const that = this;
        let ipaddresses = [];
        elems.each(function(i) {
            ipaddresses.push({
                ip: $(this).text()
            })
        }).promise().done(function() {
            that.makeReqs(ipaddresses, 0);
        });
    }


    parseActiveSessions(section) {
        $("#title li").off().removeClass("activeCursor");
        var html = $(this.props.data.html);
        const that = this;
        html.find("h2").each(function(i) {
            var el = $(this),
                elems = el.next("ul").find("li");
            if (el.text() === section) {
                if (section === "IP Addresses") {
                    that.extractIp(elems);
                } else {
                    that.extractIpDate(elems);
                }
            }
        });
    }

    resetVars(){
        $("#title li").on("click", this.changeSection.bind(this)).addClass("activeCursor");
        $("#processingbar").text("");
        $("#map").removeClass("faded");
        this.markers = [];
    }

    startMap() {
        this.myMap = L.map('map').setView(this.worldcenter, 2.8);
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
            // noWrap: true,
            maxZoom: 15,
            minZoon: 2,
            attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attribution">CARTO</a>'
        }).addTo(this.myMap);
        this.myMap.zoomControl.setPosition('bottomright');
        this.parseActiveSessions(this.state.section);
    }


    render() {
        console.log("Security: ", this.props.data);
        console.log(this.state);
        return (
          this.props.data === undefined ?
          <Redirect to="/" /> :
          <div className="content">
            <div id="title">
                <p><span>{this.props.username ? this.props.username : "facebook user"}</span></p>
                <ul>
                    <li id="activesessions">
                        <p>Active Sessions</p></li>
                    <li id="recognizedmachines">
                        <p>Recognized Machines</p></li>
                    <li id="ipaddresses">
                        <p>IP Addresses</p></li>
                    <li id="administrativerecords">
                        <p>Administrative Records</p></li>
                </ul>
                <p id="processingbar"></p>
            </div>
            <div id="map"></div>
          </div>
        );
    }
}

export default Security;
