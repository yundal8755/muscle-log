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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { FindWorkoutsDto } from './dto/find-workouts.dto';
import { WorkoutEntity } from './entities/workout.entity';

@ApiTags('workouts')
@Controller('workouts')
export class WorkoutsController {
    constructor(private readonly workoutsService: WorkoutsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '운동 기록 생성' })
    @ApiResponse({ status: 201, description: 'OK', type: WorkoutEntity })
    async create(@Body() createWorkoutDto: CreateWorkoutDto): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.create(createWorkoutDto);
        return new WorkoutEntity(workout);
    }

    @Get()
    @ApiOperation({ summary: '운동 기록 조회' })
    @ApiResponse({ status: 200, description: 'OK', type: [WorkoutEntity] })
    async findAll(@Query() query: FindWorkoutsDto): Promise<WorkoutEntity[]> {
        const workouts = await this.workoutsService.findAll(query);
        return workouts.map((workout) => new WorkoutEntity(workout));
    }

    @Get('statistics')
    @ApiOperation({ summary: '운동 통계 조회' })
    @ApiResponse({ status: 200, description: 'OK' })
    async getStatistics() {
        return this.workoutsService.getStatistics();
    }

    @Get('record/:exerciseName')
    @ApiOperation({ summary: '개인 최고 기록 조회' })
    @ApiResponse({ status: 200, description: 'OK', type: WorkoutEntity })
    async getPersonalRecord(@Param('exerciseName') exerciseName: string): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.getPersonalRecord(exerciseName);
        if (!workout) {
            throw new NotFoundException(`${exerciseName}의 기록을 찾을 수 없습니다.`);
        }
        return new WorkoutEntity(workout);
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 기록 상세 조회' })
    @ApiResponse({ status: 200, description: 'OK', type: WorkoutEntity })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.findOne(id);
        if (!workout) {
            throw new NotFoundException(`ID ${id}에 해당하는 운동 기록을 찾을 수 없습니다.`);
        }
        return new WorkoutEntity(workout);
    }

    @Put(':id')
    @ApiOperation({ summary: '운동 기록 수정' })
    @ApiResponse({ status: 200, description: 'OK', type: WorkoutEntity })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWorkoutDto: UpdateWorkoutDto
    ): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.update(id, updateWorkoutDto);
        return new WorkoutEntity(workout);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '운동 기록 삭제' })
    @ApiResponse({ status: 204, description: 'OK' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.workoutsService.remove(id);
    }
}
