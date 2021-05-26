import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as firstModel from '../../../assets/first20_med_a2.json';
import * as secondModel from '../../../assets/second20_med_a2.json';
import * as thirdModel from '../../../assets/third20_med_a2.json';
import * as fourthModel from '../../../assets/fourth20_med_a2.json';

import * as firstModel_b1 from '../../../assets/first20_med_b1.json';
import * as secondModel_b1 from '../../../assets/second20_med_b1.json';
import * as thirdModel_b1 from '../../../assets/third20_med_b1.json';
import * as fourthModel_b1 from '../../../assets/fourth20_med_b1.json';

import * as ADHDGeo from '../../../assets/MENT_ADHD.geo.json';
import * as ANXGeo from '../../../assets/MENT_ANX.geo.json';
import * as AUTGeo from '../../../assets/MENT_AUT.geo.json';
import * as DEPGeo from '../../../assets/MENT_DEP.geo.json';

import * as topTen_a2 from '../../../assets/top10_a2.json';
import * as topTen_b1 from '../../../assets/top10_b1.json';

import * as russiaMap from '../../../assets/russia.json';
import * as afghanistanMap from '../../../assets/afghanistan.json';
import * as canadaMap from '../../../assets/canada.json';
import * as usMap from '../../../assets/us.json';

