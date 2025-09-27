import { UserHabit } from "@/habits/types"

export type Reports = {
    date: Date,
    userHabits: UserHabit[]
}

export type GradedUserHabit = {
    userHabit: UserHabit
    grade: number
}

export type FiledReport = {
    date: Date,
    grade: number
    userHabitsGraded: GradedUserHabit[]
    note: string
}