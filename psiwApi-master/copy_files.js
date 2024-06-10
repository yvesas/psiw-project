const fs = require('fs').promises;
const path = require('path');

async function copyDir(source, destination, directoriesOnly = false) {
  try {
    // Cria o diretório de destino (se ainda não existir)
    await fs.mkdir(destination, { recursive: true });

    // Lista todos os itens no diretório fonte
    const items = await fs.readdir(source, { withFileTypes: true });

    // Itera sobre cada item
    for (const item of items) {
      const sourcePath = path.join(source, item.name);
      const destinationPath = path.join(destination, item.name);

      if (item.isDirectory()) {
        // Se o item for um diretório, copie-o recursivamente
        await copyDir(sourcePath, destinationPath, directoriesOnly);
      } else if (!directoriesOnly) {
        // Se não for para copiar apenas diretórios, copie arquivos também
        await fs.copyFile(sourcePath, destinationPath);
      }
    }
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

// Para copiar tudo (arquivos e diretórios)
copyDir('src/certs', 'dist/src/certs');

// Para copiar apenas diretórios
copyDir('public', 'dist/public');
