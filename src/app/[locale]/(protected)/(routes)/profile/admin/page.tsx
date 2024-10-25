"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { admin } from "@/src/actions/admin";
import { RoleGate } from "@/src/components/auth/role-gate";
import { FormSuccess } from "@/src/components/form-success";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { UserRole } from "@prisma/client";
import { X } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await admin();
      if ('error' in data) {
        toast.error(data.error);
      } else if ('users' in data) {
        const sortedUsers = data.users.sort((a: User, b: User) => {
          const nameA = a.name?.toLowerCase() || "";
          const nameB = b.name?.toLowerCase() || "";
          return nameA.localeCompare(nameB);
        });
        setUsers(sortedUsers);
      }
    } catch (error) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: UserRole) => {
    try {
      const result = await admin([{ userId, newRole }]);
      if ('error' in result) {
        toast.error(result.error);
      } else if ('success' in result) {
        toast.success(result.success);
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update user role.");
    }
  };

  const removeUser = async (userId: string) => {
    try {
      const result = await admin([{ userId, remove: true }]);
      if ('error' in result) {
        toast.error(result.error);
      } else if ('success' in result) {
        toast.success(result.success);
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to remove user.");
    }
  };

  const onServerActionClick = () => {
    admin().then((data) => {
      if ('error' in data) {
        toast.error(data.error);
      } else if ('success' in data) {
        toast.success(data.success);
      }
    });
  };

  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("Allowed API Route!");
      } else {
        toast.error("Forbidden API Route!");
      }
    });
  };

  const renderUserList = () => {
    if (loading) {
      return <p>Loading users...</p>;
    }

    return users.map((user) => (
      <div key={user.id} className="flex items-center justify-between border p-4 shadow-md rounded-md dark:bg-neutral-700 text-neutral-100">
        <div>
          <p className="font-medium">{user.name || "No Name"}</p>
          <p className="text-sm">{user.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={user.role}
            onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
            className="border p-2 rounded-md bg-neutral-500 dark:bg-neutral-900 border-neutral-900 dark:text-neutral-100"
          >
            {Object.keys(UserRole).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            onClick={() => removeUser(user.id)}
            className="text-red-500 hover:text-red-700 relative group"
          >
            <X className="h-5 w-5" />
            <span className="absolute left-full transform translate-x-2 -translate-y-1/2 bg-black text-red-500 text-md rounded-md px-2 py-1 opacity-0 group-hover:opacity-100">
              Remove
            </span>
          </button>
        </div>
      </div>
    ));
  };

  return (
    <Card className="w-[600px] bg-gradient-to-b from-neutral-400/90 to-neutral-700/90">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-md dark:bg-neutral-700 text-neutral-100 dark:text-neutral-100">
          <p className="text-sm font-medium text-neutral-100">Admin-only API Route</p>
          <Button onClick={onApiRouteClick} className="bg-neutral-900 dark:text-neutral-100 border-neutral-900">Click to test</Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-md dark:bg-neutral-700 text-neutral-100 dark:text-neutral-100">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick} className="bg-neutral-900 dark:text-neutral-100 border-neutral-900">Click to test</Button>
        </div>

        <hr className="my-4 border-neutral-900" />

        <div className="space-y-4">
          {renderUserList()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
