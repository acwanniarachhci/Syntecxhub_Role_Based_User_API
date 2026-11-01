exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};