import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-appointment-dialog',
  templateUrl: './edit-appointment-dialog.component.html',
  standalone: false,
})
export class EditAppointmentDialogComponent {
  editedAppointment: any;

  constructor(
    public dialogRef: MatDialogRef<EditAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editedAppointment = { ...data.appointment };
  }

  save() {
    this.dialogRef.close(this.editedAppointment);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
