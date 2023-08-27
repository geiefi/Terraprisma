/**
  * currently this script is the best way to convert the scss into css without any problems,
  * vite could be used but it doesn't preserve jsx that well for libs since it errors out with jsx
  * when (maybe) trying to optimize deps
  */
const fs = require('fs');

function getAllFilesRecursively(dirname) {
  return fs
    .readdirSync(dirname, { withFileTypes: true })
    .flatMap((file) =>
      file.isDirectory()
        ? getAllFilesRecursively(`${dirname}/${file.name}`)
        : `${dirname}/${file.name}`
    );
}

if (fs.existsSync('./lib')) {
  const filenames = getAllFilesRecursively('./lib');

  for (const filename of filenames) {
    if (filename.endsWith('.jsx')) {
      const file = fs.readFileSync(filename).toString();
      fs.writeFileSync(
        filename,
        file.replaceAll(/(?<=import\s*['"].*)\.scss(?=['"])/g, '.css')
      );
    }
  }
} else {
  throw new Error(
    'Cannot convert .scss to .css without having compiled the project and generated the proper files!'
  );
}
