(function () {
	const objestFrameGenerator = function (){
		let _this = this;
		document.addEventListener("DOMContentLoaded", (event) => {
			_this.initAllItems();
		});
	}
	objestFrameGenerator.prototype.initAllItems = function (el){
		let _this = this;
		let Items = document.querySelectorAll("[data-objest-frame-generator-list-item]");
		Items.forEach(el => {
			_this.initItem(el,_this);
		})
	};
	objestFrameGenerator.prototype.initItem = function (el){
		let Item = new this.Element(el);
		Item.generate_id();
		Item.InitFrame();
		Item.InitMessage();
	}
	objestFrameGenerator.prototype.Element = function (el){
		this.oldDataString = "";
		this.updatedDataString = "";
		this.data = {};
		this.updatedData = {};
		this._element    = el;
		this.frameStyle   = el.getAttribute("data-frame-style");
		this.src         = el.getAttribute("data-objest-frame-generator-list-item");
	}
	objestFrameGenerator.prototype.Element.prototype.sanitizeString = function (str){
		str = str.replace(/[:|\/|.]/gm,"");
		return str.trim();
	}
	objestFrameGenerator.prototype.Element.prototype.generate_id = function(){
		this.id = this.sanitizeString(this.src + Math.random().toString(36).substr(2, 9));
	}
	objestFrameGenerator.prototype.Element.prototype.InitFrame = function(){
		let frame_url = new URL(this.src)
		frame_url.searchParams.append('__frame_id__',this.id);
		frame_url.searchParams.append('__frame_data__',this.frameStyle);
		frame_url = frame_url.toString();
		this._element.innerHTML = "<iframe src=\"" + frame_url + "\" id=\"" + this.id + "\" width=\"100%\"></iframe>";
	}
	objestFrameGenerator.prototype.Element.prototype.update = function(){
		if (this.updatedDataString !== this.oldDataString){
			this.data = this.updatedData;
			this.oldDataString = this.updatedDataString;
			this._element.querySelectorAll('iframe')[0].style.height = this.data.height;
		}
	}
	objestFrameGenerator.prototype.Element.prototype.parseData = function(data){
		this.updatedDataString = data;
		this.updatedData = JSON.parse(data);
	}
	objestFrameGenerator.prototype.Element.prototype.clearUrl = function(origin){
		origin = origin.replace(new RegExp('https','g'),'');
		origin = origin.replace(new RegExp('http','g'),'');
		return origin;
	}
	objestFrameGenerator.prototype.Element.prototype.InitMessage = function(){
		let _this = this;
		window.addEventListener("message",(event) => {
			let origin = _this.clearUrl(event.origin);
			let url = new URL(_this.src).origin;
				url = _this.clearUrl(url);
			if (url !== origin) {
				return;
			}
			_this.parseData(event.data);
			if(this.updatedData.__frame_id__ !== _this.id){
				return;
			}
			_this.update();
		},false);
	}
	objestFrameGenerator.prototype.init = function (el){
		this.Element = el;
		this.src = el.getAttribute("data-objest-frame-generator-list-item");
	}
	window.objestFrameGenerator = new objestFrameGenerator();
}(window, document));
