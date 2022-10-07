const awsConfig = (env) => ({
  provider: 'aws-s3',
  providerOptions: {
    accessKeyId: env('AWS_ACCESS_KEY_ID'),
    secretAccessKey: env('AWS_ACCESS_SECRET'),
    region: env('AWS_REGION'),
    params: {
      Bucket: env('AWS_BUCKET'),
    },
  },
  actionOptions: {
    upload: {},
    uploadStream: {},
    delete: {},
  },
});

const localConfig = {
  provider: 'local',
};

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid', // For community providers pass the full package name (e.g. provider: 'strapi-provider-email-mandrill')
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'strapi@originprotocol.com',
        defaultReplyTo: 'donotreply@originprotocol.com',
        testAddress: 'franck@originprotocol.com',
      },
    },
  },
  upload: {
    config: !env('AWS_BUCKET') ? localConfig : awsConfig(env),
  },
  ckeditor: true,
});
