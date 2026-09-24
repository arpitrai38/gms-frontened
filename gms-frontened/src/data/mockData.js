// System Configuration & Clean Defaults for Gym Management Platform
// Clean Data: Zero Dummy Members / Fake Payments

export const INITIAL_ROLES = {
  admin: {
    id: 'usr_admin',
    name: 'Alex Mercer (Admin)',
    email: 'admin@gym.com',
    role: 'Admin',
    title: 'Gym General Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  trainer: {
    id: 'usr_tr1',
    name: 'Viktor Vance (Head Coach)',
    email: 'trainer@gym.com',
    role: 'Trainer',
    title: 'Head S&C Coach',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
  },
  member: {
    id: 'mem_1',
    name: 'Alex Rivera',
    email: 'member@gym.com',
    role: 'Member',
    title: 'Gold Pro Athlete',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    plan: 'Gold Pro Athlete',
    membershipId: 'APX-1001',
  }
};

export const INITIAL_PLANS = [
  {
    id: 'plan_bronze',
    name: 'Bronze Standard',
    price: 49,
    billingPeriod: 'Monthly',
    popular: false,
    color: '#94A3B8',
    features: [
      'Access during regular gym hours (6AM - 10PM)',
      'General gym floor & free weights access',
      'Locker room & shower access',
      'Basic mobile app fitness tracker'
    ],
    activeMembers: 0,
  },
  {
    id: 'plan_silver',
    name: 'Silver Active',
    price: 89,
    billingPeriod: 'Monthly',
    popular: false,
    color: '#00F0FF',
    features: [
      '24/7 Unlimited Gym Access',
      'All cardio & strength zones',
      '2 Group fitness classes per month',
      'Free body composition analysis / quarter',
      'Hydration bar access'
    ],
    activeMembers: 0,
  },
  {
    id: 'plan_gold',
    name: 'Gold Pro Athlete',
    price: 139,
    billingPeriod: 'Monthly',
    popular: true,
    color: '#CCFF00',
    features: [
      '24/7 Multi-facility access',
      'Unlimited group fitness & HIIT classes',
      '1 Personal training session / month',
      'Sauna, ice bath & recovery lounge access',
      'Smart workout & diet planner sync',
      '1 Free guest pass per month'
    ],
    activeMembers: 1,
  },
  {
    id: 'plan_platinum',
    name: 'Platinum VIP Elite',
    price: 219,
    billingPeriod: 'Monthly',
    popular: false,
    color: '#A855F7',
    features: [
      'All Gold Pro benefits included',
      'Weekly 1-on-1 Personal Trainer session',
      'Customized monthly nutritionist diet plan',
      'Dedicated VIP locker & laundry service',
      'Free protein smoothie after every workout'
    ],
    activeMembers: 0,
  }
];

// Clean empty collections (Loaded dynamically from MongoDB backend)
export const INITIAL_TRAINERS = [];
export const INITIAL_MEMBERS = [];
export const INITIAL_PAYMENTS = [];
export const INITIAL_ATTENDANCE = [];
export const INITIAL_AUDIT_LOGS = [];
export const INITIAL_NOTIFICATIONS = [];

export const INITIAL_EXERCISES = [
  { id: 'ex_1', name: 'Barbell Back Squat', targetMuscle: 'Quadriceps / Glutes', equipment: 'Barbell & Rack', defaultSets: 4, defaultReps: '8-10', burnKcalPerSet: 22 },
  { id: 'ex_2', name: 'Incline Dumbbell Press', targetMuscle: 'Upper Chest', equipment: 'Dumbbells & Bench', defaultSets: 3, defaultReps: '10-12', burnKcalPerSet: 18 },
  { id: 'ex_3', name: 'Barbell Romanian Deadlift', targetMuscle: 'Hamstrings / Glutes', equipment: 'Barbell', defaultSets: 4, defaultReps: '8-10', burnKcalPerSet: 25 },
  { id: 'ex_4', name: 'Lat Pulldown (Neutral Grip)', targetMuscle: 'Lats / Upper Back', equipment: 'Cable Tower', defaultSets: 3, defaultReps: '12', burnKcalPerSet: 15 },
  { id: 'ex_5', name: 'Dumbbell Lateral Raise', targetMuscle: 'Lateral Deltoids', equipment: 'Dumbbells', defaultSets: 4, defaultReps: '15', burnKcalPerSet: 12 },
  { id: 'ex_6', name: 'Hanging Leg Raise', targetMuscle: 'Lower Abdominals', equipment: 'Pull-up Bar', defaultSets: 3, defaultReps: '15', burnKcalPerSet: 14 },
  { id: 'ex_7', name: 'Cable Rope Tricep Pushdown', targetMuscle: 'Triceps', equipment: 'Cable Tower', defaultSets: 3, defaultReps: '12-15', burnKcalPerSet: 12 },
  { id: 'ex_8', name: 'Incline Dumbbell Bicep Curl', targetMuscle: 'Biceps', equipment: 'Dumbbells & Bench', defaultSets: 3, defaultReps: '12', burnKcalPerSet: 12 },
];

