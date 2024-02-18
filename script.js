// Sample graph data
const graphData = {
    nodes: [
        { id: "A" },
        { id: "B" },
        { id: "C" },
        { id: "D" },
        { id: "E" }
    ],
    links: [
        { source: "A", target: "B" },
        { source: "B", target: "C" },
        { source: "C", target: "D" },
        { source: "D", target: "E" },
        { source: "E", target: "A" }
    ]
};

// Create SVG container
const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", [0, 0, 800, 600])
    .append("g");

// Create links
const link = svg.selectAll("line")
    .data(graphData.links)
    .enter()
    .append("line")
    .style("stroke", "#999")
    .style("stroke-width", "2px");

// Create nodes
const node = svg.selectAll("circle")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .style("fill", "#66c2a5")
    .call(drag(simulation));

// Add labels to nodes
const label = svg.selectAll(null)
    .data(graphData.nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text(d => d.id)
    .style("fill", "#fff")
    .style("font-size", "16px");

// Create simulation
const simulation = d3.forceSimulation(graphData.nodes)
    .force("link", d3.forceLink(graphData.links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(400, 300));

simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
});

// Drag functions
function drag(simulation) {
    function dragStarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragEnded(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
}
