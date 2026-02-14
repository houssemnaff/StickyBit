// Gamification & Scoring Utilities

export interface UserProgress {
  points: number
  level: number
  lessonsCompleted: number[]
  quizzesPassed: number[]
  badges: string[]
  lastActivityDate?: Date
}

export const defaultProgress: UserProgress = {
  points: 0,
  level: 1,
  lessonsCompleted: [],
  quizzesPassed: [],
  badges: [],
}

// Points system
export const POINTS = {
  SCENARIO_CORRECT: 10,
  SCENARIO_INCORRECT: 2,
  LESSON_COMPLETED: 50,
  QUIZ_PASSED: 25,
  ASSESSMENT_COMPLETED: 30,
  SCAM_REPORTED: 5,
} as const

// Level thresholds
export const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250]

export const calculateLevel = (points: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export const getPointsToNextLevel = (currentPoints: number): number => {
  const currentLevel = calculateLevel(currentPoints)
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return 0
  }
  return LEVEL_THRESHOLDS[currentLevel] - currentPoints
}

// Badges
export const BADGES = {
  FIRST_LESSON: {
    id: 'first_lesson',
    nameAr: 'الأول',
    descriptionAr: 'أكمل درسك الأول',
    icon: '📚',
    requirement: 'lessons',
    count: 1,
  },
  FIVE_LESSONS: {
    id: 'five_lessons',
    nameAr: 'الباحث',
    descriptionAr: 'أكمل 5 دروس',
    icon: '🎓',
    requirement: 'lessons',
    count: 5,
  },
  TEN_LESSONS: {
    id: 'ten_lessons',
    nameAr: 'الخبير',
    descriptionAr: 'أكمل 10 دروس',
    icon: '⭐',
    requirement: 'lessons',
    count: 10,
  },
  FIRST_SIMULATOR: {
    id: 'first_simulator',
    nameAr: 'الشجاع',
    descriptionAr: 'جرّب السيناريو الأول',
    icon: '🎮',
    requirement: 'scenarios',
    count: 1,
  },
  PERFECT_SIMULATOR: {
    id: 'perfect_simulator',
    nameAr: 'الذكي',
    descriptionAr: 'أجب بشكل صحيح على 3 سيناريوهات متتالية',
    icon: '🧠',
    requirement: 'scenarios_perfect',
    count: 3,
  },
  FIRST_REPORT: {
    id: 'first_report',
    nameAr: 'المدافع',
    descriptionAr: 'بلّغ عن عملية احتيال واحدة',
    icon: '🚨',
    requirement: 'reports',
    count: 1,
  },
  ASSESSMENT_HERO: {
    id: 'assessment_hero',
    nameAr: 'الأمين',
    descriptionAr: 'أكمل اختبار الأمان الشخصي',
    icon: '🛡️',
    requirement: 'assessments',
    count: 1,
  },
  SECURITY_STRONG: {
    id: 'security_strong',
    nameAr: 'الحصن',
    descriptionAr: 'حصلت على تقييم أمان قوي',
    icon: '🏆',
    requirement: 'security_score',
    count: 80,
  },
} as const

export const checkBadges = (progress: UserProgress): string[] => {
  const newBadges: string[] = []

  // First lesson badge
  if (progress.lessonsCompleted.length >= 1 && !progress.badges.includes('first_lesson')) {
    newBadges.push('first_lesson')
  }

  // Five lessons badge
  if (progress.lessonsCompleted.length >= 5 && !progress.badges.includes('five_lessons')) {
    newBadges.push('five_lessons')
  }

  // Ten lessons badge
  if (progress.lessonsCompleted.length >= 10 && !progress.badges.includes('ten_lessons')) {
    newBadges.push('ten_lessons')
  }

  return newBadges
}

// User progress management
export const getUserProgress = (): UserProgress => {
  if (typeof window === 'undefined') {
    return defaultProgress
  }

  const stored = localStorage.getItem('cyberaman_progress')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return defaultProgress
    }
  }
  return defaultProgress
}

export const saveUserProgress = (progress: UserProgress) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('cyberaman_progress', JSON.stringify(progress))
}

export const addPoints = (amount: number) => {
  const progress = getUserProgress()
  progress.points += amount
  progress.level = calculateLevel(progress.points)
  progress.lastActivityDate = new Date()
  saveUserProgress(progress)
  return progress
}

export const completeLesson = (lessonId: number, lessonPoints?: number) => {
  const progress = getUserProgress()
  if (!progress.lessonsCompleted.includes(lessonId)) {
    progress.lessonsCompleted.push(lessonId)
    // Award lesson-specific points if provided, otherwise default points
    const pointsToAward = lessonPoints || POINTS.LESSON_COMPLETED
    progress.points += pointsToAward
    progress.level = calculateLevel(progress.points)
    progress.lastActivityDate = new Date()
  }
  saveUserProgress(progress)
  return progress
}

export const resetProgress = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('cyberaman_progress')
}
