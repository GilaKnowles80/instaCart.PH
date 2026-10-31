export const validateCoordinates = (req, res, next) => {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            error: 'Validation Failed',
            message: 'Both latitude and longitude parameters are required.'
        });
    }
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    if (isNaN(latNum) || !isFinite(latNum) || isNaN(lngNum) || !isFinite(lngNum)) {
        return res.status(400).json({
            error: 'Validation Failed',
            message: 'Coordinates must be valid numeric floating-point values.'
        });
    }
    if (latNum < -90 || latNum > 90) {
        return res.status(400).json({
            error: 'Validation Failed',
            message: 'Latitude must be a valid coordinate value between -90 and 90.'
        });
    }
    if (lngNum < -180 || lngNum > 180) {
        return res.status(400).json({
            error: 'Validation Failed',
            message: 'Longitude must be a valid coordinate value between -180 and 180.'
        });
    }
    req.body.latitude = latNum;
    req.body.longitude = lngNum;
    next();
};
//# sourceMappingURL=geofence.validator.js.map