import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/candidates - Get all candidates with filtering/search
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const jobId = searchParams.get('jobId')
        const search = searchParams.get('search')

        const where: any = {
            deletedAt: null
        }

        if (status && status !== 'all') {
            where.status = status
        }

        if (jobId && jobId !== 'all') {
            where.jobId = Number(jobId)
        }

        if (search) {
            where.OR = [
                { fullName: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
                {
                    job: {
                        title: { contains: search }
                    }
                }
            ]
        }

        const candidates = await prisma.candidate.findMany({
            where,
            orderBy: { appliedAt: 'desc' },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        department: true,
                        category: true
                    }
                }
            }
        })

        return NextResponse.json(candidates)
    } catch (error) {
        console.error('Error fetching candidates:', error)
        return NextResponse.json(
            { error: `Failed to fetch candidates: ${(error as Error).message}` },
            { status: 500 }
        )
    }
}

// POST /api/candidates - Create new candidate (admin adding)
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            fullName,
            email,
            phone,
            resume,
            coverLetter,
            jobId,
            status
        } = body

        const candidate = await prisma.candidate.create({
            data: {
                fullName,
                email,
                phone,
                resume,
                coverLetter,
                jobId,
                status: status || 'pending'
            }
        })

        return NextResponse.json(candidate, { status: 201 })
    } catch (error) {
        console.error('Error creating candidate:', error)
        return NextResponse.json(
            { error: 'Failed to create candidate' },
            { status: 500 }
        )
    }
}
