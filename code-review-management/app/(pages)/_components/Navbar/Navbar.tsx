"use client";

import { signOut, useSession } from "next-auth/react";
import { EXTERNAL_LINKS } from "@/lib/links";
import Image from "next/image";
import Link from "next/link";
import GitHubIcon from "@/public/icons/navbar/github.svg";
import InboxIcon from "@/public/icons/navbar/inbox.svg";
import PullerTypeIcon from "@/public/icons/navbar/pullertype.svg";
import SignOutIcon from "@/public/icons/navbar/sign_out.svg";
import Divider from "../Divider/Divider";
import IconTooltip from "../IconTooltip/IconTooltip";
import UserIcon from "../UserIcon/UserIcon";
import styles from "./Navbar.module.css";

const TOOLTIP_ID = "tooltip-navbar";
const BASE_ICON_SIZE = 20;

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
              width={BASE_ICON_SIZE + 8}
              height={BASE_ICON_SIZE + 8}
            />
          </div>
          <div className={styles.divider}>
            <Divider />
          </div>
          <Link
            className={styles.link}
            href="/dashboard"
            {...getTooltipProps("Dashboard")}
          >
            <Image
              src={InboxIcon}
              alt="Inbox"
              width={BASE_ICON_SIZE}
              height={BASE_ICON_SIZE}
            />
          </Link>
          <a
            className={styles.link}
            href={EXTERNAL_LINKS.GITHUB_APP_INSTALLATION}
            target="_blank"
            rel="noopener noreferrer"
            {...getTooltipProps("Install GitHub App")}
          >
            <Image
              src={GitHubIcon}
              alt="GitHub"
              width={BASE_ICON_SIZE}
              height={BASE_ICON_SIZE}
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
              width={BASE_ICON_SIZE}
              height={BASE_ICON_SIZE}
            />
          </button>
          <div className={styles.userIcon}>
            {session?.user.image && (
              <UserIcon
                username={session.user.githubLogin}
                avatarUrl={session.user.image}
                size={BASE_ICON_SIZE + 6}
              />
            )}
          </div>
        </div>
      </div>
      <IconTooltip id={TOOLTIP_ID} positionStrategy="fixed" />
    </>
  );
}
