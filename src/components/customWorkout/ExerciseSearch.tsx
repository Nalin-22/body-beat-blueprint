
import React from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscle_group: string | null;
  difficulty: string | null;
}

interface ExerciseSearchProps {
  exercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
}

const ExerciseSearch = ({ exercises, onSelectExercise }: ExerciseSearchProps) => {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search exercises..." />
      <CommandEmpty>No exercises found.</CommandEmpty>
      <ScrollArea className="h-72">
        <CommandGroup>
          {exercises.map((exercise) => (
            <CommandItem
              key={exercise.id}
              onSelect={() => onSelectExercise(exercise)}
              className="flex flex-col items-start p-2 cursor-pointer hover:bg-accent"
            >
              <div className="font-medium">{exercise.name}</div>
              <div className="text-sm text-muted-foreground">
                {exercise.category} • {exercise.muscle_group} • {exercise.difficulty}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
};

export default ExerciseSearch;
