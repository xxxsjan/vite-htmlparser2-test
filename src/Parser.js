function parseAttributes(attributeString) {
  console.log("attributeString: ", attributeString);
  const attributes = {};
  const regex = /([\w-]+)=(['"])([^'\"]*)\2/g;
  let match;

  while ((match = regex.exec(attributeString)) !== null) {
    console.log("match: ", match);
    attributes[match[1]] = match[3];
  }

  return attributes;
}

class Parser {
  constructor(props) {
    this.token = "";
    this.onopentag = props.onopentag;
    this.ontext = props.ontext;
    this.onclosetag = props.onclosetag;
    this.nodes = [];
  }
  write(token) {
    this.token = token;
  }
  end = () => {
    let token = this.token;
    const nodes = this.nodes;
    let textContent = "";
    const parseStr = (token, pNode) => {
      if (!token) return;
      const openTagMatch = token.match(/^<(\w+)(.*?)>/);
      const closeTagMatch = token.match(/^<\/(\w+)>/);

      if (openTagMatch) {
        const tagname = openTagMatch[1];
        this.onopentag(tagname, {});
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          lastNode.textContent += textContent;
          textContent && this.ontext(textContent);
        } else {
          textContent &&
            nodes.push({
              type: "text",
              textContent,
            });
        }
        textContent = "";
        const attrsStr = openTagMatch[2];
        const node = {
          tag: tagname,
          attrsStr,
          attrs: parseAttributes(attrsStr),
          textContent: "",
          children: [],
        };
        nodes.push(node);
        token = token.slice(openTagMatch[0].length);
        parseStr(token);
      } else if (closeTagMatch) {
        const tagname = closeTagMatch[1];
        this.onclosetag(tagname);
        nodes[nodes.length - 1].textContent = textContent;
        textContent && this.ontext(textContent);
        textContent = "";

        const cur = nodes.pop();
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          lastNode.children.push({
            type: "text",
            textContent: lastNode.textContent,
          });
          lastNode.textContent = "";
          lastNode.children.push(cur);
        } else {
          nodes.push(cur);
        }

        token = token.slice(7);
        parseStr(token);
      } else {
        textContent += token[0];
        token = token.slice(1);
        parseStr(token);
      }
    };
    parseStr(token);
  };
}

export default Parser;
