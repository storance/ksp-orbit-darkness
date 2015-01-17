var kspOdtApp = angular.module('KspOrbitDarknessTimeApp', []);

kspOdtApp.controller('CalculatorCtrl', function ($scope) {
    $scope.bodies = {
        "moho" : {
            "radius" : 250000,
            "mu" : 1.6860938e11
        },
        "eve" : {
            "radius" : 700000,
            "mu" : 8.1717302e12
        },
        "gilly" : {
            "radius" : 13000,
            "mu" : 8289449.8
        },
        "kerbin" : {
            "radius" : 600000,
            "mu" : 3.5316000e12
        },
        "mun" : {
            "radius" : 200000,
            "mu" : 6.5138398e10
        },
        "minmus" : {
            "radius" : 60000,
            "mu" : 1.7658000e9
        },
        "duna" : {
            "radius" : 320000,
            "mu" : 3.0136321e11
        },
        "ike" : {
            "radius" : 130000,
            "mu" : 1.8568369e10
        },
        "dres" : {
            "radius" : 138000,
            "mu" : 2.1484489e10
        },
        "jool" : {
            "radius" : 6000000,
            "mu" : 2.8252800e14
        },
        "laythe" : {
            "radius" : 500000,
            "mu" : 1.9620000e12
        },
        "vall" : {
            "radius" : 300000,
            "mu" : 2.0748150e11
        },
        "tylo" : {
            "radius" : 600000,
            "mu" : 2.8252800e12
        },
        "bop" : {
            "radius" : 65000,
            "mu" : 2.4868349e9
        },
        "pol" : {
            "radius" : 44000,
            "mu" : 7.2170208e8
        },
        "eeloo" : {
            "radius" : 210000,
            "mu" : 7.4410815e10
        }
    };

    $scope.orbitingBody = 'kerbin';
    $scope.apoapsis = '';
    $scope.periapsis = '';
    $scope.timeDarknessManual = '';
    $scope.energyUse = '';
    $scope.apoapsisUnits = 'm';
    $scope.periapsisUnits = 'm';
    $scope.errors = {};

    $scope.calculateDarknessTime = function() {
        if (!validateDarknessTime()) {
            $scope.timeDarkness = 0;
            return;
        }

        var body = $scope.bodies[$scope.orbitingBody],
            ap = toMeters($scope.apoapsis, $scope.apoapsisUnits),
            pe = toMeters($scope.periapsis, $scope.periapsisUnits),
            ra = ap + body.radius, // apoapsis from the center of the body
            rp = pe + body.radius, // periapsis from the center of the body
            a = (ra + rp) / 2, // semi-major axis
            b = Math.sqrt(ra * rp), // semi-minor axis
            e = (ra - rp) / (ra + rp), // eccentricity
            l = (2 * ra * rp) / (ra + rp), // semi-latus rectum of the orbital eclipse
            h = Math.sqrt(l * body.mu); // specific angular momentum

        $scope.timeDarkness = Math.round(((2*a*b)/h) * Math.asin(body.radius / b) + ((e * body.radius) / b), 0);
        $scope.timeDarknessManual = $scope.timeDarkness;
    }

    $scope.calculateEnergyStorage = function() {
        if (!validateEnergyStorage()) {
            $scope.energyStorage = 0;
            return;
        }

        var energyUse = parseFloat($scope.energyUse),
            timeDarknessManual = parseFloat($scope.timeDarknessManual);

        $scope.energyStorage = Math.round(energyUse * timeDarknessManual, 2);
    }

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

        if (valid && toMeters($scope.periapsis, $scope.periapsisUnits) > toMeters($scope.apoapsis, $scope.apoapsisUnits)) { 
            $scope.errors.periapsis = "Please enter a periapsis that is less than or equal to the apoapsis.";
            valid = false;
        }

        return valid;
    }

    function isPositiveNumber(n) {
        var floatVal = parseFloat(n);
        return Number.isFinite(floatVal) && floatVal >= 0;
    }

    function toMeters(value, units) {
        var unitMult = {
            "m" : 1,
            "km" : 1000,
            "Mm" : 1000000
        }

        return parseFloat(value) * unitMult[units];
    }
});
