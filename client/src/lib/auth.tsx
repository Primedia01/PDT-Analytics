import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "internal" | "sales" | "advertiser" | "mall_partner";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
  tenant_id: string;
  allowedMalls?: string[]; // For mall partners
};

const MOCK_USERS: Record<Role, User> = {
  admin: {
    id: "U1",
    name: "Louis Botha",
    email: "louis@primedia.co.za",
    role: "admin",
    organization: "Primedia",
    tenant_id: "TENANT-1",
  },
  internal: {
    id: "U2",
    name: "Sarah Jenkins",
    email: "sarah@primedia.co.za",
    role: "internal",
    organization: "Primedia",
    tenant_id: "TENANT-1",
  },
  sales: {
    id: "U3",
    name: "Michael Chang",
    email: "michael@primedia.co.za",
    role: "sales",
    organization: "Primedia Sales",
    tenant_id: "TENANT-1",
  },
  advertiser: {
    id: "U4",
    name: "Emma Watson",
    email: "emma@adidas.com",
    role: "advertiser",
    organization: "Adidas",
    tenant_id: "TENANT-2",
  },
  mall_partner: {
    id: "U5",
    name: "David Ndlovu",
    email: "david@mallofafrica.co.za",
    role: "mall_partner",
    organization: "Mall of Africa",
    tenant_id: "TENANT-3",
    allowedMalls: ["MALL-1001"], // Mall of Africa
  },
};

type AuthContextType = {
  user: User;
  setUserRole: (role: Role) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(MOCK_USERS.admin);

  const setUserRole = (role: Role) => {
    setUser(MOCK_USERS[role]);
  };

  return (
    <AuthContext.Provider value={{ user, setUserRole }}>
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
