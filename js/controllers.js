var kspToolsControllers = angular.module('kspToolsControllers', []);

kspToolsControllers.controller('HeaderCtrl', function($scope, $location) {
    $scope.isActive = function(path) {
        return path === $location.path();
    };
});

kspToolsControllers.controller('OrbitDarknessTimeCtrl', function ($scope) {
    $scope.orbitingBody = 'kerbin';
    $scope.apoapsis = '';
    $scope.periapsis = '';
    $scope.timeDarknessManual = '';
    $scope.energyUse = '';
    $scope.apoapsisUnits = 'km';
    $scope.periapsisUnits = 'km';
    $scope.errors = {};

    $scope.calculateDarknessTime = function() {
        if (!validateDarknessTime()) {
            $scope.timeDarkness = 0;
            return;
        }

        var body = bodies[$scope.orbitingBody],
            ap = convertAltitude($scope.apoapsis, $scope.apoapsisUnits, 'm'),
            pe = convertAltitude($scope.periapsis, $scope.periapsisUnits, 'm'),
            orbit = new Orbit(body, ap, pe);

        $scope.timeDarkness = Math.round(orbit.darknessTime);
        $scope.timeDarknessManual = $scope.timeDarkness;
    };

    $scope.calculateEnergyStorage = function() {
        if (!validateEnergyStorage()) {
            $scope.energyStorage = 0;
            return;
        }

        var energyUse = parseFloat($scope.energyUse),
            timeDarknessManual = parseFloat($scope.timeDarknessManual);

        $scope.energyStorage = Math.round(energyUse * timeDarknessManual);
    };

    function validateEnergyStorage() {
        var valid = true;
        if ($scope.energyUse === "") {
            $scope.errors.energyUse = "Please enter the amount of energy used per second.";
            valid = false;
        } else if (!isPositiveNumber($scope.energyUse)) {
            $scope.errors.energyUse = "Please enter a valid number greater than or equal to 0.";
            valid = false;
        } else {
            $scope.errors.energyUse = "";
        }

        if ($scope.timeDarknessManual === "") {
            $scope.errors.timeDarknessManual = "Please enter the nuumber of seconds spent in darkness.";
            valid = false;
        } else if (!isPositiveNumber($scope.timeDarknessManual)) {
            $scope.errors.timeDarknessManual = "Please enter a valid number greater than or equal to 0.";
            valid = false;
        } else {
            $scope.errors.timeDarknessManual = "";
        }

        return valid;
    }

    function validateDarknessTime() {
        var valid = true;
        if ($scope.apoapsis === "") {
            $scope.errors.apoapsis = "Please enter an apoapsis.";
            valid = false;
        } else if (!isPositiveNumber($scope.apoapsis)) {
            $scope.errors.apoapsis = "Please enter a valid number greater than or equal to 0.";
            valid = false;
        } else {
            $scope.errors.apoapsis = "";
        }

        if ($scope.periapsis === "") {
            $scope.errors.periapsis = "Please enter a periapsis.";
            valid = false;
        } else if (!isPositiveNumber($scope.periapsis)) {
            $scope.errors.periapsis = "Please enter a valid number greater than or equal to 0.";
            valid = false;
        } else {
            $scope.errors.periapsis = "";
        }

        if (valid) {
            var pe = convertAltitude($scope.periapsis, $scope.periapsisUnits, 'm'),
                ap = convertAltitude($scope.apoapsis, $scope.apoapsisUnits, 'm');

            if (pe > ap) { 
                $scope.errors.periapsis = "Please enter a periapsis that is less than or equal to the apoapsis.";
                valid = false;
            }
        }

        return valid;
    }
});

