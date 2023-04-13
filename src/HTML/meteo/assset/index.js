import geo from "./geo.js";

let compteur = 0
//ciblagebubule vent


const windicon = document.querySelector("body > div > div.bubule > div.bubule__right-vent > i")


//carroussel de donné
const meteo = setInterval(function () {

    compteur++;

    if (compteur > geo.length - 1) {
        compteur = 0;
    }
    //console.log(compteur);

    dynamique(geo[compteur].latti, geo[compteur].longi, geo[compteur].ville)

}, 5000);//<-modifie la vitesse de défillement


// affichage hrologe
const horloge = setInterval(myHorloge, 1000);
//transforme le code météo en phrase
function weathercode(code) {
    let result
    if (code < 1) {
        result = "Ciel clair"
        icon.className = 'wi wi-day-sunny'
    }

    else if (code === 1) {
        result = "Dégagé"
        icon.className = 'wi wi-day-sunny-overcast'
    }

    else if (code === 2) {
        result = "Nuageux"
        icon.className = 'wi wi-day-cloudy'
    }

    else if (code === 3) {
        result = "Couvert"
        icon.className = 'wi wi-cloud'
    }
    else if (code > 44 && code < 49) {
        result = "Brouillard"
        icon.className = 'wi wi-fog'
    }
    else if (code > 50 && code < 56) {
        result = "Bruine légère"
        icon.className = 'wi wi-sleet'
    }
    else if (code > 55 && code < 57) {
        result = "Bruine verglaçante"
        icon.className = 'wi wi-snowflake-cold'
    }
    else if (code > 60 && code < 66) {
        result = "Pluie faible"
        icon.className = 'wi wi-showers'
    }
    else if (code > 65 && code < 68) {
        result = "Pluie verglaçante"
        icon.className = 'wi wi-snowflake-cold'
    }
    else if (code > 70 && code < 76) {
        result = "Chute de neige"
        icon.className = 'wi wi-snow-wind'
    }
    else if (code === 77) {
        result = "Grains de neige"
        icon.className = 'wi wi-rain-mix'
    }
    else if (code > 79 && code < 83) {
        result = "Averse de pluie"
        icon.className = 'wi wi-rain'
    }
    else if (code > 84 && code < 87) {
        result = "Averse de neige"
        icon.className = 'wi wi-snow'
    }
    else if (code === 95) {
        result = "orage"
        icon.className = 'wi wi-lightning'
    }
    else if (code > 95 && code < 100) {
        result = "Orage avec grêle"
        icon.className = 'wi wi-storm-showers'
    }
    else { result = 'Inconnue' }
    return result
}
//transforme degrés en direction
function oneDirection(valeur) {
    
    if (valeur > 0 && valeur < 21) {
        
        windicon.setAttribute("class", 'wi wi-wind from-0-deg')
    }
    else if (valeur > 21 && valeur < 44) {
        
        windicon.setAttribute("class", 'wi wi-wind from-23-deg'
        )
    }
    else if (valeur > 44 && valeur < 66) {
        
        windicon.setAttribute("class", 'wi wi-wind from-45-deg'
        )
    }
    else if (valeur > 66 && valeur < 89) {
        
        windicon.setAttribute("class", 'wi wi-wind from-68-deg'
        )
    }
    else if (valeur > 89 && valeur < 112) {
       
        windicon.setAttribute("class", 'wi wi-wind from-90-deg'
        )
    }
    else if (valeur > 112 && valeur < 135) {
       
        windicon.setAttribute("class", 'wi wi-wind from-113-deg')
    }
    else if (valeur > 135 && valeur < 157) {
        
        windicon.setAttribute("class", 'wi wi-wind from-135-deg')
    }
    else if (valeur > 157 && valeur < 179) {
        
        windicon.setAttribute("class", 'wi wi-wind from-158-deg')
    }
    else if (valeur > 179 && valeur < 201) {
       
        windicon.setAttribute("class", 'wi wi-wind from-180-deg')
    }
    else if (valeur > 201 && valeur < 224) {
       
        windicon.setAttribute("class", 'wi wi-wind from-203-deg')
    }
    else if (valeur > 224 && valeur < 246) {
       
        windicon.setAttribute("class", 'wi wi-wind from-225-deg')
    }
    else if (valeur > 246 && valeur < 269) {
        
        windicon.setAttribute("class", 'wi wi-wind from-248-deg')
    }
    else if (valeur > 269 && valeur < 291) {
        
        windicon.setAttribute("class", 'wi wi-wind from-270-deg')
    }
    else if (valeur > 291 && valeur < 314) {
        
        windicon.setAttribute("class", 'wi wi-wind from-293-deg')
    }
    else if (valeur > 314 && valeur < 336) {
        
        windicon.setAttribute("class", 'wi wi-wind from-313-deg')
    }
    else if (valeur > 336 && valeur < 365) {
       
        windicon.setAttribute("class", 'wi wi-wind from-336-deg')
    }
    
    
}
//converti le format ISO8601 en string plus lissible
function convertISO(data) {
    let date = new Date(data);
    date = date.toUTCString()
    return date;

}
//recherche  et affichage de données météo
function dynamique(xx, yy, loc) {
    document.querySelector("#location").textContent = loc

    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + xx + "&longitude=" + yy + "&current_weather=true&timezone=auto")

        .then(trouve => trouve.json())
        .then(meteoDATA => {
            //console.table(meteoDATA)
            document.querySelector("#temp").textContent = meteoDATA.current_weather.temperature + " °C"
            document.querySelector("#coverage").textContent = weathercode(meteoDATA.current_weather.weathercode)
            document.querySelector("#vent").textContent = meteoDATA.current_weather.windspeed + " KM/H"
            oneDirection(meteoDATA.current_weather.winddirection)
            document.querySelector("#miseajour").textContent = "derniére mise à jour le " + convertISO(meteoDATA.current_weather.time)

        });

}
//calcul l'heure local
function myHorloge() {
    const date = new Date();
    document.getElementById("horloge").textContent = date.toLocaleTimeString();
}

