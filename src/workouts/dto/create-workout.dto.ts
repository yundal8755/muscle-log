import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateWorkoutDto {
    @ApiProperty({ description: '운동 이름', example: '벤치프레스' })
    @IsString()
    exerciseName: string;

    @ApiProperty({ description: '세트 수', example: 3, minimum: 1 })
    @IsInt()
    @Min(1)
    sets: number;

    @ApiProperty({ description: '반복 횟수', example: 10, minimum: 1 })
    @IsInt()
    @Min(1)
    reps: number;

    @ApiProperty({ description: '무게 (kg)', example: 60.5, minimum: 0 })
    @IsNumber()
    @Min(0)
    weight: number;

    @ApiProperty({ description: '운동 날짜', example: '2026-02-14T10:00:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiProperty({ description: '메모', example: '오늘 컨디션 좋았음', required: false })
    @IsOptional()
    @IsString()
    memo?: string;
}
