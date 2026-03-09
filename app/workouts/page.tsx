'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Play, Pause, Check, Plus, Search, Filter,
  Clock, Flame, Dumbbell, ChevronRight, BarChart3,
  Timer, Award, X
} from 'lucide-react'
import { useGym } from '../context/GymContext'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  weight?: number
  rest: number
  completed: boolean
  targetMuscle: string
}

interface WorkoutPlan {
  id: string
  name: string
  category: string
  duration: number
  calories: number
  exercises: Exercise[]
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
}

export default function WorkoutsPage() {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(null)
  const [isResting, setIsResting] = useState(false)
  const [restTimer, setRestTimer] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const { gymId } = useGym()
  const [isSaving, setIsSaving] = useState(false)
  const [prData, setPrData] = useState<{ exerciseName: string, weight: number }[] | null>(null)

  const handleCompleteWorkout = async () => {
    if (!activeWorkout || isSaving) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gymId,
          userId: 'demo-user-1',
          workoutName: activeWorkout.name,
          duration: activeWorkout.duration,
          calories: activeWorkout.calories,
          exercises: activeWorkout.exercises
        }),
      });
      const data = await response.json();
      if (data.success) {
        if (data.newRecords && data.newRecords.length > 0) {
          setPrData(data.newRecords);
        } else {
          setActiveWorkout(null);
          alert('¡Entrenamiento completado sin nuevos récords!');
        }
      } else {
        alert('Error al guardar el entrenamiento');
      }
    } catch (error) {
      alert('Error de red');
    } finally {
      setIsSaving(false);
    }
  }

  const workoutPlans: WorkoutPlan[] = [
    {
      id: '1',
      name: 'Pecho y Tríceps',
      category: 'Fuerza',
      duration: 60,
      calories: 450,
      difficulty: 'Intermedio',
      exercises: [
        { id: '1', name: 'Press de banca', sets: 4, reps: '8-12', weight: 80, rest: 90, completed: false, targetMuscle: 'Pecho' },
        { id: '2', name: 'Press inclinado con mancuernas', sets: 4, reps: '10-12', weight: 30, rest: 60, completed: false, targetMuscle: 'Pecho superior' },
        { id: '3', name: 'Aperturas con mancuernas', sets: 3, reps: '12-15', weight: 15, rest: 60, completed: false, targetMuscle: 'Pecho' },
        { id: '4', name: 'Fondos en paralelas', sets: 3, reps: '10-12', rest: 60, completed: false, targetMuscle: 'Pecho/Tríceps' },
        { id: '5', name: 'Press francés', sets: 3, reps: '10-12', weight: 25, rest: 60, completed: false, targetMuscle: 'Tríceps' },
        { id: '6', name: 'Extensiones de tríceps en polea', sets: 3, reps: '12-15', weight: 20, rest: 45, completed: false, targetMuscle: 'Tríceps' },
      ]
    },
    {
      id: '2',
      name: 'Piernas Completas',
      category: 'Fuerza',
      duration: 75,
      calories: 550,
      difficulty: 'Avanzado',
      exercises: [
        { id: '1', name: 'Sentadillas', sets: 5, reps: '6-8', weight: 120, rest: 120, completed: false, targetMuscle: 'Cuádriceps' },
        { id: '2', name: 'Peso muerto rumano', sets: 4, reps: '8-10', weight: 100, rest: 90, completed: false, targetMuscle: 'Isquiotibiales' },
        { id: '3', name: 'Prensa de piernas', sets: 4, reps: '10-12', weight: 180, rest: 90, completed: false, targetMuscle: 'Piernas' },
        { id: '4', name: 'Zancadas con mancuernas', sets: 3, reps: '12 por pierna', weight: 20, rest: 60, completed: false, targetMuscle: 'Piernas' },
        { id: '5', name: 'Curl femoral', sets: 3, reps: '12-15', weight: 40, rest: 60, completed: false, targetMuscle: 'Isquiotibiales' },
        { id: '6', name: 'Elevación de gemelos', sets: 4, reps: '15-20', weight: 60, rest: 45, completed: false, targetMuscle: 'Gemelos' },
      ]
    },
    {
      id: '3',
      name: 'HIIT Cardio',
      category: 'Cardio',
      duration: 30,
      calories: 380,
      difficulty: 'Intermedio',
      exercises: [
        { id: '1', name: 'Burpees', sets: 4, reps: '20 seg', rest: 40, completed: false, targetMuscle: 'Cuerpo completo' },
        { id: '2', name: 'Mountain climbers', sets: 4, reps: '30 seg', rest: 30, completed: false, targetMuscle: 'Core/Cardio' },
        { id: '3', name: 'Jumping jacks', sets: 4, reps: '30 seg', rest: 30, completed: false, targetMuscle: 'Cardio' },
        { id: '4', name: 'Sprint en el lugar', sets: 4, reps: '20 seg', rest: 40, completed: false, targetMuscle: 'Cardio' },
        { id: '5', name: 'Plancha con toque de hombros', sets: 3, reps: '30 seg', rest: 30, completed: false, targetMuscle: 'Core' },
      ]
    },
    {
      id: '4',
      name: 'Espalda y Bíceps',
      category: 'Fuerza',
      duration: 65,
      calories: 420,
      difficulty: 'Intermedio',
      exercises: [
        { id: '1', name: 'Dominadas', sets: 4, reps: '8-10', rest: 90, completed: false, targetMuscle: 'Espalda' },
        { id: '2', name: 'Remo con barra', sets: 4, reps: '8-12', weight: 70, rest: 90, completed: false, targetMuscle: 'Espalda' },
        { id: '3', name: 'Remo con mancuerna', sets: 3, reps: '10-12', weight: 35, rest: 60, completed: false, targetMuscle: 'Espalda' },
        { id: '4', name: 'Jalón al pecho', sets: 3, reps: '12-15', weight: 50, rest: 60, completed: false, targetMuscle: 'Dorsales' },
        { id: '5', name: 'Curl con barra', sets: 3, reps: '10-12', weight: 30, rest: 60, completed: false, targetMuscle: 'Bíceps' },
        { id: '6', name: 'Curl martillo', sets: 3, reps: '12-15', weight: 15, rest: 45, completed: false, targetMuscle: 'Bíceps' },
      ]
    },
  ]

  const categories = ['Todos', 'Fuerza', 'Cardio', 'Flexibilidad', 'HIIT']

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'Intermedio': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'Avanzado': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const toggleExerciseComplete = (exerciseId: string) => {
    if (!activeWorkout) return

    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    })
  }

  const filteredWorkouts = workoutPlans.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || workout.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (activeWorkout) {
    const completedExercises = activeWorkout.exercises.filter(ex => ex.completed).length
    const progress = (completedExercises / activeWorkout.exercises.length) * 100

    return (
      <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => setActiveWorkout(null)}
              className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
            >
              ← Volver a entrenamientos
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {activeWorkout.name}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{activeWorkout.duration} min</span>
              </span>
              <span className="flex items-center space-x-1">
                <Flame className="h-4 w-4" />
                <span>{activeWorkout.calories} cal</span>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progreso del entrenamiento
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {completedExercises} / {activeWorkout.exercises.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-4">
            {activeWorkout.exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg ${exercise.completed ? 'opacity-60' : ''
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl font-bold text-gray-400">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {exercise.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {exercise.targetMuscle}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          {exercise.sets} series
                        </span>
                      </div>
                      <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                          {exercise.reps} reps
                        </span>
                      </div>
                      {exercise.weight && (
                        <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg">
                          <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            {exercise.weight} kg
                          </span>
                        </div>
                      )}
                      <div className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-lg">
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                          {exercise.rest}s descanso
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExerciseComplete(exercise.id)}
                    className={`ml-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${exercise.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    <Check className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Complete Workout Button */}
          {progress === 100 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              disabled={isSaving}
              className={`w-full mt-6 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all ${isSaving ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl'}`}
              onClick={handleCompleteWorkout}
            >
              {isSaving ? 'Guardando...' : '¡Completar Entrenamiento! 🎉'}
            </motion.button>
          )}

          {/* PR Modal */}
          {prData && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl text-center relative"
              >
                <div className="absolute top-4 right-4">
                  <button onClick={() => { setPrData(null); setActiveWorkout(null); }} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">¡Nuevos Récords Personales!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Demostraste un gran avance hoy. Tu desempeño ha mejorado notablemente.</p>

                <div className="space-y-3 mb-8 text-left">
                  {prData.map((pr, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex justify-between items-center">
                      <span className="font-semibold dark:text-white">{pr.exerciseName}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-black">{pr.weight} kg</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => { setPrData(null); setActiveWorkout(null); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all">
                  Continuar
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Entrenamientos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Elige tu plan de entrenamiento y comienza a hacer progreso
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar entrenamientos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden card-hover"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {workout.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                  <Dumbbell className="h-8 w-8 text-blue-500" />
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm">{workout.duration} minutos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Flame className="h-5 w-5" />
                    <span className="text-sm">~{workout.calories} calorías</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm">{workout.exercises.length} ejercicios</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveWorkout(workout)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Comenzar</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron entrenamientos
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
