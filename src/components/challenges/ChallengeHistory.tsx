
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChallenge } from '@/contexts';
import { Challenge } from '@/contexts/challenge/challengeTypes';
import { format } from 'date-fns';

interface GroupedChallenges {
  [key: string]: Challenge[];
}

const ChallengeHistory = () => {
  const { challenges } = useChallenge();
  
  // Sort challenges by creation date, newest first
  const sortedChallenges = [...challenges].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Only show completed challenges
  const completedChallenges = sortedChallenges.filter(c => c.status === 'completed');
  
  // Group challenges by month
  const groupedByMonth = completedChallenges.reduce<GroupedChallenges>((acc, challenge) => {
    const date = new Date(challenge.createdAt);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(challenge);
    return acc;
  }, {});
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Challenge History</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedByMonth).length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No completed challenges yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByMonth).map(([month, challenges]) => (
              <div key={month}>
                <h3 className="text-lg font-medium mb-2">{month}</h3>
                <ul className="space-y-2">
                  {challenges.map(challenge => (
                    <li key={challenge.id} className="border-b pb-2">
                      <div className="font-medium">{challenge.title}</div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>{challenge.type} challenge</span>
                        <span>Completed on {format(new Date(challenge.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeHistory;
