import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit } from '@/habits/types';

@Component({
  selector: 'app-habit-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habit-item.html',
})
export class HabitItemComponent {
  @Input() habit!: Habit;

  @Output() selectHabit = new EventEmitter<Habit>();


  onClick() {

    this.selectHabit.emit(this.habit);
    this.selectHabit.emit
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}
