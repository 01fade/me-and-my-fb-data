var activeSessions = [],
    ipaddresses = [],
    requests = [],
    doneAlert = function() {
        console.log("All done.");
    };

function makeReqs(arr) {
    var count = 0;
    for (i = 0; i < arr.length; i++) {
        var url = 'http://freegeoip.net/json/' + arr[i].ip;
        requests.push($.getJSON(url).done(function(location, textStatus, jqXHR) {
            var t = moment.unix(arr[count].timestamp).format("YYYY-MM-DD h:ma");
            console.log(t, arr[count].ip, arr[count].name, location.country_name, location.region_name, location.city);
            count++;
        }));
    }

    $.when.apply(undefined, requests).then(function(results) { doneAlert() });
}

function extractIpDate(elems) {
    elems.each(function(i) {
        var listItem = $(this).html(),
            name = listItem.split("<p")[0],
            ip = listItem.match("IP Address: (.*)Browser")[1].replace("<br>", ""),
            createdTimeAll = listItem.indexOf('Updated') > -1 ? listItem.match("Updated: (.*)IP Address")[1] : listItem.match("Created: (.*)IP Address")[1],
            createdTime = createdTimeAll.substring(createdTimeAll.indexOf(', ') + 1).replace(" at ", " ").replace("<br>", ""),
            createTimestamp = moment(createdTime, "MMMM D, YYYY h:ma").unix();
        activeSessions.push({
            name: name,
            ip: ip,
            timestamp: createTimestamp
        });
        console.log(activeSessions.length, name, ip, createdTime);
    }).promise().done(function() {
        console.log("get location from ips")
        makeReqs(activeSessions);
    });
}

function extractIp(elems) {
    console.log(elems);
    elems.each(function(i){
        ipaddresses.push({
            ip: $(this).text()
        })
    }).promise().done(function() {
        console.log("get location from ips")
        makeReqs(ipaddresses);
    });
}

function parseActiveSessions(data, section) {
    $(data).find("h2").each(function(i) {
        var el = $(this);
        if (el.text() == section) {
            var elems = el.next("ul").find("li");
            if (section == "IP Addresses") {
                extractIp(elems);
            } else {
                extractIpDate(elems);
            }
        }
    });
}

$(document).ready(function() {
    console.log(">>> Me And My Facebook Data <<<");
    $("body").load('../html/security.htm');

    $.get('../html/security.htm').done(function(data) {
        // parseActiveSessions(data, "Active Sessions");
        // parseActiveSessions(data, "Recognized Machines");
        parseActiveSessions(data, "IP Addresses");
    });

})


 // Active Sessions
 // Account Activity
 // Recognized Machines
 // Logins and Logouts
 // Login Protection Data
 // IP Addresses
 // Datr Authentication Cookie Info
 // Administrative Records

// http://stackoverflow.com/questions/4819060/allow-google-chrome-to-use-xmlhttprequest-to-load-a-url-from-a-local-file
