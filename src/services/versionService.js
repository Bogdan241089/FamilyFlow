// Version Check Service
const CURRENT_VERSION = '1.0.0';
const VERSION_CHECK_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/FamilyFlow/main/version.json';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

export const versionService = {
  getCurrentVersion: () => CURRENT_VERSION,

  checkForUpdates: async () => {
    try {
      const lastCheck = localStorage.getItem('lastVersionCheck');
      const now = Date.now();
      
      if (lastCheck && now - parseInt(lastCheck) < CHECK_INTERVAL) {
        return null;
      }

      const response = await fetch(VERSION_CHECK_URL, { cache: 'no-cache' });
      if (!response.ok) return null;

      const data = await response.json();
      localStorage.setItem('lastVersionCheck', now.toString());

      if (compareVersions(data.version, CURRENT_VERSION) > 0) {
        return {
          available: true,
          version: data.version,
          releaseNotes: data.releaseNotes,
          downloadUrl: data.downloadUrl,
          critical: data.critical || false
        };
      }

      return null;
    } catch (error) {
      console.error('Version check failed:', error);
      return null;
    }
  },

  dismissUpdate: (version) => {
    localStorage.setItem('dismissedVersion', version);
  },

  isDismissed: (version) => {
    return localStorage.getItem('dismissedVersion') === version;
  }
};

function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}
