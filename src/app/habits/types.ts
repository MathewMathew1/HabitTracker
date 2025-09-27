export type Habit = {
    name: string
    emoji: string
    id: string
    isCustomHabit: boolean
    isPositive: boolean
}

export type HabitSearch = {
  searchedName: string;
  includePositive: boolean;
  includeNegative: boolean;
};

export type UserHabit = {
  habit: Habit
  severity: 1|2|3
}