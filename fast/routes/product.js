var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs');
var ejs = require('ejs');
var sys_config    = require('../config/system_config.json');
var pool = require('../db_connect');

//게시판 페이징
router.get("/list", function (req, res) {

//페이지당 게시물 수 : 한 페이지 당 10개 게시물
var page_size = 10;
//페이지의 갯수 : 1 ~ 10개 페이지
var page_list_size = 10;
//limit 변수
var no = "";
//전체 게시물의 숫자
var totalPageCount = 0;

pool.getConnection(function(err, con){
    var sql = 'select count(*) as cnt from tc_sharing_product';
    con.query(sql, function (err, data, fields) {
      con.release();
      if (err) return callback(err);
      
      //전체 게시물의 숫자
      totalPageCount = data[0].cnt

      var page;
      //현제 페이지
      console.log('req.query.pageNum::'+req.query.pageNum);
      console.log('req.params.pageNum::'+req.body.pageNum);
      if(!req.query.pageNum ){
      	page = 1;
      }else{
      	page = req.query.pageNum;
      }
      var curPage = page;

      console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


      //전체 페이지 갯수
      if (totalPageCount < 0) {
      totalPageCount = 0
      }

      var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
      var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
      var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
      var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
      var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


      //현재페이지가 0 보다 작으면
      if (curPage < 0) {
      no = 0
      } else {
      //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
      no = (curPage - 1) * 10
      }

      console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

      var result2 = {
      "curPage": curPage,
      "page_list_size": page_list_size,
      "page_size": page_size,
      "totalPage": totalPage,
      "totalSet": totalSet,
      "curSet": curSet,
      "startPage": startPage,
      "endPage": endPage
      };


      fs.readFile('./views/admin/list.ejs', 'utf-8', function (error, data) {

      if (error) {
      console.log("ejs오류" + error);
      return
      }
      console.log("몇번부터 몇번까지냐~~~~~~~" + no)

      var queryString = 'select tsp.*,F_GET_CODE_VALUE(\'SECONDREJECT\',tsp.second_reject_cd) as secondRejectCdStr'+
      ',F_GET_CODE_VALUE(\'SRR\',tsp.second_ready_reason) AS secondReadyReasonStr,date_format(tsp.create_date,\'%Y%m%d\') as create_date_str,mem.name,photo.photo_path from tc_sharing_product tsp left outer join gd_member mem on mem.m_no = tsp.member_no left outer join tc_sharing_photo photo on photo.sharing_prod_seq = tsp.sharing_prod_seq order by tsp.create_date desc limit ?,?';
      console.log('queryString::'+queryString);
      con.query(queryString, [no, page_size], function (error, result) {
      if (error) {
    	  console.log("페이징 에러" + error);
      return
      }
      res.send(ejs.render(data, {
      data: result,
      img_path : sys_config.img_path,
      pasing: result2
      }));
      });
      });


      })
    });
  });

//var queryString = 'select count(*) as cnt from gd_goods'
//connection.query(queryString, function (error2, data) {
//if (error2) {
//console.log(error2 + "메인 화면 mysql 조회 실패");
//return
//}
//
//
//})

//메인화면
router.get("/main", function (req, res) {
console.log("메인화면")
//main 으로 들어오면 바로 페이징 처리
res.redirect('/pasing/' + 1)

});

//삭제
router.get("/delete/:id", function (req, res) {
console.log("삭제 진행")

connection.query('delete from gd_goods where goodsno = ?', [req.params.goodsno], function () {
res.redirect('/main')
});

})
//삽입 페이지
router.get("/insert", function (req, res) {
console.log("삽입 페이지 나와라")

fs.readFile('insert.html', 'utf-8', function (error, data) {
res.send(data)
})

})
//삽입 포스터 데이터
router.post("/insert", function (req, res) {
console.log("삽입 포스트 데이터 진행")
var body = req.body;
connection.query('insert into gd_goods(name,modelnumber,series) values (?,?,?)', [body.name, body.num, body.section], function () {
//응답
res.redirect('/main');
})

})
//수정 페이지
router.get("/edit/:id", function (req, res) {
console.log("수정 진행")

fs.readFile('edit.html', 'utf-8', function (error, data) {
connection.query('select * from products where id = ?', [req.params.id], function (error, result) {
res.send(ejs.render(data, {
data: result[0]
}))
})
});

})
//수정 포스터 데이터
router.post("/edit/:id", function (req, res) {
console.log("수정 포스트 진행")
var body = req.body;
connection.query('update products set name = ?, modelnumber = ?, series = ? where id = ?',
[body.name, body.num, body.section, req.params.id], function () {
res.redirect('/main')
})
})


//글상세보기
router.get("/detail/:id", function (req, res) {
console.log("수정 진행")

fs.readFile('detail.html', 'utf-8', function (error, data) {
connection.query('select * from products where id = ?', [req.params.id], function (error, result) {
res.send(
		ejs.render(data, {
			data: result[0]
		}))
	})
});


})


module.exports = router
