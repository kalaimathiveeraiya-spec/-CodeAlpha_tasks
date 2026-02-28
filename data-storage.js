// Data storage for steps and workout tracking
class DataStorage {
    constructor() {
        this.storageKey = 'fitness_data';
    }

    // Save data to localStorage
    saveData(type, value, date = new Date().toDateString()) {
        let data = this.getData();
        if (!data[date]) data[date] = {};
        data[date][type] = value;
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Get all stored data
    getData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    // Get today's data
    getTodayData() {
        const data = this.getData();
        const today = new Date().toDateString();
        return data[today] || {};
    }

    // Save steps
    saveSteps(steps) {
        this.saveData('steps', steps);
    }

    // Save workout duration
    saveWorkout(minutes) {
        this.saveData('workout', minutes);
    }

    // Get today's steps
    getTodaySteps() {
        return this.getTodayData().steps || 0;
    }

    // Get today's workout
    getTodayWorkout() {
        return this.getTodayData().workout || 0;
    }
}

// Initialize storage
const storage = new DataStorage();

// Functions to update display
function updateStepDisplay() {
    const steps = storage.getTodaySteps();
    const stepElement = document.querySelector('.step-count');
    if (stepElement) stepElement.textContent = steps.toLocaleString();
}

function updateWorkoutDisplay() {
    const workout = storage.getTodayWorkout();
    const workoutElement = document.querySelector('.duration');
    if (workoutElement) workoutElement.textContent = `${workout} minutes`;
}

// Add step data
function addSteps(steps) {
    const current = storage.getTodaySteps();
    storage.saveSteps(current + parseInt(steps));
    updateStepDisplay();
}

// Add workout data
function addWorkout(minutes) {
    const current = storage.getTodayWorkout();
    storage.saveWorkout(current + parseInt(minutes));
    updateWorkoutDisplay();
}