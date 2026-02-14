import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutEntity } from './entities/workout.entity';

@ApiTags('workouts')
@Controller('workouts')
export class WorkoutsController {
    constructor(private readonly workoutsService: WorkoutsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '운동 기록 생성', description: '새로운 운동 기록을 생성합니다.' })
    @ApiResponse({
        status: 201,
        description: '운동 기록이 성공적으로 생성되었습니다.',
        type: WorkoutEntity,
    })
    @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
    async create(@Body() createWorkoutDto: CreateWorkoutDto): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.create(createWorkoutDto);
        return new WorkoutEntity(workout);
    }

    @Get()
    @ApiOperation({ summary: '모든 운동 기록 조회', description: '모든 운동 기록을 날짜 내림차순으로 조회합니다.' })
    @ApiResponse({
        status: 200,
        description: '운동 기록 목록을 성공적으로 조회했습니다.',
        type: [WorkoutEntity],
    })
    async findAll(): Promise<WorkoutEntity[]> {
        const workouts = await this.workoutsService.findAll();
        return workouts.map((workout) => new WorkoutEntity(workout));
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 운동 기록 조회', description: 'ID로 특정 운동 기록을 조회합니다.' })
    @ApiParam({ name: 'id', description: '운동 기록 ID', type: Number })
    @ApiResponse({
        status: 200,
        description: '운동 기록을 성공적으로 조회했습니다.',
        type: WorkoutEntity,
    })
    @ApiResponse({ status: 404, description: '운동 기록을 찾을 수 없습니다.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<WorkoutEntity> {
        const workout = await this.workoutsService.findOne(id);
        if (!workout) {
            throw new NotFoundException(`ID ${id}에 해당하는 운동 기록을 찾을 수 없습니다.`);
        }
        return new WorkoutEntity(workout);
    }
}
