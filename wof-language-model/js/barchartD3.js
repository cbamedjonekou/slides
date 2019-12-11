// For specific functions - import { select, svg } from 'd3';
// import 'd3';

// Setting adding an 'svg' elem to the DOM 
// These are constant elements that can't be reassigned
// The scope - affects block elements
const svg = d3.select('svg'); 
const width = +svg.attr('width');
const height = +svg.attr('height');

// function called render - to render bars for our graph
const render = (data) => {
    // sets xVal, yVal, and margin
    const xVal = d => d['Frequency']; // assignment w/ function
    const yVal = d => d['Symbol']; 
    const margin = { top: 75, right: 40, bottom: 20, left: 75}

    // sets the inner height &  Width - W/H for group element
    const innerWidth = width - margin['left'] - margin['right'];
    const innerHeight = height - margin['top'] - margin['bottom'];

    // sets the bar color
    const color = d3.scaleOrdinal()
        .range(["#0E72D4", "#B03A2E", "#1ABC9C", "#F1C40F"]);

    // The linear scale - xScale is an instance - controlling width
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xVal)]) // domain is data space - from [min, max] (max = the Frequency of a symbol)
        .range([0, innerWidth]); // range is pixel space - from [min, max] (max = the width of SVG elem)

    // The band scale - yScale is an instance - separates the bars & controls height
    const yScale = d3.scaleBand()
        .domain(data.map(yVal)) // domain is data space - from [min, max] (max = the size of a the symbol name) 
        .range([0, innerHeight]) // range is pixel space - from [min, max] (max = the height of SVG elem)
        .padding(0.15); // sets padding 

    // Creates the group element - the inner rectangle 
    // Applies attribute - an transformation - that translates the margins
    const g = svg.append('g') 
        // `translate(${},${})` - string template literal
        .attr('transform', `translate(${margin['left']},${margin['top']})`);
    
    // Adds the axes - for [yScale, xScale]
    // Appends a new group element and passes the scales
    g.append('g').call(d3.axisLeft(yScale));
    g.append('g').call(d3.axisBottom(xScale))
        // Translates the margin
        .attr('transform', `translate(0,${innerHeight})`);
    
    // Creates the bars using rectangles via data join - converting data to pixel space
    g.selectAll('rect').data(data)
        // Enter Phase: adding rectangles to DOM element - 'g' 
        .enter().append('rect')
            .attr('y', d => yScale(yVal(d))) // ordinal values of data - the names of the Symbols
            .attr('width', d => xScale(xVal(d))) // width are values of Frequency
            .attr('height', d => yScale.bandwidth())
            .style("fill", (d, i) => { return color(i) } ); // 
}

// Reading in the dataset
d3.csv('csv/WoF_unigram_ordered.csv').then((data) => {
    // Function converting 'Frequency' column from 'str' to 'float'
    data.forEach(d => {d['Frequency'] = +d['Frequency'] });

    // Renders the graph
    render(data);
});
