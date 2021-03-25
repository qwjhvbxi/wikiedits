
function vai2() {
	
	var today = new Date();
	var hr = String(today.getHours()).padStart(2, '0');
	var min = String(today.getMinutes()).padStart(2, '0');
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	
	//var st = yyyy+'-'+mm+'-'+dd+'T'+hr+':'+min+':00';
	en=0;
	//getlatestdate
	if (!localStorage.latestDate) {
		
		var st = (yyyy-1)+'-'+mm+'-'+dd+'T00:00:00';
		//var en='2021-03-01T00:00:00';
		//var st='2021-03-24T00:00:00';
		
	} else {
		calData=JSON.parse(localStorage.getItem("calData"));
		var st = localStorage.latestDate;
	}
	
	wikicall(st,en,0)
}

mwjs = MediaWikiJS('https://en.wikipedia.org');

function wikicall(st,en,cont) {
	
	var textQ={
		action: 'query', 
		list: 'usercontribs', 
		ucuser: 'Ita140188', 
		uclimit: 500,
		ucdir: 'newer',
		ucprop: 'title|timestamp'};
	if (st) {
		textQ['ucstart']=st;
		}
	if (en) {
		textQ['ucend']=en;
		}
	if (cont) {
		textQ['continue']=cont.continue;
		textQ['uccontinue']=cont.uccontinue;
	}
	//console.log(textQ)
	//'2019-01-01T00:00:00'
	mwjs.send(textQ, function (data) {
				
			//var oldestDate = data.query.usercontribs[0].timestamp;
			data.query.usercontribs.forEach(estrai2)
			//console.log(oldestDate)
			console.log(data)
			Prova=data;
			if (data.continue) {
			//wikicall(oldestDate);
				wikicall(st,en,data['continue']);
				console.log('continuing...')
			} else {
				
				//localStorage.setItem("oldestDate", en);
				if (data.query.usercontribs.length>0) {
					var lastEdit = data.query.usercontribs[data.query.usercontribs.length-1].timestamp;
					var secs=Number(lastEdit.slice(-3,-1))+1;
					lastEdit=lastEdit.slice(0,-3)+String(secs).padStart(2, '0')+'Z';
					localStorage.setItem("latestDate", lastEdit);
					localStorage.setItem("calData", JSON.stringify(calData));
				}
				generateCalendar(calData);
				
			}
		});
		
		
	
}


function combineCalData(cal1,cal2) {
	
	
	
}


function estrai2(item, index, arr) {

	var timestmp=item.timestamp;
	var ns=item.ns;
	var tms=timestmp.slice(0,10)
	if (typeof calData[tms] == 'undefined') {
		
		// create an array of calDatas with values for each namespace
		// if ns>15 ... other
		// calDataNS=[];
		// calDataNS=[][ns]={};
		// calDataNS[ns][tms]=...
		
		
		calData[tms]=1;
	} else {
		calData[tms]+=1;
	}
	//console.log(item.timestamp);
}





function vai(y) {
	
	MediaWikiJS('https://en.wikipedia.org', {action: 'query', list: 'usercontribs', ucuser: 'Ita140188', uclimit: 500, ucstart: '2019-01-01T00:00:00', ucprop: 'timestamp|sizediffprop|flags'}, function (data) {
		
    var timestmp = data.query.usercontribs[0].timestamp;
	createc(y);
	data.query.usercontribs.forEach(estrai2)
	createtable(y);
	
	console.log(data)
    
});
}

function createtable(y) {
	
	var s=document.getElementById('dispsvg');
	var q=10;
	var edits;
	s.style.width=((q+1)*54)+'px';
	s.style.height=((q+1)*7)+'px';
	var maxedits=getMax(c[y]);
	var basecolor=220;
	
	for (i=1;i<=365;i++) {
		
		d=new Date(2000+y,00,i);
		
		w=d.getDay();
		if (w==0) { w=7; }
		w=w-1;
		
		Y=y;
		M=d.getMonth();
		D=d.getDate()-1;
		
		//(typeof lastname !== "undefined")
		
		edits=c[Y][M][D];
		
		var colore=basecolor-edits/maxedits*basecolor;
		
		var dayrect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		dayrect.setAttribute("height",q);
		dayrect.setAttribute("width",q);
		dayrect.setAttribute("transform","translate("+(Math.floor((i-w)/7)*(q+1))+","+(w*(q+1))+")");
		dayrect.style.stroke = "#fff"; //Set stroke colour
		dayrect.style.strokeWidth = "0px"; //Set stroke width
		dayrect.style.fill = "rgb("+colore+","+basecolor+","+colore+")";
		s.appendChild(dayrect);
	}

}


function createc(y) {
c=[];
c[y]=[];
for (i=0;i<12;i++) {
	
	c[y][i]=[];
	
	for (j=0;j<31;j++) {
	
		c[y][i][j]=0;
	
	}
	}
}


function estrai(item, index, arr) {

	timestmp=item.timestamp;
	var y=timestmp.slice(2,4)
	var m=parseInt(timestmp.slice(5,7),10)-1;
	var d=parseInt(timestmp.slice(8,10),10)-1;
		
	/*
	if (y!=current[0]) {
		current[0]=y;
		c[y]=[];
	}
	if (m!=current[1]) {
		current[1]=m;
		c[y][m]=[];
	}
	if (d!=current[2]) {
		current[2]=d;
		c[y][m][d]=0;
	}
	*/
	
	c[y][m][d]++;
	//console.log(item.timestamp);


}

function objMax(a) {
	var k=Object.keys(a);
	var maxVal=0;
	for(var i=0;i<k.length;i++)  {
		if (a[k[i]]>maxVal) {
			maxVal=a[k[i]];
		}
	}
	return maxVal;
}

function getMax(a){
	return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
}

function calcmax(a) {
	var maxRow = a.map(function(row){ return Math.max.apply(Math, row); });
	var max = Math.max.apply(null, maxRow);
	return max;
}
