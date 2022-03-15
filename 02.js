$(function() {
	let isUrl = [];
	let isPath = [];
	let fat = true;
	let play = 1;
	isUrl[0] = 'http://' + location.host + '/';

	function getUrl(gUrl) {
		let hs = '';
		$.get(gUrl, res => hs = res)
		const xuan = () => {
			if (hs === '') {
				setTimeout(xuan, 80);
				console.log('获取失败');
				return false;
			}
			console.log('获取成功');
			const reg = /<pre>[\s\S]*<\/pre>/;
			const newD = reg.exec(hs)[0].replace('<pre>', '').replace('</pre>', '');
			document.querySelector('.d').innerHTML = newD;
			getElement();
		}
		xuan();
	}

	getUrl(isUrl[0]);
	getHistory();

	function getElement() {
		let isA = [];
		let noA = [];
		let index = 0;
		const reg = /.mp4$/;
		const getisAs = $('.content .d a'); //小a
		const oldUrl = setOldUrl();
		const newUrl = toUrl();
		for (let i = 0; i < getisAs.length; i++) {
			if (reg.test(getisAs[i].href)) {
				isA.push('<a url="' + (newUrl + getisAs[i].href.replace(isUrl[0],'')) + '" index="' + index + '">' + getisAs[i].text + '</a>');
				$('.content .b').empty().append(isA.join(''));
				index++;
			} else if (oldUrl.indexOf(getisAs[i].href.replace(isUrl[0], '')) !== -1) { //判断是否点击过这个目录
				noA.push('<a url="' + getisAs[i].href + '" class="red">' + getisAs[i].text + '</a>');
				$('.content .c').empty().append(noA.join(''));
			} else {
				noA.push('<a url="' + getisAs[i].href + '">' + getisAs[i].text + '</a>');
				$('.content .c').empty().append(noA.join(''));
			}
		}
		getnoAclick();
		getisAclick();
	}

	function getnoAclick() {
		$('.content .c a').click(function(e) {
			e.preventDefault();
			// let newUrl = '';
			if ($(this).attr('url').indexOf(isUrl[0]) !== -1 && $(this).attr('url') !== isUrl[
					0]) { //判断是否含有域名
				isUrl.push($(this).attr('url').replace(isUrl[0], '')); //获取域名后面的字符串
				isPath.push($(this).attr('url').replace(isUrl[0], ''));
			} else if ($(this).attr('url') !== isUrl[0]) {
				isUrl.push($(this).attr('url'));
				isPath.push($(this).attr('url'));
			} else {
				isUrl.length === 1 ? false : isUrl.pop(); //放回上一级目录
			}
			// isUrl.forEach(item => newUrl += item);
			const newUrl = toUrl(); //拼接链接
			getUrl(newUrl);
		})
	}

	function getisAclick() {
		$('.content .b a').click(function(e) {
			e.preventDefault();
			// let newSrc = '';
			// isUrl.forEach(item => newSrc += item);
			const isUrl = toUrl(); //拼接链接
			$('.content .a video').attr('src',$(this).attr('url'));  // newSrc + $(this).attr('url').replace(isUrl[0], '')
			toPlay($(this).attr('index'));
			$(this).addClass('red');
			getHistory();
		})
	}

	function toPlay(i) {
		let index = i;
		document.querySelector('.content .a video').addEventListener('ended', () => {
			index++;
			document.querySelectorAll('.content .b a')[index].click();
		})
		document.querySelector('.content .a video ').playbackRate = play; //视频播放倍速
	}

	function setOldUrl() {
		let path = Array.from(new Set(isPath));
		let data = sessionStorage.getItem('oldUrl');
		path.length === 0  && data !== '[]' ? path = data : sessionStorage.setItem('oldUrl', JSON.stringify(path));
		return data ? data : '没有数据';
	}
	function getHistory() {
		let oldUrl = '';
		let history = isUrl;
		history.length <= 2 ? console.log('没有数据') : localStorage.setItem('history',JSON.stringify(history));
		let oldData = localStorage.getItem('history');
		oldData = eval(oldData);
		oldData.forEach(item => oldUrl += item);
		$('#history #a').prepend(('<a url="'+oldUrl+'">返回上一个视频目录</a>'));
	}
	function toUrl () {  //拼接链接
		let toUrl = '';
		isUrl.forEach(item => toUrl += item);
		return toUrl;
	}
	function isHisclick() {
		let oldUrl = localStorage.getItem('history');
		$('#history a').click(function()  {
			isUrl = eval(oldUrl);
			getUrl($(this).attr('url'));
		})
	}
	$('.q').click( () =>{
		fat == true ? $('#history').css('display','block') : $('#history').css('display','none');
		fat = !fat;
		isHisclick();
	})
	$('#history #in input').click(function (){
		document.querySelector('.content .a video ').playbackRate = this.value;
		play = this.value;
	})
})
