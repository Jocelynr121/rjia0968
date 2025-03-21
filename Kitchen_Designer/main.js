import * as d3 from 'd3';

// Ensure the DOM is fully loaded before executing script
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and script running.");

    const svgWidth = 800;
    const svgHeight = 500;

    // Create SVG canvas inside #cabinet-layout
    const svg = d3.select("#cabinet-layout")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    let cabinetList = [];

    document.getElementById("add-button").addEventListener("click", addCabinet);
    document.getElementById("remove-button").addEventListener("click", removeCabinet);

    function addCabinet() {
        const selectedWidth = parseInt(document.getElementById("cabinet-width").value);
        const selectedHeight = parseInt(document.getElementById("cabinet-height").value);
        const selectedDoor = document.getElementById("cabinet-door").value;
        const colorPicker = document.getElementById("cabinet-color").value;

        let doorCount = 1;
        if (selectedDoor === "double") doorCount = 2;
        else if (selectedDoor === "triple") doorCount = 3;

        const SCALE = Math.min(svgWidth / 1200, svgHeight / 2200);
        const scaledWidth = selectedWidth * SCALE;
        const scaledHeight = selectedHeight * SCALE;
        const doorWidth = scaledWidth / doorCount;

        const x = Math.random() * (svgWidth - scaledWidth);
        const y = Math.random() * (svgHeight - scaledHeight);

        // Create a group for the cabinet
        const group = svg.append("g")
            .attr("transform", `translate(${x},${y})`)
            .style("cursor", "pointer");

        // Create vertical gradient
        const gradientId = `grad-${Math.random().toString(36).substring(2, 9)}`;
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", gradientId)
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "0%").attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colorPicker);
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#C4A484");

        // Cabinet body
        group.append("rect")
            .attr("width", scaledWidth)
            .attr("height", scaledHeight)
            .attr("fill", `url(#${gradientId})`)
            .attr("stroke", "#000")
            .attr("stroke-width", 3);

        // Cabinet doors
        for (let i = 0; i < doorCount; i++) {
            group.append("rect")
                .attr("x", i * doorWidth + 3)
                .attr("y", 5)
                .attr("width", doorWidth - 6)
                .attr("height", scaledHeight - 10)
                .attr("fill", `url(#${gradientId})`)
                .attr("stroke", "none");
        }

        // Show cabinet info on click
        group.on("click", () => {
            alert(`Cabinet Size: ${selectedWidth} x ${selectedHeight} mm\nDoors: ${doorCount}`);
        });

        // Add dragging
        group.call(d3.drag()
            .on("drag", (event) => {
                let newX = event.x;
                let newY = event.y;

                // Keep inside boundaries
                newX = Math.max(0, Math.min(newX, svgWidth - scaledWidth));
                newY = Math.max(0, Math.min(newY, svgHeight - scaledHeight));

                group.attr("transform", `translate(${newX},${newY})`);
            })
        );

        cabinetList.push(group);
    }

    function removeCabinet() {
        if (cabinetList.length === 0) {
            alert("No cabinets to remove!");
            return;
        }
        const last = cabinetList.pop();
        last.remove();
    }
});

