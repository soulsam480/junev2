// this is a small script to install latest deps
// after running this, don't forget to install vue@next@latest vue-router@next@latest pinia@next@latest

const execSync = require('child_process').execSync;

const { dependencies, devDependencies, syncIgnore } = require('./package.json');

Object.keys(dependencies)
  .filter((el) => !syncIgnore.includes(el))
  .forEach((key) => {
    try {
      console.info('updating' + key);

      execSync(`pnpm remove ${key}`, { encoding: 'utf-8' });
      execSync(`pnpm add ${key}`, { encoding: 'utf-8' });
    } catch (error) {
      console.log(error);
    } finally {
      console.info(key + 'updated');
    }
  });

Object.keys(devDependencies).forEach((key) => {
  try {
    console.info('updating' + key);

    execSync(`pnpm remove ${key}`, { encoding: 'utf-8' });
    execSync(`pnpm add ${key} -D`, { encoding: 'utf-8' });
  } catch (error) {
    console.log(error);
  } finally {
    console.info(key + 'updated');
  }
});

if (syncIgnore) {
  syncIgnore.forEach((el) => {
    console.info('updating' + el);
    execSync(`pnpm remove ${el}`, { encoding: 'utf-8' });
    execSync(`pnpm add ${el}@next`, { encoding: 'utf-8' });
    console.info('updated' + el);
  });
}
