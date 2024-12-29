import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';

@Component({
  selector: 'app-dialog-common',
  templateUrl: './dialog-common.component.html',
  styleUrls: ['./dialog-common.component.css'],
})
export class DialogCommonComponent {
  constructor(private dialog: MatDialog) {}

  openDialog(title: string, message: string, type: string): void {
    this.dialog.open(CommonDialogComponent, {
      data: { title, message, type }
    });
  }

  openSuccessDialog(): void {
    this.openDialog('Success', 'The operation was successful!', 'success');
  }

  openWarningDialog(): void {
    this.openDialog('Warning', 'This is a warning message.', 'warning');
  }

  openErrorDialog(): void {
    this.openDialog('Error', 'An error has occurred.', 'error');
  }

  openInfoDialog(): void {
    this.openDialog('Info', 'This is an informational message.', 'info');
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      data: { title: 'Confirm', message: 'Are you sure you want to proceed?', type: 'confirm' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed the action.');
      } else {
        console.log('User cancelled the action.');
      }
    });
  }
}
