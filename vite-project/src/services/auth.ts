import axios from "axios";

export async function login(email: string, password: string) {
  return axios.post("http://localhost:3000/api/auth/login", { email, password });
}
