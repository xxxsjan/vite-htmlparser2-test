import * as htmlparser2 from 'htmlparser2';

let sIdx = -1;
let eIdx = -1;
const  res =[]
let isOpen = false;
let isClose = false;
const htmlString = `<div class='text_content_box2'>😊做个<font color='#dd4b39' class='highlight'>测试</font>😊😊带图文的，完美。做个<font color='#dd4b39' class='highlight'>测试</font>带图文的，完美。做个<font color='#dd4b39' class='highlight'>测试</font>带图文的，完美。做个<font color='#dd4b39' class='highlight'>测试</font>带图文的，完美。做个<font color='#dd4b39' class='highlight'>测试</font>带图文的，完美。做个<font color='#dd4b39' class='highlight'>测试</font>带图文的，完美。做个<font color='#dd4b39' class='highlight'>测试</font>带图文的，完美。</div>`
let str = ''
const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
        if(name !== 'div'){
            isOpen = true;
        }
    },
    ontext(text) {
        // console.log("text -->", text.length);
        sIdx = eIdx + 1
        eIdx = eIdx + text.length
        str += text
    },
    onclosetag(tagname) {
        if(tagname !== 'div'){
            isClose = true;
            console.log(sIdx,eIdx,str.slice(sIdx,eIdx+1));
        }
    },
});

document.body.innerHTML = htmlString;
parser.write(htmlString);
parser.end();