// Recovered from the surviving frontend bundle; local variable names are not original.
import { useQuery, sM, apiClient, rM, Ey } from './runtime.js';
function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const n = (await apiClient.get("/categories")).data.categories;
      return rM(n), n;
    },
    staleTime: Ey,
    gcTime: Ey,
    refetchOnWindowFocus: !1,
    refetchOnMount: !1
  });
}
export { useCategories };
