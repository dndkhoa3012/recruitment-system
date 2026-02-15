import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { jobs: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST create new category
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug, description } = body;

        // Validate required fields
        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Name and slug are required' },
                { status: 400 }
            );
        }

        // Check for duplicate name or slug
        const existing = await prisma.category.findFirst({
            where: {
                OR: [
                    { name },
                    { slug }
                ]
            }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Category with this name or slug already exists' },
                { status: 409 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description
            }
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create category' },
            { status: 500 }
        );
    }
}
