var app = angular.module("chartApp", []);

app.controller("SalesController", function($scope, $http) {
    $http.get("countries.csv").then(function(response) {
        $scope.salesData = response;
    });
});

app.directive("linearChart", function($window) {
    return {
        restrict: "EA",
        // template: "<svg width='1024' height='728'></svg>",
        link: function(scope, elem, attrs) {
            // canvas resolution
            var margin = { top: 50, left: 50, right: 50, bottom: 50 },
                height = 900 - margin.top - margin.bottom,
                width = 1400 - margin.left - margin.right;

            // defines "svg" as data type and "make canvas" command
            var svg = d3.select("#map")
                .append("svg")
                .attr("height", height + margin.top + margin.bottom)
                .attr("width", width + margin.left + margin.right)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            

            d3.queue()
                .defer(d3.json, "https://unpkg.com/world-atlas@1.1.4/world/110m.json")
                .defer(d3.csv, "countries.csv")
                .await(ready);

            // projection-settings for mercator    
            var projection = d3.geoMercator()
                // .translate([width / 2, height / 2])
                // where to center the map in degrees
                .center([-30, 60])
                // // zoomlevel
                .scale(200);
            // // map-rotation
            // .rotate([0, 0]);

            /* Create a Path using projection */

            var path = d3.geoPath()
                .projection(projection);


            function ready(error, data, country_name) {
                console.log(data);


                var countries = topojson.feature(data, data.objects.countries).features;
                console.log(countries);
                console.log(country_name);

                /* Add a path for each country
                     Shapes -> Path
                */

                svg.selectAll(".country")
                    .data(countries)
                    .enter().append("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .on('mouseover', function(d) {
                        d3.select(this).classed("selected", true);
                    })
                    .on('mouseout', function(d) {
                        d3.select(this).classed("selected", false);
                    });

                svg.selectAll(".country-circles")
                    .data(country_name)
                    .enter().append("circle")
                    .attr("class", "circle")
                    .attr("r", 2)
                    .attr("cx", function(d) {
                        var coords = projection([d.longitude, d.latitude]);
                        return coords[0];
                    })
                    .attr("cy", function(d) {
                        var coords = projection([d.longitude, d.latitude]);
                        return coords[1];
                    });

                svg.selectAll(".countries")
                    .data(country_name)
                    .enter().append("text")
                    .attr("class", "countries")
                    .attr("x", function(d) {
                        var coords = projection([d.longitude, d.latitude]);
                        return coords[0];
                    })
                    .attr("y", function(d) {
                        var coords = projection([d.longitude, d.latitude]);
                        return coords[1];
                    })

                    .text(function(d) {
                        return d.country_name;
                    })
                    .attr("dx", 5)
                    .attr("dy", 2);


            }

        }

    };
});