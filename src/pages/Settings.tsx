import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Monitor,
  Moon,
  Sun,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { authService } from '@/lib/authService';
import { UserSettings, UserSettingsUpdate, AccountDeletion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    role: '',
    institution: '',
    dark_mode: false,
    interface_scale: 'normal',
    default_analysis_model: 'advanced',
    email_notifications: true,
    push_notifications: true,
    analysis_notifications: true,
    report_notifications: true,
    data_retention_period: '1year',
    anonymous_analytics: true,
    data_sharing: false
  });

  // Profile state
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Account deletion state
  const [deletionData, setDeletionData] = useState({
    password: '',
    confirm_deletion: false
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Load user settings
      const userSettings = await authService.getUserSettings();
      setSettings(userSettings);
      
      // Load current user profile
      const currentUser = await authService.getCurrentUser();
      setProfile({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email,
        phone_number: currentUser.phone_number || ''
      });
      
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: UserSettingsUpdate) => {
    try {
      setIsSaving(true);
      const updatedSettings = await authService.updateUserSettings(updates);
      setSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Settings updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileSave = () => {
    updateSettings({
      role: settings.role,
      institution: settings.institution
    });
  };

  const handleProfileInfoSave = async () => {
    try {
      setIsSaving(true);
      
      // Call the profile update API
      const updatedUser = await authService.updateUserProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone_number: profile.phone_number
      });
      
      // Update local state with the response
      setProfile({
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number || ''
      });
      
      toast({
        title: "Success",
        description: "Profile information updated successfully.",
      });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.detail || "Failed to update profile. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await authService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      });
      
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      toast({
        title: "Success",
        description: "Password changed successfully.",
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!deletionData.password) {
      toast({
        title: "Error",
        description: "Password is required to delete your account.",
        variant: "destructive",
      });
      return;
    }

    if (!deletionData.confirm_deletion) {
      toast({
        title: "Error",
        description: "Please confirm that you want to delete your account.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await authService.deleteAccount(deletionData);
      
      // Clear tokens and redirect to login
      authService.logout();
      
      toast({
        title: "Account Deactivated",
        description: "We're sorry to see you go. Your account has been deactivated and your personal information has been anonymized.",
      });
      
      // Redirect to login page
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please check your password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setShowDeleteDialog(false);
    }
  };

  const handlePreferencesSave = () => {
    updateSettings({
      dark_mode: settings.dark_mode,
      interface_scale: settings.interface_scale,
      default_analysis_model: settings.default_analysis_model
    });
  };

  const handleNotificationsSave = () => {
    updateSettings({
      email_notifications: settings.email_notifications,
      push_notifications: settings.push_notifications,
      analysis_notifications: settings.analysis_notifications,
      report_notifications: settings.report_notifications
    });
  };

  const handlePrivacySave = () => {
    updateSettings({
      data_retention_period: settings.data_retention_period,
      anonymous_analytics: settings.anonymous_analytics,
      data_sharing: settings.data_sharing
    });
  };

  return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--gradient-medical)] flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="medical-heading text-2xl">Settings</h1>
            <p className="clinical-text">Manage your preferences and account settings</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="clinical-text text-sm mt-1">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.first_name} 
                      onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                      className="medical-input" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profile.last_name} 
                      onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                      className="medical-input" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profile.email} 
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="medical-input" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone_number} 
                    onChange={(e) => setProfile(prev => ({ ...prev, phone_number: e.target.value }))}
                    className="medical-input" 
                    placeholder="Enter your phone number"
                  />
                </div>

                <Button 
                  className="clinical-button" 
                  onClick={handleProfileInfoSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Profile Information'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Professional Settings
                </CardTitle>
                <CardDescription>
                  Update your professional information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={settings.role || ''} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger className="medical-input">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="radiologist">Radiologist</SelectItem>
                        <SelectItem value="technician">Medical Technician</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input 
                      id="institution" 
                      value={settings.institution || ''} 
                      onChange={(e) => setSettings(prev => ({ ...prev, institution: e.target.value }))}
                      className="medical-input" 
                      placeholder="Enter your institution"
                    />
                  </div>
                </div>

                <Button 
                  className="clinical-button" 
                  onClick={handleProfileSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Professional Settings'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="clinical-text text-sm">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Switch 
                      checked={settings.dark_mode} 
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dark_mode: checked }))}
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interface Scale</Label>
                  <Select 
                    value={settings.interface_scale} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, interface_scale: value }))}
                  >
                    <SelectTrigger className="medical-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Analysis Model</Label>
                  <Select 
                    value={settings.default_analysis_model} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, default_analysis_model: value }))}
                  >
                    <SelectTrigger className="medical-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast Analysis</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="clinical-button" 
                  onClick={handlePreferencesSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="clinical-text text-sm">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={settings.email_notifications} 
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, email_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="clinical-text text-sm">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch 
                    checked={settings.push_notifications} 
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, push_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analysis Complete</Label>
                    <p className="clinical-text text-sm">
                      Notify when analysis is complete
                    </p>
                  </div>
                  <Switch 
                    checked={settings.analysis_notifications} 
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, analysis_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Report Generation</Label>
                    <p className="clinical-text text-sm">
                      Notify when reports are generated
                    </p>
                  </div>
                  <Switch 
                    checked={settings.report_notifications} 
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, report_notifications: checked }))
                    }
                  />
                </div>

                <Button 
                  className="clinical-button" 
                  onClick={handleNotificationsSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Notifications'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your privacy and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data Retention Period</Label>
                  <Select 
                    value={settings.data_retention_period} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, data_retention_period: value }))}
                  >
                    <SelectTrigger className="medical-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonymous Analytics</Label>
                    <p className="clinical-text text-sm">
                      Help improve the platform with anonymous usage data
                    </p>
                  </div>
                  <Switch 
                    checked={settings.anonymous_analytics} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, anonymous_analytics: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Sharing</Label>
                    <p className="clinical-text text-sm">
                      Allow sharing anonymized data for research
                    </p>
                  </div>
                  <Switch 
                    checked={settings.data_sharing} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, data_sharing: checked }))}
                  />
                </div>

                <Button 
                  className="clinical-button" 
                  onClick={handlePrivacySave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Privacy Settings'
                  )}
                </Button>

                <div className="pt-4 border-t border-border">
                  <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                          Delete Account
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>
                            <strong>This action will deactivate your account.</strong> Your account will be marked as deleted 
                            and your personal information will be anonymized. You will no longer be able to access your account.
                          </p>
                          <p>
                            We're sorry to see you go, but we understand that sometimes it's necessary. 
                            Before we can proceed, please confirm your identity and your decision.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="deletePassword" className="text-sm font-medium">
                            Confirm your password
                          </Label>
                          <Input
                            id="deletePassword"
                            type="password"
                            value={deletionData.password}
                            onChange={(e) => setDeletionData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter your current password"
                            className="w-full"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="confirmDeletion"
                            checked={deletionData.confirm_deletion}
                            onChange={(e) => setDeletionData(prev => ({ ...prev, confirm_deletion: e.target.checked }))}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="confirmDeletion" className="text-sm">
                            I understand that this action will deactivate my account and I want to proceed
                          </Label>
                        </div>
                      </div>
                      
                      <AlertDialogFooter>
                        <AlertDialogCancel 
                          onClick={() => {
                            setDeletionData({ password: '', confirm_deletion: false });
                          }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleAccountDeletion}
                          disabled={isSaving || !deletionData.password || !deletionData.confirm_deletion}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete Account'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <p className="clinical-text text-sm mt-2">
                    This action will deactivate your account. Your personal information will be anonymized and you will lose access to your account.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    className="medical-input" 
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    className="medical-input" 
                    placeholder="Enter your new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    className="medical-input" 
                    placeholder="Confirm your new password"
                  />
                </div>

                <Button 
                  className="clinical-button" 
                  onClick={handlePasswordChange}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};