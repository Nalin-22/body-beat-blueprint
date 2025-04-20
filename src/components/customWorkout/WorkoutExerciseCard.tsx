
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface WorkoutExercise {
  name: string;
  sets: number;
  reps?: number;
  time?: string;
  rest?: string;
}

interface Props {
  exercise: WorkoutExercise;
  onUpdate: (exercise: WorkoutExercise) => void;
  onRemove: () => void;
  index: number;
}

const WorkoutExerciseCard = ({ exercise, onUpdate, onRemove, index }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="font-semibold">{exercise.name}</div>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Sets</label>
          <Input
            type="number"
            value={exercise.sets}
            onChange={(e) => onUpdate({ ...exercise, sets: parseInt(e.target.value) })}
            min={1}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Reps</label>
          <Input
            type="number"
            value={exercise.reps || ''}
            onChange={(e) => onUpdate({ ...exercise, reps: parseInt(e.target.value) })}
            min={1}
            className="mt-1"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Time</label>
          <Input
            type="text"
            value={exercise.time || ''}
            onChange={(e) => onUpdate({ ...exercise, time: e.target.value })}
            className="mt-1"
            placeholder="e.g., 30 sec"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Rest</label>
          <Input
            type="text"
            value={exercise.rest || ''}
            onChange={(e) => onUpdate({ ...exercise, rest: e.target.value })}
            className="mt-1"
            placeholder="e.g., 1 min"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutExerciseCard;
