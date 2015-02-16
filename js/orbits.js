var bodies = {
    "kerbol" : {
        "radius" : 261600000,
        "mu" : 1.1723328e18
    },
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

function Orbit(orbitingBody, apoapsis, periapsis) {
    var ra = apoapsis + orbitingBody.radius,
        rp = periapsis + orbitingBody.radius;

    this.orbitingBody = orbitingBody;
    this.apoapsis = apoapsis;
    this.periapsis = periapsis;
    this.semiMajorAxis = (ra + rp) / 2;
    this.semiMinorAxis = Math.sqrt(ra * rp);
    this.eccentricity = (ra - rp) / (ra + rp);
    this.semiLatusRectum = (2 * ra * rp) / (ra + rp);
    this.specificAngularMomentum = Math.sqrt(this.semiLatusRectum * orbitingBody.mu);
    this.apoapsisVelocity = Math.sqrt(
        ((1 - this.eccentricity) * orbitingBody.mu) / ((1 + this.eccentricity) * this.semiMajorAxis));
    this.periapsisVelocity = Math.sqrt(
        ((1 + this.eccentricity) * orbitingBody.mu) / ((1 - this.eccentricity) * this.semiMajorAxis));
    this.period = 2 * Math.PI * Math.sqrt( Math.pow(this.semiMajorAxis, 3) / this.orbitingBody.mu);
    this.darknessTime = ((2 * this.semiMajorAxis * this.semiMinorAxis) / this.specificAngularMomentum) * 
        Math.asin(this.orbitingBody.radius / this.semiMinorAxis) +
        ((this.eccentricity * this.orbitingBody.radius) / this.semiMinorAxis);
}

Orbit.fromApAndPeriod = function(orbitingBody, ap, period) {
    var semiMajorAxis = Math.pow(Math.pow(period / (2 * Math.PI), 2) * orbitingBody.mu, 1/3),
        ra = ap + orbitingBody.radius,
        rp = (2 * semiMajorAxis) - ra,
        pe = rp - orbitingBody.radius;

    return new Orbit(orbitingBody, ap, pe);
};

Orbit.fromPeAndPeriod = function(orbitingBody, pe, period) {
    var semiMajorAxis = Math.pow(Math.pow(period / (2 * Math.PI), 2) * orbitingBody.mu, 1/3),
        rp = pe + orbitingBody.radius,
        ra = (2 * semiMajorAxis) - rp,
        ap = ra - orbitingBody.radius;

    return new Orbit(orbitingBody, ap, pe);
};

function isPositiveNumber(n) {
    var floatVal = parseFloat(n);
    return Number.isFinite(floatVal) && floatVal >= 0;
}

function convertAltitude(value, fromUnits, toUnits) {
    var unitMult = {
        "m" : 1,
        "km" : 1000,
        "Mm" : 1000000
    };

    if (fromUnits === toUnits) {
        return parseFloat(value);
    } else {
        return parseFloat(value) * (unitMult[fromUnits] / unitMult[toUnits]);
    }
}