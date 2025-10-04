import { APIClient } from './apiClient';
import {
  User,
  UserCreate,
  UserLogin,
  Token,
  PasswordReset,
  PasswordResetConfirm,
  ChangePassword,
  UserUpdate,
  UserSettings,
  UserSettingsUpdate,
  AccountDeletion
} from '../types';

class AuthService extends APIClient {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Authentication methods
  async register(userData: UserCreate): Promise<User> {
    return this.post<User>('/auth/register', userData);
  }

  async login(credentials: UserLogin): Promise<Token> {
    const tokens = await this.post<Token>('/auth/login', credentials);
    this.setTokens(tokens);
    return tokens;
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>('/auth/me');
  }

  async forgotPassword(data: PasswordReset): Promise<{ message: string; reset_token?: string }> {
    return this.post<{ message: string; reset_token?: string }>('/auth/forgot-password', data);
  }

  async resetPassword(data: PasswordResetConfirm): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/reset-password', data);
  }

  async changePassword(data: ChangePassword): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/change-password', data);
  }

  async refreshToken(): Promise<Token> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Request failed');
    }

    const tokens = await this.post<Token>('/auth/refresh-token', {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    this.setTokens(tokens);
    return tokens;
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  // Utility methods
  isAuthenticated(): boolean {
    return super.isAuthenticated();
  }

  getUserFromToken(): User | null {
    return super.getUserFromToken();
  }

  async checkUsernameAvailability(username: string): Promise<{ available: boolean; message: string }> {
    return this.get<{ available: boolean; message: string }>(`/auth/check-username/${encodeURIComponent(username)}`);
  }

  // Settings methods
  async getUserSettings(): Promise<UserSettings> {
    return this.get<UserSettings>('/auth/settings');
  }

  async updateUserSettings(settings: UserSettingsUpdate): Promise<UserSettings> {
    return this.put<UserSettings>('/auth/settings', settings);
  }

  async updateUserProfile(profileData: UserUpdate): Promise<User> {
    return this.put<User>('/auth/profile', profileData);
  }

  // Account management
  async deleteAccount(deletionData: AccountDeletion): Promise<{ message: string }> {
    return this.delete<{ message: string }>('/auth/account', { data: deletionData });
  }
}

export const authService = AuthService.getInstance();