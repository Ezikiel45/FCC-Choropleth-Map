// import topojson to convert to geoLocation data

let educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";


let educationData;
let countyData;

let height = 600;
let width = 800;

let canvas = d3.select('.canvas');
let tooltip = d3.select('#tooltip');

let drawMap = () => {

  canvas.selectAll('path').
  data(countyData).
  enter().
  append('path').
  attr('d', d3.geoPath()).
  attr('class', 'county').
  attr('fill', item => {
    let fips = item['id'];
    let county = educationData.find(county => {
      return county['fips'] === fips;
    });
    let percentages = county['bachelorsOrHigher'];
    if (percentages <= 15) {
      return '#0b55cd';
    } else if (percentages <= 25) {
      return '#0944a3';
    } else if (percentages <= 35) {
      return '#063278';
    } else {
      return '#04204e';
    }
  }).
  attr('data-fips', item => {
    return item['id'];
  }).
  attr('data-education', item => {
    let fips = item['id'];
    let county = educationData.find(county => {
      return county['fips'] === fips;
    });
    let percentage = county['bachelorsOrHigher'];
    return percentage;
  }).
  on('mouseover', (event, item) => {

    let fips = item['id'];
    let county = educationData.find(county => {
      return county['fips'] === fips;
    });

    tooltip.transition().duration(0).
    style('visibility', 'visible').
    style('top', event.pageY + 'px').
    style('left', event.pageX + 'px').
    attr('data-education', county['bachelorsOrHigher']);

    tooltip.html(
    county['area_name'] + ', ' +
    county['state'] + '<br />' + '%' +
    county['bachelorsOrHigher']);
  }).
  on('mouseout', item => {
    tooltip.transition().
    style('visibility', 'hidden');
  });
};

d3.json(countyUrl).then(
(data, error) => {
  if (error) {
    console.log(error);
  } else {
    countyData = data;
    countyData = topojson.feature(countyData, countyData.objects.counties).features;

    d3.json(educationUrl).then(
    (data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log('Education Data');
        console.log(educationData);
        drawMap();
      }
    });
  }
});