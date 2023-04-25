const max_time_value = 60000; // tiempo del color más rojo, también tiempo de animación
var highlightedSquare = null;

const myColor = d3
  .scaleSequential()
  .domain([60, 1])
  .interpolator(d3.interpolateRdYlGn);

function heatmapInit(raw_data) {
  const x_labels = Object.values(raw_data).map((obj) => obj.x_label);
  const y_labels = [
    ...new Set(
      Object.values(raw_data)
        .map((obj) => obj.algorithms)
        .flat()
    ),
  ];
  const image_labels = Object.values(raw_data).map((obj) => obj.image_label);

  // Crear un array vacío para almacenar los nuevos objetos
  const data = [];

  // Iterar sobre las llaves del objeto
  for (let key in raw_data) {
    // Obtener la propiedad x_label asociada a la llave
    const language = raw_data[key].x_label;

    // Obtener el array asociado a la llave
    const algorithms = raw_data[key].algorithms;

    // Iterar sobre los valores del array y crear un objeto para cada uno
    for (let algorithm of algorithms) {
      const newObj = { language, algorithm, time: 0 };
      data.push(newObj);
    }
  }

  const svg = d3.select("#heatmap").append("svg").append("g");
  const xAxis = svg.append("g");
  const yAxis = svg.append("g");

  const tooltip = d3
    .select("#heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  const mouseover = function (event, d) {
    highlightedSquare = d3.select(this);
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 0.8);
  };
  const mousemove = function (event, d) {
    tooltip
      .html("Time: " + d.time + " s")
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 70 + "px");
  };
  const mouseleave = function (event, d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 1);
  };

  const squares = svg
    .selectAll()
    .data(data, function (d) {
      return d.language + ":" + d.algorithm;
    })
    .enter()
    .append("rect")
    .attr("fill", myColor(0))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  function drawChart() {
    const margin = { top: 30, right: 30, bottom: 30, left: 50 },
      width =
        document.querySelector("#heatmap").parentElement.clientWidth -
        margin.left -
        margin.right -
        30,
      height = width;

    // append the svg object to the body of the page
    const svg = d3
      .select("#heatmap svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 100);

    const svg_g = svg
      .select("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Build X scales and axis:
    const x = d3.scaleBand().range([0, width]).domain(x_labels).padding(0.05);
    xAxis.attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));

    const y = d3.scaleBand().range([height, 0]).domain(y_labels).padding(0.05);

    yAxis
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("transform", "rotate(-40)");

    // add the squares
    squares
      .attr("x", function (d) {
        return x(d.language);
      })
      .attr("y", function (d) {
        return y(d.algorithm);
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("id", (d) =>
        (d.language + "-" + d.algorithm).replace(/\s/g, "").replace("+", "-")
      );

    svg_g.selectAll("image").data(x_labels).enter().append("image");

    svg_g
      .selectAll("image")
      .attr("x", function (d) {
        return x(d) + x.bandwidth() / 4;
      }) // 20 is half the width of the image
      .attr("y", height + 20) // add some padding to the bottom
      .attr("width", x.bandwidth() / 2) // set the width of the image
      .attr("height", x.bandwidth() / 2) // set the height of the image
      .attr("xlink:href", function (d) {
        return `assets/${image_labels[x_labels.indexOf(d)]}`;
      }); // set the path to the image
  }

  drawChart();

  // Add an event listener that run the function when dimension change
  window.addEventListener("resize", drawChart);
}

function startAnimation(x_label, y_labels) {
  function changeElementColor(d3Element) {
    d3Element
      .transition()
      .duration(max_time_value)
      .ease(d3.easeLinear)
      .attrTween("fill", function () {
        return function (t) {
          const seconds = (max_time_value * t) / 1000;
          const square_data = d3Element.datum();
          square_data.time = seconds;
          d3Element.data(square_data);
          if (highlightedSquare)
            highlightedSquare.attr("id") == d3Element.attr("id")
              ? d3.select("#heatmap div").html("Time: " + seconds + " s")
              : null;
          return myColor(seconds);
        };
      });
  }

  y_labels.forEach((y_label) => {
    changeElementColor(
      d3.select(
        "#" + (x_label + "-" + y_label).replace(/\s/g, "").replace("+", "-")
      )
    );
  });
}

function stopAnimation(x_label, y_label, final_time) {
  const d3Element = d3.select(
    "#" + (x_label + "-" + y_label).replace(/\s/g, "").replace("+", "-")
  );
  const square_data = d3Element.datum();
  square_data.time = final_time;
  d3Element.data(square_data);
  if (highlightedSquare)
    highlightedSquare.attr("id") == d3Element.attr("id")
      ? d3.select("#heatmap div").html("Time: " + final_time + " s")
      : null;
  d3.select(
    "#" + (x_label + "-" + y_label).replace(/\s/g, "").replace("+", "-")
  ).interrupt();
}
