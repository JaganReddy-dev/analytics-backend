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

  // Remove IPv4-mapped IPv6 prefix
  ip = ip.replace(/^::ffff:/, "");

  // Normalize IPv6 localhost to IPv4
  if (ip === "::1") {
    return "127.0.0.1";
  }

  return ip;
};

const getIp = (req) => {
  let rawIp = getClientIp(req);
  let clientIp = cleanIp(rawIp);

  return clientIp;
};

export default getIp;
