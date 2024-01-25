// var uniqueTownArray = townArray;

// for(var i = 0; i < townArray.length; i++){
//     for(var j = 0; j < townArray.length; j++){
//         if(i == j)
//             continue;
        
//         try{
//             if(townArray[i].Name == townArray[j].Name){
//                 uniqueTownArray.splice(i,1);
//                 uniqueTownArray.splice(j,1);
//             }
//         }
//         catch{
//             //console.log(townArray[i], townArray[j]);
//         }
//     }
// }

// console.log(uniqueTownArray);

var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    // popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

var map;
var layerGroup = L.layerGroup();
var startGuesses = 0, mapMode, guessBonus = 0, rounds = 0, startRounds = 0, scoreSum = 0;
var usingIdData = true;
var distanceArray = [];
var saveTownIdArray = [];
var townIdArray = [];
var guesses;

function ResetGame(){


    saveTownIdArray = [];
    townIdArray = [];

    document.getElementById("map").style.setProperty("display","block");
    // document.getElementById("map").style.setProperty("justify-content","center");
    document.getElementById("mapToggles").style.setProperty("display","none");
    document.getElementById("modeToggles").style.setProperty("display","none");
    document.getElementById("titleText").style.setProperty("display","none");
    document.getElementById("refreshButton").style.setProperty("display","none");
    document.getElementById("menuDiv").style.setProperty("display","none");

    document.getElementById("playButton").setAttribute("onClick", "StartGame()" );
    document.getElementById("playButton").innerText = "Następna runda";

    var gameIdArray = document.getElementById("idInput").value.split(',').map(Number);
    
    if([1,2,3].includes(gameIdArray[0]) && [1,2,3].includes(gameIdArray[1]) &&  [1,2,3,4,5,6,7,8,9,10].includes(gameIdArray[2])){

        if(gameIdArray.length == gameIdArray[2] + 3){

            for(var i = 3; i < gameIdArray[2] + 3; i++){

                if(isNaN(gameIdArray[i]) || gameIdArray[i] < 0 || gameIdArray[i] >= townArray.length){
                    usingIdData = false;
                    break;
                }
            }
        }
        else
            usingIdData = false;
    }
    else
        usingIdData = false;

    if(usingIdData){

        mapMode = gameIdArray[0];
        startGuesses = gameIdArray[1];
        rounds = gameIdArray[2];
        startRounds = rounds;

        for(var i = 3; i < gameIdArray[2] + 3; i++){

            townIdArray.push(gameIdArray[i]);
        }
    }
    else{
        rounds = document.getElementById("roundsRange").value;
        startRounds = rounds;
    }

}

