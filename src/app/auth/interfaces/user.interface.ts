export interface User {
    id: string;
    email: string;
    role: 'client' | 'professional' | 'admin';
}

export interface AuthResponse {
    user: User;
    token: string;
  }
  