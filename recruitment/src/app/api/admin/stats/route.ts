import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const startOfMonth = dayjs().startOf('month').toDate()
        const endOfMonth = dayjs().endOf('month').toDate()

        const [
            totalJobs,
            activeJobs,
            newJobsMonth,
            totalCandidates,
            hiredCandidates,
            newCandidatesMonth
        ] = await Promise.all([
            prisma.job.count(),
            prisma.job.count({ where: { status: 'active' } }),
            prisma.job.count({
                where: {
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            }),
            prisma.candidate.count(),
            prisma.candidate.count({ where: { status: 'accepted' } }),
            prisma.candidate.count({
                where: {
                    appliedAt: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            })
        ])

        return NextResponse.json({
            jobs: {
                total: totalJobs,
                active: activeJobs,
                newThisMonth: newJobsMonth
            },
            candidates: {
                total: totalCandidates,
                hired: hiredCandidates,
                newThisMonth: newCandidatesMonth
            }
        })
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
