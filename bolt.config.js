// Configuration pour bolt.new
export default {
  // Commande pour démarrer l'application en développement
  dev: 'npm run bolt:dev',
  
  // Commande pour construire l'application
  build: 'npm run bolt:build',
  
  // Commande pour démarrer l'application en production
  start: 'npm run bolt:start',
  
  // Port sur lequel l'application sera servie
  port: 5000,
  
  // Variables d'environnement
  env: {
    BOLT_NEW: 'true',
    NODE_ENV: 'production'
  },
  
  // Répertoire de sortie de la construction
  outputDir: 'dist',
  
  // Répertoire public
  publicDir: 'dist/public',
  
  // Fichiers à ignorer lors du déploiement
  ignore: [
    'node_modules',
    '.git',
    '.env',
    '.env.*',
    '*.log'
  ]
};