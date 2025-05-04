import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditAppointmentDialogComponent } from '../edit-appointment-dialog/edit-appointment-dialog.component';




export interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

export interface Diagnostic {
  date: string;
  description: string;
}

@Component({
  selector: 'app-dashboard-client',
  standalone: false,
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.css'
})



export class DashboardClientComponent {
   // Données des rendez-vous
   appointments: Appointment[] = [
    { id: 1, date: '2025-06-15', time: '10:00', service: 'Vidange', status: 'Confirmed' },
    { id: 2, date: '2025-06-20', time: '14:30', service: 'Diagnostic moteur', status: 'Pending' }
  ];

  // Données des diagnostics
  diagnostics: Diagnostic[] = [
    { date: '2025-03-01', description: 'Diagnostic moteur effectué - Tout est normal' },
    { date: '2025-01-20', description: 'Vidange effectuée - Huile synthétique 5W30' }
  ];

  // Nouveau rendez-vous
  newAppointment = {
    date: '',
    time: '',
    service: ''
  };

  // Services disponibles
  services = [
    'Vidange',
    'Diagnostic moteur',
    'Freinage',
    'Climatisation',
    'Pneumatiques',
    'Carrosserie'
  ];

  // Réserver un rendez-vous
  bookAppointment() {
    if (!this.isFormValid()) return;

    const appointment: Appointment = {
      id: this.generateId(),
      date: this.newAppointment.date,
      time: this.newAppointment.time,
      service: this.newAppointment.service,
      status: 'Pending'
    };

    this.appointments.push(appointment);
    this.resetForm();
  }

  constructor(private dialog: MatDialog) {}


  editAppointment(rdv: any) {
    const dialogRef = this.dialog.open(EditAppointmentDialogComponent, {
      data: { appointment: rdv }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.activeAppointments.findIndex(a => a.id === rdv.id);
        if (index !== -1) {
          this.activeAppointments[index] = result;
        }
      }
    });
  }

  editedAppointment: any = null;

  saveAppointmentChanges() {
    const index = this.activeAppointments.findIndex(
      appt => appt.id === this.editedAppointment.id
    );
    if (index !== -1) {
      this.activeAppointments[index] = { ...this.editedAppointment };
    }
    // Optionally call API to update on the backend
    this.editedAppointment = null;
  }

  // Annuler un rendez-vous
  cancelAppointment(id: number) {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index].status = 'Cancelled';
    }
  }

  // Vérification du formulaire
  isFormValid(): boolean {
    return !!this.newAppointment.date && 
           !!this.newAppointment.time && 
           !!this.newAppointment.service;
  }

  // Réinitialisation du formulaire
  private resetForm() {
    this.newAppointment = {
      date: '',
      time: '',
      service: ''
    };
  }

  // Génération d'ID
  private generateId(): number {
    return Math.max(0, ...this.appointments.map(a => a.id)) + 1;
  }

  // Filtre des rendez-vous actifs
  get activeAppointments() {
    return this.appointments.filter(a => a.status !== 'Cancelled');
  }
  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'Pending': 'En attente',
      'Confirmed': 'Confirmé',
      'Cancelled': 'Annulé',
      'Completed': 'Terminé'
    };
    return statusTexts[status] || status;
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}