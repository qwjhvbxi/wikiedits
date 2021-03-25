
mwjs = MediaWikiJS('https://en.wikipedia.org');

function startCalendar() {
	
	User=jsUcfirst(document.getElementById('username').value);
	console.log(User)
	document.getElementById('calendar-container').innerHTML = "";
	
	var today = new Date();
	var hr = String(today.getHours()).padStart(2, '0');
	var min = String(today.getMinutes()).padStart(2, '0');
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	
	en=0;
	// var st = localStorage.getItem("latestDate");
	var st = localStorage.getItem("latest_"+User);
	
	if (!st) {
		var st = (yyyy-1)+'-'+mm+'-'+dd+'T00:00:00';
		calData = {};
	} else {
		// var st = localStorage.latestDate;
		calData=JSON.parse(localStorage.getItem("calData_"+User));
	}
	
	wikicall(st,en,0)
	
}

function wikicall(st,en,cont) {
	
	var textQ={
		action: 'query', 
		list: 'usercontribs', 
		ucuser: User, 
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
	
	mwjs.send(textQ, function (data) {
		
		// console.log(data)
		data.query.usercontribs.forEach(estrai2)
		if (data.continue) {
			wikicall(st,en,data['continue']);
			console.log('continuing...')
		} else {
			if (data.query.usercontribs.length>0) {
				var lastEdit = data.query.usercontribs[data.query.usercontribs.length-1].timestamp;
				var secs=Number(lastEdit.slice(-3,-1))+1;
				lastEdit=lastEdit.slice(0,-3)+String(secs).padStart(2, '0')+'Z';
				localStorage.setItem("latest_"+User, lastEdit);
				localStorage.setItem("calData_"+User, JSON.stringify(calData));
			}
			generateCalendar(calData);
		}
	});
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

function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}