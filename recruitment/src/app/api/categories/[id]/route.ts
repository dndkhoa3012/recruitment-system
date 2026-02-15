import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single category
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const category = await prisma.category.findUnique({
            where: { id: Number(params.id) },
            include: {
                jobs: {
                    select: {
                        id: true,
                        title: true,
                        status: true
                    }
                },
                _count: {
                    select: { jobs: true }
                }
            }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

// PUT update category
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const body = await request.json();
        const { name, slug, description } = body;

        // Check if category exists
        const existing = await prisma.category.findUnique({
            where: { id: Number(params.id) }
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Check for duplicate name or slug (excluding current category)
        if (name || slug) {
            const duplicate = await prisma.category.findFirst({
                where: {
                    AND: [
                        { id: { not: Number(params.id) } },
                        {
                            OR: [
                                name ? { name } : {},
                                slug ? { slug } : {}
                            ]
                        }
                    ]
                }
            });

            if (duplicate) {
                return NextResponse.json(
                    { error: 'Category with this name or slug already exists' },
                    { status: 409 }
                );
            }
        }

        const category = await prisma.category.update({
            where: { id: Number(params.id) },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                description
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE category
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;

        // Check if category has jobs
        const category = await prisma.category.findUnique({
            where: { id: Number(params.id) },
            include: {
                _count: {
                    select: { jobs: true }
                }
            }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        if (category._count.jobs > 0) {
            return NextResponse.json(
                { error: `Cannot delete category with ${category._count.jobs} assigned jobs` },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: Number(params.id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
