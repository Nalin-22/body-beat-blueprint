
import React from 'react';
import { Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExerciseDemoProps {
  exercise: {
    name: string;
    demoUrl?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ExerciseDemo = ({ exercise, isOpen, onClose }: ExerciseDemoProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
          {exercise.demoUrl ? (
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              muted
              src={exercise.demoUrl}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Demo coming soon
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDemo;
