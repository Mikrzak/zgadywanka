function UpdateMenu(){
    document.getElementById("roundsRangeLabel").innerText = " liczba rund: " + document.getElementById("roundsRange").value;
}

setInterval(UpdateMenu);