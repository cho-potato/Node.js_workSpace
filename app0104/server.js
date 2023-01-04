// 웹서버 구축을 위한 기본 모듈
let http = require("http"); // 내장모듈
let fs = require("fs"); // 내장모듈
let qs = require("querystring"); // 클라이언트의 요청문자 분석 전담
let mysql = require("mysql"); //

let server = http.createServer(function (request, response) {
    if (request.url == "/registform") { // 등록폼을 원하면
        // html을 읽어서 클라이언트의 전송메세지로 사용하자
        // readFileSync() 메서드는 읽어진 데이터를 반환해준다
        let data = fs.readFileSync("./static/join.html", "UTF-8");
        response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
        response.end(data);
    } else if (request.url == "/regist") {
        // 클라이언트가 전송한 파라미터 받기
        request.on("data", function (data) { // 클라이언트가 전송한 데이터가 도달하면
            let json = qs.parse(data.toString()); // 분석 시작
            console.log(json);

            // mysql insert
            let constr = {
                "host": "localhost",
                "user": "root",
                "password": "1234",
                "database": "jsp"
            };
            let con = mysql.createConnection(constr); // 접속객체
            let sql = "insert into member(id, pass, mail_receive)";
            sql += " values(?, ?, ?)";
            con.query(sql, [json.id, json.pass, json.mail_receive], function (err, result) {
                // 쿼리 수행, 익명함수를 통해 수행여부 확인 
                if (err) {
                    response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
                    response.end(등록실패);
                } else {
                    response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
                    response.end(등록성공);
                }
                con.end();
            });
        });
        response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
        response.end("원하니 등록");
    }
});
server.listen(7777, function () {
    console.log("Server is running at 7777 port...");
});

