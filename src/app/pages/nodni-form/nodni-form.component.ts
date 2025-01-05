import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { LayoutModule } from '../../components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-nodni-form',
  standalone: true,
  imports: [LayoutModule,ReactiveFormsModule,CommonModule,RouterLink,MatTabGroup],
  templateUrl: './nodni-form.component.html',
  styleUrl: './nodni-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodniFormComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';
@ViewChild('tabGroup') tabGrou!: MatTabGroup;

readonly panelOpenState = signal(false);
onNgInit()
{
  
}
 goToNextTab(tabGroup: MatTabGroup) { 
  const nextIndex = (tabGroup.selectedIndex! + 1) % tabGroup._tabs.length; 
  tabGroup.selectedIndex = nextIndex;
 }

 goToPreviousTab(tabGroup: MatTabGroup) { 
    const previousIndex = (tabGroup.selectedIndex! - 1 + tabGroup._tabs.length) % tabGroup._tabs.length; 
    tabGroup.selectedIndex = previousIndex; 
  }
}
