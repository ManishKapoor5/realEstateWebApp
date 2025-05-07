const allowedRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    console.log("User Role--->", userRole);
    if (!roles.includes(userRole)) {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
  
    next();
  };
};

export default allowedRoles;
