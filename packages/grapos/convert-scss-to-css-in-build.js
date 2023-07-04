import * as fs from 'fs';

function getAllFilesRecursively(dirname) {
  return fs.readdirSync(dirname, { withFileTypes: true })
    .flatMap(file => file.isDirectory()
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
  throw new Error('Cannot convert .scss to .css without having compiled the project and generated the proper files!');
}
