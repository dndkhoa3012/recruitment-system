import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { username, password } = body

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Vui lòng nhập tên đăng nhập và mật khẩu' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
                { status: 401 }
            )
        }

        // Simple password check (plaintext for now as per seed)
        // In production, use bcrypt.compare(password, user.password)
        if (password !== user.password) {
            return NextResponse.json(
                { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
                { status: 401 }
            )
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        // Return user info
        // In a real app, you'd set a session cookie here (e.g. using jose or next-auth)
        // For this simple implementation, we'll return user data and let frontend handle state
        const response = NextResponse.json({
            message: 'Đăng nhập thành công',
            user: userWithoutPassword
        })

        // Set a simple cookie for middleware (if added later)
        response.cookies.set('auth_token', 'logged-in', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 // 1 hour
        })

        return response

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: `Lỗi hệ thống: ${(error as Error).message}` },
            { status: 500 }
        )
    }
}
