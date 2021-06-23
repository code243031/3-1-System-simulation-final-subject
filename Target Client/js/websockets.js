// 제작 : 2017243031 최주홍
// LabVIEW와 TCP통신을 위한 자바스크립트
// Copyright © 2016 by MediaMongrels Ltd. 

$(document).ready(function() {  
	
	// 웹소켓 기능을 지원하지 않는 웹 브라우저를 통해 실행되었다면 구글크롬 링크를 보여준다.
	if(!("WebSocket" in window)){  
		$('#chatLog, input, button, #examples').fadeOut("fast");  
		$('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');  
	} else {  
		// 웹소켓 기능을 가진 브라우저라면 connect 함수 호출
		connect();  
	
	}

	// 연결을 주관하는 함수
	function connect(){  
		var socket;  
		var msg_last;
		
		// 포트번호 6123, 언제든 변경가능.
		var host = "ws://localhost:6123";  
  
		try{  
			var socket = new WebSocket(host);  // 웹소켓 객체 선언
  
			message('<p class="event">연결 상태: '+socket.readyState);  
			
			// 연결이 설정되면 open이라는 메세지를 표시
			socket.onopen = function(){  
				message('<p class="event">연결 상태: '+socket.readyState+' (open)');  
			}
			
			// 수신받은 메세지를 표시
			socket.onmessage = function(msg){  
				if(msg.data == "" || msg_last == msg.data){  
					// 중복 or 빈 메세지를 수신받을 경우 처리하지 않음
				}  
				else {
					message('<p class="message">수신: '+msg.data);  
					msg_last = msg.data;
				}
				return;  
			}
			
			// 연결이 종료된 경우 Closed 메세지 표시
			socket.onclose = function(){
				message('<p class="event">연결 상태: '+socket.readyState+' (Closed)');
				alert("연결이 해제되었습니다!");
			}           
  
		} catch(exception){  
			message('<p>Error'+exception);  
		}  
  
		// 서버로 메세지 전송
		function send(){  
			var text = $('#text').val();  
  
			if(text==""){  
				message('<p class="warning">전송할 메세지를 입력하세요.');  
				return;  
			}  
			 
			try {  
				socket.send(text);  
				message('<p class="event">송신: '+text)  
  
			} catch(exception){  
				message('<p class="warning">');  
			}  
			$('#text').val("");  
		}  
		
		// 메세지를 로그에 추가하는 함수 (and close the paragraph)
		function message(msg){  
			$('#chatLog').append(msg+'</p>');  
		}  
  
		$('#text').keypress(function(event) {  
			if (event.keyCode == '13') {  
				send();  
			}  
		});     
		
		// 클라이언트에서의 연결해제
		$('#disconnect').click(function(){  
			socket.close();
			alert("연결이 해제되었습니다!");
		});  
  
	} // 연결종료  
  
}); 