const express = require('express');
const { isKnowledgeOsEnabled, getKnowledgeOsHealth } = require('@librechat/api');
const { requireJwtAuth, checkBan, uaParser } = require('~/server/middleware');

const router = express.Router();

const whenEnabled = (middleware) => (req, res, next) => {
  if (!isKnowledgeOsEnabled(process.env)) {
    return next();
  }
  return middleware(req, res, next);
};

router.get(
  '/health',
  whenEnabled(requireJwtAuth),
  whenEnabled(checkBan),
  whenEnabled(uaParser),
  (req, res) => {
    return res.status(200).json(getKnowledgeOsHealth({ env: process.env }));
  },
);

module.exports = router;
