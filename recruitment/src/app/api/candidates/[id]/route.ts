import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/candidates/[id] - Get single candidate
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const candidate = await prisma.candidate.findFirst({
            where: {
                id: Number(params.id),
                isDeleted: 0
            },
            include: {
                job: {
                    include: {
                        category: true
                    }
                }
            }
        })

        if (!candidate) {
            return NextResponse.json(
                { error: 'Candidate not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(candidate)
    } catch (error) {
        console.error('Error fetching candidate:', error)
        return NextResponse.json(
            { error: 'Failed to fetch candidate' },
            { status: 500 }
        )
    }
}

// PUT /api/candidates/[id] - Update candidate (mainly for status updates)
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const body = await request.json()

        const now = new Date();
        const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

        const candidate = await prisma.candidate.update({
            where: { id: Number(params.id) },
            data: {
                ...body,
                updatedAt: localTime
            }
        })

        return NextResponse.json(candidate)
    } catch (error) {
        console.error('Error updating candidate:', error)
        return NextResponse.json(
            { error: 'Failed to update candidate' },
            { status: 500 }
        )
    }
}

// DELETE /api/candidates/[id] - Delete candidate
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;

        const now = new Date();
        const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

        await prisma.candidate.update({
            where: { id: Number(params.id) },
            data: {
                isDeleted: 1,
                deletedAt: localTime,
                updatedAt: localTime
            }
        })

        return NextResponse.json({ message: 'Candidate deleted successfully' })
    } catch (error) {
        console.error('Error deleting candidate:', error)
        return NextResponse.json(
            { error: 'Failed to delete candidate' },
            { status: 500 }
        )
    }
}
