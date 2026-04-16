import { User } from "@/types/github.types";

export function getDefaultUser() {
  return {
    login: "",
    id: 0,
    avatar_url: "",
  } as User;
}

export function getExampleUser1() {
  return {
    login: "exampleUser1",
    id: 1,
    avatar_url: "",
  } as User;
}

export function getExampleUser2() {
  return {
    login: "exampleUser2",
    id: 2,
    avatar_url: "",
  } as User;
}
