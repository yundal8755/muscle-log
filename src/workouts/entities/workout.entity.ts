import { ApiProperty } from '@nestjs/swagger';

export class WorkoutEntity {
    @ApiProperty({ description: '운동 기록 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '운동 이름', example: '벤치프레스' })
    exerciseName: string;

    @ApiProperty({ description: '세트 수', example: 3 })
    sets: number;

    @ApiProperty({ description: '반복 횟수', example: 10 })
    reps: number;

    @ApiProperty({ description: '무게 (kg)', example: 60.5 })
    weight: number;

    @ApiProperty({ description: '운동 날짜', example: '2026-02-14T10:00:00.000Z' })
    date: Date;

    @ApiProperty({ description: '메모', example: '오늘 컨디션 좋았음', required: false })
    memo: string | null;

    @ApiProperty({ description: '생성 일시', example: '2026-02-14T10:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: '수정 일시', example: '2026-02-14T10:00:00.000Z' })
    updatedAt: Date;

    constructor(partial: Partial<WorkoutEntity>) {
        Object.assign(this, partial);
    }
}
