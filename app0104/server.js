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
            // 트랜잭션 시작
            con.beginTransaction(); // 트랜잭션 시작
            let sql = "insert into member(id, pass, mail_receive)";
            sql += " values(?, ?, ?)";
            con.query(sql, [json.id, json.pass, json.mail_receive], function (err, result) {
                // 쿼리 수행, 익명함수를 통해 수행여부 확인 
                if (err) {
                    response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
                    response.end("등록실패");
                } else {
                    // response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
                    // response.end("등록성공");
                    // con.rollback(); // con.commit();
                    // 가장 최근 나로 인해 추가된 PK 가져오기
                    sql = "select last_insert_id() as member_idx";
                    con.query(sql, function (err2, rs, fields) { // 바인드 변수가 없으므로 안가져와도 됨
                        if (err2) {
                            console.log("에러", err2);
                        } else {
                            console.log("방금 생성된 IDX는 ", rs[0].member_idx);
                            // 취미레코드 넣기
                            for (let i = 0; i < json.hobby_name.length; i++) {
                                sql= "insert into hobby(member_idx, hobby_name)";
                                sql += " values(?, ?)";
                                con.query(sql, [rs[0].member_idx, json.hobby_name[i]], function(err3, result3) {
                                    if(err3) {
                                        console.log("취미등록실패", err3);
                                        con.rollback();
                                    } else {
                                        response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
                                        response.end("등록성공");
                                        con.commit(); // con.rollback(); // con.commit();
                                    }
                                    // con.end();
                                });
                            }
                        }
                    });
                }
            });
        });
        // response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
        // response.end("원하니 등록");
    }
});
server.listen(7777, function () {
    console.log("Server is running at 7777 port...");
});

