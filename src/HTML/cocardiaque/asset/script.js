//fermeture boite respiration
const btnFermer = document.getElementById("close");

const boiteRespiration = document.querySelector(".container-respiration");

btnFermer.addEventListener("click", function () {
    boiteRespiration.classList.toggle("hidden")
    location.reload()
})
//ordre de respiration
const ordretext = document.querySelector(".ordre-respiration");

//compte a rebour
const rebour = document.querySelector(".rebour");

//selection de la durée
const duree = document.getElementById("duree");

//au démarrage
const btnStart = document.getElementById("btnStart");

//selection du mode
const mode = document.getElementById("mode");

//delection barre
const barre = document.querySelector(".barre-respiration")

//ciblage lecteur mp3
const player = document.querySelector('#audioPlayer');






btnStart.addEventListener("click", function () {
    event.preventDefault()

    let leTemp = duree.value
    refresh(leTemp)

    if (mode.value > 0) {
        beegees()
        console.log("mode beegees activé");


    } else {

    }
    if (leTemp > 0) {
        //on affiche la boite
        boiteRespiration.classList.toggle("hidden")
        altern()
        // pour répéter mon alternance de texte toute les 10
        setInterval(() => {

            altern()
        }, 10000);
        dureeaffichage(leTemp)
        decompte(leTemp)


    } else {
        console.log('durée non sélectionné');
        window.alert("choisir une durée");
    }
})

// pour  que j'affiche inspirez
function inspire() {
    ordretext.textContent = "inspirez"
}
// pour que jaffiche expirez
function expire() {
    ordretext.textContent = "expirez"
}
// pour a alterné toutes les 5
function altern() {
    inspire()
    setTimeout(() => {
        expire()
    }, 5000);
}

function dureeaffichage(para1) {

    // au bout de x minute
    setTimeout(() => {
        //on referme la boite
        boiteRespiration.classList.toggle("hidden")
        console.log("fini");


    }, para1 * 60000);
}


function decompte(para2) {

    const departMinutes = para2
    let temps = departMinutes * 60

    setInterval(() => {
        let minutes = parseInt(temps / 60, 10)
        let secondes = parseInt(temps % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        secondes = secondes < 10 ? "0" + secondes : secondes

        rebour.textContent = minutes + " : " + secondes
        temps = temps <= 0 ? 0 : temps - 1
    }, 1000)

}

function refresh(para) {
    setTimeout(() => {
        location.reload()
    }, para * 60000);
}

function beegees() {
    barre.style.animation = '0.5s linear infinite alternate tempo'
    ordretext.style.animation = "0.1s linear infinite alternate battement"
    player.play();
}











