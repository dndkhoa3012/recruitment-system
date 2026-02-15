import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/jobs - Get all jobs with filtering/search
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const categoryId = searchParams.get('categoryId')
        const search = searchParams.get('search')

        const where: any = {}

        if (status && status !== 'all') {
            where.status = status
        }

        if (categoryId && categoryId !== 'all') {
            where.categoryId = Number(categoryId)
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ]
        }

        const jobs = await prisma.job.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { candidates: true }
                },
                category: true
            }
        })

        return NextResponse.json(jobs)
    } catch (error) {
        console.error('Error fetching jobs:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch jobs' },
            { status: 500 }
        )
    }
}

// POST /api/jobs - Create new job
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            title,
            department,
            categoryId,
            location,
            type,
            salary,
            quantity,
            description,
            requirements,
            benefits,
            deadline
        } = body

        const job = await prisma.job.create({
            data: {
                title,
                department,
                categoryId,
                location,
                type: type || 'full-time',
                salary,
                quantity: quantity || 1,
                description,
                requirements,
                benefits,
                status: 'active',
                publishedAt: new Date(),
                deadline: deadline ? new Date(deadline) : null
            }
        })

        return NextResponse.json(job, { status: 201 })
    } catch (error) {
        console.error('Error creating job:', error)
        return NextResponse.json(
            { error: 'Failed to create job' },
            { status: 500 }
        )
    }
}
