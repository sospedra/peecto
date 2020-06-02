export default class Vault {
  static isHost = false
  static markAsHost = () => {
    Vault.isHost = true
  }
}
