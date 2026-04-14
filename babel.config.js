module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
     'react-native-reanimated/plugin', // ✅ Separate plugin, no options needed
    [
      'module:react-native-dotenv',   // ✅ Dotenv plugin with its options
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};