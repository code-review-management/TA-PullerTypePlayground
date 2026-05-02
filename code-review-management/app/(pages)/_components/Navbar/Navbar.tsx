"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import IconTooltip from "../IconTooltip/IconTooltip";
import InboxIcon from "@/public/icons/navbar/inbox.svg";
import SignOutIcon from "@/public/icons/navbar/sign_out.svg";
import UserIcon from "../UserIcon/UserIcon";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.group}>
          <Link
            href="/dashboard"
            data-tooltip-id={"tooltip-navbar"}
            data-tooltip-content={"Dashboard"}
            data-tooltip-place="right"
            data-tooltip-delay-show={100}
          >
            <Image src={InboxIcon} alt="Inbox" />
          </Link>
        </div>
        <div className={styles.group}>
          <button onClick={() => signOut()} className={styles.signOutButton}>
            <Image src={SignOutIcon} alt="Sign out" />
          </button>
          {session?.user.image && (
            <UserIcon
              username={session.user.githubLogin}
              avatarUrl={session.user.image}
              size={24}
            />
          )}
        </div>
      </div>
      <IconTooltip id="tooltip-navbar" positionStrategy="fixed" />
    </div>
  );
}
