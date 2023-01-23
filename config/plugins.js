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

const environment = env('NODE_ENV') === 'production' ? env(APP_ENV) : 'development';

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
  ckeditor: {
    enabled: true,
    config: {
      editor: {
        toolbar: {
          items: [
            'paragraph',
            'heading1',
            'heading2',
            'heading3',
            '|',
            'bold',
            'italic',
            'fontColor',
            'fontBackgroundColor',
            'fontFamily',
            'underline',
            'fontSize',
            'removeFormat',
            '|',
            'bulletedList',
            'todoList',
            'numberedList',
            '|',
            'alignment',
            'outdent',
            'indent',
            'horizontalLine',
            '|',
            'StrapiMediaLib',
            'insertTable',
            'blockQuote',
            'mediaEmbed',
            'link',
            'highlight',
            '|',
            'htmlEmbed',
            'sourceEditing',
            'code',
            'codeBlock',
            '|',
            'subscript',
            'superscript',
            'strikethrough',
            'specialCharacters',
            '|',
            'heading',
            'fullScreen',
            'undo',
            'redo'
          ]
        }
      }
    }
  },
  seo: {
    enabled: true,
  },
  menus: {
    enabled: false,
  },
  sentry: {
    enabled: true,
    environment: environment,
    config: {
      dsn: env('SENTRY_DSN'),
    },
  },
});
