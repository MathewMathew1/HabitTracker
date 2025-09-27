import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHabit } from '@/habits/types';
import { UserHabitItemComponent } from '@/components/user-habit-item/user-habit-item';
import { FormsModule } from '@angular/forms';
import { UserHabitsService } from '@/services/habits/userHabits';

@Component({
  selector: 'app-user-habits',
  standalone: true,
  imports: [CommonModule, UserHabitItemComponent, FormsModule],
  templateUrl: './user-habits.html',
})
export class UserHabitsComponent {
  @Input() userHabits: UserHabit[] = [];
  @Input() isRoutineActive: boolean = false;
  @Input() showDeleteButton = true;

  @Output() saveRoutine = new EventEmitter();
  @Output() deleteHabit = new EventEmitter<UserHabit>();
  @Output() severityChange = new EventEmitter<{ habit: UserHabit; severity: 1 | 2 | 3 }>();

  constructor(private routineService: UserHabitsService) {
    this.isRoutineActive = routineService.getIsActive(); 
  }

  onDelete(habit: UserHabit) {
    this.deleteHabit.emit(habit);
  }

  saveRoutineFunc() {
    this.saveRoutine.emit(this.isRoutineActive);
  }

  onSeverityChange(habit: UserHabit, severity: 1 | 2 | 3) {
    habit.severity = severity;
    this.severityChange.emit({ habit, severity });
  }
}
