import Image from "next/image";
import { StaticImageData } from "next/image";
import { FileTreeNode } from "../../_utils/filetree-utils";
import FileAddedIcon from "@/public/icons/file_added.svg";
import FileModifiedIcon from "@/public/icons/file_modified.svg";
import FileRemovedIcon from "@/public/icons/file_removed.svg";
import FileRenamedIcon from "@/public/icons/file_renamed.svg";
import FolderClosedIcon from "@/public/icons/folder_closed.svg";
import FolderOpenIcon from "@/public/icons/folder_open.svg";

const FILE_STATUS_ICONS: Record<string, StaticImageData> = {
  added: FileAddedIcon,
  modified: FileModifiedIcon,
  removed: FileRemovedIcon,
  renamed: FileRenamedIcon,
};

export default function FileTreeIcon({
  node,
  isExpanded,
}: {
  node: FileTreeNode;
  isExpanded: boolean;
}) {
  if (node.type === "directory") {
    return isExpanded ? (
      <Image src={FolderOpenIcon} alt="Open folder" />
    ) : (
      <Image src={FolderClosedIcon} alt="Closed folder" />
    );
  }

  const statusIcon = FILE_STATUS_ICONS[node.fileDiff.status];
  return statusIcon ? <Image src={statusIcon} alt={node.fileDiff.status} /> : null;
}
