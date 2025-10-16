const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return (
    req.headers["x-real-ip"] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress
  );
};

const cleanIp = (ip) => {
  if (!ip) return null;
  return ip.replace(/^::ffff:/, "");
};

const getIp = (req) => {
  let rawIp = getClientIp(req);
  let clientIp = cleanIp(rawIp);

  return clientIp;
};

export default getIp;
