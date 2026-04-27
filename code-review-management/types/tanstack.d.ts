import "@tanstack/react-query";
import { StatusError } from "@/lib/api/errors/status-error";

/**
 * Docs:
 * 1. https://tanstack.com/query/v5/docs/framework/react/typescript#registering-a-global-error
 */

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: StatusError;
  }
}
