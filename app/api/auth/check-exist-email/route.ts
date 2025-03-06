import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PriUserRepository } from '@/infrastructure/repositories/PriUserRepository';
import { CheckExistEmailUsecase } from '@/application/usecases/auth/CheckExistEmailUsecase';

const userRepository = new PriUserRepository(prisma);
const checkExistEmailUsecase = new CheckExistEmailUsecase(userRepository);

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const isExist = await checkExistEmailUsecase.execute({ email });
        return NextResponse.json(isExist, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
}