'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Apple, Loader, Zap, ChevronDown, ChevronUp, Flame } from 'lucide-react'

interface Food {
    name: string
    portion: string
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface Meal {
    name: string
    time: string
    foods: Food[]
}

interface DietPlan {
    name: string
    goal: string
    dailyCalories: number
    macros: { protein: number; carbs: number; fat: number }
    meals: Meal[]
    tips: string[]
    note?: string
}

export default function AIDietPage() {
    const [goal, setGoal] = useState('Pérdida de Grasa')
    const [weight, setWeight] = useState(75)
    const [activityLevel, setActivityLevel] = useState('Moderado')
    const [allergies, setAllergies] = useState('')
    const [loading, setLoading] = useState(false)
    const [plan, setPlan] = useState<DietPlan | null>(null)
    const [expandedMeal, setExpandedMeal] = useState<string | null>(null)

    const handleGenerate = async () => {
        setLoading(true)
        setPlan(null)
        try {
            const res = await fetch('/api/ai-diet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal, weight, activityLevel, allergies })
            })
            const data = await res.json()
            if (data.success) {
                setPlan(data.dietPlan)
                setExpandedMeal(data.dietPlan.meals[0]?.name || null)
            }
        } catch {
            alert('Error generando plan')
        } finally {
            setLoading(false)
        }
    }

    const macroPercent = (macro: number, calories: number) =>
        Math.round((macro * (macro === plan?.macros.fat ? 9 : 4) / calories) * 100)

    return (
        <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                            <Apple className="h-7 w-7 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black dark:text-white">Dieta IA</h1>
                            <p className="text-gray-500 text-sm">Plan nutricional personalizado</p>
                        </div>
                    </div>
                </motion.div>

                {/* Config */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl mb-6">
                    <h2 className="font-bold text-lg mb-5 dark:text-white">Configura tu plan</h2>
                    <div className="space-y-5">
                        {/* Goal */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Objetivo</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Pérdida de Grasa', 'Volumen Muscular', 'Mantenimiento'].map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setGoal(g)}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all ${goal === g
                                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                            }`}
                                    >{g}</button>
                                ))}
                            </div>
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">
                                Peso actual: <span className="text-green-600 font-black">{weight} kg</span>
                            </label>
                            <input type="range" min={40} max={150} value={weight}
                                onChange={e => setWeight(Number(e.target.value))}
                                className="w-full accent-green-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>40 kg</span><span>150 kg</span>
                            </div>
                        </div>

                        {/* Activity Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Nivel de actividad</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Sedentario', 'Moderado', 'Muy Activo'].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setActivityLevel(l)}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all ${activityLevel === l
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                            }`}
                                    >{l}</button>
                                ))}
                            </div>
                        </div>

                        {/* Allergies */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Alergias / restricciones (opcional)</label>
                            <input type="text" placeholder="ej: lactosa, gluten, mariscos..."
                                value={allergies} onChange={e => setAllergies(e.target.value)}
                                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`w-full mt-6 py-4 rounded-2xl font-black text-lg text-white transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg active:scale-95'
                            }`}
                    >
                        {loading
                            ? <><Loader className="h-5 w-5 animate-spin" /> Generando plan...</>
                            : <><Apple className="h-5 w-5" /> Generar Plan con IA</>
                        }
                    </button>
                </motion.div>

                {/* Plan */}
                <AnimatePresence>
                    {plan && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {/* Overview */}
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 mb-4 text-white">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">🥗 Plan Generado</p>
                                <h2 className="text-xl font-black mb-1">{plan.name}</h2>
                                <p className="text-3xl font-black">{plan.dailyCalories} <span className="text-base font-normal opacity-80">kcal/día</span></p>
                                {plan.note && <p className="text-xs mt-2 bg-white/20 rounded-lg p-2">{plan.note}</p>}
                            </div>

                            {/* Macros */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {[
                                    { label: 'Proteína', value: plan.macros.protein, unit: 'g', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
                                    { label: 'Carbohidratos', value: plan.macros.carbs, unit: 'g', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
                                    { label: 'Grasas', value: plan.macros.fat, unit: 'g', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
                                ].map(m => (
                                    <div key={m.label} className={`${m.color} rounded-2xl p-4 text-center`}>
                                        <p className="text-2xl font-black">{m.value}<span className="text-sm font-normal">{m.unit}</span></p>
                                        <p className="text-xs font-semibold mt-1">{m.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Meals */}
                            <div className="space-y-3 mb-4">
                                {plan.meals.map((meal) => (
                                    <div key={meal.name} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                        <button
                                            onClick={() => setExpandedMeal(expandedMeal === meal.name ? null : meal.name)}
                                            className="w-full flex items-center justify-between p-5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                                    <span className="text-lg">{meal.name.includes('Desayuno') ? '🌅' : meal.name.includes('Almuerzo') ? '☀️' : meal.name.includes('Cena') ? '🌙' : '🍏'}</span>
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold dark:text-white">{meal.name}</p>
                                                    <p className="text-sm text-gray-500">{meal.time} · {meal.foods.reduce((acc, f) => acc + f.calories, 0)} kcal</p>
                                                </div>
                                            </div>
                                            {expandedMeal === meal.name ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                                        </button>
                                        <AnimatePresence>
                                            {expandedMeal === meal.name && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                                    <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                                                        {meal.foods.map((food, i) => (
                                                            <div key={i} className="flex justify-between items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                                                                <div>
                                                                    <p className="font-semibold dark:text-white text-sm">{food.name}</p>
                                                                    <p className="text-xs text-gray-500 mt-0.5">{food.portion}</p>
                                                                    <div className="flex gap-2 mt-1">
                                                                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-md">P: {food.protein}g</span>
                                                                        <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 px-1.5 py-0.5 rounded-md">C: {food.carbs}g</span>
                                                                        <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 px-1.5 py-0.5 rounded-md">G: {food.fat}g</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-lg font-black text-green-600 flex-shrink-0">{food.calories}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Tips */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
                                <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-amber-500" /> Consejos clave
                                </h3>
                                <ul className="space-y-2">
                                    {plan.tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                                            <span className="mt-0.5 text-amber-500">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
