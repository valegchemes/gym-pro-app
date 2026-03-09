import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { gymId, userId, workoutName, duration, calories, exercises } = await request.json()

        if (!gymId || !userId) {
            return NextResponse.json({ error: 'Missing userId or gymId' }, { status: 400 })
        }

        const newRecords = []

        // 1. Create the Workout
        const workout = await prisma.workout.create({
            data: {
                name: workoutName,
                duration,
                calories,
                userId,
                gymId,
            }
        })

        // 2. Process exercises and sets
        for (const ex of exercises) {
            if (!ex.completed) continue;

            let exerciseDb = await prisma.exercise.findFirst({
                where: { name: ex.name }
            })

            if (!exerciseDb) {
                exerciseDb = await prisma.exercise.create({
                    data: {
                        name: ex.name,
                        targetMuscle: ex.targetMuscle || 'General',
                        category: 'Fuerza'
                    }
                })
            }

            if (ex.weight) {
                const weightVal = Number(ex.weight)

                await prisma.workoutSet.create({
                    data: {
                        reps: parseInt(ex.reps.toString().split('-')[0]) || 10,
                        weight: weightVal,
                        workoutId: workout.id,
                        exerciseId: exerciseDb.id
                    }
                })

                // Check PR
                const existingPR = await prisma.personalRecord.findFirst({
                    where: { userId, exerciseId: exerciseDb.id },
                    orderBy: { weight: 'desc' }
                })

                if (!existingPR || weightVal > existingPR.weight) {
                    await prisma.personalRecord.create({
                        data: {
                            weight: weightVal,
                            userId,
                            exerciseId: exerciseDb.id
                        }
                    })
                    newRecords.push({ exerciseName: ex.name, weight: weightVal })

                    // Generate a social post for breaking a PR
                    await prisma.socialPost.create({
                        data: {
                            content: `¡Rompí mi récord personal en ${ex.name} con ${weightVal}kg! 💪🔥`,
                            type: 'PR',
                            userId,
                            gymId
                        }
                    })
                }
            }
        }

        // 3. Grant XP to user for completing workout
        await prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: 150 } }
        })

        return NextResponse.json({ success: true, workoutId: workout.id, newRecords })
    } catch (error) {
        console.error('Error saving workout:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
