import { useQuery } from "@tanstack/react-query";
import { getMySessions } from "../session.api";

export function useMySessions() {
  return useQuery({
    queryKey: ["mySessions"],
    queryFn: getMySessions,
  });
}
