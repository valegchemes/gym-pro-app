import { NextResponse } from 'next/server'

// Mock routines for demo (replace with actual OpenAI call in production)
const MOCK_ROUTINES: Record<string, any> = {
    Principiante: {
        name: 'Rutina Full Body - Principiante',
        days: [
            {
                day: 'Lunes',
                focus: 'Cuerpo Completo',
                exercises: [
                    { name: 'Sentadillas con peso corporal', sets: 3, reps: '15', rest: 60 },
                    { name: 'Flexiones de pecho', sets: 3, reps: '10', rest: 60 },
                    { name: 'Remo con mancuerna', sets: 3, reps: '12', rest: 60 },
                    { name: 'Plancha', sets: 3, reps: '30 seg', rest: 45 },
                ],
            },
            {
                day: 'Miércoles',
                focus: 'Cardio + Core',
                exercises: [
                    { name: 'Salto a la comba', sets: 4, reps: '1 min', rest: 30 },
                    { name: 'Mountain Climbers', sets: 3, reps: '20', rest: 45 },
                    { name: 'Crunch abdominal', sets: 3, reps: '20', rest: 45 },
                    { name: 'Bicicleta abdominal', sets: 3, reps: '30 seg', rest: 30 },
                ],
            },
            {
                day: 'Viernes',
                focus: 'Fuerza General',
                exercises: [
                    { name: 'Peso muerto', sets: 3, reps: '10', rest: 90 },
                    { name: 'Press hombros con mancuernas', sets: 3, reps: '12', rest: 60 },
                    { name: 'Curl de bíceps', sets: 3, reps: '12', rest: 60 },
                    { name: 'Extensiones de tríceps', sets: 3, reps: '12', rest: 60 },
                ],
            },
        ],
        tip: 'Descansa al menos 1 día entre sesiones. Concéntrate en la técnica antes de aumentar el peso.',
    },
    Intermedio: {
        name: 'Rutina Push/Pull/Legs - Intermedio',
        days: [
            {
                day: 'Lunes (Push)',
                focus: 'Pecho, Hombros, Tríceps',
                exercises: [
                    { name: 'Press de banca', sets: 4, reps: '8-12', rest: 90 },
                    { name: 'Press inclinado con mancuernas', sets: 3, reps: '10-12', rest: 75 },
                    { name: 'Press militar', sets: 4, reps: '8-10', rest: 90 },
                    { name: 'Fondos en paralelas', sets: 3, reps: 'máximo', rest: 60 },
                ],
            },
            {
                day: 'Martes (Pull)',
                focus: 'Espalda, Bíceps',
                exercises: [
                    { name: 'Dominadas', sets: 4, reps: '6-10', rest: 90 },
                    { name: 'Remo con barra', sets: 4, reps: '8-12', rest: 90 },
                    { name: 'Curl con barra', sets: 3, reps: '10-12', rest: 60 },
                    { name: 'Jalón al pecho', sets: 3, reps: '12-15', rest: 60 },
                ],
            },
            {
                day: 'Jueves (Legs)',
                focus: 'Piernas, Glúteos',
                exercises: [
                    { name: 'Sentadillas con barra', sets: 5, reps: '5-8', rest: 120 },
                    { name: 'Peso muerto rumano', sets: 4, reps: '10', rest: 90 },
                    { name: 'Prensa de piernas', sets: 3, reps: '12-15', rest: 75 },
                    { name: 'Curl femoral', sets: 3, reps: '12', rest: 60 },
                ],
            },
        ],
        tip: 'Captura tus pesos cada sesión para detectar progresos. Añade 2.5kg cuando puedas completar todas las series con buena forma.',
    },
    Avanzado: {
        name: 'Rutina Alta frecuencia - Avanzado',
        days: [
            {
                day: 'Lunes',
                focus: 'Heavy compound + accesorios',
                exercises: [
                    { name: 'Sentadillas', sets: 5, reps: '5', rest: 180 },
                    { name: 'Press de banca', sets: 5, reps: '5', rest: 180 },
                    { name: 'Remo con barra (Pendlay)', sets: 5, reps: '5', rest: 180 },
                    { name: 'Press francés', sets: 3, reps: '10', rest: 60 },
                ],
            },
            {
                day: 'Miércoles',
                focus: 'Fuerza olímpica',
                exercises: [
                    { name: 'Peso muerto', sets: 1, reps: '5 (máximo)', rest: 300 },
                    { name: 'Dominadas lastradas', sets: 4, reps: '6-8', rest: 120 },
                    { name: 'Press militar sentado', sets: 4, reps: '6-8', rest: 120 },
                    { name: 'Curl con barra 21s', sets: 3, reps: '21', rest: 60 },
                ],
            },
            {
                day: 'Viernes',
                focus: 'Volumen + Técnica',
                exercises: [
                    { name: 'Sentadilla frontal', sets: 4, reps: '8', rest: 120 },
                    { name: 'Press inclinado con barra', sets: 4, reps: '8', rest: 90 },
                    { name: 'Chest supported row', sets: 4, reps: '10', rest: 90 },
                    { name: 'Fondos lastrados', sets: 3, reps: '8', rest: 75 },
                ],
            },
        ],
        tip: 'Prioriza la recuperación. Duerme 8+ horas y lleva un diario de entrenamiento detallado.',
    },
}

import { getSessionUser } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const sessionUser = await getSessionUser()
        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { level, goal, daysPerWeek } = await request.json()

        const levelKey = level || 'Intermedio'
        const routine = MOCK_ROUTINES[levelKey] || MOCK_ROUTINES['Intermedio']

        // Personalize slightly
        const personalized = {
            ...routine,
            name: `${routine.name} — ${goal || 'Fuerza General'}`,
            daysPerWeek,
        }

        return NextResponse.json({ success: true, routine: personalized })
    } catch (error) {
        console.error('Error generating routine:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
