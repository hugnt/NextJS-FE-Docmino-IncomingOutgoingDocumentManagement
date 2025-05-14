import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const notifications = [
  { id: 1, title: "Your call has been confirmed.", description: "5 min ago", unread: true },
  { id: 2, title: "You have a new message!", description: "1 hour ago", unread: true },
  { id: 3, title: "Your subscription is expiring soon!", description: "2 hours ago", unread: true },
];

export function TopbarNotification() {
  const [unreadCount, setUnreadCount] = React.useState(3);
  const [notificationItems, setNotificationItems] = React.useState(notifications);

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotificationItems(notificationItems.map((item) => ({ ...item, unread: false })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center text-white rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b px-4 py-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">Notifications</CardTitle>
              <CardDescription className="text-xs">You have {unreadCount} unread notifications</CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto p-0">
            {notificationItems.length > 0 ? (
              <div className="flex flex-col">
                {notificationItems.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 border-b p-4 last:border-0">
                    <div className="flex h-2 w-2 translate-y-1.5 rounded-full bg-primary">
                      {notification.unread && <span className="sr-only">Unread notification</span>}
                    </div>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-6">
                <p className="text-sm text-muted-foreground">No new notifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
