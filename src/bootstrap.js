'use strict';

// async function isFirstRun() {
//   const pluginStore = strapi.store({
//     environment: strapi.config.environment,
//     type: 'type',
//     name: 'setup',
//   });
//   const initHasRun = await pluginStore.get({ key: 'initHasRun' });
//   await pluginStore.set({ key: 'initHasRun', value: true });
//   return !initHasRun;
// }

module.exports = async () => {
  // const shouldImportSeedData = await isFirstRun();
  // if (shouldImportSeedData) {
  //   try {
  //     console.log('Setting up the template...');
  //     await importSeedData();
  //     console.log('Ready to go');
  //   } catch (error) {
  //     console.log('Could not import seed data');
  //     console.error(error);
  //   }
  // }
};
