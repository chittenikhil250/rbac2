### the main problem is the passport library not authenticating -- found in auth.js in utils
# in the passport.use middleware : isMatch is working, we have to change the callback done which is called based on isMatch