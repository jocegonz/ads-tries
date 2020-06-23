class TrieNode {
  constructor() {
    this.words = [];
    this.children = {};
  }
}

class Trie {
  constructor(words, buildCode, Node=TrieNode) {
    this.Node = Node;
    this.buildCode = buildCode;
    this._root = new this.Node();
    this._count = 0;
    this.knownWords = [];
    words.forEach(word => this.addWord(word));
  }

  addWord(word) {
    const code = this.buildCode(word);

    let currentNode = this._root;
    if (this.insert(currentNode, word, code)) {
      this._count += 1;
    }
  }

  insert(currentNode, word, code, index = 0) {
    if (index === code.length) {
      if (currentNode.words.includes(word)) {
        return false;
      }

      currentNode.words.push(word);
      return true;
    }

    const radix = code[index];
    let child = currentNode.children[radix];
    if (!child) {
      child = new TrieNode();
      currentNode.children[radix] = child;
    }
    return this.insert(child, word, code, index + 1);
  }

  lookupCode(code) {
    let currentNode = this._root;
    let end = code.length - 1;

    let i = 0;
    while (i <= code.length) {
      let radix = code[i];

      if (end === i ) {
        if (currentNode.children[radix]) {
          return  currentNode.children[radix].words;
        } else {
          return [];
        }
      } 

      if (currentNode.children[radix]) {
        currentNode = currentNode.children[radix];
      }
      
      i++;
    }
  }

  createPrefixWordList(node, words = []) {
    node.words.forEach(word => {
      words.push(word)
    })
    Object.values(node.children).forEach(child => {
      this.createPrefixWordList(child, words);
    });
    return words;
  }

  lookupPrefix(codePrefix) {
    let currentNode = this._root;
    let end = codePrefix.length - 1;

    let i = 0;
    while (i <= codePrefix.length) {
      let radix = codePrefix[i];
      
      if (currentNode.children[radix]) {
        currentNode = currentNode.children[radix];
      } else {
        return [];
      }

      if (end === i ) {
        return this.createPrefixWordList(currentNode, []);
      } 

      i++;
    }

  }

  count() {
    return this._count;
  }
}

export default Trie;