function StartGame(reset){

    if(reset)
        ResetGame();

    var index = -1;

    if(usingIdData){
        for(var i = 0; i < uniqueTownArray.length; i++){
            if(uniqueTownArray[i].Id == townIdArray[startRounds - rounds]){
                index = i;
                break;
            }
        }
        if(index == -1)
            index = Math.floor(Math.random() * uniqueTownArray.length);
    }
    else
        index = Math.floor(Math.random() * uniqueTownArray.length);

    var townLat = uniqueTownArray[index].Latitude;
    var townLon = uniqueTownArray[index].Longitude;

    var zoom = 6.5;
    //console.log(document.getElementById("map").clientWidth)

    try{
        map = L.map("map", {minZoom:zoom, maxZoom:zoom}).setView([52.06880141131436, 19.479684688924113], zoom);
    }
    catch{
        map = map.remove();
        map = L.map("map", {minZoom:zoom, maxZoom:zoom}).setView([52.06880141131436, 19.479684688924113], zoom);
        map.setView([52.06880141131436, 19.479684688924113], zoom);
        layerGroup.clearLayers();
        document.getElementById("guessInfoText").innerText = "";
        document.getElementById("townInfoText").innerText = "";
        //document.getElementById("guessInfoText").innerText = "";
    }

    if(!usingIdData){

        if(document.getElementById("modeToggle1").checked)
            startGuesses = 1;
        else if(document.getElementById("modeToggle2").checked)
            startGuesses = 2;
        else if(document.getElementById("modeToggle3").checked)
            startGuesses = 3;

        if(document.getElementById("mapToggle1").checked){
            L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
                maxZoom: 20,
                attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
            }).addTo(map);
            mapMode = 1;
        }
        else if(document.getElementById("mapToggle2").checked){
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);
            mapMode = 2;
        }
        else if(document.getElementById("mapToggle3").checked){
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            mapMode = 3;
        }
    }
    else{
        if(mapMode == 1){
            L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
                maxZoom: 20,
                attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
            }).addTo(map);
        }
        else if(mapMode == 2){
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);
        }
        else if(mapMode == 3){
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
        }
    }

    guesses = startGuesses;
    guessBonus = 0;

    document.getElementById("buttonDiv").style.setProperty("display","none");
    document.getElementById("sliderDiv").style.setProperty("display","none");
    document.getElementById("inputDiv").style.setProperty("display","none");

    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(map);

    L.DomUtil.addClass(map._container,'crosshair-cursor-enabled');

    map.on('click', function(e){

        if(guesses <= 0)
            return;

        var coord = e.latlng;
        var lat = coord.lat;
        var lon = coord.lng;

        var marker = L.marker([lat,lon]);
        layerGroup.addLayer(marker);
        map.addLayer(layerGroup);

        guesses--;

        document.getElementById("guessInfoText").innerText += "Twoja " + (startGuesses - guesses).toString() + " odpowiedź była \n" + Math.round(GetDistanceFromLatLonInKm(lat,lon,townLat,townLon) * 100)/100 + " km od celu \n \n";
        
        var dist = Math.round(GetDistanceFromLatLonInKm(lat,lon,townLat,townLon) * 100)/100;
        distanceArray.push(dist);

        var distScore;

        if(guesses == 0){
            // if(dist > 300)
            //     document.getElementById("guessInfoText").innerText += "Wynik: " + (Math.round((-distanceArray[distanceArray.length - 1] + 510) * 100)/100).toString() + " / 1000";
            // else
                //document.getElementById("guessInfoText").innerText += "Wynik: " + (Math.round((1000 * 1.6 ** (-distanceArray[distanceArray.length - 1]/65)) * 100)/100).toString() + " / 1000";
            distScore = (Math.round(1000 * Math.exp(-0.5 * (distanceArray[distanceArray.length - 1] / 167)**2)));

            document.getElementById("guessInfoText").innerText += "Wynik: " + distScore.toString() + " / 1000 pkt\n\n";
            
            if(startGuesses == 1){
                document.getElementById("guessInfoText").innerText += "Bonus za tryb +50%: " + Math.floor(distScore * 0.5) + "\n\n";
                guessBonus = distScore * 0.5;
            }
            else if(startGuesses == 2){
                document.getElementById("guessInfoText").innerText += "Bonus za tryb +20%: " + Math.floor(distScore * 0.2) + "\n\n";
                guessBonus = distScore * 0.2;
            }

            if(mapMode == 1){
                document.getElementById("guessInfoText").innerText += "Bonus za mapę +40%: " + Math.floor(distScore * 0.4) + " pkt\n\n Ostateczny wynik: " + Math.floor(distScore * 1.4 + guessBonus) + " pkt";
                scoreSum += distScore * 1.4 + guessBonus;
            }
            else if(mapMode == 2){
                document.getElementById("guessInfoText").innerText += "Bonus za mapę +25%: " + Math.floor(distScore * 0.25) + " pkt\n\n Ostateczny wynik: " + Math.floor(distScore * 1.25 + guessBonus) + " pkt";
                scoreSum += distScore * 1.25 + guessBonus;
            }
            else{
                document.getElementById("guessInfoText").innerText += "Ostateczny wynik: " + Math.floor(distScore + guessBonus) + " pkt";
                scoreSum += distScore + guessBonus;
            }
            
            document.getElementById("townInfoText").innerText = "Województwo " + uniqueTownArray[index].Province + "\n\n";
            document.getElementById("townInfoText").innerText += "Powiat " + uniqueTownArray[index].District + "\n\n";
            document.getElementById("townInfoText").innerText += "Gmina " + uniqueTownArray[index].Commune.split('-')[0] + "\n\n";

            var marker = L.marker([townLat,townLon], {icon: redIcon});
            layerGroup.addLayer(marker);
            map.addLayer(layerGroup);
            rounds--;
            
            saveTownIdArray.push(uniqueTownArray[index].Id);

            document.getElementById("buttonDiv").style = "position: absolute; top: " + (document.getElementById("guessInfoText").getBoundingClientRect().height + document.getElementById("guessInfoText").getBoundingClientRect().y) + "px;";
            document.getElementById("buttonDiv").style.setProperty("display","block");

            if(rounds == 0){
                document.getElementById("guessInfoText").innerText += "\n\n Wynik końcowy: " + Math.floor(scoreSum) + " pkt";
                document.getElementById("townInfoText").innerText += " Id gry: " + mapMode + "," + startGuesses + "," + document.getElementById("roundsRange").value + "," + saveTownIdArray;

                document.getElementById("playButton").setAttribute("onClick", "StartGame(true)" );
                document.getElementById("playButton").innerText = "Zagraj ponownie";
                document.getElementById("refreshButton").style.setProperty("display","block");
                distanceArray = [];
            }
        } //https://stackoverflow.com/questions/65351282/based-on-distance-away-from-a-coordinate-generate-score-lower-distance-away
    });

    function DegToRad(deg) {
        return deg * (Math.PI/180)
    }

    function GetDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) { //https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
        var R = 6371; // Radius of the earth in km
        var dLat = DegToRad(lat2-lat1);  // deg2rad below
        var dLon = DegToRad(lon2-lon1); 
        var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(DegToRad(lat1)) * Math.cos(DegToRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }

    document.getElementById("townText").innerText = startRounds - rounds + 1 + " / " + startRounds + " Miejscowość: " + uniqueTownArray[index].Name;

    if(uniqueTownArray[index].Type == "city")
        document.getElementById("townText").innerText += " (miasto)";
    else
        document.getElementById("townText").innerText += " (wieś)";
}
