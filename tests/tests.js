// auto run test suites.
exports.defineAutoTests = function() {
    require('./specs/specHelper');
    require('./specs/regionSpecs');
    require('./specs/beaconRegionSpecs');
    require('./specs/circularRegionSpecs');
    require('./specs/regionsSpec');
    require('./specs/locationManagerSpecs');
    require('./specs/delegateSpecs');
}