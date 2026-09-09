import axios from "axios";
import { env } from "@/config/env";

export const api = axios.create({
  baseURL: env.appUrl || undefined,
  headers: { "Content-Type": "application/json" },
});
