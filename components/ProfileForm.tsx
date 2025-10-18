'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

interface UserProfile {
  age?: number;
  focusGoal?: string;
  preferredMode?: 'focus' | 'calm' | 'energize';
  preferredFrequency?: number;
  timezone?: string;
  notificationsEnabled?: boolean;
  theme?: 'light' | 'dark';
  bio?: string;
  avatar?: string;
}

interface ProfileFormProps {
  onSave?: () => void;
}

export function ProfileForm({ onSave }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    preferredMode: 'focus',
    preferredFrequency: 40,
    notificationsEnabled: true,
    theme: 'dark',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load profile from localStorage
    const stored = localStorage.getItem('focusync_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.profile) {
          setProfile(user.profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update profile');
        return;
      }

      // Update localStorage
      const user = JSON.parse(localStorage.getItem('focusync_user') || '{}');
      user.profile = profile;
      localStorage.setItem('focusync_user', JSON.stringify(user));

      setSuccess(true);
      onSave?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Customize your FOCUSYNC experience</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Profile updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="13"
                max="120"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : undefined })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={profile.timezone || 'UTC'} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                <SelectTrigger id="timezone" disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time</SelectItem>
                  <SelectItem value="CST">Central Time</SelectItem>
                  <SelectItem value="MST">Mountain Time</SelectItem>
                  <SelectItem value="PST">Pacific Time</SelectItem>
                  <SelectItem value="GMT">GMT</SelectItem>
                  <SelectItem value="CET">Central European Time</SelectItem>
                  <SelectItem value="IST">Indian Standard Time</SelectItem>
                  <SelectItem value="JST">Japan Standard Time</SelectItem>
                  <SelectItem value="AEST">Australian Eastern Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="focusGoal">Focus Goal</Label>
            <Textarea
              id="focusGoal"
              placeholder="What do you want to achieve with FOCUSYNC?"
              value={profile.focusGoal || ''}
              onChange={(e) => setProfile({ ...profile, focusGoal: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredMode">Preferred Mode</Label>
              <Select value={profile.preferredMode || 'focus'} onValueChange={(value: any) => setProfile({ ...profile, preferredMode: value })}>
                <SelectTrigger id="preferredMode" disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="focus">Focus (Gamma 40Hz)</SelectItem>
                  <SelectItem value="calm">Calm (Alpha 10Hz)</SelectItem>
                  <SelectItem value="energize">Energize (Beta 20Hz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredFrequency">Preferred Frequency (Hz)</Label>
              <Input
                id="preferredFrequency"
                type="number"
                min="2"
                max="40"
                step="1"
                value={profile.preferredFrequency || 40}
                onChange={(e) => setProfile({ ...profile, preferredFrequency: parseInt(e.target.value) })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={profile.theme || 'dark'} onValueChange={(value: any) => setProfile({ ...profile, theme: value })}>
                <SelectTrigger id="theme" disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={profile.notificationsEnabled || false}
                  onCheckedChange={(checked) => setProfile({ ...profile, notificationsEnabled: checked })}
                  disabled={loading}
                />
                <Label htmlFor="notifications" className="cursor-pointer">
                  Enable Notifications
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

