const htmlString =
  "<div class='text_content_box2'>😊1<font color='#dd4b39' class='highlight'>测试</font>😊2<font color='#dd4b39' class='highlight'>测试</font>😊3<font color='#dd4b39' class='highlight'>测试</font>😊4<font color='#dd4b39' class='highlight'>测试</font>😊5<font color='#dd4b39' class='highlight'>测试</font>😊6<font color='#dd4b39' class='highlight'>测试</font>😊7</div>";
let text = "";
let token = htmlString;
const nodes = [];
let textContent = "";
function parseStr(token, pNode) {
  if (!token) return;
  if (token.startsWith("<div")) {
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
    nodes[nodes.length - 1].textContent += textContent;
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
    nodes.push(node);
    token = token.slice(match[0].length);
    parseStr(token);
  } else if (token.startsWith("</div>")) {
    const lastNode = nodes[nodes.length - 1];
    lastNode.textContent = textContent;
    textContent = "";
    token = token.slice(6);
    parseStr(token);
  } else if (token.startsWith("</font>")) {
    nodes[nodes.length - 1].textContent = textContent;
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
}
console.log(parseStr(token));
console.log(nodes);
