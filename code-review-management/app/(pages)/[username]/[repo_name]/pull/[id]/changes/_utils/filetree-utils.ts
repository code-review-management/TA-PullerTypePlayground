import { FileDiff } from "@/types/github.types";

type Segment = string;

class PrefixTrieNode {
  public children: Record<Segment, PrefixTrieNode>;
  public isFile: boolean;
  public file?: FileDiff;

  public constructor() {
    this.children = {};
    this.isFile = false;
  }
}

class PrefixTrie {
  public root: PrefixTrieNode;

  public constructor() {
    this.root = new PrefixTrieNode();
  }

  public insert(file: FileDiff) {
    const segments = file.filename.split("/");
    let node = this.root;
    for (const segment of segments) {
      if (!(segment in node.children)) {
        node.children[segment] = new PrefixTrieNode();
      }
      node = node.children[segment];
    }
    node.isFile = true;
    node.file = file;
  }
}

export function buildFileTree(files: FileDiff[]) {
  const fileTree = new PrefixTrie();
  files.forEach((file) => fileTree.insert(file));
  console.log(fileTree);
}
