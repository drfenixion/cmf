module.exports = {
  user : function(req, res, next) {
    if (req.session.authenticated) {
      next();   
    } else {
      res.redirect('/login');
    }  
  },
  admin : function(req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }  
    
    if (req.session.user.admin === 1) {
      next();
    } else {
      res.redirect('/login');
    }  
  },
  visitor : function(req, res, next) {
    if (!req.session.authenticated) {
      next();   
    } else {
      res.redirect('/tours');
    }  
  }
}