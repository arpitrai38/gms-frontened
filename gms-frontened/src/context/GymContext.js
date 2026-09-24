import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_ROLES,
  INITIAL_PLANS,
  INITIAL_EXERCISES,
  INITIAL_ROUTINES,
  INITIAL_DIET,
  INITIAL_CLASSES,
  INITIAL_PROGRESS
} from '../data/mockData';
import {
  authAPI,
  membersAPI,
  trainersAPI,
  plansAPI,
  paymentsAPI,
  attendanceAPI,
  workoutsAPI,
  dietsAPI,
  classesAPI,
  notificationsAPI,
  auditLogsAPI
} from '../services/api';

const GymContext = createContext();

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};

export const GymProvider = ({ children }) => {
  // Current logged in user (null by default if not logged in -> shows Home Page)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fitflow_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeMemberModal, setActiveMemberModal] = useState(null);

  // Entities state
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [payments, setPayments] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [routines, setRoutines] = useState(INITIAL_ROUTINES);
  const [exercises] = useState(INITIAL_EXERCISES);
  const [diet, setDiet] = useState(INITIAL_DIET);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Clear legacy mock data caches from localStorage on version update
  useEffect(() => {
    const CACHE_KEY = 'fitflow_clean_v2_mongo';
    if (!localStorage.getItem(CACHE_KEY)) {
      localStorage.removeItem('fitflow_members');
      localStorage.removeItem('fitflow_trainers');
      localStorage.removeItem('fitflow_payments');
      localStorage.removeItem('fitflow_attendance');
      localStorage.removeItem('fitflow_audit_logs');
      localStorage.removeItem('fitflow_notifications');
      localStorage.setItem(CACHE_KEY, 'true');
    }
  }, []);

  // Fetch live data from MongoDB backend
  const fetchAllData = useCallback(async () => {
    try {
      // 1. Members
      const memRes = await membersAPI.getAll();
      if (memRes.success && Array.isArray(memRes.data)) {
        setMembers(memRes.data);
        setIsBackendConnected(true);
      }

      // 2. Trainers
      const trRes = await trainersAPI.getAll();
      if (trRes.success && Array.isArray(trRes.data)) {
        setTrainers(trRes.data);
      }

      // 3. Plans
      const plansRes = await plansAPI.getAll();
      if (plansRes.success && Array.isArray(plansRes.data) && plansRes.data.length > 0) {
        setPlans(plansRes.data);
      }

      // 4. Payments
      const payRes = await paymentsAPI.getAll();
      if (payRes.success && Array.isArray(payRes.data)) {
        setPayments(payRes.data);
      }

      // 5. Attendance
      const attRes = await attendanceAPI.getAll();
      if (attRes.success && Array.isArray(attRes.data)) {
        setAttendanceLogs(attRes.data);
      }

      // 6. Classes
      const clsRes = await classesAPI.getAll(currentUser?.memberProfile?._id || currentUser?.id);
      if (clsRes.success && Array.isArray(clsRes.data)) {
        setClasses(clsRes.data);
      }

      // 7. Notifications
      const notifRes = await notificationsAPI.getAll();
      if (notifRes.success && Array.isArray(notifRes.data)) {
        setNotifications(notifRes.data);
      }

      // 8. Audit Logs
      const logsRes = await auditLogsAPI.getAll();
      if (logsRes.success && Array.isArray(logsRes.data)) {
        setAuditLogs(logsRes.data);
      }

      // 9. If member logged in, fetch personal workout & diet
      if (currentUser?.role === 'Member') {
        const memId = currentUser.memberProfile?._id || currentUser.id;
        const woRes = await workoutsAPI.get(memId);
        if (woRes.success && Array.isArray(woRes.data) && woRes.data.length > 0) {
          setRoutines(woRes.data);
        }

        const dtRes = await dietsAPI.get(memId);
        if (dtRes.success && dtRes.data) {
          setDiet({
            macroTargets: {
              calories: dtRes.data.dailyCalories || 2400,
              protein: dtRes.data.protein || 160,
              carbs: dtRes.data.carbs || 250,
              fats: dtRes.data.fats || 60
            },
            consumed: {
              calories: 1750,
              protein: 120,
              carbs: 180,
              fats: 45
            },
            waterTargetMl: dtRes.data.waterTargetMl || 3500,
            waterConsumedMl: dtRes.data.waterConsumedMl || 0,
            meals: dtRes.data.meals || []
          });
        }
      }
    } catch (err) {
      console.warn('Backend sync warning:', err.message);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fitflow_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fitflow_user');
    }
  }, [currentUser]);

  // Auth: Login
  const login = async (email, password, role) => {
    try {
      const res = await authAPI.login(email, password, role);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        if (res.user.role === 'Admin') {
          setActiveTab('dashboard');
        } else if (res.user.role === 'Trainer') {
          setActiveTab('trainer-home');
        } else if (res.user.role === 'Member') {
          setActiveTab('trainee-home');
        }
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Auth: Register New Trainee
  const registerTrainee = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setActiveTab('trainee-home');
        fetchAllData();
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Auth: Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fitflow_user');
    setActiveTab('dashboard');
  };

  // Switch role for test / dev demo
  const switchRole = (roleKey) => {
    const user = INITIAL_ROLES[roleKey.toLowerCase()] || INITIAL_ROLES.admin;
    setCurrentUser(user);
    if (user.role === 'Admin') setActiveTab('dashboard');
    if (user.role === 'Trainer') setActiveTab('trainer-home');
    if (user.role === 'Member') setActiveTab('trainee-home');
  };

  // Member CRUD
  const addMember = async (memberData) => {
    try {
      const res = await membersAPI.create(memberData);
      if (res.success && res.data) {
        setMembers(prev => [res.data, ...prev]);
        fetchAllData();
        return res.data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateMember = async (id, updatedFields) => {
    try {
      const res = await membersAPI.update(id, updatedFields);
      if (res.success && res.data) {
        setMembers(prev => prev.map(m => (m._id === id || m.id === id) ? res.data : m));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMember = async (id) => {
    try {
      await membersAPI.delete(id);
      setMembers(prev => prev.filter(m => m._id !== id && m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Trainer CRUD
  const addTrainer = async (trainerData) => {
    try {
      const res = await trainersAPI.create(trainerData);
      if (res.success && res.data) {
        setTrainers(prev => [...prev, res.data]);
        return res.data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Payments & Billing
  const recordPayment = async (paymentData) => {
    try {
      const res = await paymentsAPI.create(paymentData);
      if (res.success && res.data) {
        setPayments(prev => [res.data, ...prev]);
        fetchAllData();
        return res.data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Attendance Check-in / Check-out
  const checkInMember = async (memberOrIdentifier, method = 'QR Scanner') => {
    try {
      const identifier = typeof memberOrIdentifier === 'string'
        ? memberOrIdentifier
        : (memberOrIdentifier.qrCode || memberOrIdentifier.membershipId || memberOrIdentifier._id || memberOrIdentifier.id);

      const res = await attendanceAPI.checkIn(identifier, method);
      if (res.success) {
        fetchAllData();
        return res;
      }
      return res;
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Diet & Hydration
  const logWater = async (amountMl = 250) => {
    const memId = currentUser?.memberProfile?._id || currentUser?.id;
    setDiet(prev => ({
      ...prev,
      waterConsumedMl: Math.min(prev.waterTargetMl, prev.waterConsumedMl + amountMl)
    }));
    if (memId) {
      await dietsAPI.logWater(memId, amountMl);
    }
  };

  const logMeal = (newMeal) => {
    setDiet(prev => ({
      ...prev,
      consumed: {
        calories: prev.consumed.calories + Number(newMeal.calories || 0),
        protein: prev.consumed.protein + Number(newMeal.protein || 0),
        carbs: prev.consumed.carbs + Number(newMeal.carbs || 0),
        fats: prev.consumed.fats + Number(newMeal.fats || 0),
      },
      meals: [...prev.meals, { ...newMeal, id: `meal_${Date.now()}` }]
    }));
  };

  // Classes Booking
  const toggleBookClass = async (classId) => {
    const memId = currentUser?.memberProfile?._id || currentUser?.id || 'guest';
    const memName = currentUser?.name || 'Member';
    const res = await classesAPI.book(classId, memId, memName);
    if (res.success) {
      fetchAllData();
    }
  };

  // Workout Session Controls
  const startWorkoutSession = (routine) => {
    setActiveWorkout({
      routine,
      currentExerciseIndex: 0,
      currentSet: 1,
      elapsedSeconds: 0,
      isRunning: true,
      completedSets: {},
      burnedCalories: 0
    });
  };

  const finishWorkoutSession = () => {
    setActiveWorkout(null);
  };

  // PDF Invoice
  const openInvoice = (payment) => {
    setActiveInvoice(payment);
  };

  const closeInvoice = () => {
    setActiveInvoice(null);
  };

  // Occupancy count
  const currentOccupancy = attendanceLogs.filter(a => a.status === 'In Gym').length;

  return (
    <GymContext.Provider value={{
      currentUser,
      login,
      registerTrainee,
      logout,
      switchRole,
      viewMode,
      setViewMode,
      activeTab,
      setActiveTab,
      activeInvoice,
      openInvoice,
      closeInvoice,
      activeMemberModal,
      setActiveMemberModal,
      isBackendConnected,
      fetchAllData,

      // Entities
      members,
      addMember,
      updateMember,
      deleteMember,

      trainers,
      addTrainer,

      plans,

      payments,
      recordPayment,

      attendanceLogs,
      checkInMember,
      currentOccupancy,

      routines,
      setRoutines,
      exercises,
      activeWorkout,
      startWorkoutSession,
      finishWorkoutSession,
      setActiveWorkout,

      diet,
      logWater,
      logMeal,

      classes,
      toggleBookClass,

      progress,
      setProgress,
      notifications,
      auditLogs
    }}>
      {children}
    </GymContext.Provider>
  );
};
