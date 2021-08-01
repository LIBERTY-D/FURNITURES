const Err = (msg, err, req, res) => {
  return res.status(err.statusCode).render("error", {
    title: "Error",
    status: err.status,
    message: msg,
  });
};

module.exports.errorHandler = (err, req, res, next) => {
  err.status = err.status || "Error";
  err.statusCode = err.statusCode || 500;
  if (err.operational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    if (err.name === "CastError") {
      return Err("Something went wrong", err, req, res);
    } else if (err.name === "ValidationError") {
      const values = Object.values(err.errors).map((el) => el.properties)[0]
        .message;
      return res.status(err.statusCode).json({
        status: err.status,
        message: values,
      });
    } else if (err.code === 11000) {
      let message = "";
      const keyValue = err.keyValue;
      Object.keys(keyValue).forEach((el) => {
        if (el.startsWith("email")) {
          message = "The email is taken";
        } else {
          message = "Your already made a review for this product";
        }
      });

      return res.status(err.statusCode).json({
        status: err.status,
        message,
      });
    } else if (err.name === "JsonWebTokenError") {
      return Err("Please login in to access this route!", err, req, res);
    } else if (err.name === "TokenExpiredError") {
      return Err(
        "Your token expired please log in again to get a fresh token!",
        err,
        req,
        res
      );
    } else {
      return res.status(err.statusCode).json({
        status: err.status,
        message: "Something went wrong",
      });
    }
  }
};
