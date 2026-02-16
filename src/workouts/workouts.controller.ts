import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { FindWorkoutsDto } from './dto/find-workouts.dto';
import { WorkoutEntity } from './entities/workout.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';

/**
 * 운동 기록 컨트롤러
 * JWT Guard로 모든 엔드포인트를 보호합니다.
 * Authorization 헤더에 Bearer 토큰을 포함해야 접근 가능합니다.
 */
@ApiTags('Workout')
@ApiBearerAuth() // Swagger에서 JWT 인증 UI 표시
@UseGuards(JwtAuthGuard) // 모든 엔드포인트에 JWT 인증 적용
@Controller('workouts')
export class WorkoutsController {
    constructor(private readonly workoutsService: WorkoutsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '운동 기록 생성' })
    @ApiResponse({ status: 201, description: 'OK', type: WorkoutEntity })
    async create(
        @User('id') userId: number,
        @Body() createWorkoutDto: CreateWorkoutDto,
    ): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.create(userId, createWorkoutDto);
        return new WorkoutEntity(workout);
    }

    @Get()
    @ApiOperation({ summary: '운동 기록 조회' })
    @ApiResponse({ status: 200, description: 'OK', type: [WorkoutEntity] })
    async findAll(
        @User('id') userId: number,
        @Query() query: FindWorkoutsDto,
    ): Promise<WorkoutEntity[]> {
        const workouts = await this.workoutsService.findAll(userId, query);
        return workouts.map((workout) => new WorkoutEntity(workout));
    }

    @Get('statistics')
    @ApiOperation({ summary: '운동 통계 조회' })
    @ApiResponse({ status: 200, description: 'OK' })
    async getStatistics(@User('id') userId: number) {
        return this.workoutsService.getStatistics(userId);
    }

    @Get('record/:exerciseName')
    @ApiOperation({ summary: '개인 최고 기록 조회' })
    @ApiResponse({ status: 200, description: 'OK', type: WorkoutEntity })
    async getPersonalRecord(
        @User('id') userId: number,
        @Param('exerciseName') exerciseName: string,
    ): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.getPersonalRecord(userId, exerciseName);
        if (!workout) {
            throw new NotFoundException(`${exerciseName}의 기록을 찾을 수 없습니다.`);
        }
        return new WorkoutEntity(workout);
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 기록 상세 조회' })
    @ApiResponse({ status: 200, description: 'OK', type: WorkoutEntity })
    async findOne(
        @User('id') userId: number,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.findOne(userId, id);
        if (!workout) {
            throw new NotFoundException(`ID ${id}에 해당하는 운동 기록을 찾을 수 없습니다.`);
        }
        return new WorkoutEntity(workout);
    }

    @Put(':id')
    @ApiOperation({ summary: '운동 기록 수정' })
    @ApiResponse({ status: 200, description: 'OK', type: WorkoutEntity })
    async update(
        @User('id') userId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWorkoutDto: UpdateWorkoutDto
    ): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.update(userId, id, updateWorkoutDto);
        return new WorkoutEntity(workout);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '운동 기록 삭제' })
    @ApiResponse({ status: 204, description: 'OK' })
    async remove(
        @User('id') userId: number,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        await this.workoutsService.remove(userId, id);
    }
}
