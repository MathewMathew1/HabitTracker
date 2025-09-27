import { UserHabit } from '@/habits/types';

const MAX_GRADE = 5

export const rateDailyPerformance = (
  userHabits: UserHabit[],
  grades: Record<string, number>
): number => {
  let badScore = 0;
  let maxBadScore = 0;
  let goodScore = 0;
  let maxGoodScore = 0;

  userHabits.forEach((habit) => {
    if (habit.habit.isPositive) {
      const rating = grades[habit.habit.id] || 1;
      goodScore += rating * habit.severity;
      maxGoodScore += MAX_GRADE * habit.severity;
    } else {
      const rating = grades[habit.habit.id] || 1;
      badScore += (rating - 1) * habit.severity;
      maxBadScore += (MAX_GRADE - 1) * habit.severity;
    }
  });

  const maximumScore = maxGoodScore + maxBadScore;
  const score = badScore + maxGoodScore - goodScore;
  const percentageOfScore = score / maximumScore;

  const removedPoints = Math.round(10 * percentageOfScore);
  const points = 10 - removedPoints;

  return points;
};
