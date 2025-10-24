import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { API_URL, ITEM_PER_PAGE, TRANSLATE_API_URL } from '../../constant/admin.constant';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { ApiService } from '../services/api.service';
import { TranslateService } from '../services/translate.service';

@Injectable({
    providedIn: 'root'
})
export class Util {

    private debounceTimeout: any;
    private static _instance: Util;
    readonly dialog = inject(MatDialog);
    // constructor(private http: HttpClient, private api: ApiService, private dialog: MatDialog) {

    // }
    constructor(private translate: TranslateService, private http: HttpClient, private api: ApiService) {

    }


    getTranslateText(event: Event, marathiText: string): Observable<any> {
        const input = event.target as HTMLInputElement;
        let text = input.value;
        input.value = (text.trim() !== '') ? text : ' ';

        return new Observable((observer) => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                if (text.trim() !== '') {
                    this.http.post(TRANSLATE_API_URL, {
                        q: text,
                        source: 'en',
                        target: 'mr',
                        format: 'text'
                    }).subscribe((res: any) => {
                        if (res && res.data && res.data.translations && res.data.translations.length > 0) {
                            marathiText = res.data.translations[0].translatedText;

                            setTimeout(() => {
                                this.updateText(marathiText, input);
                                observer.next(marathiText);
                                observer.complete();
                            }, 400);
                        } else {
                            observer.error('Unexpected API response format');
                        }
                    }, (err) => {
                        console.error('Translation API error:', err);
                        observer.error(err);
                    });
                } else {
                    marathiText = '';
                    this.updateText(marathiText, input);
                    observer.next(marathiText);
                    observer.complete();
                }
            }, 200);
        });
    }

    onKeydown(event: KeyboardEvent, controlName: string, formGroup: any): void {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default Enter key behavior
            const control = formGroup.get(controlName);
            const text = control.value;
            let translatedText = '';
            if (text && text.trim() !== '') {
                console.log('Translating:', text);
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.translate.translate(text).subscribe({
                        next: (res: any) => {
                            console.log("res===", res)
                            if (res && res.data && res.data.translations && res.data.translations.length > 0) {
                                translatedText = res.data.translations[0].translatedText;
                                this.updateText1(translatedText, control);
                            } else {
                                console.error('Unexpected API response format:', res);
                            }
                        },
                        error: (err) => {
                            console.error('Translation API error:', err);
                        },
                        complete: () => {
                            console.log('Translation completed');
                        }
                    });
                }, 200); // Adjust the debounce delay as per your requirement
            }
        }
    }


    private updateText(text: string, input: HTMLInputElement): void {
        input.value = text;
        input.dispatchEvent(new Event('input'));
    }

    private updateText1(text: string, control: any): void {
        control.setValue(text);
        control.updateValueAndValidity();
    }

    getSerialNumber(index: number, currentPage: number): number {
        return (currentPage - 1) * ITEM_PER_PAGE + index + 1;
    }


    // async showConfirmAlert(): Promise<boolean> {
    //     return Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then((result) => {
    //         return result.isConfirmed;
    //     });
    // }

    async getDistrictDDL(url: string = "district-list-ddl") {
        const cacheKey = 'districts';
        // const cachedData = localStorage.getItem(cacheKey);
        // if (cachedData) {
        //     return JSON.parse(cachedData);
        // }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
            const res: any = await this.http.post(`${API_URL}${url}`, {}, { headers }).toPromise();
            const data = res?.data ?? [];
            // localStorage.setItem(cacheKey, JSON.stringify(data));
            return data;
        } catch (err) {
            console.error('Error getting districts:', err);
            return [];
        }
    }

    async getMalmattechePrakartDDL(url: string = "get-malmatteche-prakar-all-list") {
        const cacheKey = 'malmatteche-prakar';
        // const cachedData = localStorage.getItem(cacheKey);
        // if (cachedData) {
        //     return JSON.parse(cachedData);
        // }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
            const res: any = await this.http.post(`${API_URL}${url}`, {}, { headers }).toPromise();
            const data = res?.data ?? [];
            // localStorage.setItem(cacheKey, JSON.stringify(data));
            return data;
        } catch (err) {
            console.error('Error getting malmatteche prakar:', err);
            return [];
        }
    }
    async getTalukaById(params: any) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        return await this.http.post(`${API_URL}taluka-list-by-district-id`, params, { headers }).toPromise();

    }
    async getGatGramTalukaById(params: any) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
        return await this.http.post(`${API_URL}panchayat-list-by-taluka-id`, params, { headers }).toPromise();
    }
    async showConfirmAlert(): Promise<boolean> {
        return Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            return result.isConfirmed;
        });
    }

    async showAlertMessage(msg: string, title: string, type: 'success' | 'error' | 'warning' | 'info' | 'question'): Promise<boolean> {
        const result = await Swal.fire({
            title: title,
            text: msg,
            icon: type,
            confirmButtonText: 'OK'
        });
        return result.isConfirmed;
    }

    openDialog(title: string, message: string, type: string): void {
        this.dialog.open(CommonDialogComponent, { data: { title, message, type } });
    }
    allowOnlyCharacters(event: KeyboardEvent): boolean {
        const inputChar = String.fromCharCode(event.keyCode || event.which);
        const pattern = /^[a-zA-Z\s]*$/; // allows letters and spaces

        if (!pattern.test(inputChar)) {
            event.preventDefault(); // block the input
            return false;
        }
        return true;
    }
    allowOnlyNumbers(event: KeyboardEvent): boolean {
        const charCode = event.keyCode || event.which;
        const isNumber = charCode >= 48 && charCode <= 57; // 0 to 9

        if (!isNumber) {
            event.preventDefault(); // Block non-numeric input
            return false;
        }
        return true;
    }
    

}
export default Util;
// utils.ts
// export function numberToMarathiWords(num: number): string {
//   if (num === 0) return "शून्य रुपये फक्त";

