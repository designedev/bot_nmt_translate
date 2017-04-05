var telegram = require('telegram-bot-api');
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var work_count = 0;
const MAX_WORK_COUNT = 10;

var api = new telegram({
	token: '274079929:AAFp5jFfGvXynd3lmvmd9J1QJAqtPzKjmvo',
	updates: {enabled: true}
});

/*
TELEGRAM MESSAGE DATA FORMAT...

{ message_id: 29,
  from: 
   { id: 58034127,
     first_name: 'Torrent',
     last_name: 'of Rivia',
     username: 'torrent' },
  chat: 
   { id: 58034127,
     first_name: 'Torrent',
     last_name: 'of Rivia',
     username: 'torrent',
     type: 'private' },
  date: 1491117892,
  text: '312' }
*/

api.on('message', function(message) {
	console.log(`메세지 수신함 : ${message.from.username} : ${message.text}`);
		console.log("bot load : " + work_count + "/" + MAX_WORK_COUNT);
		if (message.text && check_quota(message)) {
			//get_stat(message);
			translate(message);
			reduce_quota();
		}
});

function check_quota(message) {
	if(work_count >= MAX_WORK_COUNT) {
		send_msg(message.chat.id, "너무 많은 사용자들이 사용하고 있습니다. \n조금 뒤에 시도해주세요.");
		send_msg_to_master("사용자가 너무 많습니다. 대박");
		return false;
	}
	else {
		work_count++;
		console.log(`work count increased ( ${work_count} )`);
		return true;
	}
}

function reduce_quota() {
	work_count --;
	if(work_count <= 0) work_count == 0;
	console.log(`work count decreased ( ${work_count} )`);
}


function send_msg(chat_id, msg) {
	api.sendMessage({
		chat_id: chat_id,
		text: msg
	}).then(function(msg) {
		// console.log(msg);
	}, function(error) {
		// console.log(error);
	});
}

function send_msg_to_master(msg) {
	send_msg(master_user_id, msg);
}


function translate(message) {
  // Build the post string from an object
  var post_data = querystring.stringify({
		'source' : 'ko',
		'target' : 'en',
        'text' : message.text
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'labspace.naver.com',
      port: '80',
      path: '/api/n2mt/translate',
      method: 'POST',
      headers: {
'Host' : 'labspace.naver.com',
'Connection' : 'keep-alive',
'Content-Length': Buffer.byteLength(post_data),
'Pragma' : 'no-cache',
'Cache-Control' : 'no-cache',
'Origin' : 'http://labspace.naver.com',
'x-naver-client-id' : 'labspace',
'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
'content-type' : 'application/x-www-form-urlencoded; charset=UTF-8',
'Accept' : '*/*',
'Referer' : 'http://labspace.naver.com/nmt/',
'Accept-Encoding' : 'gzip, deflate',
'Accept-Language' : 'ko,en;q=0.8,en-US;q=0.6',
'Cookie' : 'NNB=7M6TWYSNJCQVO; npic=nkpfBUh4ZkfAa0NPMrx5H1LiArgvceLV38f73u/bfoRY53G7EYogHQCFzxjkwB7jCA==; m_loc=fd3275cff818ac70d9e8dbcdc884a6f692e4eefc9c57df39a93856474fb74a81; NV_WETR_LAST_ACCESS_RGN_M=02135109; NV_WETR_LOCATION_RGN_M=02135109; _ga=GA1.2.278707754.1472541663; nx_ssl=2; nid_inf=-2133750019; BMR=s=1491202403814&r=http%3A%2F%2Fm.cafe.naver.com%2FArticleRead.nhn%3Fclubid%3D10050146%26menuid%3D749%26articleid%3D372439591&r2=; NID_AUT=cWRIsPMKUUA66yF/t94ks9QtDP1++DqXvxVS8URI1UmDb7UftyAl2KUyXBt3cOjgFXW0N4XOf760ev/UsaxCXKDto/fQpKAgqG1IRXLRAwQ/q2YCd3xgXvO8pqCtlGae; NID_SES=AAABhE0F/MuB5MqpV30HnzS9RBYnm4Qdr0KgyRaPEhYsP154xDZ+KPu1Ml3HXjR23So5LozGSGaBiR83b9WIaqaAl6UngiMmLN1FWt4IxVzFnBierbmwFA0sJ2XfyJOQqTgss1K5W+A69afPVQbFjhZG2HGLblnsLUPtZG8W3rwKEyD9+i9HEMMMw20DAp0/eASpP1h65PfCO4f9b/m1QWpYSs6obz3jUxzbIgPhOavmQJpmKabDv9aFiNp5+e/8EOdroV/xDdfbB2iYbThQ4rYiwV5liE/NgSt99VKPBBQUcE9K9QB7zcy6Y+V3jhd9QNVbo6CTi5zJfN6ji4kAan+HPDUVkcAdzbHgtC6sy6wxErVp9dMGV90cKezdFQBvwLm7pLoFI/pvlH0A8FTq+kFasTfqgPL4hSZZM2nWKaSt3szVCIsuHt9qBDn37D53zb3ToJ4q9EIBK8yOfmFM1gWn9uRkiQHccfntBi1yjLBhSMplROHLlkLg6QfPTs3ja49UzyryXPxr5L7yX2wpcW5Kehw=; wcs_bt=dccae51cc9ffb4:1491292625'
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
		try {
          console.log('Response: ' + chunk);
		  var jsonObj = JSON.parse(chunk);
		  console.log("\n=============================\n");
		  console.log(jsonObj.message.result.translatedText);
		  send_msg(message.chat.id, jsonObj.message.result.translatedText);
		} catch (err) {
		  send_msg(message.chat.id, "error");
		}
      });
  });
  // post the data
  post_req.write(post_data);
  post_req.end();

}