kspToolsControllers.controller('OrbitInfoCtrl', function ($scope) {
    $scope.orbitingBody = 'kerbin';
    $scope.mode = 'ap+pe';
    $scope.apoapsis = '';
    $scope.periapsis = '';
    $scope.apoapsisUnits = 'km';
    $scope.periapsisUnits = 'km';
    $scope.period = '';
    $scope.semiMajorAxis = '';
    $scope.semiMinorAxis = '';
    $scope.eccentricity = '';
    $scope.apoapsisVelocity = '';
    $scope.periapsisVelocity = '';
    $scope.apoapsisCalc = '';
    $scope.periapsisCalc = '';
    $scope.periodCalc = '';
    $scope.periodHumanized = '';
    $scope.errors = {};

    $scope.calculate = function() {
        if (!validate()) {
            $scope.timeDarkness = 0;
            return;
        }

        var body = bodies[$scope.orbitingBody], orbit, ap, pe, period;

        if ($scope.mode === 'ap+pe') {
            ap = convertAltitude($scope.apoapsis, $scope.apoapsisUnits, 'm');
            pe = convertAltitude($scope.periapsis, $scope.periapsisUnits, 'm');
            orbit = new Orbit(body, ap, pe);
        } else if ($scope.mode === 'ap+period') {
            ap = convertAltitude($scope.apoapsis, $scope.apoapsisUnits, 'm');
            period = parseFloat($scope.period);
            orbit = Orbit.fromApAndPeriod(body, ap, $scope.period);
        } else if ($scope.mode === 'pe+period') {
            pe = convertAltitude($scope.periapsis, $scope.periapsisUnits, 'm');
            period = parseFloat($scope.period);
            orbit = Orbit.fromPeAndPeriod(body, pe, $scope.period);
        }

        if ($scope.mode === 'pe+period') {
            $scope.apoapsisCalc = round(convertAltitude(orbit.apoapsis, 'm', $scope.periapsisUnits), 3);
        } else {
            $scope.apoapsisCalc = '';
        }

        if ($scope.mode === 'ap+period') {
            $scope.periapsisCalc = round(convertAltitude(orbit.periapsis, 'm', $scope.apoapsisUnits), 3);
        } else {
            $scope.periapsisCalc = '';
        }
        $scope.semiMajorAxis = round(orbit.semiMajorAxis);
        $scope.semiMinorAxis = round(orbit.semiMinorAxis);
        $scope.eccentricity = round(orbit.eccentricity, 3);
        $scope.apoapsisVelocity = round(orbit.apoapsisVelocity, 1);
        $scope.periapsisVelocity = round(orbit.periapsisVelocity, 1);
        if ($scope.mode === 'ap+pe') {
            $scope.periodCalc = round(orbit.period, 3);
            $scope.periodHumanized = humanizeSeconds(orbit.period);
        } else {
            $scope.periodCalc = '';
            $scope.periodHumanized = '';
        }
    };

    $scope.reset = function () {
        $scope.semiMajorAxis = '';
        $scope.semiMinorAxis = '';
        $scope.eccentricity = '';
        $scope.apoapsisVelocity = '';
        $scope.periapsisVelocity = '';
        $scope.apoapsisCalc = '';
        $scope.periapsisCalc = '';
        $scope.periodCalc = '';
        $scope.periodHumanized = '';
    };

    function validate() {
        var valid = true;
        if ($scope.mode === "ap+pe" || $scope.mode === "ap+period") {
            if ($scope.apoapsis === "") {
                $scope.errors.apoapsis = "Please enter an apoapsis.";
                valid = false;
            } else if (!isPositiveNumber($scope.apoapsis)) {
                $scope.errors.apoapsis = "Please enter a valid number greater than or equal to 0.";
                valid = false;
            } else {
                $scope.errors.apoapsis = "";
            }
        }

        if ($scope.mode === "ap+pe" || $scope.mode === "pe+period") {
            if ($scope.periapsis === "") {
                $scope.errors.periapsis = "Please enter a periapsis.";
                valid = false;
            } else if (!isPositiveNumber($scope.periapsis)) {
                $scope.errors.periapsis = "Please enter a valid number greater than or equal to 0.";
                valid = false;
            } else {
                $scope.errors.periapsis = "";
            }
        }

        if ($scope.mode === "ap+pe" && valid) {
            var pe = convertAltitude($scope.periapsis, $scope.periapsisUnits, 'm'),
                ap = convertAltitude($scope.apoapsis, $scope.apoapsisUnits, 'm');

            if (pe > ap) { 
                $scope.errors.periapsis = "Please enter a periapsis that is less than or equal to the apoapsis.";
                valid = false;
            }
        }

        if ($scope.mode === "pe+period" || $scope.mode === "ap+period") {
            if ($scope.period === "") {
                $scope.errors.period = "Please enter an orbital period.";
                valid = false;
            } else if (!isPositiveNumber($scope.period)) {
                $scope.errors.period = "Please enter a valid number greater than or equal to 0.";
                valid = false;
            } else {
                $scope.errors.period = "";
            }
        }

        return valid;
    }
});