//   const ones: { [key: number]: string } = {
//     1: "एक", 2: "दोन", 3: "तीन", 4: "चार", 5: "पाच",
//     6: "सहा", 7: "सात", 8: "आठ", 9: "नऊ", 10: "दहा",
//     11: "अकरा", 12: "बारा", 13: "तेरा", 14: "चौदा",
//     15: "पंधरा", 16: "सोळा", 17: "सतरा", 18: "अठरा", 19: "एकोणीस"
//   };

//   const tens: { [key: number]: string } = {
//     20: "वीस", 30: "तीस", 40: "चाळीस", 50: "पन्नास",
//     60: "साठ", 70: "सत्तर", 80: "ऐंशी", 90: "नव्वद"
//   };

//   const scales = ["", "हजार", "लाख", "कोटी"];

//   function twoDigitToWords(n: number): string {
//     if (n === 0) return "";
//     if (n < 20) return ones[n];
//     const t = Math.floor(n / 10) * 10;
//     const o = n % 10;
//     return tens[t] + (o ? " " + ones[o] : "");
//   }

//   function threeDigitToWords(n: number): string {
//     let str = "";
//     const hundreds = Math.floor(n / 100);
//     const remainder = n % 100;
//     if (hundreds > 0) str += (ones[hundreds] || "") + "शे ";
//     if (remainder > 0) str += twoDigitToWords(remainder);
//     return str.trim();
//   }

//   let parts: number[] = [];
//   parts.push(num % 1000);
//   num = Math.floor(num / 1000);

//   while (num > 0) {
//     parts.push(num % 100);
//     num = Math.floor(num / 100);
//   }

//   let words = "";
//   for (let i = parts.length - 1; i >= 0; i--) {
//     if (parts[i] !== 0) {
//       if (i === 0) {
//         words += threeDigitToWords(parts[i]) + " ";
//       } else {
//         words += twoDigitToWords(parts[i]) + " " + scales[i] + " ";
//       }
//     }
//   }

//   return words.trim() + " रुपये फक्त";
// }



