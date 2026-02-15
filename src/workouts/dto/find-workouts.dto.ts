import { ApiPropertyOptional } from '@nestjs/swagger'; // 이거 필수!
import { IsOptional, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindWorkoutsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    exerciseName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}