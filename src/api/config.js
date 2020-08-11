const Configs = {
  apis: {
    default: {
      url: 'http://localhost:65115'
    }
  },
  authConfig: {
    issuer: 'http://106.14.16.41:30001',
    clientId: 'app-client',
    dummyClientSecret: 'winkappsercret',
    scope: '',
    showDebugInformation: true,
    oidc: false,
    requireHttps: true
  }
}
if (process.env.NODE_ENV === 'production') {

}
export default Configs
