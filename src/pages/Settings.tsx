
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [emailNotifications, setEmailNotifications] = useState({
    dueDateReminders: true,
    newArrivals: false,
    recommendations: true,
    systemUpdates: isAdmin
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      setIsUpdating(false);
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      setIsUpdating(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setIsUpdating(false);
    }, 1000);
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsUpdating(false);
    }, 1000);
  };
  
  const handleNotificationUpdate = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <PageLayout title="Settings" subtitle="Manage your account settings">
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details and public information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={user?.role === "admin" ? "Administrator" : "User"} disabled />
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handlePasswordChange}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      />
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Change Password"}
                    </Button>
                  </div>
                </form>
                
                {isAdmin && (
                  <div className="pt-6 border-t">
                    <h3 className="font-medium mb-4">Danger Zone</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all of your data
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Email Notifications</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="due-date">Due Date Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when books are about to be due
                        </p>
                      </div>
                      <Switch 
                        id="due-date" 
                        checked={emailNotifications.dueDateReminders}
                        onCheckedChange={(checked) => {
                          setEmailNotifications({...emailNotifications, dueDateReminders: checked});
                          handleNotificationUpdate();
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="new-arrivals">New Book Arrivals</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when new books are added to the library
                        </p>
                      </div>
                      <Switch 
                        id="new-arrivals" 
                        checked={emailNotifications.newArrivals}
                        onCheckedChange={(checked) => {
                          setEmailNotifications({...emailNotifications, newArrivals: checked});
                          handleNotificationUpdate();
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="recommendations">Book Recommendations</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive recommendations based on your reading history
                        </p>
                      </div>
                      <Switch 
                        id="recommendations" 
                        checked={emailNotifications.recommendations}
                        onCheckedChange={(checked) => {
                          setEmailNotifications({...emailNotifications, recommendations: checked});
                          handleNotificationUpdate();
                        }}
                      />
                    </div>
                    
                    {isAdmin && (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-updates">System Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about system updates and maintenance
                          </p>
                        </div>
                        <Switch 
                          id="system-updates" 
                          checked={emailNotifications.systemUpdates}
                          onCheckedChange={(checked) => {
                            setEmailNotifications({...emailNotifications, systemUpdates: checked});
                            handleNotificationUpdate();
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Notification Frequency</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Email Digest Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose how often you want to receive email notifications
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNotificationUpdate} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Settings;
