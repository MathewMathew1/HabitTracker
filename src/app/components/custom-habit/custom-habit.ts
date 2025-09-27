import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit } from '@/habits/types';
import { habitEmojis } from '@/emojis/customEmojis';

@Component({
  selector: 'app-custom-habit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-habit.html',
})
export class CustomHabitModalComponent {
  @Output() add = new EventEmitter<Habit>();
  @Output() closeModal = new EventEmitter<void>();

  habitEmojis = habitEmojis;
  name = '';
  emoji = '';
  isPositive = true;
  nameError: string | null = null;
  emojiError: string | null = null;

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    const modalContent = this.eRef.nativeElement.querySelector('.modal-content');
    if (modalContent && !modalContent.contains(event.target as Node)) {
      this.close();
    }
  }

  save() {
    this.nameError = null;
    this.emojiError = null;

    let hasError = false;

    if (!this.name.trim()) {
      this.nameError = 'Name cannot be empty';
      hasError = true;
    }

    if (!this.emoji.trim()) {
      this.emojiError = 'Please select an emoji';
      hasError = true;
    }

    if (hasError) return;

    const habit: Habit = {
      id: crypto.randomUUID(),
      name: this.name.trim(),
      emoji: this.emoji.trim(),
      isPositive: this.isPositive,
      isCustomHabit: true,
    };

    this.add.emit(habit);
    this.closeModal.emit();
  }

  close() {
    this.closeModal.emit();
  }
}
