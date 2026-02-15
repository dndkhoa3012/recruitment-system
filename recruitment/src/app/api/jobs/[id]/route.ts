import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/jobs/[id] - Get single job
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const job = await prisma.job.findUnique({
            where: { id: Number(params.id) },
            include: {
                candidates: {
                    orderBy: { appliedAt: 'desc' }
                }
            }
        })

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(job)
    } catch (error) {
        console.error('Error fetching job:', error)
        return NextResponse.json(
            { error: 'Failed to fetch job' },
            { status: 500 }
        )
    }
}

// PUT /api/jobs/[id] - Update job
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const body = await request.json()

        const job = await prisma.job.update({
            where: { id: Number(params.id) },
            data: {
                ...body,
                deadline: body.deadline ? new Date(body.deadline) : null
            }
        })

        return NextResponse.json(job)
    } catch (error) {
        console.error('Error updating job:', error)
        return NextResponse.json(
            { error: 'Failed to update job' },
            { status: 500 }
        )
    }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        await prisma.job.delete({
            where: { id: Number(params.id) }
        })

        return NextResponse.json({ message: 'Job deleted successfully' })
    } catch (error) {
        console.error('Error deleting job:', error)
        return NextResponse.json(
            { error: 'Failed to delete job' },
            { status: 500 }
        )
    }
}
