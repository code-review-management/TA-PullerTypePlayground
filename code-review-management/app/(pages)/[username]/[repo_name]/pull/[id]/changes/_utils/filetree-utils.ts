import { FileDiff } from "@/types/github.types";

type Segment = string;

export type FileTreeNode =
  | { type: "directory"; name: string; children: FileTreeNode[] }
  | { type: "file"; name: string; fileDiff: FileDiff };

class PrefixTrieNode {
  children: Map<Segment, PrefixTrieNode>;
  isFile: boolean;
  fileDiff?: FileDiff; // Always included if `isFile` is true.

  constructor() {
    this.children = new Map();
    this.isFile = false;
  }
}

class PrefixTrie {
  root: PrefixTrieNode;

  constructor() {
    this.root = new PrefixTrieNode();
  }

  insert(fileDiff: FileDiff) {
    const segments = fileDiff.filename.split("/");

    let node = this.root;
    for (const segment of segments) {
      if (!node.children.has(segment)) {
        node.children.set(segment, new PrefixTrieNode());
      }
      node = node.children.get(segment)!;
    }

    node.isFile = true; // Set `isFile` to true for leaf nodes.
    node.fileDiff = fileDiff; // Include `FileDiff` object for leaf nodes.
  }

  traverse(parent: PrefixTrieNode) {
    // Assemble an array of directories and files at the same level in the tree.
    const directories: FileTreeNode[] = [];
    const files: FileTreeNode[] = [];

    // Traverse through all the children directly connected to the current node.
    for (const [segment, child] of parent.children) {
      if (child.isFile) {
        files.push({ type: "file", name: segment, fileDiff: child.fileDiff! });
      } else {
        let collapsedName = segment;
        let node = child;

        // Collapse directory names if the current directory contains only
        // 1 child that is also a directory.
        while (node.children.size === 1) {
          // Docs: https://stackoverflow.com/a/32373389 (gets the first item in a map)
          const next = node.children.entries().next().value!;
          const [nextSegment, nextChild] = next;

          if (nextChild.isFile) break;

          collapsedName += "/" + nextSegment;
          node = nextChild;
        }

        directories.push({
          type: "directory",
          name: collapsedName,
          children: this.traverse(node),
        });
      }
    }

    // Directories and files at the same level are sorted lexicographically.
    directories.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    // Directories should precede files when they are at the same level.
    return [...directories, ...files];
  }
}

/**
 * Builds a prefix trie from each file's name, then traverses it to produce a
 * data structure that resembles their file path hierarchy.
 * 
 * @param fileDiffs: List of `FileDiff` objects for each of the pull request files.
 */
export function buildFileTree(fileDiffs: FileDiff[]) {
  const trie = new PrefixTrie();
  fileDiffs.forEach((fileDiff) => trie.insert(fileDiff));
  return trie.traverse(trie.root);
}
