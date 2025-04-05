// Configuration pour lovable.dev
export default {
  // Commande pour démarrer l'application en développement
  dev: 'npm run lovable:dev',
  
  // Commande pour construire l'application
  build: 'npm run lovable:build',
  
  // Commande pour démarrer l'application en production
  start: 'npm run lovable:start',
  
  // Port sur lequel l'application sera servie
  port: 5000,
  
  // Variables d'environnement
  env: {
    LOVABLE_DEV: 'true',
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