export const INITIAL_ROUTINES = [
  {
    id: 'rout_1',
    title: 'Chest & Triceps Power Hypertrophy',
    level: 'Intermediate',
    durationMinutes: 55,
    caloriesEst: 460,
    tags: ['Hypertrophy', 'Smart Training', 'Upper Body'],
    exercises: [
      { id: 'ex_2', name: 'Incline Dumbbell Press', sets: 4, reps: 10, weightKg: 28, restSeconds: 75 },
      { id: 'ex_4', name: 'Lat Pulldown (Neutral Grip)', sets: 4, reps: 12, weightKg: 65, restSeconds: 60 },
      { id: 'ex_5', name: 'Dumbbell Lateral Raise', sets: 3, reps: 15, weightKg: 12, restSeconds: 45 },
      { id: 'ex_7', name: 'Cable Rope Tricep Pushdown', sets: 3, reps: 12, weightKg: 25, restSeconds: 45 }
    ]
  }
];

export const INITIAL_DIET = {
  macroTargets: {
    calories: 2600,
    protein: 180,
    carbs: 280,
    fats: 65
  },
  consumed: {
    calories: 1750,
    protein: 128,
    carbs: 190,
    fats: 45
  },
  waterTargetMl: 3500,
  waterConsumedMl: 1750,
  meals: [
    {
      id: 'meal_1',
      type: 'Breakfast',
      time: '08:00 AM',
      name: 'Power Oats & Whey Protein Bowl',
      calories: 520,
      protein: 42,
      carbs: 64,
      fats: 12,
      items: ['80g Rolled Oats', '1 Scoop Whey Isolate', '15g Almond Butter', '100g Blueberries']
    },
    {
      id: 'meal_2',
      type: 'Lunch',
      time: '01:00 PM',
      name: 'Flame-Grilled Chicken Breast & Quinoa Salad',
      calories: 640,
      protein: 55,
      carbs: 58,
      fats: 16,
      items: ['200g Chicken Breast', '150g Cooked Quinoa', 'Steamed Broccoli', '1 tbsp Extra Virgin Olive Oil']
    },
    {
      id: 'meal_3',
      type: 'Pre-Workout Snack',
      time: '04:30 PM',
      name: 'Greek Yogurt & Honey Rice Cakes',
      calories: 320,
      protein: 22,
      carbs: 38,
      fats: 5,
      items: ['170g 0% Greek Yogurt', '2 Brown Rice Cakes', '1 tbsp Raw Honey']
    },
    {
      id: 'meal_4',
      type: 'Dinner',
      time: '08:00 PM',
      name: 'Wild Salmon Fillet with Roasted Sweet Potato',
      calories: 570,
      protein: 46,
      carbs: 45,
      fats: 21,
      items: ['180g Wild Salmon', '200g Roasted Sweet Potato', 'Asparagus Spears', 'Lemon Herb Glaze']
    }
  ]
};

export const INITIAL_CLASSES = [
  {
    id: 'cls_1',
    name: 'HIIT Cardio Inferno',
    instructor: 'Viktor Vance',
    instructorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    room: 'Studio A (Crossfit Zone)',
    day: 'Monday & Wednesday',
    time: '07:00 AM - 07:45 AM',
    intensity: 'High',
    capacity: 20,
    bookedCount: 1,
    color: '#FF5733',
    isBookedByUser: true,
    description: 'High intensity interval training designed to push endurance, torch calories, and build functional athletic power.'
  },
  {
    id: 'cls_2',
    name: 'Power Vinyasa Yoga',
    instructor: 'Sarah Connor',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    room: 'Zen Recovery Hall',
    day: 'Tuesday & Thursday',
    time: '06:30 PM - 07:30 PM',
    intensity: 'Medium',
    capacity: 15,
    bookedCount: 0,
    color: '#00F0FF',
    isBookedByUser: false,
    description: 'Dynamic athletic flows paired with focused breathwork to boost mobility, hip flexor release, and mental clarity.'
  },
  {
    id: 'cls_3',
    name: 'Barbell Strength Camp',
    instructor: 'Viktor Vance',
    instructorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    room: 'Main Weight Floor',
    day: 'Friday & Saturday',
    time: '08:30 AM - 09:20 AM',
    intensity: 'Hard',
    capacity: 16,
    bookedCount: 0,
    color: '#A855F7',
    isBookedByUser: false,
    description: 'Form and power development on the big compound lifts: Squats, Deadlifts, and Overhead Presses.'
  }
];

export const INITIAL_PROGRESS = {
  currentWeight: 76.8,
  targetWeight: 74.0,
  startingWeight: 84.5,
  currentBodyFat: 15.8,
  targetBodyFat: 12.0,
  heightCm: 180,
  bmi: 23.7,
  muscleMassKg: 38.4,
  waterPercentage: 59.2,
  history: [
    { date: '2026-02-01', weight: 78.5, bodyFat: 17.5, chestCm: 101, waistCm: 83, armsCm: 38 },
    { date: '2026-03-01', weight: 76.8, bodyFat: 15.8, chestCm: 102, waistCm: 81, armsCm: 39 }
  ]
};
