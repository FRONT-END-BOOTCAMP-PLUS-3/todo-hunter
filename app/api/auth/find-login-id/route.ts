import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PriUserRepository } from '@/infrastructure/repositories/PriUserRepository';
import { FindLoginIdByEmailUsecase } from '@/application/usecases/auth/FindLoginIdByEmailUsecase';

const prisma = new PrismaClient();
const userRepository = new PriUserRepository(prisma);
const findLoginIdByEmailUsecase = new FindLoginIdByEmailUsecase(userRepository);

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const loginId = await findLoginIdByEmailUsecase.execute(email);
        return NextResponse.json({ loginId }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
}