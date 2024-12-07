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
  end() {
    let token = this.token;
    const nodes = this.nodes;
    let textContent = "";
    const parseStr = (token, pNode) => {
      if (!token) return;
      if (token.startsWith("<div")) {
        this.onopentag("div", {});
        textContent = "";
        const match = token.match(/<div(.*?)>/);
        const attrsStr = match[1];
        const node = {
          tag: "div",
          props: {},
          attrsStr,
          textContent: "",
          children: [],
        };
        nodes.push(node);
        token = token.slice(match[0].length);
        parseStr(token);
      } else if (token.startsWith("<font")) {
        this.onopentag("font", {});

        nodes[nodes.length - 1].textContent += textContent;
        textContent && this.ontext(textContent);
        textContent = "";
        const match = token.match(/<font(.*?)>/);
        const attrsStr = match[1];
        const node = {
          tag: "font",
          props: {},
          attrsStr,
          textContent: "",
          children: [],
        };
        textContent && this.ontext(textContent);
        nodes.push(node);
        token = token.slice(match[0].length);
        parseStr(token);
      } else if (token.startsWith("</div>")) {
        this.onclosetag("div");
        const lastNode = nodes[nodes.length - 1];
        lastNode.textContent = textContent;
        textContent && this.ontext(textContent);

        textContent = "";
        token = token.slice(6);
        parseStr(token);
      } else if (token.startsWith("</font>")) {
        this.onclosetag("div");
        nodes[nodes.length - 1].textContent = textContent;
        textContent && this.ontext(textContent);

        textContent = "";
        const cur = nodes.pop();
        const lastNode = nodes[nodes.length - 1];
        lastNode.children.push({
          type: "text",
          textContent: lastNode.textContent,
        });

        lastNode.textContent = "";
        lastNode.children.push(cur);
        token = token.slice(7);
        parseStr(token);
      } else {
        textContent += token[0];
        token = token.slice(1);
        parseStr(token);
      }
    };
    parseStr(token);
  }
}

const htmlString =
  "<div class='text_content_box2'>😊1<font color='#dd4b39' class='highlight'>测试</font>😊2<font color='#dd4b39' class='highlight'>测试</font>😊3<font color='#dd4b39' class='highlight'>测试</font>😊4<font color='#dd4b39' class='highlight'>测试</font>😊5<font color='#dd4b39' class='highlight'>测试</font>😊6<font color='#dd4b39' class='highlight'>测试</font>😊7</div>";
let sIdx = -1;

let eIdx = -1;
const res = [];
let isOpen = false;
let isClose = false;
let str = "";
const parser = new Parser({
  onopentag(name, attributes) {
    if (name !== "div") {
      isOpen = true;
    }
  },
  ontext(text) {
    console.log("text -->", text);
    sIdx = eIdx + 1;
    eIdx = eIdx + text.length;
    str += text;
  },
  onclosetag(tagname) {
    if (tagname !== "div") {
      isClose = true;
      console.log(sIdx, eIdx, str.slice(sIdx, eIdx + 1));
    }
  },
});
parser.write(htmlString);
parser.end();
console.log(parser);
