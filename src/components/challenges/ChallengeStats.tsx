
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useChallenge } from '@/contexts';
import { Challenge } from '@/contexts/challenge/challengeTypes';

const ChallengeStats = () => {
  const { challenges } = useChallenge();
  
  // Calculate statistics by challenge type
  const typeStats = challenges.reduce<Record<string, { total: number, completed: number }>>((acc, challenge) => {
    if (!acc[challenge.type]) {
      acc[challenge.type] = { total: 0, completed: 0 };
    }
    
    acc[challenge.type].total += 1;
    if (challenge.status === 'completed') {
      acc[challenge.type].completed += 1;
    }
    
    return acc;
  }, {});
  
  // Format challenge type labels
  const formatChallengeType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Challenge Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Challenge Type</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead className="text-right">Completion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(typeStats).map(([type, stats]) => (
              <TableRow key={type}>
                <TableCell className="font-medium">{formatChallengeType(type)}</TableCell>
                <TableCell>{stats.total}</TableCell>
                <TableCell>{stats.completed}</TableCell>
                <TableCell className="text-right">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ChallengeStats;
