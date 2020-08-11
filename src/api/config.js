const Configs = {
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

}
export default Configs
