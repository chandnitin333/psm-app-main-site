import { Component } from '@angular/core';
import { LayoutModule } from '../../components/layout/layout.module';

export interface PeriodicElement {
  from_year: number;
  to_year: number;
  khatedharak_name:string;
  gruhkar_bhumikar: number;
  vij_divabatti_kar: number;
  aarogya_rakshan_kar: number;
  safae_kar:number;
  samanya_pani_kar:number; 
  vises_pani_kar:number;
  total:number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { from_year: 2024, to_year: 2024, khatedharak_name: 'Kundan M Kotangale', gruhkar_bhumikar:1242.5, vij_divabatti_kar:100, aarogya_rakshan_kar: 100, safae_kar:100, samanya_pani_kar:100, vises_pani_kar:100, total:25000.25},
  { from_year: 2024, to_year: 2024, khatedharak_name: 'Kundan M Kotangale', gruhkar_bhumikar:1242.5, vij_divabatti_kar:100, aarogya_rakshan_kar: 100, safae_kar:100, samanya_pani_kar:100, vises_pani_kar:100, total:25000.25},
];

@Component({
  selector: 'app-tax-generration',
  standalone: true,
  imports: [LayoutModule],
  templateUrl: './tax-generration.component.html',
  styleUrl: './tax-generration.component.css'
})
export class TaxGenerrationComponent {
toYearSelected: string = '2025';
fromYearSelected: string = '2024';

  displayedColumns: string[] = [
    'from_year',
    'to_year',
    'khatedharak_name',
    'gruhkar_bhumikar',
    'vij_divabatti_kar',
    'aarogya_rakshan_kar',
    'safae_kar',
    'samanya_pani_kar',
    'vises_pani_kar',
    'total'
];
  dataSource = ELEMENT_DATA;

  ngOnInit(){
  }
}
