// Metro configuration for Expo
// Enables support for .cjs files used by some dependencies (e.g. Supabase storage-js)
// and keeps the default Expo settings.

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure .cjs files are treated as source files so Metro can bundle them
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

module.exports = config;