// number-to-marathi.ts
export function numberToMarathiWords(inputNum: number): string {
  if (!Number.isFinite(inputNum) || inputNum < 0) {
    throw new Error('Only non-negative finite numbers supported');
  }
  const num = Math.floor(inputNum);
  if (num === 0) return "शून्य रुपये फक्त";

  // Lookup for 0..99 (uses standard Marathi forms for 1..99)
  const upto99: { [k: number]: string } = {
    0: "", 1: "एक", 2: "दोन", 3: "तीन", 4: "चार", 5: "पाच",
    6: "सहा", 7: "सात", 8: "आठ", 9: "नऊ", 10: "दहा",
    11: "अकरा", 12: "बारा", 13: "तेरा", 14: "चौदा", 15: "पंधरा",
    16: "सोळा", 17: "सतरा", 18: "अठरा", 19: "एकोणीस",
    20: "वीस", 21: "एकवीस", 22: "बावीस", 23: "तेवीस", 24: "चोवीस",
    25: "पंचवीस", 26: "सव्वीस", 27: "सत्तावीस", 28: "अठ्ठावीस", 29: "एकोणतीस",
    30: "तीस", 31: "एकतीस", 32: "बत्तीस", 33: "तेहेतीस", 34: "चौतीस", 35: "पस्तीस",
    36: "छत्तीस", 37: "सदतीस", 38: "अडतीस", 39: "एकोणचाळीस",
    40: "चाळीस", 41: "एक्केचाळीस", 42: "बेचाळीस", 43: "त्रेचाळीस", 44: "चव्वेचाळीस",
    45: "पंचेचाळीस", 46: "सेहेचाळीस", 47: "सत्तेचाळीस", 48: "अठ्ठेचाळीस", 49: "एकोणपन्नास",
    50: "पन्नास", 51: "एक्कावन्न", 52: "बावन्न", 53: "त्रेपन्नास", 54: "चोपन्नास",
    55: "पंचावन्न", 56: "छप्पन्न", 57: "सत्तावन्न", 58: "अठ्ठावन्न", 59: "एकोणसाठ",
    60: "साठ", 61: "एकसष्ट", 62: "बासष्ट", 63: "त्रेसष्ट", 64: "चौंसष्ट",
    65: "पणसष्ट", 66: "सहासष्ट", 67: "सत्तसष्ट", 68: "अडसष्ट", 69: "एकोणसत्तर",
    70: "सत्तर", 71: "एक्काहत्तर", 72: "बहत्तर", 73: "त्र्याहत्तर", 74: "चौऱ्हत्तर",
    75: "पंच्याहत्तर", 76: "शहात्तर", 77: "सत्त्याहत्तर", 78: "अठ्ठ्याहत्तर", 79: "एकोणऐंशी",
    80: "ऐंशी", 81: "एक्क्याऐंशी", 82: "ब्याऐंशी", 83: "त्र्याऐंशी", 84: "चौर्‍याऐंशी",
    85: "पंच्याऐंशी", 86: "शहाऐंशी", 87: "सत्त्याऐंशी", 88: "अठ्ठ्याऐंशी", 89: "एकोणनव्वद",
    90: "नव्वद", 91: "एक्क्याण्णव", 92: "ब्याण्णव", 93: "त्र्याण्णव", 94: "चौर्‍याण्णव",
    95: "पंच्याण्णव", 96: "शहाण्णव", 97: "सत्त्याण्णव", 98: "अठ्ठ्याण्णव", 99: "एकोणशंभर"
  };

  // helper: number < 100
  function twoDigitToWords(n: number): string {
    if (n === 0) return "";
    if (n <= 99) return upto99[n] || "";
    return "";
  }

  // helper: number 0..999
  function threeDigitToWords(n: number): string {
    if (n === 0) return "";
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    let parts: string[] = [];
    if (hundreds > 0) {
      // e.g. 400 -> "चारशे", 100 -> "एकशे"
      const hundredWord = (hundreds === 1 ? "एकशे" : (upto99[hundreds] + "शे"));
      parts.push(hundredWord);
    }
    if (remainder > 0) {
      parts.push(twoDigitToWords(remainder));
    }
    return parts.join(" ").trim();
  }

  // Indian grouping: last 3 digits, then groups of 2 (thousand, lakh, crore, ...)
  const scales = ["", "हजार", "लाख", "कोटी"];
  let n = num;
  const parts: number[] = [];
  parts.push(n % 1000); // last 3 digits
  n = Math.floor(n / 1000);

  while (n > 0) {
    parts.push(n % 100); // next groups of 2
    n = Math.floor(n / 100);
  }

  // Build words from highest group to lowest
  let wordsParts: string[] = [];
  for (let i = parts.length - 1; i >= 0; i--) {
    const val = parts[i];
    if (val === 0) continue;

    if (i === 0) {
      // units (0..999)
      wordsParts.push(threeDigitToWords(val));
    } else {
      // 1..99 with scale (thousand, lakh, ...)
      const w = twoDigitToWords(val);
      if (w) wordsParts.push(w + (scales[i] ? " " + scales[i] : ""));
    }
  }

  const finalWords = wordsParts.join(" ").replace(/\s+/g, " ").trim();
  return finalWords + " रुपये फक्त";
}



