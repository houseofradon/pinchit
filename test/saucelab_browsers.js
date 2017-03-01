/**
 * format is {
 *   browserName: [versions..]
 *   OR
 *   browserName: {
 *     version: [platforms...]
 *   }
 * }
 * for possibilities
 * https://wiki.saucelabs.com/display/DOCS/Platform+Configurator
 */

module.exports = {
  sl_ios_safari: {
    base: 'SauceLabs',
    browserName: 'Safari',
    platform: 'iOS',
    version: '9.1',
    device: 'iPhone 6'
  },
  // sl_android: {
  //   base: 'SauceLabs',
  //   browserName: 'android',
  //   version: 'latest'
  // }
};
