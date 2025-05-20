
import React from 'react';
import { useUser } from '@/contexts/user/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

const UserProfileCard: React.FC = () => {
  const { userProfile, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!userProfile) {
    return null;
  }
  
  const level = userProfile.level || 1;
  const totalPoints = userProfile.total_points || 0;
  const pointsForCurrentLevel = (level - 1) * 100;
  const pointsForNextLevel = level * 100;
  const progressToNextLevel = Math.min(
    ((totalPoints - pointsForCurrentLevel) / 
    (pointsForNextLevel - pointsForCurrentLevel)) * 100, 
    100
  );
  
  const displayName = userProfile.display_name || userProfile.username || 'User';
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-md">Profile</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            {userProfile.avatar_url ? (
              <AvatarImage src={userProfile.avatar_url} alt={displayName} />
            ) : (
              <AvatarFallback className="text-lg bg-primary/20">{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="ml-4">
            <h3 className="font-semibold text-lg">{displayName}</h3>
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-0.5 text-xs rounded-full font-medium">
                Level {level}
              </span>
              <span className="text-sm text-muted-foreground">
                {totalPoints} pts
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span>Progress to level {level + 1}</span>
            <span>{Math.round(progressToNextLevel)}%</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{pointsForCurrentLevel} pts</span>
            <span>{pointsForNextLevel} pts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
