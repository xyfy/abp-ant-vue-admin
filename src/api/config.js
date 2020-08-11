let Configs = {
  apis: {
    default: {
      url: 'http://localhost:65115'
    }
  },
  authConfig: {
    issuer: 'http://localhost:64999',
    clientId: 'app-client',
    dummyClientSecret: 'winkappsercret',
    scope: '',
    showDebugInformation: true,
    oidc: false,
    requireHttps: true
  }
}
if (process.env.NODE_ENV === 'production') {
  Configs = {
    apis: {
      default: {
        url: 'https://api.dev.boligc.com'
      }
    },
    authConfig: {
      issuer: 'http://localhost:64999',
      clientId: 'app-client',
      dummyClientSecret: 'winkappsercret',
      // scope: "OrganizationDemo",
      showDebugInformation: true,
      oidc: false,
      requireHttps: true
    }
  }
}
export default Configs
