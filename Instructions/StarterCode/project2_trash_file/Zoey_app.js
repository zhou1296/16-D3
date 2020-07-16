
var queryUrl = "https://api.covid19api.com/summary";

d3.json(queryUrl, function(data) {
  //console.log(data);
  country_list=data.Countries;
  //console.log(country_list);
  //var filter_country=country_list.filter(d=>d.TotalConfirmed).sort().reverse().slice(0,10);
  country_list.sort((a, b) => parseFloat(b.TotalConfirmed) - parseFloat(a.TotalConfirmed));

  
  console.log(country_list);
  filter_country=country_list.slice(0,10);

  var tbody=d3.select("tbody");
  console.log("filter_country");
  console.log(filter_country);

  filter_country.forEach((f)=>{
        //console.log(f);
        var row =tbody.append("tr");
        Object.entries(f).forEach(([key, value]) => {
        //console.log(key);
            mycols=["Country", "NewConfirmed","TotalConfirmed","NewDeaths","TotalDeaths","NewRecovered","TotalRecovered","Date"];
            if(mycols.includes(key)){
                
                var cell = row.append("td");
                cell.text(value);
        }

  })});
  var country_name=[];
  var TotalConfirmed_list=[];
  var NewConfirmed_list=[];

    filter_country.forEach((f)=>{
      country_name.push(f.Country);
      TotalConfirmed_list.push(f.TotalConfirmed);
      NewConfirmed_list.push(f.NewConfirmed);
    });
      
    console.log(country_name);
    console.log(TotalConfirmed_list);
    console.log(NewConfirmed_list);

    tableData=country_list;
    var button =d3.select("#filter-btn");
    var form =d3.select("#form");
    button.on("click", runEnter);
    form.on("submit",runEnter);
    function runEnter() {
        d3.event.preventDefault();
        var tbody=d3.select("tbody");
        tbody.html(" ");
        var inputElement_country = d3.select('#country');
        var inputValue_country = inputElement_country.property("value");
        console.log(inputValue_country);

    
    if(inputValue_country !=" ") {   
        var filter_data= tableData.filter(d=>{return d.Country==inputValue_country});
    }
    console.log(filter_data);

    filter_data.forEach((f)=>{
        //console.log(f);
        var row=tbody.append("tr");
        Object.entries(f).forEach(([key, value])=>{
            var cell=row.append("td");
            cell.text(value);
        })
    });
};
    //****************************************************************** */

    var svgHeight = 500;
    var svgWidth = 800;

    // margins
    var margin = {
    top: 20,
    right: 0,
    bottom: 50,
    left: 100
    };

    // chart area minus margins
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // create svg container
    var svg = d3.select("#svg-area").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    // shift everything over by the margins
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var choseYAxis="TotalConfirmed";
    // scale y to chart height
    function yScale(filter_country,choseYAxis){
        var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(filter_country,d=>d.choseYAxis)*1.2])
        .range([height, 0]);
        return yLinearScale;
    };

    function renderAxes(newYScale, yAxis){
        var leftAxis=d3.axisLeft(newYScale);
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
      return yAxis;
    }

    function renderBars(barsGroup, newYScale, choseYAxis){
        barsGroup.y=transition()
        .duration(1000)
        .attr("y",d=>newYScale(d[choseYAxis]));
        return barsGroup;
    }

    function updateToolTip(choseYAxis,barsGroup){
        var label;
        if(choseYAxis==="TotalConfirmed"){
            label="TotalConfirmed";
        }
        else{
            label="NewConfirmed";
        }
        var tooTip=d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
        return (`<br>${label} ${d[chosenXAxis]}`);
        });
    

        barsGroup.call(updateToolTip);
        barsGroup.on("mouseover", function() {
            d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("fill", "red");
        })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("fill", "green");
          });

        return barsGroup;
    }
    // scale x to chart width
    var xLinearScale = d3.scaleBand()
    .domain(country_name)
    .range([0, width])
    .padding(0.05);

    var yLinearScale = yScale(filter_country,choseYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, ${width})`)
    .call(leftAxis);

  // append y axis
  chartGroup.append("g")
    .call(bottomAxis);

        
    var barsGroup = chartGroup.selectAll(".bar")
    .data(TotalConfirmed_list)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("x", (d, i) => xLinearScale(country_list[i]))
    .attr("y", (d => yLinearScale(d[choseYAxis])))
    .attr("width", xLinearScale.bandwidth())
    .attr("height", (d => height - yLinearScale(d)));

    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var TotalConfirmedLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "TotalConfirmed") // value to grab for event listener
    .classed("active", true)
    .text("Total Conformed of top10 countries");

  var NewConfirmedLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "NewConfirmed") // value to grab for event listener
    .classed("inactive", true)
    .text("New Confirmed of top10 counties");

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Number of Covid cases");

var barsGroup=updateToolTip(choseYAxis, barsGroup);

labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;
        // updates x scale for new data
        yLinearScale = yScale(filter_country, chosenYAxis);

        // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new x values
        barsGroup = renderBars(barsGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        barsGroup = updateToolTip(chosenYAxis, barsGroup);

        // changes classes to change bold text
        if (chosenYAxis === "TotalConfirmed") {
            TotalConfirmedLabel
            .classed("active", true)
            .classed("inactive", false);
            NewConfirmedLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            TotalConfirmedLabel
            .classed("active", false)
            .classed("inactive", true);
            NewConfirmedLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});