kspToolsControllers.controller('SatelliteCtrl', function ($scope) {
    $scope.orbitingBody = 'kerbin';
    $scope.apoapsis = '';
    $scope.periapsis = '';
    $scope.apoapsisUnits = 'km';
    $scope.periapsisUnits = 'km';
    $scope.satellites = '';
    $scope.periapsisCalc = '';
    $scope.periodCalc = '';
    $scope.periodHumanized = '';
    $scope.errors = {};

    $scope.calculate = function() {
        if (!validate()) {
            return;
        }

        var body = bodies[$scope.orbitingBody],
            ap = convertAltitude($scope.apoapsis, $scope.apoapsisUnits, 'm'),
            pe = convertAltitude($scope.periapsis, $scope.periapsisUnits, 'm'),
            orbit = new Orbit(body, ap, pe),
            desiredPeriod = (orbit.period * ($scope.satellites - 1)) / $scope.satellites,
            parkingOrbit = Orbit.fromApAndPeriod(body, ap, desiredPeriod);

        console.log(parkingOrbit);
        console.log(desiredPeriod);

        $scope.periapsisCalc = round(convertAltitude(parkingOrbit.periapsis, 'm', $scope.apoapsisUnits), 3);
        $scope.periodCalc = round(parkingOrbit.period, 3);
        $scope.periodHumanized = humanizeSeconds(parkingOrbit.period);
    };

    function validate() {
        var valid = true;
        if ($scope.apoapsis === "") {
            $scope.errors.apoapsis = "Please enter an apoapsis.";
            valid = false;
        } else if (!isPositiveNumber($scope.apoapsis)) {
            $scope.errors.apoapsis = "Please enter a valid number greater than or equal to 0.";
            valid = false;
        } else {
            $scope.errors.apoapsis = "";
        }

        if ($scope.periapsis === "") {
            $scope.errors.periapsis = "Please enter a periapsis.";
            valid = false;
        } else if (!isPositiveNumber($scope.periapsis)) {
            $scope.errors.periapsis = "Please enter a valid number greater than or equal to 0.";
            valid = false;
        } else {
            $scope.errors.periapsis = "";
        }

        if ($scope.satellites === "") {
            $scope.errors.satellites = "Please enter the number of satellites.";
            valid = false;
        } else if (!isPositiveNumber($scope.satellites) || $scope.satellites < 1) {
            $scope.errors.satellites = "Please enter a valid number greater than or equal to 1.";
            valid = false;
        } else {
            $scope.errors.satellites = "";
        }

        if (valid) {
            var pe = convertAltitude($scope.periapsis, $scope.periapsisUnits, 'm'),
                ap = convertAltitude($scope.apoapsis, $scope.apoapsisUnits, 'm');

            if (pe > ap) { 
                $scope.errors.periapsis = "Please enter a periapsis that is less than or equal to the apoapsis.";
                valid = false;
            }
        }

        return valid;
    }
});

