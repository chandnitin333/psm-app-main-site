import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MenuItem } from '../../models/menu-item/menu-item.interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutModule } from '../layout/layout.module';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-matrix-menu',
  standalone: true,
  imports: [LayoutModule,CommonModule,RouterLink],
  templateUrl: './matrix-menu.component.html',
  styleUrl: './matrix-menu.component.css'
})
export class MatrixMenuComponent {
  userName:string = "";
  constructor(private api: ApiService, public auth:AuthService) { }

  ngOnInit() {

    let user = this.api.getDecodedToken();
    this.userName = `${user?.NAME} ${user?.SURNAME}`;
   
  }
  menuItems: MenuItem[] = [
    { label: 'नोंदणी फॉर्म', icon: 'assignment',  url:"/nodni-form", subItems:[ ] },
    { label: 'मालमत्ता नोंदणी', icon: 'people', url:"/customer", subItems:[] },
    { label: 'मालमत्ता फेरफार', icon: 'bar_chart',  url:"/ferfar-yadi", subItems:[] },
    { label: 'कर आकारणी', icon: 'monetization_on', url:'/tax-generation', subItems:[] },
    { label: 'वसुली', icon: 'savings',  url:'/customer-vasuli', subItems:[] },
    { label: 'अहवाल', icon: 'bar_chart',  url:'javascript:void(0)', subItems:[
      { label: 'आधार लिस्ट शो', icon: 'account_box',  url:'/aadhar-card-show' },
      { label: 'मोबाईल नंबर लिस्ट', icon: 'phone',  url:'/mobile-number' },
      { label: 'पिण्याचा पाणी लिस्ट', icon: 'water',  url:'/pani-vyavasta-yadi' },
      { label: 'शौचालय  लिस्ट', icon: 'wc',  url:'/toilet-yadi' },
      { label: 'मालमत्ता दुरुस्ती यादी', icon: 'show_chart',  url:'/malmatta-grahak-yadi' },
      { label: 'नमुना 8', icon: 'assignment',  url:'/namuna-8-form' },
      { label: 'नमुना 9', icon: 'assignment',  url:'/namuna-9-form' },
      { label: 'करांच्या मागणीचे बिल', icon: 'receipt',  url:'/magniche-bill' },
      { label: 'करांच्या मागणीचे बिल (वार्ड)', icon: 'receipt',  url:'/magniche-bill-ward' },
      { label: 'नमुना 10', icon: 'assignment',  url:'/customer-vasuli' },
      { label: 'इमला कर', icon: 'monetization_on',  url:'/imla-kar-form' },
      { label: 'इमला कर New', icon: 'monetization_on',  url:'/imla-kar-form-new' },
    ] },
    { label: 'Certificate', icon: 'military_tech',  url:'', subItems:[
      { label: 'जन्म प्रमाणपत्र', icon: 'military_tech',  url:'/birth-certificate' },
      { label: 'परित्यक्त्या प्रमाणपत्र', icon: 'military_tech',  url:'/certificate-of-deserted' },
      { label: 'निराधार असल्याचा दाखिला', icon: 'military_tech',  url:'/certificate-of-niradhar' },
      { label: 'हयातीचा दाखला', icon: 'military_tech',  url:'/living-certificate' },
      { label: 'रहिवासी दाखला', icon: 'military_tech',  url:'/residence-certificate' },
      { label: 'थकबाकी नसल्याचे प्रमाणपत्र', icon: 'military_tech',  url:'/no-dues-certificate' },
      { label: 'विभक्त कुटुंब प्रमाणपत्र', icon: 'military_tech',  url:'/nucler-family-certificate' },
      { label: 'मृत्यू प्रमाणपत्र', icon: 'military_tech',  url:'/death-certificate' },
      { label: 'विवाह नोंदणीचे प्रमाणपत्र', icon: 'military_tech',  url:'/marriage-certificate' },
      { label: 'दाखल्याबद्दल पावती', icon: 'military_tech',  url:'/receipt-of-certificate' },
      { label: 'विधवा असल्यचा दाखला', icon: 'military_tech',  url:'/widow-certificate' },
      { label: 'शौचालय दाखला', icon: 'military_tech',  url:'/toilet-certificate' },
      { label: 'दारिद्र्य रेषेखालील कुटुंबाचा दाखला', icon: 'military_tech',  url:'/below-poverty-certificate' },
    ] },
  ];
}
