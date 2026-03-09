'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Apple, Plus, Search, Calendar, Flame, TrendingUp,
  Utensils, Coffee, Sun, Moon, Pizza, Salad, Beef,
  Fish, Egg, Milk, Carrot, Target, CheckCircle2
} from 'lucide-react'

interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  time: string
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack'
  icon: any
}

interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fats: number
}

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddMeal, setShowAddMeal] = useState(false)

  const goals: NutritionGoals = {
    calories: 2500,
    protein: 180,
    carbs: 280,
    fats: 70,
  }

  const [todayMeals, setTodayMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Avena con plátano y proteína',
      calories: 450,
      protein: 35,
      carbs: 60,
      fats: 10,
      time: '08:00',
      type: 'Desayuno',
      icon: Coffee
    },
    {
      id: '2',
      name: 'Pollo a la plancha con arroz y brócoli',
      calories: 650,
      protein: 55,
      carbs: 70,
      fats: 15,
      time: '13:30',
      type: 'Almuerzo',
      icon: Utensils
    },
    {
      id: '3',
      name: 'Batido de proteína con frutos secos',
      calories: 280,
      protein: 30,
      carbs: 20,
      fats: 12,
      time: '17:00',
      type: 'Snack',
      icon: Coffee
    },
    {
      id: '4',
      name: 'Salmón con quinoa y vegetales',
      calories: 580,
      protein: 45,
      carbs: 50,
      fats: 20,
      time: '20:00',
      type: 'Cena',
      icon: Fish
    },
  ])

  const consumed = todayMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 })

  const getPercentage = (consumed: number, goal: number) => {
    return Math.min((consumed / goal) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) return 'from-green-500 to-green-600'
    if (percentage >= 70 && percentage < 90) return 'from-yellow-500 to-yellow-600'
    if (percentage > 110) return 'from-red-500 to-red-600'
    return 'from-blue-500 to-blue-600'
  }

  const commonFoods = [
    { name: 'Pechuga de pollo (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6, icon: Beef },
    { name: 'Arroz blanco (100g)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, icon: Carrot },
    { name: 'Huevos (2 unidades)', calories: 140, protein: 12, carbs: 1, fats: 10, icon: Egg },
    { name: 'Plátano', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, icon: Apple },
    { name: 'Salmón (100g)', calories: 208, protein: 20, carbs: 0, fats: 13, icon: Fish },
    { name: 'Batido de proteína', calories: 120, protein: 24, carbs: 3, fats: 1.5, icon: Milk },
  ]

  const mealTypeIcons = {
    Desayuno: Sun,
    Almuerzo: Utensils,
    Cena: Moon,
    Snack: Coffee,
  }

  const waterIntake = [1, 2, 3, 4, 5, 6, 7, 8]
  const [waterDrunk, setWaterDrunk] = useState(5)

  return (
    <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Nutrición
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Registra tus comidas y alcanza tus objetivos nutricionales
          </p>
        </div>

        {/* Daily Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Resumen Diario</h2>
              <Calendar className="h-6 w-6" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Flame className="h-6 w-6 mb-2" />
                <p className="text-sm opacity-90 mb-1">Calorías</p>
                <p className="text-2xl font-bold">{consumed.calories}</p>
                <p className="text-xs opacity-75">de {goals.calories}</p>
                <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${getPercentage(consumed.calories, goals.calories)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Beef className="h-6 w-6 mb-2" />
                <p className="text-sm opacity-90 mb-1">Proteínas</p>
                <p className="text-2xl font-bold">{consumed.protein}g</p>
                <p className="text-xs opacity-75">de {goals.protein}g</p>
                <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${getPercentage(consumed.protein, goals.protein)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Carrot className="h-6 w-6 mb-2" />
                <p className="text-sm opacity-90 mb-1">Carbohidratos</p>
                <p className="text-2xl font-bold">{consumed.carbs}g</p>
                <p className="text-xs opacity-75">de {goals.carbs}g</p>
                <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${getPercentage(consumed.carbs, goals.carbs)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Fish className="h-6 w-6 mb-2" />
                <p className="text-sm opacity-90 mb-1">Grasas</p>
                <p className="text-2xl font-bold">{consumed.fats}g</p>
                <p className="text-xs opacity-75">de {goals.fats}g</p>
                <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${getPercentage(consumed.fats, goals.fats)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Meals List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Comidas de Hoy
              </h2>
              <button
                onClick={() => setShowAddMeal(!showAddMeal)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {todayMeals.map((meal, index) => {
              const Icon = meal.icon
              const TypeIcon = mealTypeIcons[meal.type]
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg card-hover"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <TypeIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {meal.type} • {meal.time}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {meal.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {meal.calories}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">kcal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {meal.protein}g
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">proteína</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {meal.carbs}g
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">carbos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {meal.fats}g
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">grasas</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Water Intake */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Milk className="h-5 w-5 text-blue-500" />
                <span>Hidratación</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {waterDrunk} / {waterIntake.length} vasos (2L)
              </p>
              <div className="grid grid-cols-4 gap-2">
                {waterIntake.map((glass) => (
                  <button
                    key={glass}
                    onClick={() => setWaterDrunk(glass)}
                    className={`aspect-square rounded-xl transition-all ${
                      glass <= waterDrunk
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    <Milk className="h-6 w-6 mx-auto" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quick Add Foods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-green-500" />
                <span>Alimentos Comunes</span>
              </h3>
              <div className="space-y-2">
                {commonFoods.map((food, index) => {
                  const Icon = food.icon
                  return (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {food.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {food.calories} kcal
                          </p>
                        </div>
                      </div>
                      <Plus className="h-5 w-5 text-gray-400" />
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {/* Weekly Goal Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl text-white"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6" />
                <h3 className="text-lg font-bold">Objetivo Semanal</h3>
              </div>
              <p className="text-3xl font-bold mb-2">5 / 7 días</p>
              <p className="text-sm opacity-90 mb-4">
                ¡Vas genial! Mantén el ritmo para cumplir tu meta
              </p>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all"
                  style={{ width: '71%' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
