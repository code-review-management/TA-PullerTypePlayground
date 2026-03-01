import { FileDiff } from "@/types/github.types";

type Segment = string;

export type FileTreeNode =
  | { type: "directory"; name: string; children: FileTreeNode[] }
  | { type: "file"; name: string; fileDiff: FileDiff };

class PrefixTrieNode {
  public children: Map<Segment, PrefixTrieNode>;
  public isFile: boolean;
  public fileDiff?: FileDiff;

  public constructor() {
    this.children = new Map();
    this.isFile = false;
  }
}

class PrefixTrie {
  public root: PrefixTrieNode;

  public constructor() {
    this.root = new PrefixTrieNode();
  }

  public insert(fileDiff: FileDiff) {
    const segments = fileDiff.filename.split("/");

    let node = this.root;
    for (const segment of segments) {
      if (!node.children.has(segment)) {
        node.children.set(segment, new PrefixTrieNode());
      }
      node = node.children.get(segment)!;
    }

    node.isFile = true;
    node.fileDiff = fileDiff;
  }

  public traverse(parent: PrefixTrieNode) {
    const directories: FileTreeNode[] = [];
    const files: FileTreeNode[] = [];

    for (const [segment, child] of parent.children) {
      if (child.isFile) {
        files.push({ type: "file", name: segment, fileDiff: child.fileDiff! });
      } else {
        let collapsedName = segment;
        let node = child;

        while (node.children.size === 1) {
          const next = node.children.entries().next().value!;
          const [nextSegment, nextChild] = next;

          if (nextChild.isFile) break;

          collapsedName += nextSegment;
          node = nextChild;
        }

        directories.push({
          type: "directory",
          name: collapsedName,
          children: this.traverse(node),
        });
      }
    }

    directories.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    return [...directories, ...files];
  }
}

export function buildFileTree(fileDiffs: FileDiff[]) {
  const trie = new PrefixTrie();
  fileDiffs.forEach((fileDiff) => trie.insert(fileDiff));
  return trie.traverse(trie.root);
}
