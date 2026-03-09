import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./queryClient";

export function useMalls() {
  return useQuery<any[]>({
    queryKey: ["/api/malls"],
  });
}

export function useAssets(filters?: { mallId?: string; tenantId?: string; type?: string }) {
  const params = new URLSearchParams();
  if (filters?.mallId) params.set("mallId", filters.mallId);
  if (filters?.tenantId) params.set("tenantId", filters.tenantId);
  if (filters?.type) params.set("type", filters.type);
  const qs = params.toString();
  const url = qs ? `/api/assets?${qs}` : "/api/assets";

  return useQuery<any[]>({
    queryKey: [url],
  });
}

export function useCampaigns(tenantId?: string) {
  const url = tenantId ? `/api/campaigns?tenantId=${tenantId}` : "/api/campaigns";
  return useQuery<any[]>({
    queryKey: [url],
  });
}

export function useAnalytics(days: number = 30) {
  return useQuery<any[]>({
    queryKey: [`/api/analytics?days=${days}`],
  });
}

export function usePortfolioStats() {
  return useQuery<{
    totalMalls: number;
    totalAssets: number;
    totalImpressions: number;
    totalFootfall: number;
  }>({
    queryKey: ["/api/portfolio/stats"],
  });
}

export function useUsers() {
  return useQuery<any[]>({
    queryKey: ["/api/users"],
  });
}

export function useCreateCampaign() {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/campaigns", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
    },
  });
}
