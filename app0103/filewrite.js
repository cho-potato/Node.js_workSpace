/*
Node.js의 FileSystem Module을 이용하면, 파일을 읽을 수 있을 뿐만 아니라
파일에 데이터를 쓰는 것도 가능하다
*/

let fs = require("fs");
// fs.writeFile("파일경로", "채울테이터", functiom() {
// });
fs.writeFile("./res/memo.txt","this is my data", function () {
    // 성공하면 오른쪽이 호출된다
    console.log("쓰기완료");
});