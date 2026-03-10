/* PAGE NAVIGATION */

function showPage(page){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
document.getElementById(page).classList.add("active")
document.querySelector(".menu").classList.remove("show")
}

function toggleMenu(){
document.querySelector(".menu").classList.toggle("show")
}


/* =========================
ORBIT CALCULATOR
========================= */

function calculateOrbit(){

let planetName=document.getElementById("planet").value
let altitude=parseFloat(document.getElementById("altitude").value)

let planet=planets[planetName]

let r=planet.radius+altitude
let v=Math.sqrt(planet.mu/r)
let period=2*Math.PI*Math.sqrt(Math.pow(r,3)/planet.mu)/60

document.getElementById("orbitResult").innerHTML=
`Velocity: ${v.toFixed(2)} km/s <br>
Period: ${period.toFixed(2)} minutes`

drawOrbit(planetName)

}


/* =========================
ORBIT VISUALIZER
========================= */

function drawOrbit(planetName){

let canvas=document.getElementById("orbitCanvas")
let ctx=canvas.getContext("2d")

canvas.width=500
canvas.height=500

let centerX=250
let centerY=250
let orbitRadius=150
let angle=0

function animate(){

ctx.clearRect(0,0,500,500)

ctx.beginPath()
ctx.arc(centerX,centerY,orbitRadius,0,Math.PI*2)
ctx.strokeStyle="white"
ctx.lineWidth=2
ctx.stroke()

ctx.beginPath()
ctx.arc(centerX,centerY,15,0,Math.PI*2)
ctx.fillStyle=planets[planetName].color
ctx.fill()

let x=centerX+orbitRadius*Math.cos(angle)
let y=centerY+orbitRadius*Math.sin(angle)

ctx.beginPath()
ctx.arc(x,y,6,0,Math.PI*2)
ctx.fillStyle="red"
ctx.fill()

angle+=0.02

requestAnimationFrame(animate)

}

animate()

}



/* =========================
REAL ISS TRACKER
========================= */

const issCanvas=document.getElementById("issTracker")
const issCtx=issCanvas.getContext("2d")

issCanvas.width=700
issCanvas.height=350

let issLat=0
let issLon=0

const worldMap=new Image()
worldMap.src="assets/worldmap.jpeg"


/* ISS ORBIT PARAMETERS */

const inclination = 51.64 * Math.PI/180
const earthRotation = 360 / 86164
const orbitalPeriod = 92 * 60


async function fetchISS(){

try{

let res=await fetch("https://api.wheretheiss.at/v1/satellites/25544")
let data=await res.json()

issLat=data.latitude
issLon=data.longitude

document.getElementById("issData").innerHTML=
`Latitude: ${data.latitude.toFixed(2)}°<br>
Longitude: ${data.longitude.toFixed(2)}°<br>
Altitude: ${data.altitude.toFixed(2)} km<br>
Speed: ${data.velocity.toFixed(0)} km/h`

}catch(e){
console.log("ISS API error")
}

}



/* DRAW REAL ORBIT PATH */

function drawISS(){

issCtx.clearRect(0,0,700,350)

issCtx.drawImage(worldMap,0,0,700,350)



/* ORBIT PREDICTION */

issCtx.beginPath()
issCtx.strokeStyle="lime"
issCtx.lineWidth=2

let startLon = issLon
let startLat = issLat

for(let t=0; t<5400; t+=60){

let phase = (t/orbitalPeriod)*2*Math.PI

let lat = Math.asin(Math.sin(inclination)*Math.sin(phase)) * 180/Math.PI

let lon = startLon + (t/orbitalPeriod)*360 - earthRotation*t

if(lon>180) lon-=360
if(lon<-180) lon+=360

let x=(lon+180)*(700/360)
let y=(90-lat)*(350/180)

if(t===0){
issCtx.moveTo(x,y)
}else{
issCtx.lineTo(x,y)
}

}

issCtx.stroke()



/* DRAW ISS POSITION */

let x=(issLon+180)*(700/360)
let y=(90-issLat)*(350/180)

issCtx.beginPath()
issCtx.arc(x,y,7,0,Math.PI*2)
issCtx.fillStyle="red"
issCtx.fill()



requestAnimationFrame(drawISS)

}



setInterval(fetchISS,5000)
fetchISS()

worldMap.onload=drawISS




/* =========================
LEARN TAB
========================= */

function calculateWeight(){

let w=parseFloat(document.getElementById("weight").value)
let result=""

for(let p in planets){

let newWeight=w*(planets[p].gravity/9.8)

result+=p.toUpperCase()+": "+newWeight.toFixed(1)+" kg\n"

}

document.getElementById("weightResult").innerText=result

}


function checkAnswer(ans){

if(ans==="jupiter"){
document.getElementById("quizResult").innerText="Correct!"
}else{
document.getElementById("quizResult").innerText="Wrong Answer"
}

}


const facts=[
"ISS circles Earth every 90 minutes",
"Light from Sun reaches Earth in 8 minutes",
"Jupiter could fit 1300 Earths",
"Saturn could float in water"
]

function randomFact(){
document.getElementById("fact").innerText=facts[Math.floor(Math.random()*facts.length)]
}