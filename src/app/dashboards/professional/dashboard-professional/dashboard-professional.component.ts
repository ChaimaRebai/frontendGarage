// dashboard-professional.component.ts
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, registerables } from 'chart.js';

// Enregistrer les modules Chart.js
Chart.register(...registerables);

export interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  paymentStatus?: 'Unpaid' | 'Partial' | 'Paid';
  price?: number;
}

export interface Statistic {
  label: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-professional',
  templateUrl: './dashboard-professional.component.html',
  styleUrls: ['./dashboard-professional.component.css'],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class DashboardProfessionalComponent implements OnInit {
  // Use inject to get dependencies
  private modalService = inject(NgbModal);
  
  // Expose Math to the template
  Math = Math;

  // Données d'exemple pour les rendez-vous
  appointments: Appointment[] = [
    { 
      id: 1, 
      date: '2025-06-15', 
      time: '10:00', 
      service: 'Vidange', 
      status: 'Confirmed', 
      clientName: 'Ahmed Benali',
      clientEmail: 'ahmed.benali@email.com',
      clientPhone: '06 12 34 56 78',
      notes: 'Voiture: Renault Clio 2018',
      paymentStatus: 'Paid',
      price: 80
    },
    { 
      id: 2, 
      date: '2025-06-20', 
      time: '14:30', 
      service: 'Diagnostic moteur', 
      status: 'Pending', 
      clientName: 'Ons Cherif',
      clientEmail: 'ons.cherif@email.com',
      clientPhone: '07 98 76 54 32',
      notes: 'Voiture: Peugeot 308 2020, problème au démarrage',
      paymentStatus: 'Unpaid',
      price: 120
    },
    { 
      id: 3, 
      date: '2025-06-22', 
      time: '09:15', 
      service: 'Freins et plaquettes', 
      status: 'Confirmed', 
      clientName: 'Karim Lazaar',
      clientEmail: 'karim.l@email.com',
      clientPhone: '06 45 78 12 36',
      notes: 'Changement des plaquettes avant et arrière',
      paymentStatus: 'Partial',
      price: 220
    },
    { 
      id: 4, 
      date: '2025-06-18', 
      time: '11:30', 
      service: 'Changement pneus', 
      status: 'Completed', 
      clientName: 'Fatima Belkacem',
      clientEmail: 'f.belkacem@email.com',
      clientPhone: '07 14 25 36 98',
      notes: 'Installation des 4 pneus Michelin',
      paymentStatus: 'Paid',
      price: 340
    },
    { 
      id: 5, 
      date: '2025-06-25', 
      time: '16:00', 
      service: 'Révision complète', 
      status: 'Pending', 
      clientName: 'Youssef Mansouri',
      clientEmail: 'y.mansouri@email.com',
      clientPhone: '06 87 52 41 30',
      notes: 'Révision annuelle, 60 000 km',
      paymentStatus: 'Unpaid',
      price: 250
    }
  ];

  // Statistiques pour le tableau de bord
  statistics: Statistic[] = [
    { label: 'Rendez-vous', value: 0, icon: 'calendar-check', color: 'primary' },
    { label: 'En attente', value: 0, icon: 'clock', color: 'warning' },
    { label: 'Complétés', value: 0, icon: 'check-circle', color: 'success' },
    { label: 'Revenus', value: 0, icon: 'euro-sign', color: 'info' }
  ];

  // État du filtre et de la recherche
  searchTerm: string = '';
  statusFilter: string = 'all';
  dateFilter: string = '';
  editingAppointment: Appointment | null = null;
  newAppointment: Appointment = this.getEmptyAppointment();
  sortBy: string = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';
  displayMode: 'list' | 'calendar' = 'list';
  selectedDate: Date = new Date();
  currentView: 'day' | 'week' | 'month' = 'day';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  
  // Indique si nous sommes en train de charger
  loading: boolean = false;
  
  // Pour les graphiques
  appointmentChart: any;
  revenueChart: any;

  constructor() {}

  ngOnInit() {
    this.calculateStatistics();
    this.totalItems = this.appointments.length;
    setTimeout(() => {
      this.initCharts();
    }, 500);
  }

  // Initialiser les graphiques
  initCharts() {
    // Graphique des rendez-vous par statut
    const appointmentCtx = document.getElementById('appointmentChart') as HTMLCanvasElement;
    if (appointmentCtx) {
      this.appointmentChart = new Chart(appointmentCtx, {
        type: 'doughnut',
        data: {
          labels: ['En attente', 'Confirmés', 'Annulés', 'Terminés'],
          datasets: [{
            data: [
              this.appointments.filter(a => a.status === 'Pending').length,
              this.appointments.filter(a => a.status === 'Confirmed').length,
              this.appointments.filter(a => a.status === 'Cancelled').length,
              this.appointments.filter(a => a.status === 'Completed').length
            ],
            backgroundColor: ['#ffc107', '#0d6efd', '#dc3545', '#198754'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // Graphique des revenus par mois
    const revenueCtx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (revenueCtx) {
      this.revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
          datasets: [{
            label: 'Revenus (€)',
            data: [1200, 1900, 1500, 2100, 1800, 2200],
            backgroundColor: 'rgba(13, 110, 253, 0.5)',
            borderColor: 'rgba(13, 110, 253, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Mise à jour des statistiques
  calculateStatistics() {
    this.statistics[0].value = this.appointments.filter(a => a.status === 'Confirmed').length;
    this.statistics[1].value = this.appointments.filter(a => a.status === 'Pending').length;
    this.statistics[2].value = this.appointments.filter(a => a.status === 'Completed').length;
    
    // Calculer les revenus totaux à partir des rendez-vous terminés et payés
    const totalRevenue = this.appointments
      .filter(a => a.status === 'Completed' && a.paymentStatus === 'Paid')
      .reduce((sum, app) => sum + (app.price || 0), 0);
    
    this.statistics[3].value = totalRevenue;
  }

  // Ouvrir la modal pour ajouter/modifier un rendez-vous
  openAppointmentModal(content: any, appointment?: Appointment) {
    if (appointment) {
      this.editingAppointment = { ...appointment };
    } else {
      this.editingAppointment = this.getEmptyAppointment();
    }
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // Créer un nouvel objet rendez-vous vide
  getEmptyAppointment(): Appointment {
    return {
      id: this.appointments.length + 1,
      date: '',
      time: '',
      service: '',
      status: 'Pending',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      notes: '',
      paymentStatus: 'Unpaid',
      price: 0
    };
  }

  // Sauvegarder un rendez-vous (nouveau ou édité)
  saveAppointment() {
    if (this.editingAppointment) {
      const index = this.appointments.findIndex(a => a.id === this.editingAppointment?.id);
      if (index > -1) {
        // Mise à jour d'un rendez-vous existant
        this.appointments[index] = { ...this.editingAppointment };
      } else {
        // Ajout d'un nouveau rendez-vous
        this.appointments.push({ ...this.editingAppointment });
      }
      this.editingAppointment = null;
      this.calculateStatistics();
      this.totalItems = this.filteredAppointments.length;
      this.modalService.dismissAll();
      
      // Mettre à jour les graphiques
      if (this.appointmentChart) {
        this.appointmentChart.data.datasets[0].data = [
          this.appointments.filter(a => a.status === 'Pending').length,
          this.appointments.filter(a => a.status === 'Confirmed').length,
          this.appointments.filter(a => a.status === 'Cancelled').length,
          this.appointments.filter(a => a.status === 'Completed').length
        ];
        this.appointmentChart.update();
      }
    }
  }

  // Supprimer un rendez-vous
  deleteAppointment(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous?')) {
      const index = this.appointments.findIndex(a => a.id === id);
      if (index > -1) {
        this.appointments.splice(index, 1);
        this.calculateStatistics();
        this.totalItems = this.filteredAppointments.length;
      }
    }
  }
  updateStatus(id: number, newStatus: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed') {
    const appointment = this.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = newStatus;
      this.calculateStatistics();
      
      // Update charts if they exist
      if (this.appointmentChart) {
        this.appointmentChart.data.datasets[0].data = [
          this.appointments.filter(a => a.status === 'Pending').length,
          this.appointments.filter(a => a.status === 'Confirmed').length,
          this.appointments.filter(a => a.status === 'Cancelled').length,
          this.appointments.filter(a => a.status === 'Completed').length
        ];
        this.appointmentChart.update();
      }
      
      // Show success message
      alert(`Statut du rendez-vous mis à jour: ${this.getStatusText(newStatus)}`);
    }
  }
  
  // Changer le statut de paiement
  updatePaymentStatus(id: number, status: 'Unpaid' | 'Partial' | 'Paid') {
    const appointment = this.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.paymentStatus = status;
      this.calculateStatistics();
    }
  }

  // Obtenir le texte du statut en français
  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'Pending': 'En attente',
      'Confirmed': 'Confirmé',
      'Cancelled': 'Annulé',
      'Completed': 'Terminé'
    };
    return statusTexts[status] || status;
  }

  // Obtenir le texte du statut de paiement en français
  getPaymentStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'Unpaid': 'Non payé',
      'Partial': 'Partiel',
      'Paid': 'Payé'
    };
    return statusTexts[status] || status;
  }

  // Trier les rendez-vous
  sortAppointments(column: string) {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
  }

  // Filtrer les rendez-vous
  get filteredAppointments(): Appointment[] {
    return this.appointments.filter(appointment => {
      // Filtrer par terme de recherche
      const searchMatch = this.searchTerm === '' || 
                          appointment.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          appointment.service.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtrer par statut
      const statusMatch = this.statusFilter === 'all' || appointment.status === this.statusFilter;
      
      // Filtrer par date
      const dateMatch = this.dateFilter === '' || appointment.date === this.dateFilter;
      
      return searchMatch && statusMatch && dateMatch;
    }).sort((a, b) => {
      // Trier les résultats
      let comparison = 0;
      switch (this.sortBy) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'time':
          comparison = a.time.localeCompare(b.time);
          break;
        case 'clientName':
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        case 'service':
          comparison = a.service.localeCompare(b.service);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Rendez-vous paginés
  get paginatedAppointments(): Appointment[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAppointments.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Changer la page
  changePage(page: number) {
    this.currentPage = page;
  }

  // Calculer le nombre total de pages
  get totalPages(): number[] {
    const pages = Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
    return Array.from({length: pages}, (_, i) => i + 1);
  }

  // Exporter les rendez-vous en CSV
  exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nom Client,Email,Téléphone,Date,Heure,Service,Statut,Paiement,Prix,Notes\n";
    
    this.appointments.forEach(app => {
      csvContent += `${app.id},${app.clientName},${app.clientEmail || ''},${app.clientPhone || ''},${app.date},${app.time},${app.service},${this.getStatusText(app.status)},${this.getPaymentStatusText(app.paymentStatus || 'Unpaid')},${app.price || 0},${app.notes || ''}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rendez-vous_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  }

  // Changer la vue (liste ou calendrier)
  changeView(view: 'list' | 'calendar') {
    this.displayMode = view;
  }

  // Formater la date pour l'affichage
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Obtenir le badge de couleur pour le statut de paiement
  getPaymentStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'Paid':
        return 'bg-success';
      case 'Partial':
        return 'bg-info';
      case 'Unpaid':
      default:
        return 'bg-danger';
    }
  }

  // Créer un rendez-vous rapide
  createQuickAppointment(content: any) {
    this.editingAppointment = this.getEmptyAppointment();
    this.modalService.open(content, { centered: true });
  }


// Send reminder to client
sendReminder(appointment: Appointment) {
  if (appointment.clientEmail) {
    // In a real app, you would send an email here
    alert(`Rappel envoyé à ${appointment.clientName} (${appointment.clientEmail})`);
  } else {
    alert('Aucun email disponible pour ce client');
  }
}

  // Actions disponibles pour un rendez-vous
  getAvailableActions(appointment: Appointment): Array<{icon: string, label: string, action: string, class: string}> {
    const actions = [
      { icon: 'pencil', label: 'Modifier', action: 'edit', class: 'btn-outline-primary' },
      { icon: 'trash', label: 'Supprimer', action: 'delete', class: 'btn-outline-danger' }
    ];

    // Ajouter des actions spécifiques en fonction du statut
    if (appointment.status === 'Pending') {
      actions.push({ icon: 'check', label: 'Confirmer', action: 'confirm', class: 'btn-outline-success' });
    }
    
    if (appointment.status !== 'Cancelled' && appointment.status !== 'Completed') {
      actions.push({ icon: 'x-circle', label: 'Annuler', action: 'cancel', class: 'btn-outline-warning' });
    }
    
    if (appointment.status === 'Confirmed') {
      actions.push({ icon: 'check-circle', label: 'Marquer terminé', action: 'complete', class: 'btn-outline-info' });
    }

    // Ajouter action de rappel par email
    if (appointment.clientEmail) {
      actions.push({ icon: 'bell', label: 'Rappel', action: 'reminder', class: 'btn-outline-secondary' });
    }

    return actions;
  }

  // Exécuter une action sur un rendez-vous
  executeAction(action: string, appointment: Appointment, content?: any) {
    switch(action) {
      case 'edit':
        this.openAppointmentModal(content, appointment);
        break;
      case 'delete':
        this.deleteAppointment(appointment.id);
        break;
      case 'confirm':
        this.updateStatus(appointment.id, 'Confirmed');
        break;
      case 'cancel':
        this.updateStatus(appointment.id, 'Cancelled');
        break;
      case 'complete':
        this.updateStatus(appointment.id, 'Completed');
        break;
      case 'reminder':
        this.sendReminder(appointment);
        break;
    }
  }
  // Add these to your DashboardProfessionalComponent class

// Toggle sidebar visibility
sidebarVisible: boolean = false;

toggleSidebar() {
  this.sidebarVisible = !this.sidebarVisible;
}

// Get user initials for avatar
getUserInitials(): string {
  const name = "Mohammed Gharbi";
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// Update appointment status

}