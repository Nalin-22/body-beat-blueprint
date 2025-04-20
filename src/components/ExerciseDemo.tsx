
import React, { useMemo } from 'react';
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

const convertGiphyToMP4 = (url: string): string => {
  // Check if it's a Giphy GIF link
  if (url.includes('giphy.com/')) {
    // Convert Giphy GIF to MP4
    const giphyId = url.split('/').pop()?.split('-').pop()?.split('.')[0];
    return `https://media.giphy.com/media/${giphyId}/giphy.mp4`;
  }
  return url;
};

const ExerciseDemo = ({ exercise, isOpen, onClose }: ExerciseDemoProps) => {
  const videoSrc = useMemo(() => 
    exercise.demoUrl ? convertGiphyToMP4(exercise.demoUrl) : undefined, 
    [exercise.demoUrl]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
          {videoSrc ? (
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              muted
              src={videoSrc}
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
