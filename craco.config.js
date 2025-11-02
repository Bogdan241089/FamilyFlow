module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Отключаем code splitting для избежания проблем с чанками
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Объединяем все в один файл
          bundle: {
            name: 'bundle',
            chunks: 'all',
            enforce: true
          }
        }
      };
      
      return webpackConfig;
    }
  }
};