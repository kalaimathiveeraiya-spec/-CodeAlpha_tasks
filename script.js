let fitnessData = JSON.parse(localStorage.getItem('fitnessData')) || [];
let waterIntake = parseInt(localStorage.getItem('waterIntake')) || 0;
let favoriteQuotes = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];

if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
}

function addData() {
    let steps = parseInt(document.getElementById("steps").value) || 0;
    let workout = parseInt(document.getElementById("workout").value) || 0;
    let calories = parseInt(document.getElementById("calories").value) || 0;
    
    let data = { steps, workout, calories };

    fitnessData.push(data);
    localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
    
    document.getElementById("steps").value = "";
    document.getElementById("workout").value = "";
    document.getElementById("calories").value = "";
    
    updateDashboard();
    checkGoals(steps, workout);
}

const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Push yourself because no one else is going to do it for you.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Take care of your body. It's the only place you have to live."
];

const gradients = [
    "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
    "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
    "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
    "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)"
];

function newQuote() {
    const random = Math.floor(Math.random() * quotes.length);
    const randomGradient = Math.floor(Math.random() * gradients.length);
    document.getElementById("quote").textContent = quotes[random];
    document.body.style.background = gradients[randomGradient];
}

function checkGoals(steps, workout) {
    let msg = "";
    if (steps < 10000) msg += `👉 Keep going! ${10000 - steps} more steps to reach your 10,000 goal.\n`;
    else msg += "✅ Steps goal achieved!\n";
    if (workout < 30) msg += `👉 ${30 - workout} more minutes to reach your 30-min workout goal.`;
    else msg += "✅ Workout goal achieved!";
    document.getElementById("reminder").textContent = msg;
}

function updateDashboard() {
    if (!fitnessData.length) {
        document.getElementById("todaySteps").textContent = "0";
        document.getElementById("todayWorkout").textContent = "0";
        document.getElementById("todayCalories").textContent = "0";
        document.getElementById("weekSteps").textContent = "0";
        document.getElementById("weekWorkout").textContent = "0";
        document.getElementById("weekCalories").textContent = "0";
        document.getElementById("stepsBar").style.width = "0%";
        document.getElementById("workoutBar").style.width = "0%";
        document.getElementById("goalStatus").innerHTML = "0/2 Goals<br>✅ Achieved";
        return;
    }
    
    let today = fitnessData[fitnessData.length - 1];
    let weekData = fitnessData.slice(-7);
    
    let weekSteps = weekData.reduce((sum, d) => sum + parseInt(d.steps || 0), 0);
    let weekWorkout = weekData.reduce((sum, d) => sum + parseInt(d.workout || 0), 0);
    let weekCalories = weekData.reduce((sum, d) => sum + parseInt(d.calories || 0), 0);
    
    document.getElementById("todaySteps").textContent = today.steps;
    document.getElementById("todayWorkout").textContent = today.workout;
    document.getElementById("todayCalories").textContent = today.calories;
    
    document.getElementById("weekSteps").textContent = weekSteps;
    document.getElementById("weekWorkout").textContent = weekWorkout;
    document.getElementById("weekCalories").textContent = weekCalories;
    
    let stepsPercent = Math.min((today.steps / 10000) * 100, 100);
    let workoutPercent = Math.min((today.workout / 30) * 100, 100);
    document.getElementById("stepsBar").style.width = stepsPercent + "%";
    document.getElementById("workoutBar").style.width = workoutPercent + "%";
    
    let goalsAchieved = (stepsPercent >= 100 ? 1 : 0) + (workoutPercent >= 100 ? 1 : 0);
    document.getElementById("goalStatus").innerHTML = `${goalsAchieved}/2 Goals<br>✅ Achieved`;
}

updateDashboard();
newQuote();
updateWater();

function addWater() {
    waterIntake++;
    localStorage.setItem('waterIntake', waterIntake);
    updateWater();
}

function resetWater() {
    waterIntake = 0;
    localStorage.setItem('waterIntake', waterIntake);
    updateWater();
}

function updateWater() {
    document.getElementById('waterCount').textContent = waterIntake;
    let waterPercent = Math.min((waterIntake / 8) * 100, 100);
    document.getElementById('waterBar').style.width = waterPercent + '%';
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    document.querySelector('button[onclick="toggleDarkMode()"]').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.querySelector('button[onclick="toggleDarkMode()"]').textContent = '☀️ Light Mode';
}

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const btn = document.querySelector('button[onclick="toggleMusic()"]');
    if (music.paused) {
        music.play();
        btn.textContent = '🔇 Mute';
    } else {
        music.pause();
        btn.textContent = '🎵 Music';
    }
}

function saveQuote() {
    const quote = document.getElementById('quote').textContent;
    if (!favoriteQuotes.includes(quote)) {
        favoriteQuotes.push(quote);
        localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
        displayFavorites();
        alert('❤️ Quote saved!');
    } else {
        alert('Quote already saved!');
    }
}

function displayFavorites() {
    const list = document.getElementById('favoriteQuotes');
    list.innerHTML = '';
    favoriteQuotes.forEach((q, i) => {
        list.innerHTML += `<li style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 8px;">${q} <button onclick="removeFavorite(${i})" style="background: red; padding: 5px 10px;">❌</button></li>`;
    });
}

function removeFavorite(index) {
    favoriteQuotes.splice(index, 1);
    localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
    displayFavorites();
}

function shareWhatsApp() {
    const quote = document.getElementById('quote').textContent;
    const url = `https://wa.me/?text=${encodeURIComponent(quote)}`;
    window.open(url, '_blank');
}

function copyQuote() {
    const quote = document.getElementById('quote').textContent;
    navigator.clipboard.writeText(quote).then(() => {
        alert('📋 Quote copied to clipboard!');
    });
}

function downloadQuote() {
    const quote = document.getElementById('quote').textContent;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = quote.split(' ');
    let line = '';
    let y = 200;
    words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > 700) {
            ctx.fillText(line, 400, y);
            line = word + ' ';
            y += 40;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, 400, y);
    
    const link = document.createElement('a');
    link.download = 'quote.png';
    link.href = canvas.toDataURL();
    link.click();
}

displayFavorites();