declare var test;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  play = false;
  refresh = false;
  progress = false;

  firstModelData = firstModel['default'];
  secondModelData = secondModel['default'];
  thirdModelData = thirdModel['default'];
  fourthModelData = fourthModel['default'];
  firstModel_b1 = firstModel_b1['default']
  secondModel_b1 = secondModel_b1['default']
  thirdModel_b1 = thirdModel_b1['default']
  fourthModel_b1 = fourthModel_b1['default']

  ADHDMap = ADHDGeo['default']
  ANXMap = ANXGeo['default']
  AUTMap = AUTGeo['default']
  DEPMap = DEPGeo['default']

  russiaMapData = russiaMap['default']
  afghanistanMapData = afghanistanMap['default']
  canadaMapData = canadaMap['default']
  usMapData = usMap['default']

  topTen_a2Data = topTen_a2['top-ten-bar-a2']
  topTen_b1Data = topTen_b1['top-ten-bar-b1']

  valueRange = [0];
  labelRange = ["All states"];
  titleTag;
  divname;

  autoTicks = true;
  disabled = false;
  invert = false;
  max = 300;
  min = 0;
  showTicks = true;
  step = 20;
  thumbLabel = true;
  value = 0;
  vertical = false;
  tickInterval = 20;

  sliderValue;
  drawCallout;

  jsons;
  jsons_a2 = [this.firstModelData, this.secondModelData, this.thirdModelData, this.fourthModelData];
  jsons_b1 = [this.firstModel_b1, this.secondModel_b1, this.thirdModel_b1, this.fourthModel_b1];

  scenarioAttention = true;
  scenarioAnx = false;
  scenarioAut = false;
  scenarioDepre = false;

  canadaPick = false;

  svgWidth;
  xMargin;
  graphShift;

  scenario = 'ADHD';

  active = d3.select(null);
  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  ngOnInit() {

    for (let i = 1; i <= this.max/this.step; i++) {
      this.labelRange.push(`>= $${this.step*i} per capita`);
      this.valueRange.push(this.step*i)
    }
  

    let width = window.innerWidth;
    this.jsons = this.ADHDMap;



    d3.select('.canada-div').style('display', 'block');

    let windowWidth = width;

    if (windowWidth <= 500) {
      this.svgWidth = 375;
      this.xMargin = 50;
      this.graphShift = 50;
    } else {
      this.svgWidth = 400;
      this.xMargin = 30;
      this.graphShift = 40;
    }
    
    if (width > 500) {
      width = 500;
    }
    console.log(this.scenarioAttention)
    this.setMap(960, 480, this.jsons)
    this.drawBarChart(width, this.topTen_a2Data, '.top10-a2');
    this.drawBarChart(width, this.topTen_b1Data, '.top10-b1');
    
    this.drawCountry(this.russiaMapData, '.russia-map', 300, 200, [0, 250], 90, this.svgWidth, this.xMargin, this.graphShift)
    this.drawCountry(this.canadaMapData, '.canada-map', 300, 200, [310, 260], 90, this.svgWidth, this.xMargin, this.graphShift)
    this.drawCountry(this.afghanistanMapData, '.afghanistan-map', 300, 200, [-480, 510], 650, this.svgWidth, this.xMargin, this.graphShift)
    this.drawCountry(this.usMapData, '.us-map', 300, 200, [400, 220], 120, this.svgWidth, this.xMargin, this.graphShift)
    // this.drawLineChart(this.canadaMapData, '.canada-div', this.svgWidth, this.xMargin, this.graphShift)
  }

  scenarioADHD(){
    this.scenarioAttention = true;
    this.scenarioAnx = false;
    this.scenarioAut = false;
    this.scenarioDepre = false;
    this.jsons = this.ADHDMap;

    this.scenario = 'ADHD';

    // d3.select('svg').remove();

    this.value = 0
    console.log(this.scenario);
    this.transitionMap(this.jsons, 0)
  }

  scenarioANX(){
    this.scenarioAttention = false;
    this.scenarioAnx = true;
    this.scenarioAut = false;
    this.scenarioDepre = false;
    this.jsons = this.ANXMap;

    this.scenario = 'Anxiety';
    this.value = 0
    // d3.select('svg').remove();
    this.transitionMap(this.jsons, 0)
  }

  scenarioAUTISM(){
    this.scenarioAttention = false;
    this.scenarioAnx = false;
    this.scenarioAut = true;
    this.scenarioDepre = false;
    this.jsons = this.AUTMap;

    this.scenario = 'Autism';
    this.value = 0
    // d3.select('svg').remove();
    console.log(this.scenario);
    this.transitionMap(this.jsons, 0)
  }

  scenarioDEP(){
    this.scenarioAttention = false;
    this.scenarioAnx = false;
    this.scenarioAut = false;
    this.scenarioDepre = true;
    this.jsons = this.DEPMap;

    this.scenario = 'Depression';

    // d3.select('svg').remove();
    this.value = 0
    console.log(this.scenario);

    this.transitionMap(this.jsons, 0);
  }

  pitch(event: any) {
    this.sliderValue = event.value;
    // const sliderArray = ['0', '100', '200', '300'];
    // this.thumbLabel = true;
    console.log(this.sliderValue)
    const i = this.valueRange.indexOf(this.sliderValue);

    this.transitionMap(this.jsons, i, 500)
  }



  setMap(width, height, datapull) {

    d3.select('#stop').style('visibility', 'hidden');

    
    this.titleTag = this.labelRange[0];

    const margin = {top: 10, right: 10, bottom: 10, left: 10};
  
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    const projection = d3.geoAlbersUsa()
      .translate([width /2 , height / 2])
      .scale(width);

    const path = d3.geoPath()
              .projection(projection);
  
    const svg = d3.select('.world-map')
                .append('svg')
                .attr('class', 'map')
                .attr('x', 200)
                .attr('y', 0)
                .attr('viewBox', '0 0 1000 500')
                .attr('preserveAspectRatio', 'xMidYMid')
                .style('max-width', 1200)
                .style('margin', 'auto')
                .style('display', 'flex');

    

    const color_domain = [-0.1, -0.05, -0.001, 0.001, 0.05, 0.1, 0.15, 0.25, 0.35, 0.50];

    const color_legend = d3.scaleThreshold<string>()
    .range(['#4e4eb1', '#6e6ebf', '#8e8ecd', '#ccc', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#b92d0e', '#a50f15'])
    .domain(color_domain);

    var boundFunction = (function(d){
      document.getElementsByClassName("geopolitics-display")[0].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});

      let scenario = document.getElementsByClassName("highlight")[0].innerHTML.replace(/ .*/,'');

      document.getElementsByClassName("projection-country")[0].innerHTML = scenario + ` in ${d.properties.name}` ;
      let scenario_to_ment = {
        ADHD:       "MENT_ADHD",
        Anxiety:    "MENT_ANX",
        Autism:     "MENT_AUT",
        Depression: "MENT_DEP"
      }

      let ment = scenario_to_ment[scenario]
      console.log(`../../../assets/pyramids/${d.properties.name}_${ment}.json`)
      d3.json(`../../../assets/pyramids/${d.properties.name}_${ment}.json`, function(d){
        // if (document.getElementById("pyramid_plot") === null
        d3.select('#pyramid_plot').remove()
        
          var w = 440,
              h = 370,
              w_full = w,
              h_full = h;
      
          // if (w > $( window ).width()) {
          //   w = $( window ).width();
          // }
      
          var margin = {
                  top: 50,
                  right: 10,
                  bottom: 20,
                  left: 10,
                  middle: 10
              },
              sectorWidth = (w / 2) - margin.middle,
              leftBegin = sectorWidth - margin.left,
              rightBegin = w - margin.right - sectorWidth;
      
          w = (w- (margin.left + margin.right) );
          h = (h - (margin.top + margin.bottom));
      
          // if (typeof options.style === 'undefined') {
          var style = {
            leftBarColor: '#6c9dc6',
            rightBarColor: '#de5454',
            tooltipBG: '#fefefe',
            tooltipColor: 'black'
          };
          // } 
        //   else {
        //     var style = {
        //       leftBarColor: typeof options.style.leftBarColor === 'undefined'  ? '#6c9dc6' : options.style.leftBarColor,
        //       rightBarColor: typeof options.style.rightBarColor === 'undefined' ? '#de5454' : options.style.rightBarColor,
        //       tooltipBG: typeof options.style.tooltipBG === 'undefined' ? '#fefefe' : options.style.tooltipBG,
        //       tooltipColor: typeof options.style.tooltipColor === 'undefined' ? 'black' : options.style.tooltipColor
        //   };
        // }
      
          var totalPopulation = d3.sum(d, function(d) {
                  return d.male + d.female;
              }),
              percentage = function(d) {
                  return d / totalPopulation;
              };
      
          var styleSection = d3.select(".line-wrapper").append('style')
          .text('svg {max-width:100%} \
          .axis line,axis path {shape-rendering: crispEdges;fill: transparent;stroke: #555;} \
          .axis text {font-size: 11px;} \
          .bar {fill-opacity: 0.5;} \
          .bar.left {fill: ' + style.leftBarColor + ';} \
          .bar.left:hover {fill: ' + colorTransform(style.leftBarColor, '333333') + ';} \
          .bar.right {fill: ' + style.rightBarColor + ';} \
          .bar.right:hover {fill: ' + colorTransform(style.rightBarColor, '333333') + ';} \
          .tooltip {position: absolute;line-height: 1.1em;padding: 7px; margin: 3px;background: ' + style.tooltipBG + '; color: ' + style.tooltipColor + '; pointer-events: none;border-radius: 6px;}')
      
          var region = d3.select(".line-wrapper").append('svg')
              .attr('width', w_full)
              .attr('id', 'pyramid_plot')
              .attr('height', h_full);
      
      
          var legend = region.append('g')
              .attr('class', 'legend');
      
              // TODO: fix these margin calculations -- consider margin.middle == 0 -- what calculations for padding would be necessary?
          legend.append('rect')
              .attr('class', 'bar left')
              .attr('x', (w / 2))
              .attr('y', 8)
              .attr('width', 12)
              .attr('height', 12);
      
          legend.append('text')
              .attr('fill', '#000')
              .attr('x', (w / 2) + (margin.middle * 2))
              .attr('y', 14)
              .attr('dy', '0.32em')
              .text('Not diagnosed with ' + scenario);
      
          legend.append('rect')
              .attr('class', 'bar right')
              .attr('x', (w / 2))
              .attr('y', 24)
              .attr('width', 12)
              .attr('height', 12);
      
          legend.append('text')
              .attr('fill', '#000')
              .attr('x', (w / 2) + (margin.middle * 2))
              .attr('y', 30)
              .attr('dy', '0.32em')
              .text('Diagnosed with ' + scenario);
      
          var tooltipDiv = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);
      
          var pyramid = region.append('g')
              .attr('class', 'inner-region')
              .attr('transform', translation(margin.left, margin.top));
      
          // find the maximum data value for whole dataset
          // and rounds up to nearest 5%
          //  since this will be shared by both of the x-axes
          var maxValue = Math.ceil(Math.max(
              d3.max(d, function(d) {
                  return d.male;
              }),
              d3.max(d, function(d) {
                  return d.female;
              })
          )/0.05)*0.05;
      
          // SET UP SCALES
      
          // the xScale goes from 0 to the width of a region
          //  it will be reversed for the left x-axis
          var xScale = d3.scaleLinear()
              .domain([0, maxValue])
              .range([0, (sectorWidth-margin.middle)])
              .nice();
      
          var xScaleLeft = d3.scaleLinear()
              .domain([0, maxValue])
              .range([sectorWidth, 0]);
      
          var xScaleRight = d3.scaleLinear()
              .domain([0, maxValue])
              .range([0, sectorWidth]);
      
          var yScale = d3.scaleBand()
              .domain(d.map(function(d) {
                  return d.age;
              }))
              .range([h, 0], 0.1);
      
      
          // SET UP AXES
          var yAxisLeft = d3.axisRight()
              .scale(yScale)
              .tickSize(4, 0)
              .tickPadding(margin.middle - 4);
      
          var yAxisRight = d3.axisLeft()
              .scale(yScale)
              .tickSize(4, 0)
              .tickFormat('');
      
          var xAxisRight = d3.axisBottom()
              .scale(xScale)
              .tickFormat(d3.format('.0%'));
      
          var xAxisLeft = d3.axisBottom()
              // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
              .scale(xScale.copy().range([leftBegin, 0]))
              .tickFormat(d3.format('.0%'));
      
          // MAKE GROUPS FOR EACH SIDE OF CHART
          // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
          var leftBarGroup = pyramid.append('g')
              .attr('transform', translation(leftBegin, 0) + 'scale(-1,1)');
          var rightBarGroup = pyramid.append('g')
              .attr('transform', translation(rightBegin, 0));
      
          // DRAW AXES
          pyramid.append('g')
              .attr('class', 'axis y left')
              .attr('transform', translation(leftBegin, 0))
              .call(yAxisLeft)
              .selectAll('text')
              .style('text-anchor', 'middle');
      
          pyramid.append('g')
              .attr('class', 'axis y right')
              .attr('transform', translation(rightBegin, 0))
              .call(yAxisRight);
      
          pyramid.append('g')
              .attr('class', 'axis x left')
              .attr('transform', translation(0, h))
              .call(xAxisLeft);
      
          pyramid.append('g')
              .attr('class', 'axis x right')
              .attr('transform', translation(rightBegin, h))
              .call(xAxisRight);
      
          // DRAW BARS
          leftBarGroup.selectAll('.bar.left')
              .data(d)
              .enter().append('rect')
              .attr('class', 'bar left')
              .attr('x', 0)
              .attr('y', function(d) {
                  return yScale(d.age) + margin.middle / 4;
              })
              .attr('width', function(d) {
                  return xScale(d.male);
              })
              .attr('height', (yScale.range()[0] / d.length) - margin.middle / 2)
              .on("mouseover", function(d) {
                  tooltipDiv.transition()
                      .duration(200)
                      .style("opacity", 0.9);
                  tooltipDiv.html("<strong><strong> DAST Score " + d.age + " for those not diagnosed with " + scenario + "</strong>" +
                          "<br />" + (Math.round(d.male * 1000) / 10) + "% of total not diagnosed with " +  scenario)
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY - 28) + "px");
              })
              .on("mouseout", function(d) {
                  tooltipDiv.transition()
                      .duration(500)
                      .style("opacity", 0);
              });
      
          rightBarGroup.selectAll('.bar.right')
              .data(d)
              .enter().append('rect')
              .attr('class', 'bar right')
              .attr('x', 0)
              .attr('y', function(d) {
                  return yScale(d.age) + margin.middle / 4;
              })
              .attr('width', function(d) {
                  return xScale(d.female);
              })
              .attr('height', (yScale.range()[0] / d.length) - margin.middle / 2)
              .on("mouseover", function(d) {
                  tooltipDiv.transition()
                      .duration(200)
                      .style("opacity", 0.9);
                  tooltipDiv.html("<strong> DAST Score " + d.age + " for those diagnosed with " + scenario + "</strong>" +
                          "<br />" + (Math.round(d.female * 1000) / 10) + "% of Total diagnosed with " + scenario)
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY - 28) + "px");
              })
              .on("mouseout", function(d) {
                  tooltipDiv.transition()
                      .duration(500)
                      .style("opacity", 0);
              });
      
          /* HELPER FUNCTIONS */
      
          // string concat for translate
          function translation(x, y) {
              return 'translate(' + x + ',' + y + ')';
          }
      
          // numbers with commas
          function prettyFormat(x) {
              return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
      
          // lighten colors
          function colorTransform(c1, c2) {
              var c1 = c1.replace('#','')
                  let origHex = {
                      r: c1.substring(0, 2),
                      g: c1.substring(2, 4),
                      b: c1.substring(4, 6)
                  },
                  transVec = {
                      r: c2.substring(0, 2),
                      g: c2.substring(2, 4),
                      b: c2.substring(4, 6)
                  }
                  // newHex = {};
      
              function transform(d, e) {
                  var f = parseInt(d, 16) + parseInt(e, 16);
                  if (f > 255) {
                      f = 255;
                  }
                  return f.toString(16);
              }
              let newHex = {
                r: transform(origHex.r, transVec.r),
                g: transform(origHex.g, transVec.g),
                b: transform(origHex.b, transVec.b)
              }
  
              return '#' + newHex.r + newHex.g + newHex.b;
          }
        
    })
    if (d.properties.name === 'California'){
      document.getElementsByClassName("projection-summary")[0].innerHTML = ``
      d3.select('.canada-div').style('display', 'block');
    }else if (d.properties.name) {
      d3.select('.canada-div').style('display', 'block');
      d3.select('.russia-div').style('display', 'none')
      d3.select('.afghanistan-div').style('display', 'none')
      d3.select('.us-div').style('display', 'none')
    } else if (d.properties.name === 'Russia') {
      d3.select('.russia-div').style('display', 'block')
      d3.select('.afghanistan-div').style('display', 'none')
      d3.select('.canada-div').style('display', 'none');
      d3.select('.us-div').style('display', 'none')
    } else if (d.properties.name === 'Afghanistan') {
      d3.select('.afghanistan-div').style('display', 'block')
      d3.select('.russia-div').style('display', 'none')
      d3.select('.canada-div').style('display', 'none');
      d3.select('.us-div').style('display', 'none')
    } else if (d.properties.name === 'United States of America') {
      d3.select('.afghanistan-div').style('display', 'none')
      d3.select('.russia-div').style('display', 'none')
      d3.select('.canada-div').style('display', 'none');
      d3.select('.us-div').style('display', 'block')
    }
  }).bind(this);

    svg.selectAll('path')
      .data(datapull.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('id', 'unselected')
      .style('fill', function(d) {
        const value = d['Change_mental'];
          if (value) {  
            return color_legend(d['Change_mental']);
          } else {
            return '#ccc';
          }
      })
      .style('stroke', '#fff')
      .style('stroke-width', '0.5')
      .classed('svg-content-responsive', true)
      .on('mouseover', function (d) {

        d3.select(this)
          .style('cursor', 'pointer')
          .style('stroke-width', '1.5')
          .style('font-size', '2em')

      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style('stroke-width', '0.5');
      })
      .on('click', boundFunction);
    
  }

  
  transitionMap(json, i, time=1000) {
    const svg = d3.select('.world-map');
    console.log(i)
    this.titleTag = this.labelRange[i];


    const color_domain = [-0.1, -0.05, -0.001, 0.001, 0.05, 0.1, 0.15, 0.25, 0.35, 0.50];

    
    const color_legend = d3.scaleThreshold<string>()
    .range(['#4e4eb1', '#6e6ebf', '#8e8ecd', '#ccc', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#b92d0e', '#a50f15'])
    .domain(color_domain);


    var boundFunction = (function(d) {
      const value = d['Change_mental'];
      if (value) {  
        console.log(d['Change_mental'])
        console.log(this.sliderValue)
        return color_legend(d['Change_mental'] * (d['Mental_amount'] > (this.sliderValue || 0) ? 1 : 0));
      } else {
        return '#ccc';
      }
  }).bind(this)

    svg.selectAll('path')
       .data(json.features)
       .transition()
       .duration(time)
       .style('fill', boundFunction)
}


  refreshButton() {
    let width = window.innerWidth;

    if (width > 1000) {
      width = 1000;
    }

    d3.select('svg').remove();
    this.setMap(1000, 600, this.jsons[0])

    this.play = false;
    this.refresh = false;
    this.value = 2040;
  }

  drawBarChart(width, dataset, divname) {

    const svgbar = d3.select(divname)
    .append('svg')
    .attr('width', width)
    .attr('height', '400')
    .classed('overall-bar', true);

    const color_domain = [2.5, 4, 7, 9, 10];
    
    const color_legend = d3.scaleThreshold<string>()
    .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'])
    .domain(color_domain);

    const margin = { top: 20, right: 50, bottom: 20, left: 50 };
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().rangeRound([0, width]);
    const yScale = d3.scaleBand().rangeRound([0, height]).padding(0.05);
    
    xScale.domain([0, 12]);
    yScale.domain(dataset.map((d) => d['country']));

    svgbar.append('g')
    .selectAll('rect')
    .data(dataset)
    .enter().append('rect')
    .attr('y', function (d) { return yScale(d['country']); })
    .attr('x', 10)
    .attr('height', yScale.bandwidth())
    .attr('width', function (d) {
      return xScale(d['temp']) - margin.right - 30;
    })
    .attr('fill', function(d) {
      return color_legend(d['temp']);
    })
    .classed('temp-rects');

    svgbar.selectAll('rect.temp-rects')
    .data(dataset)
    .enter().append('text')
    .attr('x', 20)
    .attr('y', function(d) { 
      return yScale(d['country']) + yScale.bandwidth() / 2 + 4; 
    })
    .text(function(d) {
      return d['country'] + ' (' + '+' + d['temp'] + '\xB0' + 'F)';
    })
    .style('font-size', '12px')
    .style('font-weight', '600')
    .style('fill', '#ffffff')
    .style('font-family', 'Montserrat')
  }

  drawCountry(countryjson, countrydiv, width, height, translate, scale, windowWidth, xMargin, graphShift) {

    const projection = d3.geoMercator()
    .rotate([-11, 0])
    .scale(scale)
    .translate(translate);

    const path = d3.geoPath()
              .projection(projection);
  
    const svg = d3.select(countrydiv)
                .append('svg')
                .attr('class', 'country')
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', '0 0 300 200')
                .attr('preserveAspectRatio', 'xMidYMid')
                .style('max-width', 1200)
                .style('margin', 'auto')
                .style('display', 'flex');

            
    svg.selectAll('path')
      .data(countryjson)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', '#fcbba1')
      .style('stroke', '#de2d26')
      .style('stroke-width', '0.5')
      .on('mouseover', function (d) {

        d3.select(this)
          .style('cursor', 'pointer')
          .style('stroke-width', '1.5')
          .style('font-size', '2em')

      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style('stroke-width', '0.5');
      })
      .style('fill', '#fcbba1')
      .on('click', function(d) {

        d3.select('.jumbo').remove()
        
        const margin = {top: 10, right: 10, bottom: 10, left: 10};

        if (d.properties.name === 'Canada') {
          d3.select('.canada-div').style('display', 'block');
          d3.select('.russia-div').style('display', 'none')
          d3.select('.afghanistan-div').style('display', 'none')
          d3.select('.us-div').style('display', 'none')
        } else if (d.properties.name === 'Russia') {
          d3.select('.russia-div').style('display', 'block')
          d3.select('.afghanistan-div').style('display', 'none')
          d3.select('.canada-div').style('display', 'none');
          d3.select('.us-div').style('display', 'none')
        } else if (d.properties.name === 'Afghanistan') {
          d3.select('.afghanistan-div').style('display', 'block')
          d3.select('.russia-div').style('display', 'none')
          d3.select('.canada-div').style('display', 'none');
          d3.select('.us-div').style('display', 'none')
        } else if (d.properties.name === 'United States of America') {
          d3.select('.afghanistan-div').style('display', 'none')
          d3.select('.russia-div').style('display', 'none')
          d3.select('.canada-div').style('display', 'none');
          d3.select('.us-div').style('display', 'block')
        }     

 
        const data = d['trend-data'];
        const width = windowWidth;
        const yheight = 200;
        const height = 300;

        const parseTime = d3.timeParse('%m/%d/%Y');

        const x = d3.scaleTime().range([0, width - margin.left - margin.right - xMargin]);
        x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));

        const y = d3.scaleLinear().range([yheight, 0]).nice();
        y.domain([0, 12]);


        const valueline = d3.line()
        .x(function(d) { return x(parseTime(d.date)); })
        .y(function(d) { return y(d.a2) + margin.top + margin.bottom; })
        .curve(d3.curveMonotoneX);

        const valueline_b = d3.line()
        .x(function(d) { return x(parseTime(d.date)); })
        .y(function(d) { return y(d.b1) + margin.top + margin.bottom; })
        .curve(d3.curveMonotoneX);

        const svg = d3.select('.line-wrapper').append('svg')
        .attr('width',  width - margin.left - margin.right + 30)
        .attr('height', height - margin.top - margin.bottom)
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'jumbo')
        .append('g')
        .attr('transform', 'translate(' + graphShift + ', 0)')


        // Add the x-axis.
        svg.append('g')
              .attr("class", "y-axis")
              .attr("transform", "translate(0," + (margin.top + margin.bottom) + ")")
              .call(d3.axisLeft(y).ticks(4).tickSizeOuter(0).tickFormat(d => '+' + d + '\xB0' + 'F'));

        svg.append('g')
              .attr("class", "x-axis")
              .attr("transform", "translate(0," + (yheight + margin.top + margin.bottom) + ")")
              .call(d3.axisBottom(x).ticks(4).tickSizeOuter(1));

        d3.select('.x-axis .tick:first-child').remove()

        const path = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', '#de2d26')
        .attr('d', valueline);

        const path_b = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', '#fc9272')
        .attr('d', valueline_b);

        const ext_color_domain = [25, 35, 45, 55, 65];


        const ls_w = 15, ls_h = 15;

        const legend = svg.append('g')
        .data(ext_color_domain)
        .attr('class', 'legend');


        const totalLength = path.node().getTotalLength();

        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .on('start', function repeat() {
            d3.active(this)
                .duration(3000)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);
        });

        path_b.attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .on('start', function repeat() {
            d3.active(this)
                .duration(3000)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);
        });


        legend.append('rect')
          .attr('x', 20)
          .attr('y', 30)
          .attr('width', ls_w)
          .attr('height', ls_h)
          .style('fill', function (d, i) { return '#de2d26'; })
          .style('opacity', 0.8);
          
        legend.append('rect')
        .attr('x', 20)
        .attr('y', 50)
        .attr('width', ls_w)
        .attr('height', ls_h)
        .style('fill', function (d, i) { return '#fc9272'; })
        .style('opacity', 0.8);

        legend.append('text')
        .attr('x', 40)
        .attr('y', 42)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', '#de2d26')
        .text('Scenario A2')

        legend.append('text')
          .attr('x', 40)
          .attr('y', 62)
          .attr('font-size', '12px')
          .attr('font-weight', '500')
          .attr('fill', '#fc9272')
          .text('Scenario B1');

      })

    svg.selectAll('text')
      .data(countryjson)
      .enter().append('text')
      .attr('x', function(d) {
        return path.centroid(d)[0];
      })
      .attr('y', function(d) {
          return path.centroid(d)[1];
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '1.25em')
      .attr('font-weight', '600')
      .attr('fill', '#a50f15')
      .text(function(d){
        return d.properties.name;
      })

    
  }

  drawLineChart(countryjson, countrydiv, windowWidth, xMargin, graphShift) {
       
        const margin = {top: 10, right: 10, bottom: 10, left: 10};
        const data = countryjson[0]['trend-data'];
        const width = windowWidth;
        const yheight = 200;
        const height = 300;

        const parseTime = d3.timeParse('%m/%d/%Y');

        const x = d3.scaleTime().range([0, width - margin.left - margin.right - xMargin]);
        x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));

        const y = d3.scaleLinear().range([yheight, 0]).nice();
        y.domain([0, 12]);


        const valueline = d3.line()
        .x(function(d) { return x(parseTime(d.date)); })
        .y(function(d) { return y(d.a2) + margin.top + margin.bottom; })
        .curve(d3.curveMonotoneX);

        const valueline_b = d3.line()
        .x(function(d) { return x(parseTime(d.date)); })
        .y(function(d) { return y(d.b1) + margin.top + margin.bottom; })
        .curve(d3.curveMonotoneX);

        const svg = d3.select('.line-wrapper').append('svg')
        .attr('width',  width - margin.left - margin.right + 30)
        .attr('height', height - margin.top - margin.bottom)
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'jumbo')
        .append('g')
        .attr('transform', 'translate(' + graphShift + ', 0)')

        // Add the x-axis.
        svg.append('g')
              .attr("class", "y-axis")
              .attr("transform", "translate(0," + (margin.top + margin.bottom) + ")")
              .call(d3.axisLeft(y).ticks(4).tickSizeOuter(0).tickFormat(d => '+' + d + '\xB0' + 'F'));

        svg.append('g')
              .attr("class", "x-axis")
              .attr("transform", "translate(0," + (yheight + margin.top + margin.bottom) + ")")
              .call(d3.axisBottom(x).ticks(4).tickSizeOuter(1));

        d3.select('.x-axis .tick:first-child').remove()

        const path = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', '#de2d26')
        .attr('d', valueline);

        const path_b = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', '#fc9272')
        .attr('d', valueline_b);

        const ext_color_domain = [25, 35, 45, 55, 65];

        const ls_w = 15, ls_h = 15;

        const legend = svg.append('g')
        .data(ext_color_domain)
        .attr('class', 'legend');

        legend.append('rect')
          .attr('x', 20)
          .attr('y', 30)
          .attr('width', ls_w)
          .attr('height', ls_h)
          .style('fill', function (d, i) { return '#de2d26'; })
          .style('opacity', 0.8);
          
        legend.append('rect')
        .attr('x', 20)
        .attr('y', 50)
        .attr('width', ls_w)
        .attr('height', ls_h)
        .style('fill', function (d, i) { return '#fc9272'; })
        .style('opacity', 0.8);

        legend.append('text')
        .attr('x', 40)
        .attr('y', 42)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', '#de2d26')
        .text('Scenario A2')

        legend.append('text')
          .attr('x', 40)
          .attr('y', 62)
          .attr('font-size', '12px')
          .attr('font-weight', '500')
          .attr('fill', '#fc9272')
          .text('Scenario B1');

      }

      scrollDiv($element): void {
        $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }


      pyramidBuilder(data, target, options) {
        var w = typeof options.width === 'undefined' ? 400  : options.width,
            h = typeof options.height === 'undefined' ? 400  : options.height,
            w_full = w,
            h_full = h;
    
        // if (w > $( window ).width()) {
        //   w = $( window ).width();
        // }
    
        var margin = {
                top: 50,
                right: 10,
                bottom: 20,
                left: 10,
                middle: 20
            },
            sectorWidth = (w / 2) - margin.middle,
            leftBegin = sectorWidth - margin.left,
            rightBegin = w - margin.right - sectorWidth;
    
        w = (w- (margin.left + margin.right) );
        h = (h - (margin.top + margin.bottom));
    
        // if (typeof options.style === 'undefined') {
        var style = {
          leftBarColor: '#6c9dc6',
          rightBarColor: '#de5454',
          tooltipBG: '#fefefe',
          tooltipColor: 'black'
        };
        // } 
      //   else {
      //     var style = {
      //       leftBarColor: typeof options.style.leftBarColor === 'undefined'  ? '#6c9dc6' : options.style.leftBarColor,
      //       rightBarColor: typeof options.style.rightBarColor === 'undefined' ? '#de5454' : options.style.rightBarColor,
      //       tooltipBG: typeof options.style.tooltipBG === 'undefined' ? '#fefefe' : options.style.tooltipBG,
      //       tooltipColor: typeof options.style.tooltipColor === 'undefined' ? 'black' : options.style.tooltipColor
      //   };
      // }
    
        var totalPopulation = d3.sum(data, function(d) {
                return d.male + d.female;
            }),
            percentage = function(d) {
                return d / totalPopulation;
            };
    
        var styleSection = d3.select(target).append('style')
        .text('svg {max-width:100%} \
        .axis line,axis path {shape-rendering: crispEdges;fill: transparent;stroke: #555;} \
        .axis text {font-size: 11px;} \
        .bar {fill-opacity: 0.5;} \
        .bar.left {fill: ' + style.leftBarColor + ';} \
        .bar.left:hover {fill: ' + colorTransform(style.leftBarColor, '333333') + ';} \
        .bar.right {fill: ' + style.rightBarColor + ';} \
        .bar.right:hover {fill: ' + colorTransform(style.rightBarColor, '333333') + ';} \
        .tooltip {position: absolute;line-height: 1.1em;padding: 7px; margin: 3px;background: ' + style.tooltipBG + '; color: ' + style.tooltipColor + '; pointer-events: none;border-radius: 6px;}')
    
        var region = d3.select(target).append('svg')
            .attr('width', w_full)
            .attr('height', h_full);
    
    
        var legend = region.append('g')
            .attr('class', 'legend');
    
            // TODO: fix these margin calculations -- consider margin.middle == 0 -- what calculations for padding would be necessary?
        legend.append('rect')
            .attr('class', 'bar left')
            .attr('x', (w / 2) - (margin.middle * 3))
            .attr('y', 12)
            .attr('width', 12)
            .attr('height', 12);
    
        legend.append('text')
            .attr('fill', '#000')
            .attr('x', (w / 2) - (margin.middle * 2))
            .attr('y', 18)
            .attr('dy', '0.32em')
            .text('Males');
    
        legend.append('rect')
            .attr('class', 'bar right')
            .attr('x', (w / 2) + (margin.middle * 2))
            .attr('y', 12)
            .attr('width', 12)
            .attr('height', 12);
    
        legend.append('text')
            .attr('fill', '#000')
            .attr('x', (w / 2) + (margin.middle * 3))
            .attr('y', 18)
            .attr('dy', '0.32em')
            .text('Females');
    
        var tooltipDiv = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    
        var pyramid = region.append('g')
            .attr('class', 'inner-region')
            .attr('transform', translation(margin.left, margin.top));
    
        // find the maximum data value for whole dataset
        // and rounds up to nearest 5%
        //  since this will be shared by both of the x-axes
        var maxValue = Math.ceil(Math.max(
            d3.max(data, function(d) {
                return d.male;
            }),
            d3.max(data, function(d) {
                return d.female;
            })
        )/0.05)*0.05;
    
        // SET UP SCALES
    
        // the xScale goes from 0 to the width of a region
        //  it will be reversed for the left x-axis
        var xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, (sectorWidth-margin.middle)])
            .nice();
    
        var xScaleLeft = d3.scaleLinear()
            .domain([0, maxValue])
            .range([sectorWidth, 0]);
    
        var xScaleRight = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, sectorWidth]);
    
        var yScale = d3.scaleBand()
            .domain(data.map(function(d) {
                return d.age;
            }))
            .range([h, 0], 0.1);
    
    
        // SET UP AXES
        var yAxisLeft = d3.axisRight()
            .scale(yScale)
            .tickSize(4, 0)
            .tickPadding(margin.middle - 4);
    
        var yAxisRight = d3.axisLeft()
            .scale(yScale)
            .tickSize(4, 0)
            .tickFormat('');
    
        var xAxisRight = d3.axisBottom()
            .scale(xScale)
            .tickFormat(d3.format('.0%'));
    
        var xAxisLeft = d3.axisBottom()
            // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
            .scale(xScale.copy().range([leftBegin, 0]))
            .tickFormat(d3.format('.0%'));
    
        // MAKE GROUPS FOR EACH SIDE OF CHART
        // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
        var leftBarGroup = pyramid.append('g')
            .attr('transform', translation(leftBegin, 0) + 'scale(-1,1)');
        var rightBarGroup = pyramid.append('g')
            .attr('transform', translation(rightBegin, 0));
    
        // DRAW AXES
        pyramid.append('g')
            .attr('class', 'axis y left')
            .attr('transform', translation(leftBegin, 0))
            .call(yAxisLeft)
            .selectAll('text')
            .style('text-anchor', 'middle');
    
        pyramid.append('g')
            .attr('class', 'axis y right')
            .attr('transform', translation(rightBegin, 0))
            .call(yAxisRight);
    
        pyramid.append('g')
            .attr('class', 'axis x left')
            .attr('transform', translation(0, h))
            .call(xAxisLeft);
    
        pyramid.append('g')
            .attr('class', 'axis x right')
            .attr('transform', translation(rightBegin, h))
            .call(xAxisRight);
    
        // DRAW BARS
        leftBarGroup.selectAll('.bar.left')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar left')
            .attr('x', 0)
            .attr('y', function(d) {
                return yScale(d.age) + margin.middle / 4;
            })
            .attr('width', function(d) {
                return xScale(d.male);
            })
            .attr('height', (yScale.range()[0] / data.length) - margin.middle / 2)
            .on("mouseover", function(d) {
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltipDiv.html("<strong>Males Age " + d.age + "</strong>" +
                        "<br />  Population: " + prettyFormat(d.male) +
                        "<br />" + (Math.round(d.male * 1000) / 10) + "% of Total without Mental Disorder")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    
        rightBarGroup.selectAll('.bar.right')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar right')
            .attr('x', 0)
            .attr('y', function(d) {
                return yScale(d.age) + margin.middle / 4;
            })
            .attr('width', function(d) {
                return xScale(d.female);
            })
            .attr('height', (yScale.range()[0] / data.length) - margin.middle / 2)
            .on("mouseover", function(d) {
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltipDiv.html("<strong> Females Age " + d.age + "</strong>" +
                        "<br />  Population: " + prettyFormat(d.female) +
                        "<br />" + (Math.round(d.female * 1000) / 10) + "% of Total with Mental Disorder")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    
        /* HELPER FUNCTIONS */
    
        // string concat for translate
        function translation(x, y) {
            return 'translate(' + x + ',' + y + ')';
        }
    
        // numbers with commas
        function prettyFormat(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    
        // lighten colors
        function colorTransform(c1, c2) {
            var c1 = c1.replace('#','')
                let origHex = {
                    r: c1.substring(0, 2),
                    g: c1.substring(2, 4),
                    b: c1.substring(4, 6)
                },
                transVec = {
                    r: c2.substring(0, 2),
                    g: c2.substring(2, 4),
                    b: c2.substring(4, 6)
                }
                // newHex = {};
    
            function transform(d, e) {
                var f = parseInt(d, 16) + parseInt(e, 16);
                if (f > 255) {
                    f = 255;
                }
                return f.toString(16);
            }
            let newHex = {
              r: transform(origHex.r, transVec.r),
              g: transform(origHex.g, transVec.g),
              b: transform(origHex.b, transVec.b)
            }

            return '#' + newHex.r + newHex.g + newHex.b;
        }
    
    }
    
    test(){
        console.log("ooooof")
    }

  }
