import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHabit } from '@/habits/types';

@Component({
  selector: 'app-user-habit-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-habit-item.html',
})
export class UserHabitItemComponent {
  @Input() habit!: UserHabit;
  @Input() showDeleteButton = true;

  @Output() delete = new EventEmitter<UserHabit>();
  @Output() severityChange = new EventEmitter<1 | 2 | 3>();

  onDelete() {
    this.delete.emit(this.habit);
  }

  onSeverityChange(value: number) {
    const severity = Math.min(Math.max(1, Math.round(value)), 3) as 1 | 2 | 3;
    this.severityChange.emit(severity);
  }

  
}
