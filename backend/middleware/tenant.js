const tenantMiddleware = async (req, res, next) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || req.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }
    
    req.tenantId = tenantId;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid tenant context' });
  }
};

module.exports = tenantMiddleware;
