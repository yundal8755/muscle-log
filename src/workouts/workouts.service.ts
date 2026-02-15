import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { FindWorkoutsDto } from './dto/find-workouts.dto';

@Injectable()
export class WorkoutsService {
    constructor(private prisma: PrismaService) { }

    /// 운동 기록 생성
    async create(createWorkoutDto: CreateWorkoutDto) {
        return this.prisma.workout.create({
            data: {
                ...createWorkoutDto,
                date: createWorkoutDto.date ? new Date(createWorkoutDto.date) : new Date(),
            },
        });
    }

    /// 운동 기록 조회 (전체/검색/필터/최근 기록 통합)
    async findAll(dto: FindWorkoutsDto = {}) {
        const { exerciseName, startDate, endDate, limit } = dto;

        return this.prisma.workout.findMany({
            where: {
                ...(exerciseName && {
                    exerciseName: {
                        contains: exerciseName,
                        mode: 'insensitive',
                    },
                }),
                ...(startDate && endDate && {
                    date: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                }),
            },
            take: limit ? Number(limit) : undefined,
            orderBy: {
                date: 'desc',
            },
        });
    }

    /// 특정 운동 기록 조회
    async findOne(id: number) {
        return this.prisma.workout.findUnique({
            where: { id },
        });
    }

    /// 운동 통계 조회
    async getStatistics() {
        const totalWorkouts = await this.prisma.workout.count();

        const exerciseGroups = await this.prisma.workout.groupBy({
            by: ['exerciseName'],
            _count: {
                id: true,
            },
            _avg: {
                weight: true,
                sets: true,
                reps: true,
            },
            _max: {
                weight: true,
            },
        });

        return {
            totalWorkouts,
            exerciseGroups: exerciseGroups.map(group => ({
                exerciseName: group.exerciseName,
                count: group._count.id,
                avgWeight: group._avg.weight,
                avgSets: group._avg.sets,
                avgReps: group._avg.reps,
                maxWeight: group._max.weight,
            })),
        };
    }

    /// 특정 운동의 역대 최고 기록 조회
    async getPersonalRecord(exerciseName: string) {
        return this.prisma.workout.findFirst({
            where: {
                exerciseName: {
                    equals: exerciseName,
                    mode: 'insensitive',
                },
            },
            orderBy: {
                weight: 'desc',
            },
        });
    }

    /// 운동 기록 수정
    async update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
        return this.prisma.workout.update({
            where: { id },
            data: {
                ...updateWorkoutDto,
                ...(updateWorkoutDto.date && { date: new Date(updateWorkoutDto.date) }),
            },
        });
    }

    /// 운동 기록 삭제
    async remove(id: number) {
        return this.prisma.workout.delete({
            where: { id },
        });
    }
}
