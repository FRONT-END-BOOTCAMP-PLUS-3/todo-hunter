import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PriUserRepository } from '@/infrastructure/repositories/PriUserRepository';
import { CheckExistLoginIdUsecase } from '@/application/usecases/auth/CheckExistLoginIdUsecase';

const prisma = new PrismaClient();
const userRepository = new PriUserRepository(prisma);
const checkExistLoginIdUsecase = new CheckExistLoginIdUsecase(userRepository);

export async function POST(req: NextRequest) {
    const { loginId } = await req.json();

    if (!loginId || typeof loginId !== 'string') {
        return NextResponse.json({ error: 'Login ID is required' }, { status: 400 });
    }

    try {
        const isExist = await checkExistLoginIdUsecase.execute({ loginId });
        return NextResponse.json(isExist, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
}