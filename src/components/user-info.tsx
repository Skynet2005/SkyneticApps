import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, label }) => {
  const renderUserInfo = (label: string, value: string | null | undefined) => (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-md dark:bg-neutral-700 text-neutral-100">
      <p className="text-sm font-medium">{label}</p>
      <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-neutral-300 rounded-md text-neutral-900">
        {value ?? "N/A"}
      </p>
    </div>
  );

  const renderTwoFactorAuth = (isEnabled: boolean | undefined) => (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-md dark:bg-neutral-700 text-neutral-100">
      <p className="text-sm font-medium">Two Factor Authentication</p>
      <Badge variant={isEnabled ? "success" : "destructive"}>
        {isEnabled ? "ON" : "OFF"}
      </Badge>
    </div>
  );

  return (
    <Card className="w-[600px] bg-gradient-to-b from-neutral-400/90 to-neutral-700/90">
      <CardHeader>
        <p className="text-2xl font-semibold text-center text-neutral-900 dark:text-neutral-100">
          {label}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderUserInfo("ID", user?.id ?? null)}
        {renderUserInfo("Name", user?.name ?? null)}
        {renderUserInfo("Email", user?.email ?? null)}
        {renderUserInfo("Role", user?.role ?? null)}
        {renderTwoFactorAuth(user?.isTwoFactorEnabled)}
      </CardContent>
    </Card>
  );
};
