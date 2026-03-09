import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

export type Role = "admin" | "internal" | "sales" | "advertiser" | "mall_partner";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
  tenantId: string;
  allowedMalls?: string[] | null;
};

const FALLBACK_USERS: Record<Role, User> = {
  admin: { id: "U1", name: "Louis Botha", email: "louis@primedia.co.za", role: "admin", organization: "Primedia", tenantId: "TENANT-1" },
  internal: { id: "U2", name: "Sarah Jenkins", email: "sarah@primedia.co.za", role: "internal", organization: "Primedia", tenantId: "TENANT-1" },
  sales: { id: "U3", name: "Michael Chang", email: "michael@primedia.co.za", role: "sales", organization: "Primedia Sales", tenantId: "TENANT-1" },
  advertiser: { id: "U4", name: "Emma Watson", email: "emma@adidas.com", role: "advertiser", organization: "Adidas", tenantId: "TENANT-2" },
  mall_partner: { id: "U5", name: "David Ndlovu", email: "david@mallofafrica.co.za", role: "mall_partner", organization: "Mall of Africa", tenantId: "TENANT-3", allowedMalls: ["MALL-1001"] },
};

type AuthContextType = {
  user: User;
  setUserRole: (role: Role) => void;
  users: Record<Role, User>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: apiUsers } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const usersMap: Record<Role, User> = apiUsers && apiUsers.length > 0
    ? apiUsers.reduce((acc, u) => {
        acc[u.role as Role] = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as Role,
          organization: u.organization,
          tenantId: u.tenantId,
          allowedMalls: u.allowedMalls,
        };
        return acc;
      }, {} as Record<Role, User>)
    : FALLBACK_USERS;

  const [currentRole, setCurrentRole] = useState<Role>("admin");
  const user = usersMap[currentRole] || FALLBACK_USERS[currentRole];

  const setUserRole = (role: Role) => {
    setCurrentRole(role);
  };

  return (
    <AuthContext.Provider value={{ user, setUserRole, users: usersMap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
