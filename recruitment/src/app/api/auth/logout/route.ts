import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json({
        message: 'Đăng xuất thành công'
    })

    // Clear the auth cookie
    response.cookies.delete('auth_token')

    return response
}
