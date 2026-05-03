"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import GitHubIcon from "@/public/icons/navbar/github.svg";
import InboxIcon from "@/public/icons/navbar/inbox.svg";
import PullerTypeIcon from "@/public/icons/navbar/pullertype.svg";
import SignOutIcon from "@/public/icons/navbar/sign_out.svg";
import IconTooltip from "../IconTooltip/IconTooltip";
import UserIcon from "../UserIcon/UserIcon";
import styles from "./Navbar.module.css";

const TOOLTIP_ID = "tooltip-navbar";
const ICON_SIZE = 18;

const getTooltipProps = (content: string) => ({
  "data-tooltip-id": TOOLTIP_ID,
  "data-tooltip-content": content,
  "data-tooltip-place": "right" as const,
  "data-tooltip-delay-show": 100,
});

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.group}>
          <div className={styles.logo}>
            <Image
              src={PullerTypeIcon}
              alt="PullerType"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </div>
          <Link
            className={styles.link}
            href="/dashboard"
            {...getTooltipProps("Dashboard")}
          >
            <Image
              src={InboxIcon}
              alt="Inbox"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </Link>
          <a
            className={styles.link}
            href="https://github.com/apps/code-review-management/installations/select_target"
            target="_blank"
            rel="noopener noreferrer"
            {...getTooltipProps("Install GitHub App")}
          >
            <Image
              src={GitHubIcon}
              alt="GitHub"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </a>
        </div>
        <div className={styles.group}>
          <button
            onClick={() => signOut()}
            className={styles.button}
            {...getTooltipProps("Sign out")}
          >
            <Image
              src={SignOutIcon}
              alt="Sign out"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </button>
          {session?.user.image && (
            <UserIcon
              username={session.user.githubLogin}
              avatarUrl={session.user.image}
              size={ICON_SIZE}
            />
          )}
        </div>
      </div>
      <IconTooltip id={TOOLTIP_ID} positionStrategy="fixed" />
    </>
  );
}
