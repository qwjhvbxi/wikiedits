

function generateCalendar(calData) {

    // SPACING includes square size and gutters
    const SPACING = 13;
    const SQUARE_SIZE = 11;
    const MARKED_DAY_COLOR = '#229944';//'#52BA69';
    const UNMARKED_DAY_COLOR = '#eee';
	const MaxEdits = objMax(calData);

    function padWithZeroes (x) {
      return (+x < 10) ? '0' + x : x;
    }

    // pass in a date object and get 'YYYY-MM-DD' string
    function getYYYYMMDD (date) {
      let yyyy = date.getFullYear().toString();
      let mm = (date.getMonth()+1).toString();
      let dd = date.getDate().toString();
      return yyyy + '-' + padWithZeroes(mm) + '-' + padWithZeroes(dd);
    }

    // takes x coord and month name as string
    function drawMonthText(x, month) {
      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('class', 'calendar-monthname');
      text.setAttribute('y', '-5');
      text.setAttribute('x', x);
      const mthName = document.createTextNode(month);
      text.appendChild(mthName);
      mainG.appendChild(text);
    }

    // draw 1 column of squares
    function addColumn(x, startAtY, stopAtY, squareDate, mthName) {
      const g = document.createElementNS(svgNS, 'g');

      // draw new month name if arg was passed
      if (mthName) {
        drawMonthText(x, mthName);
      }

      // draw column of squares; startAtY makes it start further down than normal
      // and stopAtY makes it stop further up than normal
      let lowerLimit = (startAtY !== null) ? startAtY : 0;
      let upperLimit = (stopAtY !== null) ? stopAtY : 6;
      for (let i = lowerLimit; i <= upperLimit; i++) {
        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('y', (i * SPACING));
        rect.setAttribute('width', SQUARE_SIZE);
        rect.setAttribute('height', SQUARE_SIZE);
        rect.setAttribute('class', 'calendar-day');
        rect.setAttribute('fill', UNMARKED_DAY_COLOR);
        // attach data attr showing square's date as YYYY-MM-DD
        let dateString = getYYYYMMDD(squareDate);
        rect.setAttribute('data-date', dateString);
		let thisValue = 0;
        // check our passed-in data for date-value pairs
        if (calData.hasOwnProperty(dateString)) {
          rect.setAttribute('data-value', calData[dateString]);
          // mark the square with a color if it's over 0
          if (calData[dateString] > 0) {
            rect.setAttribute('fill', MARKED_DAY_COLOR);
			rect.setAttribute('fill-opacity', 0.2+(calData[dateString]/MaxEdits)*0.8);
			thisValue=calData[dateString];
          }
        } else {
          rect.setAttribute('data-value', '0');
        }
		ttip=document.createElementNS("http://www.w3.org/2000/svg", 'title');
		ttip.innerHTML=dateString+' - Edits: '+thisValue;
		rect.appendChild(ttip);
        g.setAttribute('transform', 'translate(' + x + ',0)');
        g.appendChild(rect);
        squareDate.setDate(squareDate.getDate() + 1);
      }
      mainG.appendChild(g);
    }

    // get date of first square, one year ago
    function getStartDate() {
      const now = new Date();
      const startDate = new Date();
      startDate.setDate(now.getDate() - 365);
      return startDate;
    }

    // draw any text; takes x/y coords, text string and optional class name
    function drawText(x, y, t, className) {
      const text = document.createElementNS(svgNS, 'text');
      if (className) text.setAttribute('class', className);
      text.setAttribute('y', y);
      text.setAttribute('x', x);
      const mthName = document.createTextNode(t);
      text.appendChild(mthName);
      mainG.appendChild(text);
    }

    function drawCalendar() {
      // daysOfWeek represents a column's y values for each weekday
      // e.g. Mondays are always y = 13, Tuesdays are y = 26, etc.
      const daysOfWeek = [];
      for (let i = 0; i < 7; i++) {
        daysOfWeek.push(i * SPACING);
      }

      // draw the labels for M, W, F
      const dayLabels = ['M', 'W', 'F'];
      for (let i in dayLabels) {
        drawText(-10, i * 26 + 22, dayLabels[i], 'calendar-daylabel');
      }

      const mthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // determine which day of the week the first and last squares were
      // so we can draw the first and last columns
      const startDate = getStartDate();
      const firstDayWasA = startDate.getDay();
      const today = new Date(); // i.e. now
      const todayIsA = today.getDay();
      const msInAYear = 864e5;

      // draw a column for each week
      // if we're now in a new month, pass month name as arg
      const squareDate = getStartDate();
      let curMonth = squareDate.getMonth();
      let mthName = mthNames[curMonth % 12];
      let numColumns = (todayIsA === 0) ? 54 : 53;
      for (let i = 0; i < numColumns; i++) {
        let s = null;
        let z = null;
        if (i === 0) s = firstDayWasA;
        if (i === (numColumns - 1)) z = todayIsA;
        addColumn(i * SPACING, s, z, squareDate, mthName);
        // remember squareDate increments each time addColumn is called
        if (squareDate.getMonth() > curMonth || (squareDate.getMonth() === 0 && curMonth === 11)) {
          curMonth++;
          curMonth = curMonth % 12;
          mthName = mthNames[curMonth];
        } else {
          mthName = null;
        }
      }
    }
	
	function drawLegend2() {
		
		//0
		//MaxEdits
		
		for (var i=0;i<5;i++) {
			const rect2 = document.createElementNS(svgNS, 'rect');
			rect2.setAttribute('x', (i * SPACING));
			rect2.setAttribute('width', SQUARE_SIZE);
			rect2.setAttribute('height', SQUARE_SIZE);
			if (i==0) {
				rect2.setAttribute('fill', UNMARKED_DAY_COLOR);
			} else {
				rect2.setAttribute('fill', MARKED_DAY_COLOR);
				rect2.setAttribute('fill-opacity', 0.2+i/4*0.8);
			}
			leg.appendChild(rect2);
		}
        
		const textMin = document.createElementNS(svgNS, 'text');
		const textMinVal = document.createTextNode('0');
		textMin.setAttribute('class', 'calendar-monthname');
		textMin.setAttribute('y', -5);
		textMin.setAttribute('x', 0);
		textMin.appendChild(textMinVal);
		leg.appendChild(textMin);
		
		const textMin1 = document.createElementNS(svgNS, 'text');
		const textMinVal1 = document.createTextNode('1');
		textMin1.setAttribute('class', 'calendar-monthname');
		textMin1.setAttribute('y', -5);
		textMin1.setAttribute('x', SPACING);
		textMin1.appendChild(textMinVal1);
		leg.appendChild(textMin1);
		
		const textMax = document.createElementNS(svgNS, 'text');
		const textMaxVal = document.createTextNode(MaxEdits);
		textMax.setAttribute('class', 'calendar-monthname');
		textMax.setAttribute('y', -5);
		textMax.setAttribute('x', 4 * SPACING);
		textMax.appendChild(textMaxVal);
		leg.appendChild(textMax);
	}

    // svg itself
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.id = 'calendar';
    svg.setAttribute('width', '720px');
    svg.setAttribute('height', '140px');
    document.getElementById('calendar-container').appendChild(svg);

    // main group that contains everything within svg
    const mainG = document.createElementNS(svgNS, 'g');
    mainG.setAttribute('transform', 'translate(20,20)');
    svg.appendChild(mainG);
	
	const leg = document.createElementNS(svgNS, 'g');
	leg.setAttribute('transform', 'translate(20,130)');
	svg.appendChild(leg);
	
	var Style="* {font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;} .calendar-monthname { font-size: 10px; fill: $calendar-textlabelcolor;} .calendar-daylabel {  fill: $calendar-textlabelcolor;  font-size: 10px;  text-anchor: middle;}	.calendar-day {	  &:hover {	stroke: $calendar-bordercolor;	  }	}";
	var styleElement = document.createElementNS(svgNS, "style");
	styleElement.textContent = Style; 
	svg.appendChild(styleElement);
	
	drawLegend2();
    drawCalendar();

	saveSvg(svg, 'test.svg')
	
}