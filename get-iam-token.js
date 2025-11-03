const https = require('https');

const oauthToken = 'y0__xDnmexBGMHdEyD7i7qAFRbwRImql_sY8_cr9UonV3DYgHZW';

const data = JSON.stringify({ yandexPassportOauthToken: oauthToken });

const options = {
  hostname: 'iam.api.cloud.yandex.net',
  path: '/iam/v1/tokens',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const result = JSON.parse(body);
    console.log('IAM Token:', result.iamToken);
    console.log('\nДобавьте в .env:');
    console.log(`REACT_APP_YANDEX_API_KEY=${result.iamToken}`);
  });
});

req.on('error', (e) => console.error('Error:', e));
req.write(data);
req.end();
