var margin = { top: 50, right: 10, bottom: 50, left: 10},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    x = d3.scale.ordinal().rangeRoundBands([0, width], 0.35),
    y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(0)
                    .innerTickSize(-height)
                    .outerTickSize(0)
                    .tickPadding(10);

var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(0)
                    .innerTickSize(-width)
                    .outerTickSize(0)
                    .tickPadding(10);


var svg = d3.select("#expenses-chart")
                .append("svg")
                    .attr("width", width)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



d3.json("data.json", function(data){
    x.domain(data.map(d => d.day));

    y.domain([0, d3.max(data, d => d.amount)]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", "-0.1em")
        .attr("dy", "-0.1em")
        .attr("y", 30)
        .attr("transform", "rotate(0)")

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", "0.8em")
        .attr("text-anchor", "end")
        // .text("Expenses");

    svg.selectAll("bar")
        .data(data)
        .enter()
        .append("rect")
            .style("fill", "hsl(10, 79%, 65%)")
            .attr("rx", 8)
            .attr("x", d => x(d.day))
            .attr("width", x.rangeBand())
            .attr("y", d => y(d.amount))
            .attr("height", d => height - y(d.amount))
            .on("mousemove", showTooltip)
            .on("touchstart", showTooltip)
            .on("mouseout", hideTooltip)
            .on("touchend", hideTooltip);

    var max = d3.max(data, d => d.amount);

    svg.selectAll("rect")
            .filter(d => d.amount === max)
            .classed("max", true)
            .style("fill", "hsl(186, 34%, 60%)");
            
});

var tooltip = d3.select("body")
                    .append("div")
                        .classed("tooltip", true);

function showTooltip(d){
    tooltip
        .style("opacity", 1)
        .style("left", d3.event.x - (tooltip.node().offsetWidth / 2) + "px")
        .style("top", d3.event.y + 25 + "px")
        .html(`
            <p>$ ${d.amount}</p>
        `);
}

function hideTooltip(){
    tooltip
        .style("opacity", 0);
}