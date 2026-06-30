const AuditLog = require('../models/AuditLog');

const auditLog = (action, getResourceDetails) => {
  return async (req, res, next) => {
    // We want to log after the request has been processed to capture the result
    const originalSend = res.send;
    
    res.send = function (body) {
      res.send = originalSend;
      const response = res.send(body);
      
      // Only log successful actions (e.g. 200, 201)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const details = typeof getResourceDetails === 'function' ? getResourceDetails(req, body) : {};
          
          AuditLog.create({
            user: req.user ? req.user._id : null,
            action,
            resource: req.originalUrl,
            details: {
              method: req.method,
              ip: req.ip,
              ...details
            }
          });
        } catch (err) {
          console.error('Audit Log Error:', err);
        }
      }
      return response;
    };
    
    next();
  };
};

module.exports = auditLog;
