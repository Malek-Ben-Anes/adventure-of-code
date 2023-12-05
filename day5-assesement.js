fs = require('fs');

/** 
 * Result should look like:
 * 
 * Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
 * Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
 * Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
 * Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.
 * 
 */

fs.readFile('./input.txt', 'utf8', function (err, data) {
    const rows = data.split("\r\n").filter((row) => row);

    const seedsRanges = rows.find((row) => row.includes('seeds')).split(':')[1].trim().split(' ').map((seed) => +seed);
    console.log(seedsRanges);
    const seeds = [...seedsRanges];


    /* start index of map */
    const seedToSoilMapStartIndex = rows.findIndex((row) => row.includes('seed-to-soil map:')) + 1;
    const soilToFertilizerMapStartIndex = rows.findIndex((row) => row.includes('soil-to-fertilizer map:')) + 1;
    const fertilizerToWaterMapStartIndex = rows.findIndex((row) => row.includes('fertilizer-to-water map:')) + 1;
    const waterToLightMapStartIndex = rows.findIndex((row) => row.includes('water-to-light map:')) + 1;
    const lightToTemperatureMapStartIndex = rows.findIndex((row) => row.includes('light-to-temperature map:')) + 1;
    const temperatureToHumidityMapStartIndex = rows.findIndex((row) => row.includes('temperature-to-humidity map:')) + 1;
    const humidityToLocationMapStartIndex = rows.findIndex((row) => row.includes('humidity-to-location map:')) + 1;

    /* Map datas */
    const seedToSoilRules = rows.slice(seedToSoilMapStartIndex, soilToFertilizerMapStartIndex - 1).map((data) => data.split(' ').map((value) => +value));
    const soilToFertilizerRules = rows.slice(soilToFertilizerMapStartIndex, fertilizerToWaterMapStartIndex - 1).map((data) => data.split(' ').map((value) => +value));
    const fertilizerToWaterRules = rows.slice(fertilizerToWaterMapStartIndex, waterToLightMapStartIndex - 1).map((data) => data.split(' ').map((value) => +value));
    const waterToLightRules = rows.slice(waterToLightMapStartIndex, lightToTemperatureMapStartIndex - 1).map((data) => data.split(' ').map((value) => +value));
    const lightToTemperatureRules = rows.slice(lightToTemperatureMapStartIndex, temperatureToHumidityMapStartIndex - 1).map((data) => data.split(' ').map((value) => +value));
    const temperatureToHumidityRules = rows.slice(temperatureToHumidityMapStartIndex, humidityToLocationMapStartIndex - 1).map((data) => data.split(' ').map((value) => +value));
    const humidityToLocationRules = rows.slice(humidityToLocationMapStartIndex).map((data) => data.split(' ').map((value) => +value));


    /* Calculer result based on different rules */
    const soils = applyRule(seeds, seedToSoilRules);
    const fertilizers = applyRule(soils, soilToFertilizerRules);
    const water = applyRule(fertilizers, fertilizerToWaterRules);
    const light = applyRule(water, waterToLightRules);
    const temperature = applyRule(light, lightToTemperatureRules);
    const humidity = applyRule(temperature, temperatureToHumidityRules);
    const location = applyRule(humidity, humidityToLocationRules);

    for(let i = 0; i< 4; i++) {
        console.log(`Seed ${seeds[i]}, soil ${soils[i]}, fertilizer ${fertilizers[i]}, water ${water[i]}, light ${light[i]}, temperature ${temperature[i]}, humidity ${humidity[i]}, location ${location[i]}.`)
    }

    const lowestLocation = Math.min(...location);
    console.log(`So, the lowest location number in this example is ${lowestLocation}.`)
});

applyRule = (sources, rules) => {
    return sources.map(source => {
        return computeDestinationValue(source, rules);
    });
};

computeDestinationValue = (source, rules) => {
    const rule = rules.find(rule => {
        return (rule[1] <= source && source < (rule[1] + rule[2]));
    });

    if(rule != undefined) {
        return rule[0] + (source - rule[1]);
    }
    return source;
};