
import React, { useState } from 'react';
import { useUser } from '@/contexts/user/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Loader2, Pencil, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sonnerToast as toast } from '@/components/ui';

const UserProfileCard: React.FC = () => {
  const { profile, isLoading, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form when profile loads
  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || profile.username || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);
  
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
  
  if (!profile) {
    return null;
  }
  
  const level = profile.level || 1;
  const totalPoints = profile.total_points || 0;
  const pointsForCurrentLevel = (level - 1) * 100;
  const pointsForNextLevel = level * 100;
  const progressToNextLevel = Math.min(
    ((totalPoints - pointsForCurrentLevel) / 
    (pointsForNextLevel - pointsForCurrentLevel)) * 100, 
    100
  );
  
  const currentDisplayName = profile.display_name || profile.username || 'User';
  const initials = currentDisplayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error("Nome não pode estar vazio");
      return;
    }
    
    setIsSaving(true);
    try {
      await updateProfile({ 
        display_name: displayName.trim(),
        avatar_url: avatarUrl.trim() || undefined
      });
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-md flex justify-between items-center">
          <span>Profile</span>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full" 
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar perfil</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full text-green-500 hover:text-green-600"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              <span className="sr-only">Salvar perfil</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              {!isEditing && (
                <>
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={currentDisplayName} />
                  ) : (
                    <AvatarFallback className="text-lg bg-primary/20">{initials}</AvatarFallback>
                  )}
                </>
              )}
              
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </Avatar>
          </div>
          
          <div className="ml-4 flex-1">
            {!isEditing ? (
              <>
                <h3 className="font-semibold text-lg">{currentDisplayName}</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/20 text-primary px-2 py-0.5 text-xs rounded-full font-medium">
                    Level {level}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {totalPoints} pts
                  </span>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nome de exibição"
                  className="h-8 text-sm"
                />
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="URL da foto (opcional)"
                  className="h-8 text-sm"
                />
              </div>
            )}
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
