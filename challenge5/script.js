let locations;

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setUserPosition, handleLocationError, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
    } else {
        displayMessage("Geolocatie wordt niet ondersteund door deze browser.");
    }
}

function setUserPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map).bindPopup("Je bent hier!");

    
    locations = {
        "Eiffel Tower": { country: "Frankrijk", capital: "Parijs", coords: [48.8584, 2.2945] },
        "Statue of Liberty": { country: "Verenigde Staten", capital: "Washington D.C.", coords: [40.6892, -74.0445] },
        "Colosseum": { country: "Italië", capital: "Rome", coords: [41.8902, 12.4922] },
        "Londen Eye": { country: "Verenigd Koninkrijk", capital: "Londen", coords: [51.5033, -0.1195] }
        
    };

    
    Object.keys(locations).forEach(function (location) {
        const locationData = locations[location];
        const marker = L.marker(locationData.coords).addTo(map).bindPopup(location);
        marker.on('click', function() {
            map.once('locationfound', function(e) {
                const userLocation = e.latlng;
                const distance = calculateDistance(locationData.coords[0], locationData.coords[1], userLocation.lat, userLocation.lng);
                if (distance <= 50) { 
                    askQuestion(location);
                } else {
                    displayMessage("Je bent nog niet dicht genoeg bij deze locatie om een vraag te krijgen.");
                }
            });
            map.locate();
        });
    });
}

function handleLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            displayMessage("Gebruiker heeft geen toestemming gegeven voor geolocatie.");
            break;
        case error.POSITION_UNAVAILABLE:
            displayMessage("Locatie-informatie is niet beschikbaar.");
            break;
        case error.TIMEOUT:
            displayMessage("Het verzoek om gebruikerslocatie heeft de time-out bereikt.");
            break;
        case error.UNKNOWN_ERROR:
            displayMessage("Er is een onbekende fout opgetreden bij het verkrijgen van de locatie.");
            break;
    }
}

function askQuestion(location) {
    const locationData = locations[location];
    const question = `Wat is de hoofdstad van ${locationData.country}?`;
    const answers = getAnswers(locationData.capital);

    const questionElement = document.createElement('div');
    questionElement.classList.add('question'); 
    questionElement.textContent = question;

    const answersList = document.createElement('ul');
    answersList.classList.add('answers'); 

    answers.forEach((answer, index) => {
        const answerItem = document.createElement('li');
        answerItem.textContent = answer;
        answerItem.setAttribute('onclick', `checkAnswer(${index}, '${locationData.capital}')`);
        answersList.appendChild(answerItem);
    });

    questionElement.appendChild(answersList);

    document.body.appendChild(questionElement);
}

function checkAnswer(index, correctAnswer) {
    const selectedAnswer = document.querySelectorAll('ul li')[index].innerText;
    if (selectedAnswer === correctAnswer) {
        displayMessage("Correct antwoord! +1 punt");
    } else {
        displayMessage("Incorrect antwoord!");
    }
 
    const questionElement = document.querySelector('ul');
    questionElement.remove();
}


function getAnswers(correctAnswer) {
    const answers = [correctAnswer];
    const capitals = Object.values(locations).map(location => location.capital);
    while (answers.length < 3) {
        const randomCapital = capitals[Math.floor(Math.random() * capitals.length)];
        if (!answers.includes(randomCapital)) {
            answers.push(randomCapital);
        }
    }
    return shuffleArray(answers);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; 
    return d * 1000; 
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message'); 
    document.body.appendChild(messageElement);
    setTimeout(function() {
        messageElement.remove();
    }, 5000); 
}


window.onload = getUserLocation;