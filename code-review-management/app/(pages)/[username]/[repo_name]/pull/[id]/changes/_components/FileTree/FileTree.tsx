import { FileTreeNode } from "../../_utils/filetree-utils";
import FileTreeRow from "../FileTreeRow/FileTreeRowRenamed";
import styles from "./FileTree.module.css";

/**
 * Tree of pull request files.
 *
 * @param fileTree: Array of `FileTreeNode`s representing the file hierarchy.
 */
export default function FileTree({ fileTree }: { fileTree: FileTreeNode[] }) {
  return (
    <div className={styles.tree}>
      {fileTree.map((node: FileTreeNode) => (
        <FileTreeRow key={node.name} node={node} />
      ))}
    </div>
  );
}
