import { useState } from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Node } from "@tiptap/pm/model";
import Image from "next/image";
import CheckIcon from "@/public/icons/check.svg";
import CopyIcon from "@/public/icons/copy.svg";
import styles from "./CodeBlockComponent.module.css";

export default function CodeBlockComponent({ node }: { node: Node }) {
  const [copiedNew, setCopiedNew] = useState(false);
  const isDiff = node.attrs.language === "diff";

  const getLines = (type: "old" | "new") => {
    return node.textContent
      .split("\n")
      .filter((line) => {
        if (type === "old") return line.startsWith("-");
        if (type === "new") return line.startsWith("+");
        return false;
      })
      .map((line) => line.slice(1))
      .join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getLines("new"));
    setCopiedNew(true);
    setTimeout(() => setCopiedNew(false), 2000);
  };

  return (
    <NodeViewWrapper>
      <div className={styles.wrapper}>
        <pre>
          <code>
            <NodeViewContent />
          </code>
        </pre>
        {isDiff && (
          <div className={styles.actions}>
            <button onClick={handleCopy} className={styles.copy}>
              {copiedNew ? (
                <Image
                  src={CheckIcon}
                  width={12}
                  height={12}
                  alt="Copied new"
                />
              ) : (
                <Image src={CopyIcon} width={12} height={12} alt="Copy new" />
              )}
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