kspToolsControllers.controller('LifeSupportCtrl', function ($scope) {
    var configs = {
        "stock" : {
            foodConsumptionRate : 1.6927083333e-05,
            waterConsumptionRate : 1.1188078704e-05,
            oxygenConsumptionRate : 0.001713537562385,
            co2ProductionRate : 0.00148012889876,
            wasteProductionRate : 1.539351852e-06,
            wasteWaterProductionRate : 1.4247685185e-05,
            baseEnergyConsumption : 0.02125,
            energyConsumptionPerCrew : 0.014166666666667
        },
        "realism-overhaul" : {
            foodConsumptionRate : 3.47222E-05,
            waterConsumptionRate : 1.96759E-05,
            oxygenConsumptionRate : 0.00729167,
            co2ProductionRate : 0.00625,
            wasteProductionRate : 1.73611E-05,
            wasteWaterProductionRate : 3.125E-05,
            baseEnergyConsumption : 0.2,
            energyConsumptionPerCrew : 0.05
        }
    };

    var utilization = {
        'food' : 1,
        'water' : 1,
        'oxygen' : 221.1347,
        'waste' : 1,
        'wasteWater' : 1,
        'co2' : 476.2173
    };

    $scope.config = 'stock';
    $scope.durationYears = 0;
    $scope.durationDays = 0;
    $scope.durationHours = 0;
    $scope.durationMinutes = 0;
    $scope.durationSeconds = 0;
    $scope.crewCount = 1;
    $scope.tankVolume = '';
    $scope.tankType = 'both';
    $scope.tripResults = null;
    $scope.mftResults = null;
    $scope.errors = {};

    $scope.calculateTrip = function() {
        if (!validateTrip()) {
            return;
        }

        var config = configs[$scope.config],
            duration = $scope.getDurationInSeconds(),
            exactEnergy = config.baseEnergyConsumption + (config.energyConsumptionPerCrew * $scope.crewCount);

        $scope.tripResults = {
            food:        round(config.foodConsumptionRate * duration * $scope.crewCount, 3),
            water:       round(config.waterConsumptionRate * duration * $scope.crewCount, 3),
            oxygen:      round(config.oxygenConsumptionRate * duration * $scope.crewCount, 1),
            waste:       round(config.wasteProductionRate * duration * $scope.crewCount, 3),
            wasteWater:  round(config.wasteWaterProductionRate * duration * $scope.crewCount, 3),
            co2:         round(config.co2ProductionRate * duration * $scope.crewCount, 1),
            energy:      round(exactEnergy, 2),
            totalEnergy: round(exactEnergy * duration),
        };
        $scope.tripResults.liters = ($scope.tripResults.food / utilization.food) +
                                ($scope.tripResults.water / utilization.water) +
                                ($scope.tripResults.oxygen / utilization.oxygen) +
                                ($scope.tripResults.waste / utilization.waste) +
                                ($scope.tripResults.wasteWater / utilization.wasteWater) +
                                ($scope.tripResults.co2 / utilization.co2);
    };

    $scope.calculateMFT = function() {
        if (!validateMFT()) {
            return;
        }

        var config = configs[$scope.config],
            total = 0;

        if ($scope.tankType === 'both' || $scope.tankType === 'supplies') {
            total += (config.foodConsumptionRate / utilization.food) +
                     (config.waterConsumptionRate / utilization.water) +
                     (config.oxygenConsumptionRate / utilization.oxygen);
        }

        if ($scope.tankType === 'both' || $scope.tankType === 'waste') {
            total += (config.wasteProductionRate / utilization.waste) +
                     (config.wasteWaterProductionRate / utilization.wasteWater) +
                     (config.co2ProductionRate / utilization.co2);
        }

        $scope.mftResults = {};

        if ($scope.tankType === 'both' || $scope.tankType === 'supplies') {
            var foodPercentage = round(config.foodConsumptionRate / utilization.food / total, 6),
                waterPercantage = round(config.waterConsumptionRate / utilization.water / total, 6),
                oxygenPercentage = round(config.oxygenConsumptionRate / utilization.oxygen / total, 6);

            $scope.mftResults.food   = round($scope.tankVolume * utilization.food * foodPercentage, 3);
            $scope.mftResults.water  = round($scope.tankVolume * utilization.water * waterPercantage, 3);
            $scope.mftResults.oxygen = round($scope.tankVolume * utilization.oxygen * oxygenPercentage, 1);
        }

        if ($scope.tankType === 'both' || $scope.tankType === 'waste') {
            var wastePercentage = round(config.wasteProductionRate / utilization.waste / total, 6),
                wasteWaterPercentage = round(config.wasteWaterProductionRate / utilization.wasteWater / total, 6),
                co2Percentage = round(config.co2ProductionRate / utilization.co2 / total, 6);

            $scope.mftResults.waste      = round($scope.tankVolume * utilization.waste * wastePercentage, 3);
            $scope.mftResults.wasteWater = round($scope.tankVolume * utilization.wasteWater * wasteWaterPercentage, 3);
            $scope.mftResults.co2        = round($scope.tankVolume * utilization.co2 * co2Percentage, 1);
        }
    };

    function validateTrip() {
        var valid = true;

        if ($scope.crewCount === "") {
            $scope.errors.crewCount = "Please enter an crew count.";
            valid = false;
        } else if (!isPositiveNumber($scope.crewCount) || $scope.crewCount < 1) {
            $scope.errors.crewCount = "Please enter a valid number greater than or equal to 1.";
            valid = false;
        } else {
            $scope.errors.crewCount = "";
        }

        $scope.errors.duration = [];
        if (!isPositiveNumber($scope.durationYears)) {
            $scope.errors.duration.push("Please enter a years component greater than or equal to 0.");
            valid = false;
        }

        if (!isPositiveNumber($scope.durationDays)) {
            $scope.errors.duration.push("Please enter a days component greater than or equal to 0.");
            valid = false;
        }

        if (!isPositiveNumber($scope.durationHours)) {
            $scope.errors.duration.push("Please enter a hours component greater than or equal to 0.");
            valid = false;
        }

        if (!isPositiveNumber($scope.durationMinutes)) {
            $scope.errors.duration.push("Please enter a minutes component greater than or equal to 0.");
            valid = false;
        }

        if (!isPositiveNumber($scope.durationSeconds)) {
            $scope.errors.duration.push("Please enter a seconds component greater than or equal to 0.");
            valid = false;
        }

        if ($scope.errors.duration.length === 0 && $scope.getDurationInSeconds() === 0) {
            $scope.errors.duration.push("Please enter a duration greater then 0.");
            valid = false;
        }

        return valid;
    }

    function validateMFT() {
        var valid = true;

        if ($scope.tankVolume === "") {
            $scope.errors.tankVolume = "Please enter a tank volumne.";
            valid = false;
        } else if (!isPositiveNumber($scope.tankVolume) || $scope.tankVolume < 1) {
            $scope.errors.tankVolume = "Please enter a valid number greater than or equal to 1.";
            valid = false;
        } else {
            $scope.errors.tankVolume = "";
        }

        return valid;
    }

    $scope.getDurationInSeconds = function() {
        var durationYears = parseFloat($scope.durationYears),
            durationDays = parseFloat($scope.durationDays),
            durationHours = parseFloat($scope.durationHours),
            durationMinutes = parseFloat($scope.durationMinutes),
            durationSeconds = parseFloat($scope.durationSeconds);

        return (durationYears * 426 * 21600) + (durationDays * 21600) + (durationHours * 3600) + (durationMinutes * 60) + durationSeconds;
    };
});

function round(value, decimalPlaces) {
    decimalPlaces = decimalPlaces || 0;
    var mult = Math.pow(10, decimalPlaces);

    return Math.round(value * mult) / mult;
}

function humanizeSeconds(seconds) {
    var years = 0,
        days = 0,
        hours = 0,
        minutes = 0;

    if (seconds > 60) {
        minutes = Math.floor(seconds / 60);
        seconds = Math.round((seconds % 60) * 1000) / 1000;
    }

    if (minutes > 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
    }

    if (hours > 6) {
        days = Math.floor(hours / 6);
        hours = hours % 6;
    }

    if (days > 426) {
        years = Math.floor(days / 426);
        days = days % 426;
    }

    var humanizedText = seconds + "s";
    if (minutes > 0 || hours > 0 || days > 0 || years > 0) {
        humanizedText = minutes + "m " + humanizedText;
    }

    if (hours > 0 || days > 0 || years > 0) {
        humanizedText = hours + "h " + humanizedText;
    }

    if (days > 0 || years > 0) {
        humanizedText = days + "d " + humanizedText;
    }

    if (years > 0) {
        humanizedText = years + "y " + humanizedText;
    }

    return humanizedText;
}
