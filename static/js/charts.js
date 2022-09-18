function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    console.log("metadata");
    console.log(metadata);

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("resultArray");
    console.log(resultArray);

    var result = resultArray[0];
    console.log("result");
    console.log(result);

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log("samples");
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log("sampleArray");
    console.log(samplesArray);

    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("metadataArray");
    console.log(metadataArray);    

    //  5. Create a variable that holds the first sample in the array.
    var sampleObj = samplesArray[0];
    console.log("sampleObj");
    console.log(sampleObj);

    var metadataObj = metadataArray[0];  
    console.log("metadataObj");
    console.log(metadataObj);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleObj.otu_ids;
    var otuLabels = sampleObj.otu_labels;
    var sampleValues = sampleObj.sample_values;
    console.log(otuIds);  
    console.log(otuLabels);
    console.log(sampleValues);

    var wFreq = Number(metadataObj.wfreq);
    console.log("wFreq");
    console.log(wFreq);    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    reversedOtuIds = otuIds.slice(0, 10).reverse();
    console.log("reversedOtuIds");  
    console.log(reversedOtuIds);

    reversedOtuLabels = otuLabels.slice(0, 10).reverse();
    console.log("reversedOtuLabels");  
    console.log(reversedOtuLabels);

    reversedSampleValues = sampleValues.slice(0, 10).reverse();
    console.log("reversedSampleValues");  
    console.log(reversedSampleValues);    

    var yticks = reversedOtuIds.map(value => {
      return `OTU ${value}`;
    });
    console.log("yticks");
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: reversedSampleValues,
      y: yticks,
      text: reversedOtuLabels,
      name: "Top 10 Bacteria Cultures Found",
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      width: 425,
      height: 400,
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100} 
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);    

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      marker: {
        color: otuIds,
        colorscale: "Earth",
        size: sampleValues},
      mode: "markers",
      text: otuLabels   
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
      title: "OTU ID"},
      hovermode: "closest",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100}           
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      // domain: {x: , y: },
      value: wFreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week"},     
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "limegreen"},
          {range: [8, 10], color: "green"}
        ]
      }
    }];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 425,
      height: 400,
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}



