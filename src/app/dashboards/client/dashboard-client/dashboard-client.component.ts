import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

export interface Appointment {
  date: string;
  time: string;
  service: string;
  status: string;
}



@Component({
  selector: 'app-dashboard-client',
  standalone: false,
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.css'
})



export class DashboardClientComponent {
  viewDate: Date = new Date();
  events: CalendarEvent[] = []; // Tableau des événements (rendez-vous)

  // Modèle pour un rendez-vous
  appointment: Appointment = { date: '', time: '', service: '', status: '' };
  appointments: Appointment[] = []; // Liste des rendez-vous
  diagnostics = [
    { date: '2025-03-01', description: 'Diagnostic moteur effectué.' },
    { date: '2025-01-20', description: 'Vidange effectuée.' },
  ];

  // Méthode pour réserver un rendez-vous
  bookAppointment() {
    if (!this.appointment.date || !this.appointment.time || !this.appointment.service) return;

    const newRdv: Appointment = {
      ...this.appointment,
      status: 'Pending'
    };

    this.appointments.push(newRdv);
    this.events.push({
      title: `${newRdv.service} (${newRdv.status})`,
      start: new Date(`${newRdv.date}T${newRdv.time}:00`),
      color: { primary: '#f39c12', secondary: '#f39c12' },
      meta: newRdv
    });

    this.appointment = { date: '', time: '', service: '', status: '' };
  }
}