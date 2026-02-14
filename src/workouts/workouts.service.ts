import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { Workout } from '@prisma/client';

@Injectable()
export class WorkoutsService {
    constructor(private prisma: PrismaService) { }

    async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
        return this.prisma.workout.create({
            data: {
                ...createWorkoutDto,
                date: createWorkoutDto.date ? new Date(createWorkoutDto.date) : new Date(),
            },
        });
    }

    async findAll(): Promise<Workout[]> {
        return this.prisma.workout.findMany({
            orderBy: {
                date: 'desc',
            },
        });
    }

    async findOne(id: number): Promise<Workout | null> {
        return this.prisma.workout.findUnique({
            where: { id },
        });
    }
}
