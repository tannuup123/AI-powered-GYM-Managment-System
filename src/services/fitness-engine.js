// Fitness Engine - Rule-based calculations (NO API calls)
// Handles calorie calculations, protein targets, BMI, etc.

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor
 */
export function calculateBMR(weight, height, age, gender = 'male') {
    if (gender === 'female') {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr, activityLevel = 'moderate') {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.55));
}

/**
 * Calculate daily calorie target based on goal
 */
export function calculateCalorieTarget(tdee, goal) {
    switch (goal) {
        case 'fat_loss':
        case 'weight_loss':
            return Math.round(tdee - 500); // 500 cal deficit
        case 'muscle_gain':
        case 'bulk':
            return Math.round(tdee + 300); // 300 cal surplus
        case 'maintenance':
        default:
            return tdee;
    }
}

/**
 * Calculate macros based on calorie target and goal
 */
export function calculateMacros(calories, goal, weight) {
    let proteinPerKg, fatPercent;

    switch (goal) {
        case 'fat_loss':
        case 'weight_loss':
            proteinPerKg = 2.2;
            fatPercent = 0.25;
            break;
        case 'muscle_gain':
        case 'bulk':
            proteinPerKg = 2.0;
            fatPercent = 0.25;
            break;
        default:
            proteinPerKg = 1.6;
            fatPercent = 0.30;
    }

    const protein = Math.round(weight * proteinPerKg);
    const fat = Math.round((calories * fatPercent) / 9);
    const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

    return { protein, fat, carbs };
}

/**
 * Calculate BMI
 */
export function calculateBMI(weight, heightCm) {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);

    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    return { value: Math.round(bmi * 10) / 10, category };
}

/**
 * Calculate daily water intake (liters)
 */
export function calculateWaterIntake(weight, activityLevel = 'moderate') {
    let base = weight * 0.033;
    if (activityLevel === 'active' || activityLevel === 'veryActive') {
        base += 0.5;
    }
    return Math.round(base * 10) / 10;
}

/**
 * Get fitness level description
 */
export function getFitnessLevel(experience) {
    const levels = {
        beginner: { label: 'Beginner', description: '0-6 months of training', setsPerExercise: 3, repsRange: '10-15' },
        intermediate: { label: 'Intermediate', description: '6 months - 2 years', setsPerExercise: 4, repsRange: '8-12' },
        advanced: { label: 'Advanced', description: '2+ years of training', setsPerExercise: 4, repsRange: '6-10' }
    };
    return levels[experience] || levels.beginner;
}

/**
 * Generate a quick fitness summary for display
 */
export function generateFitnessSummary(profile) {
    const { weight, height, age, gender, goal, activityLevel } = profile;

    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const calorieTarget = calculateCalorieTarget(tdee, goal);
    const macros = calculateMacros(calorieTarget, goal, weight);
    const bmi = calculateBMI(weight, height);
    const water = calculateWaterIntake(weight, activityLevel);

    return {
        bmr,
        tdee,
        calorieTarget,
        macros,
        bmi,
        water,
        goalLabel: getGoalLabel(goal)
    };
}

function getGoalLabel(goal) {
    const labels = {
        fat_loss: '🔥 Fat Loss',
        weight_loss: '🔥 Weight Loss',
        muscle_gain: '💪 Muscle Gain',
        bulk: '💪 Bulking',
        maintenance: '⚖️ Maintenance',
        general_fitness: '🏃 General Fitness'
    };
    return labels[goal] || '🏋️ Fitness';
}
