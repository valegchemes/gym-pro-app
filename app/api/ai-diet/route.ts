import { NextResponse } from 'next/server'

// Mock AI-powered diet plans
const DIET_PLANS: Record<string, any> = {
    'Pérdida de Grasa': {
        name: 'Plan Déficit Calórico Inteligente',
        dailyCalories: 1800,
        macros: { protein: 180, carbs: 150, fat: 60 },
        meals: [
            {
                name: 'Desayuno',
                time: '7:00',
                foods: [
                    { name: 'Avena con proteína', portion: '80g avena + 1 scoop proteína', calories: 420, protein: 35, carbs: 55, fat: 8 },
                    { name: 'Claras de huevo', portion: '6 claras', calories: 100, protein: 22, carbs: 0, fat: 0 },
                ]
            },
            {
                name: 'Almuerzo',
                time: '13:00',
                foods: [
                    { name: 'Pechuga de pollo a la plancha', portion: '200g', calories: 220, protein: 46, carbs: 0, fat: 3 },
                    { name: 'Arroz integral', portion: '120g cocido', calories: 160, protein: 3, carbs: 34, fat: 1 },
                    { name: 'Ensalada mixta', portion: 'libre', calories: 40, protein: 2, carbs: 6, fat: 1 },
                ]
            },
            {
                name: 'Pre-entreno',
                time: '17:00',
                foods: [
                    { name: 'Manzana', portion: '1 unidad', calories: 80, protein: 0, carbs: 21, fat: 0 },
                    { name: 'Proteína whey', portion: '1 scoop', calories: 120, protein: 25, carbs: 3, fat: 2 },
                ]
            },
            {
                name: 'Cena',
                time: '20:00',
                foods: [
                    { name: 'Salmón al horno', portion: '180g', calories: 300, protein: 40, carbs: 0, fat: 14 },
                    { name: 'Batata asada', portion: '150g', calories: 130, protein: 2, carbs: 30, fat: 0 },
                    { name: 'Espinacas salteadas', portion: '200g', calories: 50, protein: 5, carbs: 4, fat: 2 },
                ]
            }
        ],
        tips: [
            'Bebe al menos 3 litros de agua al día',
            'No saltees comidas — mantener el metabolismo activo es clave',
            'Pesarte a la misma hora del día, en ayunas',
        ]
    },
    'Volumen Muscular': {
        name: 'Plan Superávit Muscular',
        dailyCalories: 2800,
        macros: { protein: 200, carbs: 320, fat: 80 },
        meals: [
            {
                name: 'Desayuno',
                time: '7:00',
                foods: [
                    { name: 'Tortilla de 4 huevos + 2 claras', portion: '4 huevos enteros', calories: 360, protein: 32, carbs: 2, fat: 24 },
                    { name: 'Tostadas integrales', portion: '3 rebanadas', calories: 240, protein: 8, carbs: 44, fat: 3 },
                    { name: 'Jugo de naranja natural', portion: '300ml', calories: 130, protein: 2, carbs: 30, fat: 0 },
                ]
            },
            {
                name: 'Media mañana',
                time: '10:30',
                foods: [
                    { name: 'Plátano', portion: '2 unidades', calories: 200, protein: 2, carbs: 52, fat: 0 },
                    { name: 'Mantequilla de maní', portion: '30g', calories: 190, protein: 8, carbs: 6, fat: 16 },
                ]
            },
            {
                name: 'Almuerzo',
                time: '13:30',
                foods: [
                    { name: 'Carne magra (ternera/pollo)', portion: '250g', calories: 300, protein: 55, carbs: 0, fat: 8 },
                    { name: 'Pasta integral', portion: '200g cocida', calories: 300, protein: 12, carbs: 58, fat: 2 },
                    { name: 'Verduras salteadas', portion: '200g', calories: 60, protein: 3, carbs: 10, fat: 2 },
                ]
            },
            {
                name: 'Post-entreno',
                time: '19:30',
                foods: [
                    { name: 'Proteína whey', portion: '1.5 scoops', calories: 180, protein: 38, carbs: 4, fat: 3 },
                    { name: 'Arroz con leche descremada', portion: '200g', calories: 200, protein: 8, carbs: 38, fat: 2 },
                ]
            },
            {
                name: 'Cena',
                time: '21:00',
                foods: [
                    { name: 'Merluza o tilapia', portion: '200g', calories: 180, protein: 38, carbs: 0, fat: 3 },
                    { name: 'Puré de papa dulce', portion: '200g', calories: 180, protein: 3, carbs: 42, fat: 0 },
                    { name: 'Aguacate', portion: '1/2 unidad', calories: 120, protein: 1, carbs: 6, fat: 11 },
                ]
            }
        ],
        tips: [
            'Come cada 3 horas para mantener el anabolismo',
            'Comer carbohidratos complejos antes y después del entrenamiento',
            'No negliges las grasas saludables — son esenciales para la testosterona',
        ]
    },
    'Mantenimiento': {
        name: 'Plan Equilibrio y Bienestar',
        dailyCalories: 2200,
        macros: { protein: 160, carbs: 230, fat: 75 },
        meals: [
            {
                name: 'Desayuno',
                time: '8:00',
                foods: [
                    { name: 'Yogur griego con granola', portion: '200g yogur + 40g granola', calories: 380, protein: 22, carbs: 50, fat: 9 },
                    { name: 'Frutas de temporada', portion: '150g', calories: 80, protein: 1, carbs: 20, fat: 0 },
                ]
            },
            {
                name: 'Almuerzo',
                time: '13:00',
                foods: [
                    { name: 'Pechuga de pollo grillada', portion: '180g', calories: 200, protein: 42, carbs: 0, fat: 3 },
                    { name: 'Quinoa', portion: '150g cocida', calories: 180, protein: 7, carbs: 33, fat: 3 },
                    { name: 'Brócoli al vapor', portion: '200g', calories: 55, protein: 4, carbs: 11, fat: 0 },
                ]
            },
            {
                name: 'Cena',
                time: '20:00',
                foods: [
                    { name: 'Salmón a la plancha', portion: '150g', calories: 250, protein: 33, carbs: 0, fat: 12 },
                    { name: 'Verduras asadas mix', portion: '250g', calories: 100, protein: 4, carbs: 18, fat: 3 },
                    { name: 'Aceite de oliva', portion: '1 cucharada', calories: 120, protein: 0, carbs: 0, fat: 14 },
                ]
            }
        ],
        tips: [
            'El balance calórico es todo — pesa los alimentos 2-3 veces por semana',
            'Incluye variedad de vegetales de diferentes colores',
            'Permite comidas libres 1 vez por semana para adherencia a largo plazo',
        ]
    }
}

export async function POST(request: Request) {
    try {
        const { goal, weight, activityLevel, allergies } = await request.json()

        const goalKey = goal || 'Mantenimiento'
        const plan = DIET_PLANS[goalKey] || DIET_PLANS['Mantenimiento']

        // Adjust calories based on weight
        const baseCalories = plan.dailyCalories
        const adjustedCalories = weight
            ? Math.round(baseCalories + (weight - 75) * 15)
            : baseCalories

        return NextResponse.json({
            success: true,
            dietPlan: {
                ...plan,
                dailyCalories: adjustedCalories,
                goal: goalKey,
                activityLevel,
                note: allergies ? `⚠️ Alergias/restricciones reportadas: ${allergies}. Consulta con un nutricionista.` : null,
            }
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
